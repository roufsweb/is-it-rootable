import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0d14',
        surface: '#0f1724',
        'surface-elevated': '#162032',
        border: '#1e293b',
        'border-subtle': '#182234',
        primary: {
          DEFAULT: '#06b6d4',
          foreground: '#041624',
        },
        root: {
          full: '#10b981',
          'full-glow': 'rgba(16, 185, 129, 0.15)',
          conditional: '#f59e0b',
          'conditional-glow': 'rgba(245, 158, 11, 0.15)',
          locked: '#f43f5e',
          'locked-glow': 'rgba(244, 63, 94, 0.15)',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

