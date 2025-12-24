import { forwardRef } from 'react'

// Supported formats configuration - easy to extend in the future
const SUPPORTED_FORMATS = [
  { ext: 'PNG', desc: 'Portable Network Graphics' },
  { ext: 'JPG', desc: 'JPEG Image' },
  { ext: 'JPEG', desc: 'JPEG Image' },
]

/**
 * UploadZone Component
 * Drag & drop area for file upload - Google Drive style
 */
const UploadZone = forwardRef(({ 
  isDragging, 
  dragHandlers, 
  onInputChange, 
  onClick 
}, ref) => {
  return (
    <div className="space-y-5">
      {/* Main Upload Area */}
      <div
        onDragEnter={dragHandlers.onDragEnter}
        onDragLeave={dragHandlers.onDragLeave}
        onDragOver={dragHandlers.onDragOver}
        onDrop={dragHandlers.onDrop}
        onClick={onClick}
        className={`
          relative border-2 border-dashed rounded-lg
          p-10 sm:p-12
          text-center cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-blue-600 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
          }
        `}
      >
        <input
          ref={ref}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={onInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4">
          {/* Upload Icon */}
          <div className={`
            p-4 rounded-full 
            ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}
            transition-colors duration-200
          `}>
            <svg 
              className={`w-10 h-10 ${isDragging ? 'text-blue-600' : 'text-gray-500'}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" 
              />
            </svg>
          </div>
          
          {/* Upload Text */}
          <div>
            <p className="text-base sm:text-lg font-medium text-gray-900">
              {isDragging ? 'Drop your image here' : 'Drag and drop your image here'}
            </p>
            <p className="text-gray-500 mt-1 text-sm">
              or <span className="text-blue-600 font-medium">browse files</span>
            </p>
          </div>
        </div>
      </div>

      {/* Supported Formats Section */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <svg 
            className="w-5 h-5 text-gray-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" 
            />
          </svg>
          <h3 className="text-sm font-medium text-gray-700">
            Supported Formats
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_FORMATS.map((format, index) => (
            <div 
              key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 
                bg-white rounded-md border border-gray-200 text-sm"
            >
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="font-medium text-gray-700">{format.ext}</span>
            </div>
          ))}
        </div>
        
        <p className="mt-3 text-xs text-gray-500">
          <span className="font-medium text-gray-700">Smart Detection:</span> Upload any size image — we'll automatically 
          create a single-page PDF for regular images or split long screenshots into multiple A4 pages.
        </p>
      </div>
    </div>
  )
})

UploadZone.displayName = 'UploadZone'

export default UploadZone
