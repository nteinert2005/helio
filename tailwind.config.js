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
        helio: {
          // Core dark foundation (stealth)
          'void': '#0A0A0B',           // helio-void (primary app bg)
          'obsidian': '#141416',       // helio-obsidian (cards / surfaces)
          'ash-divider': '#242428',    // helio-ash-divider (borders / separators)

          // Mythic signal core (accents)
          'solar-ember': '#F59E0B',    // helio-solar-ember (primary logo color / CTA)
          'ancient-gold': '#FCD34D',   // helio-ancient-gold (soft highlights)
          'ritual-flame': '#DC2626',   // helio-ritual-flame (rare strong accent / errors)

          // Typography / UI text
          'bone': '#F4F4F5',            // helio-bone (primary text)
          'muted-titanium': '#9CA3AF', // helio-muted-titanium (secondary text)
          'ghost-gray': '#6B7280'      // helio-ghost-gray (disabled / subtle)
        },
        // Legacy color mappings for backward compatibility
        'primary-bg': '#0A0A0B',
        'card-bg': '#141416',
        'primary-action': '#F59E0B',
        'yellow': '#FCD34D',
        'success': '#3EB980',
        'warning': '#FFB85C',
        'critical': '#DC2626',
        'body-text': '#F4F4F5',
        'label-text': '#9CA3AF',
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
        'helio-glow-sm': '0 4px 18px rgba(245,158,11,0.08)',
        'helio-glow-md': '0 12px 40px rgba(245,158,11,0.12)',
        'helio-glow-strong': '0 20px 80px rgba(245,158,11,0.18)',
      },
      ringColor: {
        'helio': '#F59E0B',
      },
      backdropBlur: {
        'glass': '12px',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
