import path from 'path';
import { fileURLToPath } from 'url';
import { reactJsConfig } from '@repo/eslint-config/react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
	...reactJsConfig(__dirname),
	{
		files: ['**/*.{ts,tsx}'],
		rules: {
			'import/no-unresolved': 'off',
		},
	},
];
