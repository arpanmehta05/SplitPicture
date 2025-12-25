import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    tools: [
      { name: 'Smart Split', href: '/split-pdf' },
      { name: 'Merge PDF', href: '/merge-pdf' },
      { name: 'Quick Edit', href: '/edit-pdf' },
    ],
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Section - Left */}
          <div className="lg:col-span-5">
            {/* Logo & Name */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#1A73E8] rounded-lg flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={2}
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                DocuFix Suite
              </span>
            </div>
            
            {/* Tagline */}
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">
              Making document management simple and secure. All processing happens 
              locally in your browser — your files never leave your device.
            </p>
            
            {/* Copyright */}
            <p className="text-gray-500 text-xs">
              © {currentYear} DocuFix Suite. All rights reserved.
            </p>
          </div>

          {/* Links Section - Right */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              {/* Tools Column */}
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-gray-900 uppercase mb-4">
                  Tools
                </h3>
                <ul className="space-y-3">
                  {footerLinks.tools.map((link) => (
                    <li key={link.name}>
                      <Link 
                        to={link.href}
                        className="text-sm text-gray-600 hover:text-[#1A73E8] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-gray-900 uppercase mb-4">
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-[#1A73E8] transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Column */}
              <div>
                <h3 className="text-xs font-semibold tracking-wider text-gray-900 uppercase mb-4">
                  Legal
                </h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <a 
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-[#1A73E8] transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar - Optional subtle divider with additional info */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              Built with privacy in mind. No data collection. No tracking.
            </p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
