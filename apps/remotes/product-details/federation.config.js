import { makeRemoteWithFallback, truthy } from '@repo/rspack-config/utils';

const localRemotes = {};
const deployedRemotes = {};

const enableDevRemoteFallback = truthy(process.env.ENABLE_REMOTE_FALLBACK);
const port = Number(process.env.PORT ?? 3002);
const devPublicPath = `http://localhost:${port}/`;
const devRemotes = enableDevRemoteFallback
	? Object.fromEntries(
			Object.keys(localRemotes).map((scope) => [
				scope,
				makeRemoteWithFallback(scope, localRemotes[scope], deployedRemotes[scope]),
			]),
		)
	: localRemotes;

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
	.split(',')
	.filter(Boolean)
	.map((url) => new URL(url).origin);

const config = {
	development: {
		publicPath: devPublicPath,
		remotes: devRemotes,
		allowedOrigins,
	},
	production: {
		// Use auto so deployed host serves assets from its own domain.
		publicPath: 'auto',
		remotes: deployedRemotes,
		allowedOrigins,
	},
	staging: {
		publicPath: 'auto',
		remotes: deployedRemotes,
		allowedOrigins,
	},
	default: {
		publicPath: devPublicPath,
		remotes: localRemotes,
		allowedOrigins,
	},
};

export default config;
