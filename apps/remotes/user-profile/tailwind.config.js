/** @type {import('tailwindcss').Config} */
import { tokens } from '@repo/styles/tokens';

export default {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: tokens.colors,
			spacing: tokens.spacing,
			borderRadius: tokens.radius,
			boxShadow: tokens.shadows,
		},
	},
	plugins: [],
};
