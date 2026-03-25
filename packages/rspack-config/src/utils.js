import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Utility to calculate __filename and __dirname relative to the importing file.
 * @param importingFileUrl - The URL of the file importing this utility.
 */
function getFilePaths(importingFileUrl) {
	const __filename = fileURLToPath(importingFileUrl);
	const __dirname = path.resolve(path.dirname(__filename));

	return { __filename, __dirname };
}

/**
 * Utility to parse command line arguments
 * @param {string[]} argv - Array of command line arguments
 * @returns {Object} Parsed arguments object
 */
function parseArgs(argv) {
	const argsObject = {};

	argv.forEach((arg) => {
		if (arg.includes('=')) {
			const [key, value] = arg.split('=');
			argsObject[key.slice(2)] = value;
		} else if (arg.startsWith('--')) {
			argsObject[arg.slice(2)] = true;
		}
	});

	return argsObject;
}

/**
 * Rspack/webpack Module Federation "promise external" that:
 * - tries local remoteEntry first
 * - falls back to deployed remoteEntry on load error/timeout
 *
 * Controlled via ENABLE_REMOTE_FALLBACK in dev config below.
 */
const makeRemoteWithFallback = (scope, localUrl, fallbackUrl) => {
	const timeoutMs = Number(process.env.MF_REMOTE_LOCAL_TIMEOUT_MS ?? 800);

	// Module Federation expects a JS string that evaluates in the browser.
	return `promise new Promise((resolve, reject) => {
  const scope = ${JSON.stringify(scope)};
  const localUrl = ${JSON.stringify(localUrl)};
  const fallbackUrl = ${JSON.stringify(fallbackUrl)};
  const timeoutMs = ${JSON.stringify(timeoutMs)};

  const mergeResolution = (patch) => {
    try {
      globalThis.__MF_REMOTE_RESOLUTION__ = globalThis.__MF_REMOTE_RESOLUTION__ || {};
      const prev = globalThis.__MF_REMOTE_RESOLUTION__[scope] || {};
      globalThis.__MF_REMOTE_RESOLUTION__[scope] = { ...prev, ...patch, resolvedAt: Date.now() };
      globalThis.dispatchEvent?.(new CustomEvent('mf:remote-resolved', { detail: { scope, ...patch } }));
    } catch (_) {}
  };

  const markResolved = (url, source) => {
    mergeResolution({ url, source });
  };

  const probeLocalRemote = async (url) => {
    try {
      const r = await fetch(url, { method: 'HEAD', mode: 'cors', cache: 'no-store' });
      return { status: r.status, blocked: false };
    } catch {
      try {
        const r = await fetch(url, { method: 'GET', mode: 'cors', cache: 'no-store' });
        return { status: r.status, blocked: false };
      } catch {
        return { status: null, blocked: true };
      }
    }
  };

  const resolveContainer = (source, url) => {
    const container = globalThis[scope];
    if (!container) {
      reject(new Error(\`[mf] Remote container "\${scope}" not found after loading \${url}\`));
      return;
    }
    markResolved(url, source);
    resolve({
      get: container.get.bind(container),
      init: (arg) => {
        try { return container.init(arg); }
        catch (e) {
          // Ignore double-init, which happens in HMR/strict mode scenarios.
          if (!String(e && e.message || e).includes('already initialized')) throw e;
        }
      }
    });
  };

  const loadScript = (url, source) => new Promise((res, rej) => {
    // If already loaded, just resolve.
    if (globalThis[scope]) return res({ url, source, already: true });

    const existing = document.querySelector(\`script[data-mf-remote="\${scope}"]\`);
    if (existing) {
      existing.addEventListener('load', () => res({ url, source, already: true }), { once: true });
      existing.addEventListener('error', () => rej(new Error(\`[mf] Failed existing script for "\${scope}"\`)), { once: true });
      return;
    }

    const el = document.createElement('script');
    el.src = url;
    el.type = 'text/javascript';
    el.async = true;
    el.dataset.mfRemote = scope;

    const timer = setTimeout(() => {
      el.remove();
      rej(new Error(\`[mf] Timeout loading "\${scope}" from \${url}\`));
    }, timeoutMs);

    el.onload = () => { clearTimeout(timer); res({ url, source }); };
    el.onerror = () => { clearTimeout(timer); el.remove(); rej(new Error(\`[mf] Error loading "\${scope}" from \${url}\`)); };
    document.head.appendChild(el);
  });

  loadScript(localUrl, 'local')
    .then(({ url, source }) => resolveContainer(source, url))
    .catch(async (scriptErr) => {
      const scriptMsg = String(
        scriptErr && scriptErr.message != null ? scriptErr.message : scriptErr || '',
      );
      const timedOut = scriptMsg.includes('Timeout');
      const { status, blocked } = await probeLocalRemote(localUrl);
      let localNote = '';
      let localLikelyOffline = false;
      if (timedOut) {
        localLikelyOffline = true;
        localNote =
          'Local dev server did not respond in time — it is probably not running. Using the deployed remote instead.';
      } else if (!blocked && status === 403) {
        localNote =
          'Forbidden — remote /remoteEntry.js blocked this host (check ALLOWED_ORIGINS / Referer on the remote dev server).';
      } else if (!blocked && status != null && status >= 400) {
        localNote = 'HTTP ' + status;
      } else if (!blocked && status != null && status < 400) {
        localNote =
          'Local responded ' +
          status +
          ' but script load still failed — check publicPath (trailing slash), MIME, or CSP.';
      } else if (blocked) {
        localLikelyOffline = true;
        localNote =
          'Could not verify local dev server from this page (browser may hide the status). Most often the app is not running on that port — open Network → remoteEntry.js: connection refused means nothing is listening. If it is running, you may need CORS on error responses or fix Referer / ALLOWED_ORIGINS.';
      }
      mergeResolution({
        localUrl,
        localHttpStatus: status,
        localFailureNote: localNote || undefined,
        localLikelyOffline: localLikelyOffline || undefined,
      });
      return loadScript(fallbackUrl, 'fallback')
        .then(({ url, source }) => resolveContainer(source, url))
        .catch((e) => reject(e));
    });
})`;
};

