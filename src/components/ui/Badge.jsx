/**
 * Badge Component
 * Small status indicator following Material Design 3
 * 
 * @param {string} variant - 'default' | 'primary' | 'success' | 'warning' | 'error'
 * @param {string} size - 'sm' | 'md'
 */

const variants = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-blue-100 text-[#1A73E8]',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700'
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm'
}

const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}) => {
  return (
    <span
      className={`
        inline-flex items-center
        font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export default Badge
