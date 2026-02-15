// Consistent theme configuration for RealMoneyCalc
export const theme = {
  // Color palette
  colors: {
    primary: {
      50: 'emerald-50',
      100: 'emerald-100', 
      200: 'emerald-200',
      400: 'emerald-400',
      500: 'emerald-500',
      600: 'emerald-600',
      700: 'emerald-700',
      800: 'emerald-800',
      900: 'emerald-900'
    },
    secondary: {
      50: 'blue-50',
      100: 'blue-100',
      200: 'blue-200',
      400: 'blue-400',
      500: 'blue-500',
      600: 'blue-600',
      700: 'blue-700',
      800: 'blue-800',
      900: 'blue-900'
    },
    accent: {
      50: 'amber-50',
      100: 'amber-100',
      200: 'amber-200',
      400: 'amber-400',
      500: 'amber-500',
      600: 'amber-600',
      700: 'amber-700',
      800: 'amber-800',
      900: 'amber-900'
    },
    neutral: {
      50: 'gray-50',
      100: 'gray-100',
      200: 'gray-200',
      300: 'gray-300',
      400: 'gray-400',
      500: 'gray-500',
      600: 'gray-600',
      700: 'gray-700',
      800: 'gray-800',
      900: 'gray-900'
    }
  },

  // Gradients
  gradients: {
    primary: 'bg-gradient-to-r from-emerald-600 to-blue-600',
    primaryHover: 'bg-gradient-to-r from-emerald-700 to-blue-700',
    background: 'bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700',
    card: 'bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20',
    inflation: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20',
    results: 'bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-800 dark:to-gray-900'
  },

  // Typography
  typography: {
    heading: {
      h1: 'text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight',
      h2: 'text-2xl sm:text-3xl font-bold',
      h3: 'text-xl font-bold',
      h4: 'text-lg font-semibold'
    },
    body: {
      large: 'text-lg leading-relaxed',
      base: 'text-base leading-relaxed',
      small: 'text-sm leading-relaxed',
      xs: 'text-xs leading-relaxed'
    },
    colors: {
      primary: 'text-gray-900 dark:text-white',
      secondary: 'text-gray-600 dark:text-gray-300', 
      muted: 'text-gray-500 dark:text-gray-400',
      accent: 'text-emerald-600 dark:text-emerald-400'
    }
  },

  // Spacing
  spacing: {
    section: 'mb-6',
    sectionLarge: 'mb-8',
    element: 'mb-4',
    elementSmall: 'mb-2'
  },

  // Border radius
  borderRadius: {
    small: 'rounded-lg',
    medium: 'rounded-xl',
    large: 'rounded-2xl'
  },

  // Shadows
  shadows: {
    small: 'shadow-sm',
    medium: 'shadow-lg',
    large: 'shadow-xl'
  },

  // Container sizes
  containers: {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full'
  },

  // Button styles
  buttons: {
    primary: `
      inline-flex items-center font-semibold rounded-xl 
      transform hover:scale-105 transition-all duration-200
      bg-gradient-to-r from-emerald-600 to-blue-600 text-white 
      hover:from-emerald-700 hover:to-blue-700 shadow-lg hover:shadow-xl
    `,
    secondary: `
      inline-flex items-center font-semibold rounded-xl 
      transform hover:scale-105 transition-all duration-200
      bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50 
      dark:bg-gray-800 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/20
    `,
    sizes: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base', 
      lg: 'px-8 py-4 text-lg'
    }
  },

  // Form inputs
  inputs: {
    base: `
      h-14 text-lg font-medium border-2 rounded-xl shadow-sm
      transition-all duration-200 ease-in-out
      text-gray-900 dark:text-gray-100
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      focus:outline-none focus:bg-white dark:focus:bg-gray-800
    `,
    focused: `
      border-emerald-500 dark:border-emerald-400 
      ring-2 ring-emerald-100 dark:ring-emerald-900/30 
      bg-white dark:bg-gray-800
    `,
    default: `
      border-gray-200 dark:border-gray-600 
      hover:border-gray-300 dark:hover:border-gray-500 
      bg-gray-50 dark:bg-gray-700
    `
  },

  // Cards
  cards: {
    base: `
      bg-white dark:bg-gray-800 rounded-xl shadow-sm 
      border border-gray-100 dark:border-gray-700
    `,
    hover: `
      hover:shadow-lg transition-all duration-200 
      hover:border-emerald-200 dark:hover:border-emerald-700
    `,
    gradient: `
      bg-gradient-to-br from-emerald-50 to-blue-50 
      dark:from-emerald-900/20 dark:to-blue-900/20 
      border border-emerald-200/50 dark:border-emerald-800/50
    `
  },

  // Inflation-specific styling
  inflation: {
    banner: 'bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl text-white',
    highlight: `
      bg-gradient-to-r from-amber-50 to-orange-50 
      dark:from-amber-900/20 dark:to-orange-900/20 
      border border-amber-200 dark:border-amber-800/30 rounded-lg
    `,
    text: 'text-amber-800 dark:text-amber-200'
  }
};

// Utility functions for consistent styling
export const getThemeClass = (category: string, variant: string = 'base') => {
  const categories = category.split('.');
  let result = theme as any;
  
  for (const cat of categories) {
    result = result[cat];
    if (!result) return '';
  }
  
  return result[variant] || result;
};

// Common component class combinations
export const commonStyles = {
  pageContainer: `min-h-screen ${theme.gradients.background}`,
  section: `rounded-xl p-6 ${theme.spacing.section}`,
  sectionCard: `${theme.cards.base} ${theme.spacing.section}`,
  sectionGradient: `${theme.gradients.card} ${theme.spacing.section}`,
  heading: `${theme.typography.heading.h1} ${theme.typography.colors.primary}`,
  subheading: `${theme.typography.heading.h2} ${theme.typography.colors.primary}`,
  bodyText: `${theme.typography.body.base} ${theme.typography.colors.secondary}`,
  mutedText: `${theme.typography.body.small} ${theme.typography.colors.muted}`,
  accentText: `${theme.typography.colors.accent} font-semibold`,
  primaryButton: `${theme.buttons.primary} ${theme.buttons.sizes.md}`,
  secondaryButton: `${theme.buttons.secondary} ${theme.buttons.sizes.md}`,
  formInput: `w-full ${theme.inputs.base}`,
  card: theme.cards.base,
  cardHover: `${theme.cards.base} ${theme.cards.hover}`,
  cardGradient: theme.cards.gradient
};

export default theme;