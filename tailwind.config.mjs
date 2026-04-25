/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
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
				grayLight: '#f9f9fc',
				// Home redesign palette — dark slate base + violet accents
				ink: {
					900: '#020617',
					800: '#0b1120',
					700: '#0f172a',
					600: '#111827',
				},
				accent: {
					blue: '#60a5fa',
					violet: '#a78bfa',
					sky: '#38bdf8',
				},
				code: {
					bg: '#1a1f2e',     // dark code block / blockquote background
					header: '#1e2533', // dark code block title bar
				},
			},
			backgroundImage: {
				'home-radial': 'radial-gradient(ellipse at 30% 20%, #0f172a 0%, #020617 55%, #000 100%)',
				'home-radial-light': 'radial-gradient(ellipse at 30% 20%, #eef2ff 0%, #f8fafc 55%, #e2e8f0 100%)',
				'home-gradient-text': 'linear-gradient(135deg, #60a5fa, #a78bfa, #60a5fa)',
				'home-gradient-text-light': 'linear-gradient(135deg, #2563eb, #7c3aed, #2563eb)',
			},
			fontFamily: {
				mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
				display: ['Outfit', 'system-ui', 'sans-serif'],
			},
			width: {
				'116': '29rem',
			},
			spacing: {
				'30': '7.5rem',
			},
			keyframes: {
				'home-rise': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'home-pulse': {
					'0%, 100%': { opacity: '0.4' },
					'50%': { opacity: '1' },
				},
			},
			animation: {
				'home-rise': 'home-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
				'home-pulse': 'home-pulse 2.4s ease-in-out infinite',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
