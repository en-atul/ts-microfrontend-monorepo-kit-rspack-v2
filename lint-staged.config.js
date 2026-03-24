module.exports = {
	'**/*.{ts,tsx}': ['pnpm eslint --config packages/eslint-config/base.js --fix'],
	'**/*': ['pnpm prettier --write --ignore-unknown'],
};
