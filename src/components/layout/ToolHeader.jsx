/**
 * ToolHeader Component
 * Consistent header for tool pages with icon, title, and description
 */

const ToolHeader = ({ 
  icon: Icon, 
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-[#1A73E8]',
  title, 
  description,
  className = '' 
}) => {
  return (
    <div className={`text-center mb-8 ${className}`}>
      {Icon && (
        <div className={`inline-flex items-center justify-center w-16 h-16 ${iconBgColor} rounded-2xl mb-4`}>
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600">
          {description}
        </p>
      )}
    </div>
  )
}

export default ToolHeader
