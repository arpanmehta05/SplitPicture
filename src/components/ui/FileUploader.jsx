import { useCallback, useState } from 'react'
import { UploadIcon, DocumentIcon, ImageIcon } from '../icons'

/**
 * FileUploader Component
 * Drag-and-drop file upload zone with Material Design 3 styling
 * 
 * @param {function} onFilesSelected - Callback when files are selected
 * @param {string[]} acceptedTypes - Array of accepted MIME types
 * @param {boolean} multiple - Whether to allow multiple files
 * @param {number} maxFiles - Maximum number of files (when multiple=true)
 * @param {number} maxSize - Maximum file size in bytes
 * @param {string} label - Upload zone label
 * @param {string} hint - Helper text
 */

const FileUploader = ({
  onFilesSelected,
  acceptedTypes = ['application/pdf', 'image/*'],
  multiple = false,
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB default
  label = 'Drop files here or click to upload',
  hint = 'Supports PDF and image files',
  disabled = false,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)

  const validateFiles = useCallback((files) => {
    const validFiles = []
    const errors = []

    for (const file of files) {
      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'))
        }
        return file.type === type
      })

      if (!isValidType) {
        errors.push(`${file.name}: Invalid file type`)
        continue
      }

      // Check file size
      if (file.size > maxSize) {
        errors.push(`${file.name}: File too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`)
        continue
      }

      validFiles.push(file)
    }

    // Check max files
    if (multiple && validFiles.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed`)
      return { files: validFiles.slice(0, maxFiles), errors }
    }

    return { files: validFiles, errors }
  }, [acceptedTypes, maxSize, maxFiles, multiple])

  const handleFiles = useCallback((fileList) => {
    if (disabled) return

    const files = Array.from(fileList)
    const { files: validFiles, errors } = validateFiles(files)

    if (errors.length > 0) {
      setError(errors[0])
      setTimeout(() => setError(null), 3000)
    }

    if (validFiles.length > 0) {
      setError(null)
      onFilesSelected?.(multiple ? validFiles : validFiles[0])
    }
  }, [disabled, validateFiles, onFilesSelected, multiple])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleInputChange = useCallback((e) => {
    handleFiles(e.target.files)
    e.target.value = '' // Reset for same file selection
  }, [handleFiles])

  const accept = acceptedTypes.join(',')

  // Determine icon based on accepted types
  const isPdfOnly = acceptedTypes.length === 1 && acceptedTypes[0] === 'application/pdf'
  const isImageOnly = acceptedTypes.every(t => t.startsWith('image/'))
  const Icon = isPdfOnly ? DocumentIcon : isImageOnly ? ImageIcon : UploadIcon

  return (
    <div className={className}>
      <label
        className={`
          relative flex flex-col items-center justify-center
          min-h-[200px] p-8
          border-2 border-dashed rounded-2xl
          cursor-pointer
          transition-all duration-200
          ${isDragging 
            ? 'border-[#1A73E8] bg-blue-50 scale-[1.01]' 
            : 'border-gray-300 hover:border-[#1A73E8] hover:bg-gray-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={disabled}
        />

        {/* Icon */}
        <div className={`
          w-16 h-16 mb-4 rounded-full
          flex items-center justify-center
          transition-all duration-200
          ${isDragging 
            ? 'bg-[#1A73E8] text-white scale-110' 
            : 'bg-gray-100 text-gray-400'
          }
        `}>
          <Icon className="w-8 h-8" />
        </div>

        {/* Label */}
        <p className={`
          text-base font-medium text-center
          ${isDragging ? 'text-[#1A73E8]' : 'text-gray-700'}
        `}>
          {isDragging ? 'Drop files here' : label}
        </p>

        {/* Hint */}
        <p className="text-sm text-gray-500 mt-2 text-center">
          {hint}
        </p>

        {/* Max files info */}
        {multiple && (
          <p className="text-xs text-gray-400 mt-1">
            Up to {maxFiles} files, max {Math.round(maxSize / 1024 / 1024)}MB each
          </p>
        )}

        {/* Error message */}
        {error && (
          <p className="text-sm text-red-500 mt-3 font-medium">
            {error}
          </p>
        )}
      </label>
    </div>
  )
}

export default FileUploader
