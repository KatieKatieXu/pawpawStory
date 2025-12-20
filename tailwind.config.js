/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        // Usage: bg-background, text-primary, etc.
        background: 'rgb(var(--color-background) / <alpha-value>)',
        'background-card': 'rgb(var(--color-background-card) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-dark': 'rgb(var(--color-accent-dark) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'logo-accent': 'rgb(var(--color-logo-accent) / <alpha-value>)',
        'logo-text': 'rgb(var(--color-logo-text) / <alpha-value>)',

        // Legacy static colors (for backwards compatibility)
        // These are the night mode colors - use theme-aware colors above for new code
        pawpaw: {
          navy: '#1e2749',
          navyLight: '#2b3a67',
          yellow: '#ffd166',
          yellowDark: '#e6b84d',
          white: '#f8f9fa',
          gray: '#c4cfdb',
          border: '#7b8fb8',
        },
      },
      fontFamily: {
        nunito: ['Nunito_400Regular'],
        'nunito-bold': ['Nunito_700Bold'],
        'nunito-extrabold': ['Nunito_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