const truthy = (value) => value === '1' || value === 'true' || value === 'yes' || value === 'on';

const getOriginFromHeader = (originOrReferer) => {
	if (!originOrReferer) return '';
	try {
		return new URL(originOrReferer).origin;
	} catch {
		return '';
	}
};

/**
 * Express middleware factory to protect `/remoteEntry.js` by checking Origin/Referer.
 *
 * - Allows same-origin requests (based on federation publicPath origin)
 * - Allows requests from federation allowedOrigins
 * - Otherwise returns 403
 */
const createRemoteEntryOriginGuard = ({ publicPath, allowedOrigins }) => {
	const appOrigin = new URL(publicPath).origin.replace(/\/$/, '');
	const allowed = (allowedOrigins || []).map((o) => String(o).replace(/\/$/, ''));

	return (req, res, next) => {
		const setErrorCors = () => {
			const origin = req.get('origin');
			// So cross-origin fetch from the host (e.g. status probe / preflight) can read non-2xx responses.
			res.setHeader('Access-Control-Allow-Origin', origin || '*');
			res.setHeader('Vary', 'Origin');
		};

		if (req.method === 'OPTIONS') {
			setErrorCors();
			res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
			res.setHeader('Access-Control-Max-Age', '86400');
			res.status(204).end();
			return;
		}

		const header = req.get('origin') || req.get('referer') || '';
		const requestOrigin = getOriginFromHeader(header).replace(/\/$/, '');

		if (!requestOrigin) {
			setErrorCors();
			res.status(403).send('Forbidden: Referer not allowed');
			return;
		}

		if (requestOrigin === appOrigin || allowed.includes(requestOrigin)) {
			next();
			return;
		}

		setErrorCors();
		res.status(403).send('Forbidden: Referer not allowed');
	};
};

const getEnvironmentConfig = (env, fedConfig) => {
	switch (env) {
		case 'development':
			return {
				publicPath: fedConfig.development.publicPath,
				remotes: fedConfig.development.remotes,
				allowedOrigins: fedConfig.development.allowedOrigins,
			};

		case 'staging':
			return {
				publicPath: fedConfig.staging.publicPath,
				remotes: fedConfig.staging.remotes,
				allowedOrigins: fedConfig.staging.allowedOrigins,
			};

		case 'production':
			return {
				publicPath: fedConfig.production.publicPath,
				remotes: fedConfig.production.remotes,
				allowedOrigins: fedConfig.production.allowedOrigins,
			};

		default:
			return {
				publicPath: fedConfig.default.publicPath,
				remotes: fedConfig.default.remotes,
				allowedOrigins: fedConfig.default.allowedOrigins,
			};
	}
};

export {
	getFilePaths,
	parseArgs,
	makeRemoteWithFallback,
	truthy,
	createRemoteEntryOriginGuard,
	getEnvironmentConfig,
};
