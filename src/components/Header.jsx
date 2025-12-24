/**
 * Header Component
 * Displays the app title and description - Google Material Design style
 */
const Header = ({ 
  title = "Smart Image-to-PDF Splitter",
  subtitle = "Intelligently split long screenshots into multi-page A4 PDFs without cutting through content"
}) => {
  return (
    <div className="text-center mb-8 px-2">
      <div className="flex items-center justify-center gap-3 mb-3">
        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
          {title}
        </h1>
      </div>
      <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
        {subtitle}
      </p>
    </div>
  )
}

export default Header
