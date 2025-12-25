import { forwardRef } from 'react'

/**
 * Button Component
 * A versatile, accessible button following Google Material Design 3
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} fullWidth - Whether button takes full width
 * @param {boolean} loading - Show loading spinner
 * @param {boolean} disabled - Disable the button
 * @param {ReactNode} leftIcon - Icon on the left
 * @param {ReactNode} rightIcon - Icon on the right
 */

const variants = {
  primary: 'bg-[#1A73E8] hover:bg-[#1557B0] text-white shadow-sm hover:shadow-md',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 bg-white',
  ghost: 'hover:bg-gray-100 text-gray-600 hover:text-gray-900',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
  xl: 'px-8 py-4 text-base gap-2.5'
}

const iconSizes = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-5 h-5'
}

const Spinner = ({ className }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle 
      className="opacity-25" 
      cx="12" cy="12" r="10" 
      stroke="currentColor" 
      strokeWidth="4" 
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
    />
  </svg>
)

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const isDisabled = disabled || loading

  // Clone icons with proper size class
  const sizedLeftIcon = leftIcon && (
    <span className={iconSizes[size]}>{leftIcon}</span>
  )
  const sizedRightIcon = rightIcon && (
    <span className={iconSizes[size]}>{rightIcon}</span>
  )

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        font-medium rounded-xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A73E8]
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className={iconSizes[size]} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {sizedLeftIcon}
          {children}
          {sizedRightIcon}
        </>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
