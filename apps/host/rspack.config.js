import pc from 'picocolors';
import { createRequire } from 'module';
import { getConfig } from '@repo/rspack-config/config';
import { parseArgs } from '@repo/rspack-config/utils';
import hostConfig from './federation.config.js';

const moduleUrl = import.meta.url;
const require = createRequire(moduleUrl);

const { dependencies: deps } = require('./package.json');

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'development';

// Base configuration
const baseFederationConfig = {
	name: 'hostApp',
	filename: 'remoteEntry.js',
	exposes: {},
	shared: {
		...deps,
		react: { singleton: true, eager: true, requiredVersion: deps.react },
		'react-dom': { singleton: true, eager: true, requiredVersion: deps['react-dom'] },
		'@repo/ecommerce-core': {
			singleton: true,
			eager: true,
			requiredVersion: false,
		},
		'@repo/ui': { singleton: true, eager: true, requiredVersion: false },
		'@repo/styles': { singleton: true, eager: true, requiredVersion: false },
		'@repo/utils': { singleton: true, eager: true, requiredVersion: false },
		zustand: { singleton: true, eager: true, requiredVersion: deps.zustand },
		'react-router-dom': {
			singleton: true,
			eager: true,
			requiredVersion: deps['react-router-dom'],
		},
	},
};

// Environment-specific settings (overrides for each environment)
const getEnvironmentConfig = (env) => {
	switch (env) {
		case 'development':
			return {
				publicPath: hostConfig.development.publicPath,
				remotes: hostConfig.development.remotes,
				allowedOrigins: hostConfig.development.allowedOrigins,
			};

		case 'staging':
			return {
				publicPath: hostConfig.staging.publicPath,
				remotes: hostConfig.staging.remotes,
				allowedOrigins: hostConfig.staging.allowedOrigins,
			};

		case 'production':
			return {
				publicPath: hostConfig.production.publicPath,
				remotes: hostConfig.production.remotes,
				allowedOrigins: hostConfig.production.allowedOrigins,
			};

		default:
			// Fallback to development as default environment
			return {
				publicPath: hostConfig.default.publicPath,
				remotes: hostConfig.default.remotes,
				allowedOrigins: hostConfig.default.allowedOrigins,
			};
	}
};

// Get the specific environment config
const environmentConfig = getEnvironmentConfig(process.env.NODE_ENV);

// Combine base and environment-specific configs
const federationConfigs = {
	...baseFederationConfig,
	...environmentConfig,
};

console.log(pc.gray(`[${mode === 'development' ? 'Dev' : 'Build'}]: ${pc.magenta(mode)}`));

const config = getConfig({
	baseUrl: moduleUrl,
	federationConfigs,
	mode,
});

// Add devServer configuration for development mode
if (mode === 'development') {
	config.devServer = {
		port: 3000,
		host: 'localhost',
		hot: true,
		open: true,
		historyApiFallback: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		// Handle remote entry access control
		setupMiddlewares: function (middlewares, devServer) {
			devServer.app.use('/remoteEntry.js', (req, res, next) => {
				const referer = req.get('origin') || req.get('referer');
				const isSameOrigin = referer === federationConfigs.publicPath;

				if (federationConfigs.allowedOrigins.some((origin) => referer && referer.startsWith(origin)) || isSameOrigin) {
					return next();
				}

				res.status(403).send('Forbidden: Referer not allowed');
			});

			return middlewares;
		},
	};
}

export default config;
