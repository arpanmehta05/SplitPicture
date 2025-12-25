import { Link } from 'react-router-dom'
import { DocumentIcon, ArrowLeftIcon } from '../icons'

/**
 * ToolPageLayout Component
 * Consistent layout wrapper for all tool pages
 * 
 * @param {string} maxWidth - Max width class (e.g., 'max-w-3xl', 'max-w-4xl')
 * @param {ReactNode} children - Page content
 */
const ToolPageLayout = ({ children, maxWidth = 'max-w-4xl' }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${maxWidth}`}>
          <div className="flex items-center justify-between h-14">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Tools</span>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[#1A73E8] rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">DocuFix Suite</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ${maxWidth}`}>
        {children}
      </div>
    </div>
  )
}

export default ToolPageLayout
