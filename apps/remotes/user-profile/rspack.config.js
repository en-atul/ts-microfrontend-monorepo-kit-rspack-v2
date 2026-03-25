import pc from 'picocolors';
import dotenv from 'dotenv';
import fs from 'node:fs';
import { createRequire } from 'module';
import { getConfig } from '@repo/rspack-config/config';
import {
	createRemoteEntryOriginGuard,
	getEnvironmentConfig,
	parseArgs,
} from '@repo/rspack-config/utils';

const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'development';

if (fs.existsSync(`.env.${mode}`)) {
	dotenv.config({ path: `.env.${mode}` });
}

const moduleUrl = import.meta.url;
const require = createRequire(moduleUrl);

const port = Number(process.env.PORT ?? 3005);

const { dependencies: deps } = require('./package.json');
const fedConfig = (await import('./federation.config.js')).default;

const baseFederationConfig = {
	name: 'userProfileApp',
	filename: 'remoteEntry.js',
	exposes: {
		'./UserProfileWidget': './UserProfileWidget.tsx',
	},
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
		zustand: { singleton: true, eager: true, requiredVersion: deps.zustand },
	},
};

const environmentConfig = getEnvironmentConfig(mode, fedConfig);

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

if (mode === 'development') {
	config.devServer = {
		port,
		host: 'localhost',
		hot: true,
		open: false,
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
