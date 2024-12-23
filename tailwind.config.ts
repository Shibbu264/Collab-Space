import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'primary-gradient': 'linear-gradient(to right, #000000, #4B0082)', // black to purple-900
      },
      colors: {
        primaryText: '#E0E0E0', // light gray for good contrast
        secondaryText: '#B3B3B3', // slightly darker gray for secondary text
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
}
export default config
