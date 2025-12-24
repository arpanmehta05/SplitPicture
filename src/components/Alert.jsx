/**
 * Alert Component
 * Displays error or success messages - Google Material Design style
 */
const Alert = ({ type = 'error', message, pageCount, conversionMode }) => {
  const isSuccess = type === 'success'
  
  const baseClasses = "flex items-center gap-3 p-4 rounded-lg text-sm"
  const typeClasses = isSuccess 
    ? "bg-green-50 border border-green-200 text-green-800"
    : "bg-red-50 border border-red-200 text-red-800"

  const getSuccessMessage = () => {
    if (conversionMode === 'single') {
      return `PDF generated successfully! Single-page conversion completed.`
    }
    return `PDF generated successfully! ${pageCount} page${pageCount !== 1 ? 's' : ''} created with smart splitting.`
  }

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      {isSuccess ? <SuccessIcon /> : <WarningIcon />}
      <span className="flex-1">
        {isSuccess ? getSuccessMessage() : message}
      </span>
    </div>
  )
}

// Icon Components
const WarningIcon = () => (
  <svg 
    className="w-5 h-5 flex-shrink-0 text-red-600" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
    />
  </svg>
)

const SuccessIcon = () => (
  <svg 
    className="w-5 h-5 flex-shrink-0 text-green-600" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
    />
  </svg>
)

export default Alert
