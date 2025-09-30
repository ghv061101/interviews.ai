/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/styles/tailwind.css',
    // Add other paths as needed
  ],
  theme: {
    extend: {
      borderColor: {
        border: 'var(--color-border)',
      },
      backgroundColor: {
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        popover: 'var(--color-popover)',
        muted: 'var(--color-muted)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        destructive: 'var(--color-destructive)',
        surface: 'var(--color-surface)',
      },
      textColor: {
        foreground: 'var(--color-foreground)',
        'card-foreground': 'var(--color-card-foreground)',
        'popover-foreground': 'var(--color-popover-foreground)',
        'muted-foreground': 'var(--color-muted-foreground)',
        'primary-foreground': 'var(--color-primary-foreground)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        'accent-foreground': 'var(--color-accent-foreground)',
        'success-foreground': 'var(--color-success-foreground)',
        'warning-foreground': 'var(--color-warning-foreground)',
        'error-foreground': 'var(--color-error-foreground)',
        'destructive-foreground': 'var(--color-destructive-foreground)',
        'surface-foreground': 'var(--color-surface-foreground)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
      },
    },
  },
  plugins: [],
}