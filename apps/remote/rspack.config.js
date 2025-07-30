import pc from 'picocolors';
import { createRequire } from 'module';
import { getConfig } from '@repo/rspack-config/config';
import { parseArgs } from '@repo/rspack-config/utils';

const moduleUrl = import.meta.url;
const require = createRequire(moduleUrl);

const { dependencies: deps } = require('./package.json');

const port = 3001;

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'development';

// Base configuration
const baseFederationConfig = {
	name: 'remoteApp',
	filename: 'remoteEntry.js',
	exposes: {
		'./Counter': 'Counter.tsx',
	},
	shared: {
		...deps,
		react: { singleton: true, eager: true, requiredVersion: deps.react },
		'react-dom': { singleton: true, eager: true, requiredVersion: deps['react-dom'] },
	},
};

// Environment-specific settings (overrides for each environment)
const getEnvironmentConfig = (env) => {
	switch (env) {
		case 'development':
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {
					hostApp: 'http://localhost:3000/remoteEntry.js',
				},
				allowedOrigins: ['http://localhost:3000/'],
			};

		case 'staging':
			return {
				publicPath: `http://staging.example.com/`,
				remotes: {},
				allowedOrigins: [`http://marketting.staging.example.com/`],
			};

		case 'production':
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {},
				allowedOrigins: ['http://localhost:3000/'],
			};

		default:
			// Fallback to development as default environment
			return {
				publicPath: `http://localhost:${port}/`,
				remotes: {},
				allowedOrigins: ['http://localhost:3000/'],
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
		port: port,
		host: 'localhost',
		hot: true,
		open: false, // Don't open browser for remote app
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
