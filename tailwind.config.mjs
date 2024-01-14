/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#212737',
				secondary: '#ff6b01',
				tertiary: '#eaedf3',
			},
			fontFamily: {
				ibm: ['IBM Plex Mono', 'monospace'],
			}
		},
	},
	plugins: [],
}
