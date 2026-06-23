/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base palette — clean, calm, trustworthy.
        ink: '#0a0c10', //締め色 (deep near-black)
        carbon: '#14181f',
        ivory: '#f7f6f1', // アイボリー
        mist: '#eef0f3', // 薄いグレー
        // Accent palette — restrained, premium light tones.
        emerald: '#0f6b53', // 深いグリーン
        ocean: '#1f4fff', // ブルー
        violet: '#6d4aff', // パープル
        cyan: '#27d3e0', // シアン系の光
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Hiragino Kaku Gothic ProN',
          'Noto Sans JP',
          'sans-serif',
        ],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        content: '1200px',
      },
      transitionTimingFunction: {
        // Apple-like buttery easing.
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-smooth forwards',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
