export const colors = {
  primary: {
    main: '#1A73E8',
    hover: '#1557B0',
    light: '#E8F0FE',
    dark: '#174EA6'
  },
  success: {
    main: '#34A853',
    light: '#E6F4EA',
    dark: '#137333'
  },
  error: {
    main: '#EA4335',
    light: '#FCE8E6',
    dark: '#C5221F'
  },
  warning: {
    main: '#FBBC04',
    light: '#FEF7E0',
    dark: '#E37400'
  },
  gray: {
    50: '#F8F9FA',
    100: '#F1F3F4',
    200: '#E8EAED',
    300: '#DADCE0',
    400: '#BDC1C6',
    500: '#9AA0A6',
    600: '#80868B',
    700: '#5F6368',
    800: '#3C4043',
    900: '#202124'
  }
}

// Spacing scale (in Tailwind units)
export const spacing = {
  xs: '0.5',   // 2px
  sm: '1',     // 4px
  md: '2',     // 8px
  lg: '4',     // 16px
  xl: '6',     // 24px
  '2xl': '8',  // 32px
  '3xl': '12', // 48px
}

// Border radius
export const radii = {
  sm: 'rounded',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-full'
}

// Shadows
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
}

// Transitions
export const transitions = {
  fast: 'transition-all duration-150',
  normal: 'transition-all duration-200',
  slow: 'transition-all duration-300'
}

// Typography
export const typography = {
  h1: 'text-4xl sm:text-5xl lg:text-6xl font-extrabold',
  h2: 'text-2xl sm:text-3xl font-bold',
  h3: 'text-lg sm:text-xl font-semibold',
  h4: 'text-base font-semibold',
  body: 'text-sm sm:text-base',
  small: 'text-xs sm:text-sm',
  tiny: 'text-xs'
}

// Button variants
export const buttonVariants = {
  primary: 'bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-sm hover:shadow-md',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
  ghost: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white'
}

// Button sizes
export const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-base'
}

// File types
export const FILE_TYPES = {
  PDF: {
    accept: '.pdf',
    mime: 'application/pdf',
    extensions: ['pdf']
  },
  IMAGE: {
    accept: 'image/png,image/jpeg,image/jpg',
    mime: ['image/png', 'image/jpeg', 'image/jpg'],
    extensions: ['png', 'jpg', 'jpeg']
  }
}

// App branding
export const BRAND = {
  name: 'DocuFix Suite',
  tagline: 'Fix your documents instantly'
}
