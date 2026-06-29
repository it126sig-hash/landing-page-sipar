/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        'forest-deep': '#1C4A2A',
        'forest-medium': '#2E5A36',
        'forest-light': '#6FB544',
        charcoal: '#23271F',
        'charcoal-gray': '#6E7268',
        orange: '#EE8322',
        'orange-light': '#F6A24A',
        'off-white': '#FBFAF6',
        'cream-light': '#ECEAE1',
        'stone-gray': '#8A8F84',
        'sage-pale': '#E4EFDD',
        'mint-pale': '#EDF4E7',
        'sage-mist': '#BFD8B6',
        'sage-medium': '#CFE6C8',
        'sage-olive': '#5C7A52',
      },
      fontFamily: {
        sora: ['Sora', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        btn: '11px',
      },
      keyframes: {
        floatPulse: {
          '0%, 100%': { boxShadow: '0 12px 28px -8px rgba(238,131,34,.55)' },
          '50%': { boxShadow: '0 12px 34px -6px rgba(238,131,34,.85)' },
        },
      },
      animation: {
        floatPulse: 'floatPulse 2.4s ease-in-out infinite',
      },
    },
  },
}
