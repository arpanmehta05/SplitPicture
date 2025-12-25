/**
 * Card Component
 * A flexible container with consistent styling following Material Design 3
 * 
 * @param {string} variant - 'elevated' | 'outlined' | 'filled'
 * @param {string} padding - 'none' | 'sm' | 'md' | 'lg'
 * @param {boolean} interactive - Whether card has hover effects
 * @param {boolean} selected - Whether card is in selected state
 */

const variants = {
  elevated: 'bg-white shadow-md hover:shadow-lg border-0',
  outlined: 'bg-white border border-gray-200 shadow-sm',
  filled: 'bg-gray-50 border-0'
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

const Card = ({
  children,
  variant = 'outlined',
  padding = 'md',
  interactive = false,
  selected = false,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={`
        rounded-2xl
        transition-all duration-200
        ${variants[variant]}
        ${paddings[padding]}
        ${interactive ? 'cursor-pointer hover:scale-[1.01] hover:shadow-lg' : ''}
        ${selected ? 'ring-2 ring-[#1A73E8] ring-offset-2' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </Component>
  )
}

// Sub-components for structured card layouts
Card.Header = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>
    {children}
  </div>
)

Card.Title = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h3>
)

Card.Description = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 mt-1 ${className}`}>
    {children}
  </p>
)

Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
)

Card.Footer = ({ children, className = '' }) => (
  <div className={`flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-100 ${className}`}>
    {children}
  </div>
)

export default Card
