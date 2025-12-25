import { formatFileSize } from '../../../lib/pdfProcessor'

/**
 * ImagePreview Component
 * Shows the selected image with file info - Google Material Design style
 */
const ImagePreview = ({ 
  file, 
  previewUrl, 
  onRemove, 
  isProcessing 
}) => {
  return (
    <div className="relative">
      {/* File Info Header */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* File Icon */}
          <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
            <svg 
              className="w-5 h-5 text-blue-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" 
              />
            </svg>
          </div>
          
          {/* File Details */}
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 text-sm truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {formatFileSize(file.size)}
            </p>
          </div>
        </div>
        
        {/* Remove Button */}
        <button
          onClick={onRemove}
          disabled={isProcessing}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
          aria-label="Remove image"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>
      
      {/* Image Preview */}
      <div className="relative max-h-64 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="w-full object-contain object-top max-h-64"
        />
      </div>
    </div>
  )
}

export default ImagePreview
