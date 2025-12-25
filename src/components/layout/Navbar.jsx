import { Link, useLocation } from 'react-router-dom'
import { DocumentIcon } from '../icons'

const navLinks = [
  { path: '/split-pdf', label: 'Split PDF' },
  { path: '/merge-pdf', label: 'Merge PDF' },
  { path: '/edit-pdf', label: 'Edit PDF' }
]

const Navbar = ({ className = '' }) => {
  const location = useLocation()

  return (
    <header className={`bg-white border-b border-gray-100 sticky top-0 z-40 ${className}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#4285F4] rounded-xl flex items-center justify-center shadow-md">
              <DocumentIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              DocuFix Suite
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-[#1A73E8] text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button - simplified for now */}
          <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
