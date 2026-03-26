import { makeRemoteWithFallback, truthy } from '@repo/rspack-config/utils';

const localRemotes = {
	productListingApp: process.env.PRODUCT_LISTING_REMOTE_URL_LOCAL,
	productDetailsApp: process.env.PRODUCT_DETAILS_REMOTE_URL_LOCAL,
	cartApp: process.env.CART_REMOTE_URL_LOCAL,
	checkoutApp: process.env.CHECKOUT_REMOTE_URL_LOCAL,
	userProfileApp: process.env.USER_PROFILE_REMOTE_URL_LOCAL,
};

const deployedRemotes = {
	productListingApp: process.env.PRODUCT_LISTING_REMOTE_URL,
	productDetailsApp: process.env.PRODUCT_DETAILS_REMOTE_URL,
	cartApp: process.env.CART_REMOTE_URL,
	checkoutApp: process.env.CHECKOUT_REMOTE_URL,
	userProfileApp: process.env.USER_PROFILE_REMOTE_URL,
};

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
	.split(',')
	.filter(Boolean)
	.map((url) => new URL(url).origin);

const enableDevRemoteFallback = truthy(process.env.ENABLE_REMOTE_FALLBACK);
const hostPort = Number(process.env.PORT ?? 3000);
const devPublicPath = `http://localhost:${hostPort}`;
const devRemotes = enableDevRemoteFallback
	? Object.fromEntries(
			Object.keys(localRemotes).map((scope) => [
				scope,
				makeRemoteWithFallback(scope, localRemotes[scope], deployedRemotes[scope]),
			]),
		)
	: localRemotes;

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
