/**
 * Shared @rstest/core configuration placeholder.
 * Keep this file as the single source of truth for rstest options.
 */
module.exports = {
	environment: 'jsdom',
	include: ['**/*.test.{ts,tsx,js,jsx}'],
	exclude: ['**/node_modules/**', '**/dist/**'],
};
