const localRemotes = {
	productListingApp: 'http://localhost:3001/remoteEntry.js',
	productDetailsApp: 'http://localhost:3002/remoteEntry.js',
	cartApp: 'http://localhost:3003/remoteEntry.js',
	checkoutApp: 'http://localhost:3004/remoteEntry.js',
	userProfileApp: 'http://localhost:3005/remoteEntry.js',
};

const deployedRemotes = {
	productListingApp:
		process.env.PRODUCT_LISTING_REMOTE_URL || 'https://ecom-mfe-product-listing.vercel.app/remoteEntry.js',
	productDetailsApp:
		process.env.PRODUCT_DETAILS_REMOTE_URL || 'https://ecom-mfe-product-details.vercel.app/remoteEntry.js',
	cartApp: process.env.CART_REMOTE_URL || 'https://ecom-mfe-cart.vercel.app/remoteEntry.js',
	checkoutApp: process.env.CHECKOUT_REMOTE_URL || 'https://ecom-mfe-checkout.vercel.app/remoteEntry.js',
	userProfileApp:
		process.env.USER_PROFILE_REMOTE_URL || 'https://ecom-mfe-user-profile.vercel.app/remoteEntry.js',
};

const localOrigins = Object.values(localRemotes).map((url) => new URL(url).origin + '/');
const deployedOrigins = Object.values(deployedRemotes).map((url) => new URL(url).origin + '/');

const hostConfig = {
	development: {
		publicPath: 'http://localhost:3000',
		remotes: localRemotes,
		allowedOrigins: localOrigins,
	},
	production: {
		// Use auto so deployed host serves assets from its own domain.
		publicPath: 'auto',
		remotes: deployedRemotes,
		allowedOrigins: deployedOrigins,
	},
	staging: {
		publicPath: 'auto',
		remotes: deployedRemotes,
		allowedOrigins: deployedOrigins,
	},
	default: {
		publicPath: 'http://localhost:3000',
		remotes: localRemotes,
		allowedOrigins: localOrigins,
	},
};

export default hostConfig;