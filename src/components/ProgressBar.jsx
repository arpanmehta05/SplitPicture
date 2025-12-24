/**
 * ProgressBar Component
 * Shows processing progress - Google Material Design style
 */
const ProgressBar = ({ progress }) => {
  const { current, total, status } = progress
  const percentage = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="space-y-2">
      {/* Status Text */}
      <div className="flex items-center justify-between text-sm gap-2">
        <span className="text-gray-600 truncate">{status}</span>
        {total > 0 && (
          <span className="text-gray-500 flex-shrink-0">
            Page {current} of {total}
          </span>
        )}
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
