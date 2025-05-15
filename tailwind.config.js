/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 4s ease-in-out infinite',
        'rays': 'rays 4s ease-in-out infinite',
        'cloud': 'float-cloud 20s linear infinite',
        'rain': 'rain 1.5s linear infinite',
        'snow': 'snow 6s linear infinite',
        'lightning': 'lightning 4s infinite',
        'mist': 'mist 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        rays: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)', opacity: '0.3' },
        },
        'float-cloud': {
          'from': { transform: 'translateX(-200%)' },
          'to': { transform: 'translateX(200%)' },
        },
        rain: {
          'from': { transform: 'translateY(-20px)' },
          'to': { transform: 'translateY(100vh)' },
        },
        snow: {
          'from': { 
            transform: 'translateY(-10px) rotate(0deg)',
            opacity: '1',
          },
          'to': { 
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0',
          },
        },
        lightning: {
          '0%, 100%': { opacity: '0' },
          '48%, 52%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        mist: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '10%, 90%': { opacity: '0.3' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}