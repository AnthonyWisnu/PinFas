/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        primary: '#0D2137',
        'primary-mid': '#1A3A5C',
        'primary-light': '#2E6DA4',
        'primary-pale': '#E8F0F8',
        secondary: '#0A5C46',
        'secondary-light': '#138A68',
        'secondary-pale': '#E6F4F0',
        accent: '#C9A84C',
        'accent-light': '#E8C96A',
        'accent-pale': '#FDF6E3',
        'accent-dark': '#9A7A2E',
        surface: '#F4F7FB',
      },
    },
  },
  plugins: [],
}
