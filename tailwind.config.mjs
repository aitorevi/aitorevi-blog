/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// ── Semantic tokens (CSS var-driven, auto dark/light) ────────────
				// accent.DEFAULT → text-accent, bg-accent, border-accent, etc.
				// accent-violet / accent-blue / accent-sky kept as raw aliases.
				accent: {
					DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
					soft:    'rgb(var(--color-accent-soft) / <alpha-value>)',
					violet: '#ac91fc', /* Updated from #a78bfa (6.80:1) to 7.24:1 on dark bg (WCAG AAA 1.4.6) */
					blue:   '#60a5fa',
					sky:    '#38bdf8',
					emerald:'#10b981',
				},
				// Page background token (bg-page switches light/dark automatically)
				page: 'rgb(var(--color-bg) / <alpha-value>)',
				// Content page background — case study / design system pages
				'content-page': 'rgb(var(--color-bg-content) / <alpha-value>)',
				// Foreground text token (text-fg switches light/dark automatically)
				fg:   'rgb(var(--color-fg) / <alpha-value>)',

				// ── Raw tokens (kept for backward-compat) ────────────────────────
				primary:    '#151b27',
				secondary:  '#4727cc', /* Updated from #5e3aee to meet WCAG AAA 1.4.6 (~7.5:1 contrast) */
				tertiary:   '#d0edf5',   // referenced in retro.css
				quaternary: '#334155', /* Updated from #aeb2bb (~3.5:1) to slate-700 (~9.6:1) for WCAG AAA 1.4.6 */
				grayLight:  '#f9f9fc',   // used in Tag.astro default variant
				baseLight:  '#f1faff',   // referenced in retro.css
				ink: {
					900: '#020617',
					800: '#0b1120',
					700: '#0f172a',
				},
				code: {
					bg:     '#1a1f2e',   // used in RepublishedNotice.astro + CodeBlockEnhancer
					header: '#1e2533',   // used in CodeBlockEnhancer.astro (title bar)
				},
			},
			boxShadow: {
				// Glow utilities — reference CSS var so they switch with dark mode
				'glow-accent-dot':    'var(--shadow-glow-dot)',
				'glow-accent-bullet': 'var(--shadow-glow-bullet)',
				'glow-accent-line':   'var(--shadow-glow-line)',
				'glow-accent-card-sm':'var(--shadow-glow-card-sm)',
				'glow-accent-card-md':'var(--shadow-glow-card-md)',
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
			typography: {
				DEFAULT: {
					css: {
						// WCAG 1.4.8 Visual Presentation (AAA): paragraph spacing ≥1.5× font size.
						// @tailwindcss/typography defaults to 1.25em; 1.5em meets the AAA criterion.
						p: { marginBottom: '1.5em' },
					},
				},
			},
		},
	},
	safelist: [
		// Dynamic dark-mode accent classes used via interpolation in PostCinematic + WorkCinematic.
		// Tailwind's scanner can't detect these from template expressions like `dark:${accent.text}`.
		'dark:text-accent-violet',  'dark:text-accent-blue',  'dark:text-accent-emerald',  'dark:text-accent-sky',
		'dark:ring-accent-violet/40', 'dark:ring-accent-blue/40', 'dark:ring-accent-emerald/40', 'dark:ring-accent-sky/40',
		'dark:border-accent-violet/40', 'dark:border-accent-blue/40', 'dark:border-accent-emerald/40', 'dark:border-accent-sky/40',
		// WorkCinematic accent dots — bg class computed from project.data.accent at runtime.
		'bg-accent-violet', 'bg-accent-blue', 'bg-accent-sky', 'bg-accent-emerald',
		// WorkCinematic metric text — light-mode accent text classes computed at runtime.
		'text-violet-700', 'text-blue-700', 'text-sky-700', 'text-emerald-700',
		// WorkPortal chip accents — /10 bg and /20 border opacity variants used via chipAccentMap lookup.
		'bg-accent-violet/10', 'bg-accent-blue/10', 'bg-accent-emerald/10', 'bg-accent-sky/10',
		'border-accent-violet/20', 'border-accent-blue/20', 'border-accent-emerald/20', 'border-accent-sky/20',
	],
	plugins: [
		require('@tailwindcss/typography'),
	],
}
