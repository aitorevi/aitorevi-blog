/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#151b27',
				secondary: '#5e3aee',
				tertiary: '#d0edf5',
				quaternary: '#aeb2bb',
				baseLight: '#f1faff',
				blueLight: '#7ad5f3',
			},
			fontFamily: {
				ibm: ['IBM Plex Mono', 'monospace'],
			},
			width: {
				'116': '29rem',
			}
		},
	},
	plugins: [],
}
