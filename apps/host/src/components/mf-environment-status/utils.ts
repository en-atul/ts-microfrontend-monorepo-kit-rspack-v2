import type { MfRemoteEntry, MfRemoteResolution } from './types';

/**
 * Rspack replaces `process.env.NODE_ENV` in the client bundle (preferred).
 * Falls back to `import.meta.env.MODE` when present.
 */
export const getClientMode = (): string => {
	if (typeof process !== 'undefined' && process.env && typeof process.env.NODE_ENV === 'string') {
		return process.env.NODE_ENV;
	}
	if (typeof import.meta !== 'undefined') {
		const env = import.meta.env;
		if (env !== undefined && env !== null && typeof env.MODE === 'string') {
			return env.MODE;
		}
	}
	return 'development';
};

export const parseLocalPort = (localUrl?: string): string | null => {
	if (!localUrl) {
		return null;
	}
	const m = /localhost:(\d+)/.exec(localUrl);
	return m ? m[1] : null;
};

export const isFallbackRow = (v: MfRemoteEntry): boolean =>
	Boolean(v.source && v.source !== 'local' && v.url);

export const hasHttpStatus = (v: MfRemoteEntry): boolean => typeof v.localHttpStatus === 'number';

export const buildMfEnvTraceText = (v: MfRemoteEntry): string => {
	const parts: string[] = [];
	if (v.localUrl) {
		parts.push(`local: ${v.localUrl}`);
	}
	if (hasHttpStatus(v)) {
		parts.push(`HTTP ${v.localHttpStatus as number}`);
	} else if (v.localFailureNote && !v.localLikelyOffline) {
		parts.push('HTTP status: unavailable in page');
	}
	if (v.localFailureNote) {
		parts.push(v.localFailureNote);
	}
	return parts.join(' — ');
};

export const shouldShowErrorTrace = (v: MfRemoteEntry, fallback: boolean): boolean => {
	const hasDiagnostic =
		Boolean(v.localFailureNote) || hasHttpStatus(v) || v.localLikelyOffline === true;
	return hasDiagnostic && (fallback || Boolean(v.localFailureNote));
};

export const readMfRemoteResolution = (): MfRemoteResolution | undefined =>
	typeof window !== 'undefined'
		? (window as Window & { __MF_REMOTE_RESOLUTION__?: MfRemoteResolution })
				.__MF_REMOTE_RESOLUTION__
		: undefined;

export const getResolutionEntries = (map: MfRemoteResolution): Array<[string, MfRemoteEntry]> =>
	Object.entries(map)
		.filter(([, v]) => Boolean(v?.url) || hasHttpStatus(v) || Boolean(v?.localFailureNote))
		.sort(([a], [b]) => a.localeCompare(b));

export const panelVisibility = (entries: Array<[string, MfRemoteEntry]>) => {
	const usingFallback = entries.some(([, v]) => isFallbackRow(v));
	const hadLocalDiagnostic = entries.some(
		([, v]) =>
			Boolean(v.localFailureNote) ||
			v.localHttpStatus === 403 ||
			(typeof v.localHttpStatus === 'number' && v.localHttpStatus >= 400),
	);
	const visible = entries.length > 0 && (usingFallback || hadLocalDiagnostic);
	const fallbackCount = entries.filter(([, v]) => isFallbackRow(v)).length;
	return { visible, fallbackCount };
};
