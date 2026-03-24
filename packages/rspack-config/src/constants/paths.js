import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const getRootPath = (importingFileUrl) => {
	const __filename = fileURLToPath(importingFileUrl);
	const __dirname = path.resolve(path.dirname(__filename));
	return path.resolve(__dirname, '../../../');
};

export const getPackagePaths = (rootPath) => ({
	ui: path.join(rootPath, 'packages/ui/src'),
	utils: path.join(rootPath, 'packages/utils/src'),
	ecommerceCore: path.join(rootPath, 'packages/ecommerce-core/src'),
	styles: path.join(rootPath, 'packages/styles/src'),
});

export const getEnvPaths = (rootPath) => {
	const nodeEnv = process.env.NODE_ENV || 'development';
	const envPath = `.env.${nodeEnv}`;
	return {
		dotenvPath: path.resolve(rootPath, envPath),
		fallbackDotenvPath: path.resolve(rootPath, '.env'),
		nodeEnv,
	};
};
