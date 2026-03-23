export const createResolveConfig = (srcPath, packages, aliases = {}) => ({
  extensions: ['.tsx', '.ts', '.js', '.scss', '.css'],
  alias: {
    '@': srcPath,
    '@repo/ui': packages.ui,
    '@repo/utils': packages.utils,
    '@repo/ecommerce-core': packages.ecommerceCore,
    '@repo/styles': packages.styles,
    ...aliases,
  },
}); 