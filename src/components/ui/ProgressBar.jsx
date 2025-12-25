/**
 * ProgressBar Component
 * Animated progress indicator following Material Design 3
 * 
 * @param {number} value - Current progress (0-100)
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {string} variant - 'primary' | 'success' | 'warning' | 'error'
 * @param {boolean} showLabel - Show percentage label
 * @param {boolean} indeterminate - Show indeterminate animation
 */

const sizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
}

const variants = {
  primary: 'bg-[#1A73E8]',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500'
}

const ProgressBar = ({
  value = 0,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  indeterminate = false,
  label = '',
  className = ''
}) => {
  const clampedValue = Math.min(100, Math.max(0, value))

  return (
    <div className={`w-full ${className}`}>
      {/* Label row */}
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label}
          </span>
          {showLabel && (
            <span className="text-sm font-medium text-gray-500">
              {Math.round(clampedValue)}%
            </span>
          )}
        </div>
      )}

      {/* Progress track */}
      <div
        className={`
          w-full bg-gray-200 rounded-full overflow-hidden
          ${sizes[size]}
        `}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Progress fill */}
        <div
          className={`
            h-full rounded-full
            transition-all duration-300 ease-out
            ${variants[variant]}
            ${indeterminate ? 'animate-progress-indeterminate w-1/3' : ''}
          `}
          style={indeterminate ? {} : { width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}

// Circular variant
ProgressBar.Circular = ({
  value = 0,
  size = 48,
  strokeWidth = 4,
  variant = 'primary',
  showLabel = true,
  className = ''
}) => {
  const clampedValue = Math.min(100, Math.max(0, value))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (clampedValue / 100) * circumference

  const colors = {
    primary: '#1A73E8',
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444'
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          className="text-gray-200"
          stroke="currentColor"
          fill="none"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke={colors[variant]}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-semibold text-gray-700">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  )
}

export default ProgressBar
