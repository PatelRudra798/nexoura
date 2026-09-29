/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        edu: {
          slate: "#0F172A",
          navy: "#1E293B",
          blue: "#4F46E5",
          sky: "#0284C7",
          teal: "#0D9488",
          emerald: "#10B981",
          amber: "#F59E0B",
          crimson: "#EF4444",
          bg: "#0A0B10",
          card: "#12141F",
          border: "#1E2337",
          subtle: "#94A3B8"
        },
        obsidian: {
          950: "#07080C",
          900: "#0C0E17",
          850: "#121524",
          800: "#1A1F33",
          700: "#272E4C",
          600: "#3B456E",
          500: "#64748B",
        },
        accent: {
          indigo: "#6366F1",
          violet: "#8B5CF6",
          purple: "#A855F7",
          amber: "#F59E0B",
          orange: "#F97316",
          cyan: "#06B6D4",
          emerald: "#10B981",
          rose: "#F43F5E",
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'edu-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'edu-md': '0 4px 12px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -2px rgba(0, 0, 0, 0.4)',
        'edu-lg': '0 12px 24px -4px rgba(0, 0, 0, 0.6), 0 4px 12px -2px rgba(0, 0, 0, 0.4)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.45)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.45)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
