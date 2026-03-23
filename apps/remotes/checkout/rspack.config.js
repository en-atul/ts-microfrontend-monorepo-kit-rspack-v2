import pc from 'picocolors';
import { createRequire } from 'module';
import { getConfig } from '@repo/rspack-config/config';
import { parseArgs } from '@repo/rspack-config/utils';

const moduleUrl = import.meta.url;
const require = createRequire(moduleUrl);
const { dependencies: deps } = require('./package.json');
const port = 3004;
const deployedHostOrigin = process.env.HOST_APP_ORIGIN || 'https://ecom-mfe-host.vercel.app';
const args = parseArgs(process.argv.slice(2));
const mode = args.mode || 'development';

const baseFederationConfig = {
	name: 'checkoutApp',
	filename: 'remoteEntry.js',
	exposes: {
		'./CheckoutWidget': './CheckoutWidget.tsx',
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

const federationConfigs = {
	...baseFederationConfig,
	publicPath: mode === 'development' ? `http://localhost:${port}/` : 'auto',
	remotes: {},
	allowedOrigins: mode === 'development' ? ['http://localhost:3000/'] : [`${deployedHostOrigin}/`],
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
