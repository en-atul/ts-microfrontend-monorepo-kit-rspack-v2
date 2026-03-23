/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'jsdom',
	clearMocks: true,
	collectCoverageFrom: [
		'**/*.{ts,tsx,js,jsx}',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!**/dist/**',
	],
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: true }],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	setupFilesAfterEnv: [require.resolve('./setup.cjs')],
};
