/**
 * Spinner Component
 * Animated loading indicator following Material Design 3
 * 
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} color - 'primary' | 'white' | 'gray'
 * @param {string} label - Accessible label for screen readers
 */

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const colors = {
  primary: 'text-[#1A73E8]',
  white: 'text-white',
  gray: 'text-gray-400'
}

const Spinner = ({
  size = 'md',
  color = 'primary',
  label = 'Loading',
  className = ''
}) => {
  return (
    <div role="status" aria-label={label} className={`inline-flex ${className}`}>
      <svg
        className={`animate-spin ${sizes[size]} ${colors[color]}`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  )
}

// Full page loading overlay
Spinner.Overlay = ({ message = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="xl" />
      <p className="text-gray-600 font-medium">{message}</p>
    </div>
  </div>
)

// Inline loading state
Spinner.Inline = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center gap-3 py-8">
    <Spinner size="md" />
    <p className="text-gray-500 text-sm">{message}</p>
  </div>
)

export default Spinner
