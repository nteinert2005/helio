/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // HelioIQ Dark Mode Palette
        'primary-bg': '#101214',
        'card-bg': '#1A1D20',
        'primary-action': '#d48770',
        'yellow': "#e6ba81",
        'success': '#3EB980',
        'warning': '#FFB85C',
        'critical': '#FF6F6F',
        'body-text': '#C9CDD2',
        'label-text': '#8A8F98',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['72px', { lineHeight: '1', fontWeight: '900' }],
        'hero-mobile': ['48px', { lineHeight: '1', fontWeight: '900' }],
        'page-title': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      boxShadow: {
        'glass': '0 4px 16px rgba(0, 0, 0, 0.5)',
        'glass-lg': '0 8px 32px rgba(0, 0, 0, 0.6)',
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [],
}
