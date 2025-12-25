import { Link } from 'react-router-dom'
import { ChevronRightIcon, HomeIcon } from '../icons'

const PageHeader = ({
  title,
  description,
  breadcrumbs = [], // Array of { label, path }
  actions, // Right-side action buttons
  className = ''
}) => {
  return (
    <div className={`py-8 ${className}`}>
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm mb-4">
          <Link 
            to="/" 
            className="text-gray-500 hover:text-[#1A73E8] transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRightIcon className="w-4 h-4 text-gray-400" />
              {crumb.path ? (
                <Link 
                  to={crumb.path}
                  className="text-gray-500 hover:text-[#1A73E8] transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-lg text-gray-600">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
