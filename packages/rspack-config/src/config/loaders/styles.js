import { rspack } from '@rspack/core';

const createStyleLoaderConfig = (isModule = false, mode) => {
	const styleLoader = mode === 'production' ? rspack.CssExtractRspackPlugin.loader : 'style-loader';
	const baseConfig = [
		styleLoader,
		{
			loader: 'css-loader',
			options: {
				...(isModule && {
					modules: {
						localIdentName: mode === 'production' ? '[hash:base64:5]' : '[local]__[hash:base64:5]',
					},
				}),
				// Make sure `@import`ed CSS also runs through PostCSS (and Sass when present).
				importLoaders: isModule ? 2 : 1,
			},
		},
		{
			loader: 'postcss-loader',
		},
	];

	return isModule ? [...baseConfig, 'sass-loader'] : baseConfig;
};

export const createStyleLoaders = (mode) => [
	{
		test: /\.module\.scss$/,
		use: createStyleLoaderConfig(true, mode),
	},
	{
		test: /\.s[ac]ss$/i,
		exclude: /\.module\.(scss|sass)$/,
		use: createStyleLoaderConfig(false, mode),
	},
	{
		test: /\.css$/,
		use: createStyleLoaderConfig(false, mode),
	},
];
