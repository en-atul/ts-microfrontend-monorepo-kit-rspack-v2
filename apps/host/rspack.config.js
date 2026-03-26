import pc from 'picocolors';
import dotenv from 'dotenv';
import fs from 'node:fs';
import { createRequire } from 'module';
import { getConfig } from '@repo/rspack-config/config';
import {
	createRemoteEntryOriginGuard,
	parseArgs,
	getEnvironmentConfig,
} from '@repo/rspack-config/utils';

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'development';

if (fs.existsSync(`.env.${mode}`)) {
	dotenv.config({ path: `.env.${mode}` });
}

const moduleUrl = import.meta.url;
const require = createRequire(moduleUrl);

const port = Number(process.env.PORT ?? 3000);

const { dependencies: deps } = require('./package.json');
/**
 * IMPORTANT: federation.config.js must be imported after env vars are set.
 * eg: ENABLE_REMOTE_FALLBACK needs to be available in the federation config.
 */
const fedConfig = (await import('./federation.config.js')).default;

// Base configuration
const baseFederationConfig = {
	name: 'hostApp',
	filename: 'remoteEntry.js',
	exposes: {},
	shared: {
		react: { singleton: true, eager: true, requiredVersion: deps.react },
		'react-dom': { singleton: true, eager: true, requiredVersion: deps['react-dom'] },
		'react-router-dom': {
			singleton: true,
			eager: true,
			requiredVersion: deps['react-router-dom'],
		},
		'@repo/ecommerce-core': {
			singleton: true,
			eager: true,
			requiredVersion: false,
		},
		'@repo/ui': { singleton: true, eager: true, requiredVersion: false },
		'@repo/styles': { singleton: true, eager: true, requiredVersion: false },
		'@repo/utils': { singleton: true, eager: true, requiredVersion: false },
		zustand: { singleton: true, eager: true, requiredVersion: deps.zustand },
	},
};

// Get the specific environment config
const environmentConfig = getEnvironmentConfig(mode, fedConfig);

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
		port,
		host: 'localhost',
		hot: true,
		open: true,
		historyApiFallback: true,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
		setupMiddlewares: function (middlewares, devServer) {
			devServer.app.use(
				'/remoteEntry.js',
				createRemoteEntryOriginGuard({
					publicPath: federationConfigs.publicPath,
					allowedOrigins: federationConfigs.allowedOrigins,
				}),
			);

			return middlewares;
		},
	};
}

export default config;
