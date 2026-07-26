import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        mist:      { DEFAULT: '#E3E6DC', deep: '#D4D8CB' },
        paper:     '#F0EEE5',
        ink:       { DEFAULT: '#1A1D17', soft: '#3A3F36' },
        moss:      { DEFAULT: '#2D4A2D', deep: '#1F3320' },
        marigold:  '#E09B2F',
        lichen:    { DEFAULT: '#8A9678', soft: '#B5BFA7' },
        oxblood:   '#6E2828',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body:    ['var(--font-body)'],
        mono:    ['var(--font-mono)'],
      },
      backgroundImage: {
        'grid-paper': `linear-gradient(rgba(26,29,23,0.08) 1px, transparent 1px),
                       linear-gradient(90deg, rgba(26,29,23,0.08) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid-32': '32px 32px',
      },
    },
  },
  plugins: [],
} satisfies Config;