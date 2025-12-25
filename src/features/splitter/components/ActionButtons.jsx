/**
 * ActionButtons Component
 * Renders processing/download buttons - Google Material Design style
 */
const ActionButtons = ({ 
  pdfBlob, 
  isProcessing, 
  onProcess, 
  onDownload, 
  onReset 
}) => {
  // Processing/Convert button
  if (!pdfBlob) {
    return (
      <button
        onClick={onProcess}
        disabled={isProcessing}
        className={`
          w-full flex items-center justify-center gap-2 
          py-3 px-6 rounded-full font-medium
          text-sm
          transition-all duration-200
          ${isProcessing
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]'
          }
        `}
      >
        {isProcessing ? (
          <>
            <LoadingSpinner />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <DocumentIcon />
            <span>Convert to PDF</span>
          </>
        )}
      </button>
    )
  }

  // Download & New Image buttons
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onDownload}
        className="flex-1 flex items-center justify-center gap-2 
          py-3 px-6 rounded-full font-medium
          text-sm
          bg-blue-600 hover:bg-blue-700 
          text-white shadow-sm hover:shadow-md
          active:scale-[0.98]
          transition-all duration-200"
      >
        <DownloadIcon />
        <span>Download PDF</span>
      </button>
      
      <button
        onClick={onReset}
        className="py-3 px-6 rounded-full font-medium 
          text-sm
          border border-gray-300 
          text-gray-700 hover:bg-gray-50
          active:scale-[0.98]
          transition-all duration-200"
      >
        New Image
      </button>
    </div>
  )
}

// Icon Components
const LoadingSpinner = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle 
      className="opacity-25" 
      cx="12" cy="12" r="10" 
      stroke="currentColor" 
      strokeWidth="4" 
    />
    <path 
      className="opacity-75" 
      fill="currentColor" 
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
    />
  </svg>
)

const DocumentIcon = () => (
  <svg 
    className="w-5 h-5" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" 
    />
  </svg>
)

const DownloadIcon = () => (
  <svg 
    className="w-5 h-5" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" 
    />
  </svg>
)

export default ActionButtons
