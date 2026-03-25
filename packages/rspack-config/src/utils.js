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

  const markResolved = (url, source) => {
    try {
      globalThis.__MF_REMOTE_RESOLUTION__ = globalThis.__MF_REMOTE_RESOLUTION__ || {};
      globalThis.__MF_REMOTE_RESOLUTION__[scope] = { url, source, resolvedAt: Date.now() };
      globalThis.dispatchEvent?.(new CustomEvent('mf:remote-resolved', { detail: { scope, url, source } }));
    } catch (_) {}
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
    .catch(() => loadScript(fallbackUrl, 'fallback')
      .then(({ url, source }) => resolveContainer(source, url))
      .catch((e) => reject(e)));
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
		const header = req.get('origin') || req.get('referer') || '';
		const requestOrigin = getOriginFromHeader(header).replace(/\/$/, '');

		if (!requestOrigin) {
			res.status(403).send('Forbidden: Referer not allowed');
			return;
		}

		if (requestOrigin === appOrigin || allowed.includes(requestOrigin)) {
			next();
			return;
		}

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
