/**
 * PageContainer Component
 * Consistent page wrapper with proper spacing and constraints
 */

const PageContainer = ({
  children,
  maxWidth = '7xl', // 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
  padding = true,
  centered = false,
  className = ''
}) => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div
      className={`
        mx-auto w-full
        ${maxWidths[maxWidth]}
        ${padding ? 'px-4 sm:px-6 lg:px-8' : ''}
        ${centered ? 'flex flex-col items-center' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default PageContainer
