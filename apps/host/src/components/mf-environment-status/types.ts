export type MfRemoteEntry = {
	url?: string;
	source?: string;
	resolvedAt?: number;
	localUrl?: string;
	localHttpStatus?: number | null;
	localFailureNote?: string;
	localLikelyOffline?: boolean;
};

export type MfRemoteResolution = Record<string, MfRemoteEntry>;
