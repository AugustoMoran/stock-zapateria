/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    },
    extend: {
      colors: {
        // Dark theme palette
        bg: {
          primary: '#0f1117',
          secondary: '#13151f',
          tertiary: '#1a1d2e',
          card: '#1a1f35',
        },
        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        info: '#3b82f6',
        error: '#ef4444',
        destructive: '#f97316',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'bounce-sm': 'bounce 0.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { 
          from: { opacity: '0' }, 
          to: { opacity: '1' } 
        },
        slideUp: { 
          from: { opacity: '0', transform: 'translateY(12px)' }, 
          to: { opacity: '1', transform: 'translateY(0)' } 
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.5)',
        'neon': '0 0 10px rgba(124, 58, 237, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

