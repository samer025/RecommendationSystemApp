import type { Config } from 'tailwindcss'

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
        brand: {
          50: 'oklch(0.968 0.017 255.585)',
          100: 'oklch(0.929 0.033 255.508)',
          200: 'oklch(0.852 0.064 255.508)',
          300: 'oklch(0.738 0.115 256.788)',
          400: 'oklch(0.623 0.194 256.802)',
          500: 'oklch(0.546 0.245 262.881)',
          600: 'oklch(0.488 0.243 264.376)',
          700: 'oklch(0.422 0.199 265.638)',
          800: 'oklch(0.357 0.146 265.522)',
          900: 'oklch(0.308 0.11 265.522)',
        },
        gray: {
          50: 'oklch(0.984 0.003 247.858)',
          100: 'oklch(0.968 0.007 247.896)',
          200: 'oklch(0.929 0.013 255.508)',
          300: 'oklch(0.869 0.022 254.624)',
          400: 'oklch(0.704 0.04 256.788)',
          500: 'oklch(0.554 0.046 257.417)',
          600: 'oklch(0.446 0.043 257.281)',
          700: 'oklch(0.373 0.044 257.287)',
          800: 'oklch(0.279 0.041 260.031)',
          900: 'oklch(0.208 0.042 265.755)',
        },
        success: {
          50: 'oklch(0.982 0.018 155.995)',
          100: 'oklch(0.946 0.052 156.743)',
          200: 'oklch(0.897 0.093 155.995)',
          300: 'oklch(0.833 0.151 156.066)',
          400: 'oklch(0.746 0.219 156.066)',
          500: 'oklch(0.645 0.246 156.066)',
          600: 'oklch(0.546 0.245 156.066)',
        },
        error: {
          50: 'oklch(0.982 0.024 22.628)',
          100: 'oklch(0.968 0.052 22.628)',
          200: 'oklch(0.929 0.104 22.628)',
          300: 'oklch(0.869 0.176 22.628)',
          400: 'oklch(0.768 0.236 22.628)',
          500: 'oklch(0.667 0.266 22.628)',
          600: 'oklch(0.577 0.245 27.325)',
        },
      },
      boxShadow: {
        'theme-sm': '0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)',
        'theme-md': '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        'theme-lg': '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
      },
      fontSize: {
        'theme-xs': ['0.75rem', { lineHeight: '1.125rem' }],
        'theme-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'theme-xl': ['1.25rem', { lineHeight: '1.875rem' }],
      },
      screens: {
        '2xsm': '375px',
        'xsm': '425px',
        '3xl': '2000px',
      }
    },
  },
  plugins: [],
}

export default config