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
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-elevated': 'rgb(var(--surface-elevated) / <alpha-value>)',
        'surface-card': 'rgb(var(--surface-card) / <alpha-value>)',
        border: 'var(--border)',
        'border-subtle': 'var(--border-subtle)',
        'border-card': 'var(--border-card)',
        'border-hover': 'var(--border-hover)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        primary: {
          DEFAULT: '#06b6d4',
          foreground: '#041624',
        },
        root: {
          full: '#10b981',
          'full-glow': 'rgba(16, 185, 129, 0.20)',
          conditional: '#f59e0b',
          'conditional-glow': 'rgba(245, 158, 11, 0.20)',
          locked: '#f43f5e',
          'locked-glow': 'rgba(244, 63, 94, 0.20)',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'tactile-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'tactile-card': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 4px 12px -2px rgba(0, 0, 0, 0.35)',
        'tactile-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.35), 0 12px 24px -4px rgba(0, 0, 0, 0.45)',
        'dock': '0 20px 45px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
        'contrast-sm': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'contrast-md': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'contrast-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        'contrast-card': '0 0 0 1px var(--border), 0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
