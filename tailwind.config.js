/** @type {import('tailwindcss').Config} */
export default {
  safelist: ['scroll-smooth'],
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
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Be Vietnam Pro', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        'size-1': ['4.125rem',   { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '800' }],
        'size-2': ['2.5625rem',  { lineHeight: '1.1',  letterSpacing: '-0.01em', fontWeight: '800' }],
        'size-3': ['1.5625rem',  { lineHeight: '1.2',  letterSpacing: '-0.005em', fontWeight: '700' }],
        'size-4': ['1rem',       { lineHeight: '1.3',  letterSpacing: '0',        fontWeight: '700' }],
        'size-5': ['0.6125rem',  { lineHeight: '1.4',  letterSpacing: '0.01em',  fontWeight: '600' }],
        'size-6': ['0.3813rem',  { lineHeight: '1.5',  letterSpacing: '0.02em',  fontWeight: '400' }],
        'size-7': ['0.2361rem',  { lineHeight: '1.5',  letterSpacing: '0.02em',  fontWeight: '400' }],
        'size-8': ['0.1459rem',  { lineHeight: '1.4',  letterSpacing: '0.04em',  fontWeight: '400' }],
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
