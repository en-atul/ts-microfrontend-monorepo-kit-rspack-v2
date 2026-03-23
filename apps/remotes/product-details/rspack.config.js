import pc from 'picocolors';
import { createRequire } from 'module';
import { getConfig } from '@repo/rspack-config/config';
import { parseArgs } from '@repo/rspack-config/utils';

const moduleUrl = import.meta.url;
const require = createRequire(moduleUrl);
const { dependencies: deps } = require('./package.json');
const port = 3002;
const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'development';

const baseFederationConfig = {
	name: 'productDetailsApp',
	filename: 'remoteEntry.js',
	exposes: {
		'./ProductDetailsWidget': './ProductDetailsWidget.tsx',
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

const getEnvironmentConfig = () => ({
	publicPath: `http://localhost:${port}/`,
	remotes: {},
	allowedOrigins: ['http://localhost:3000/'],
});

const federationConfigs = {
	...baseFederationConfig,
	...getEnvironmentConfig(),
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
	};
}

export default config;
