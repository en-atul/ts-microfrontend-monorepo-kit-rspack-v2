import path from 'node:path';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { getFilePaths } from './utils.js';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default ({ baseUrl, configs }) => {
	const { __dirname } = getFilePaths(baseUrl);
	const SRC = path.resolve(__dirname, 'src');
	const hasPromiseRemote = Object.values(configs.remotes || {}).some(
		(v) => typeof v === 'string' && v.trim().startsWith('promise '),
	);

	const createRemoteEntries = (remotes) =>
		Object.fromEntries(
			Object.entries(remotes).map(([key, value]) => {
				// Support "promise new Promise(...)" remotes (runtime-resolved) by passing through as-is.
				// For standard string remotes, keep the usual "scope@url" format.
				if (typeof value === 'string' && value.trim().startsWith('promise ')) {
					return [key, value];
				}
				return [key, `${key}@${value}`];
			}),
		);

	const createExposeEntries = (exposes) =>
		Object.fromEntries(
			Object.entries(exposes).map(([key, relativePath]) => [key, path.join(SRC, relativePath)]),
		);

	return {
		mode: 'development',
		devtool: 'cheap-module-source-map',
		entry: {
			main: path.resolve(SRC, 'index.tsx'),
		},
		watchOptions: {
			// Reduce watcher load in large monorepos (avoids EMFILE on some machines).
			ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/.turbo/**'],
		},
		output: {
			publicPath: configs.publicPath,
		},
		plugins: [
			new ModuleFederationPlugin({
				name: configs.name,
				filename: configs.filename,
				shared: configs.shared,
				exposes: createExposeEntries(configs.exposes),
				remotes: createRemoteEntries(configs.remotes),
				// DTS downloader doesn't understand "promise ..." remotes (it treats them like URLs).
				// Disable it in that case to avoid noisy errors + bad fetches.
				dts: hasPromiseRemote ? false : undefined,
			}),
			new ReactRefreshPlugin(),
		],
	};
};
