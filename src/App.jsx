import { useState, useRef, useCallback } from 'react'
import { jsPDF } from 'jspdf'

// Constants
const A4_ASPECT_RATIO = 1.414 // A4 is 210mm x 297mm
const WHITESPACE_SEARCH_RANGE = 80 // Max pixels to search in each direction
const WHITE_TOLERANCE = 250 // RGB threshold for "white" (accounts for JPG artifacts)

export default function App() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' })
  const [pdfBlob, setPdfBlob] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)

  // Check if a pixel row is "white" (safe to cut)
  const isRowWhitespace = (imageData, rowY, width) => {
    const startIndex = rowY * width * 4
    for (let x = 0; x < width; x++) {
      const i = startIndex + x * 4
      const r = imageData.data[i]
      const g = imageData.data[i + 1]
      const b = imageData.data[i + 2]
      const a = imageData.data[i + 3]
      
      // If pixel is not white-ish (and not transparent), it's not safe
      if (a > 10 && (r < WHITE_TOLERANCE || g < WHITE_TOLERANCE || b < WHITE_TOLERANCE)) {
        return false
      }
    }
    return true
  }

  // Find safe cut point - search BOTH directions, prefer filling the page
  const findSafeCutPoint = (imageData, proposedY, width, height) => {
    // Check the proposed line first
    if (isRowWhitespace(imageData, proposedY, width)) {
      return proposedY
    }
    
    // Search forward first (to maximize page content), then backward
    // This ensures we fill pages as much as possible
    
    // Search FORWARD (beyond proposed cut) - prefer this to fill the page more
    for (let offset = 1; offset <= WHITESPACE_SEARCH_RANGE; offset++) {
      const checkY = proposedY + offset
      if (checkY >= height) break
      
      if (isRowWhitespace(imageData, checkY, width)) {
        return checkY
      }
    }
    
    // Search BACKWARD (before proposed cut) - only if forward search failed
    for (let offset = 1; offset <= WHITESPACE_SEARCH_RANGE; offset++) {
      const checkY = proposedY - offset
      if (checkY <= 0) break
      
      if (isRowWhitespace(imageData, checkY, width)) {
        return checkY
      }
    }
    
    // No safe point found within range - force cut at proposed line
    // This ensures we don't create unnecessarily short pages
    return proposedY
  }

  // Async wrapper to allow UI updates
  const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0))

  // Main processing function
  const processImage = async () => {
    if (!imageFile) return
    
    setIsProcessing(true)
    setError(null)
    setPdfBlob(null)
    setProgress({ current: 0, total: 0, status: 'Loading image...' })

    try {
      // Load image
      const img = new Image()
      img.src = imagePreview
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('Failed to load image'))
      })

      const imgWidth = img.naturalWidth
      const imgHeight = img.naturalHeight
      
      // Create PDF to get actual A4 dimensions in mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const pdfWidth = pdf.internal.pageSize.getWidth()   // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight() // 297mm
      
      // Calculate scale: how many image pixels = 1mm in PDF
      const pixelsPerMm = imgWidth / pdfWidth
      
      // Calculate how many image pixels fit in one A4 page height
      const pageHeight = Math.floor(pdfHeight * pixelsPerMm)
      
      // Estimate total pages
      const estimatedPages = Math.ceil(imgHeight / pageHeight)
      
      setProgress({ current: 0, total: estimatedPages, status: 'Analyzing image...' })
      await yieldToMain()

      // Create main canvas for pixel analysis
      const canvas = canvasRef.current || document.createElement('canvas')
      canvas.width = imgWidth
      canvas.height = imgHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(img, 0, 0)
      
      // Get full image data for whitespace detection
      setProgress(p => ({ ...p, status: 'Reading pixel data...' }))
      await yieldToMain()
      const fullImageData = ctx.getImageData(0, 0, imgWidth, imgHeight)
      
      // Slice canvas for each page
      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = imgWidth
      const sliceCtx = sliceCanvas.getContext('2d')
      
      let currentY = 0
      let pageNum = 0
      
      while (currentY < imgHeight) {
        pageNum++
        setProgress({ 
          current: pageNum, 
          total: Math.max(estimatedPages, pageNum), 
          status: `Processing page ${pageNum}...` 
        })
        await yieldToMain()
        
        // Calculate proposed end of this page
        let proposedEndY = currentY + pageHeight
        let actualEndY
        
        if (proposedEndY >= imgHeight) {
          // Last page - no need to find safe cut
          actualEndY = imgHeight
        } else {
          // Find safe cut point
          actualEndY = findSafeCutPoint(fullImageData, proposedEndY, imgWidth, imgHeight)
        }
        
        const sliceHeight = actualEndY - currentY
        
        // Draw slice to temporary canvas
        sliceCanvas.height = sliceHeight
        sliceCtx.fillStyle = '#FFFFFF'
        sliceCtx.fillRect(0, 0, imgWidth, sliceHeight)
        sliceCtx.drawImage(
          img,
          0, currentY, imgWidth, sliceHeight,  // Source rect
          0, 0, imgWidth, sliceHeight           // Dest rect
        )
        
        // Convert to JPEG data URL
        const sliceDataUrl = sliceCanvas.toDataURL('image/jpeg', 0.92)
        
        // Add page to PDF (add new page if not first)
        if (pageNum > 1) {
          pdf.addPage()
        }
        
        // Scale image to fill full page width, height proportional
        // For a full A4 slice, this fills the page; for partial slices (like the last page), 
        // it scales proportionally from the top
        const scaleRatio = pdfWidth / imgWidth
        const pdfSliceHeight = sliceHeight * scaleRatio
        
        // Always position from top (y=0)
        pdf.addImage(sliceDataUrl, 'JPEG', 0, 0, pdfWidth, pdfSliceHeight)
        
        // Move to next slice
        currentY = actualEndY
        
        // Yield to allow UI updates
        await yieldToMain()
      }

      setProgress({ current: pageNum, total: pageNum, status: 'Generating PDF...' })
      await yieldToMain()
      
      // Generate PDF blob
      const blob = pdf.output('blob')
      setPdfBlob(blob)
      setProgress({ current: pageNum, total: pageNum, status: 'Complete!' })
      
    } catch (err) {
      console.error('Processing error:', err)
      setError(err.message || 'An error occurred during processing')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle file selection
  const handleFileSelect = useCallback((file) => {
    if (!file) return
    
    // Validate file type
    if (!file.type.match(/^image\/(png|jpe?g)$/i)) {
      setError('Please upload a PNG or JPG image')
      return
    }
    
    // Check file size (warn if > 20MB)
    if (file.size > 20 * 1024 * 1024) {
      setError('Warning: Large files may cause performance issues')
    } else {
      setError(null)
    }
    
    setImageFile(file)
    setPdfBlob(null)
    
    // Create preview
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }, [])

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Download PDF
  const downloadPdf = () => {
    if (!pdfBlob) return
    
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${imageFile?.name?.replace(/\.[^.]+$/, '') || 'output'}-split.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Reset state
  const reset = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
    setPdfBlob(null)
    setError(null)
    setProgress({ current: 0, total: 0, status: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Smart Image-to-PDF Splitter
          </h1>
          <p className="text-slate-400 text-lg">
            Intelligently split long screenshots into multi-page A4 PDFs without cutting through content
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 shadow-2xl">
          
          {/* Upload Zone */}
          {!imageFile && (
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                transition-all duration-300 ease-out
                ${isDragging 
                  ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
                  : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/30'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleInputChange}
                className="hidden"
              />
              
              <div className="flex flex-col items-center gap-4">
                <div className={`
                  p-4 rounded-full bg-slate-700/50 
                  ${isDragging ? 'animate-bounce' : ''}
                `}>
                  <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                </div>
                
                <div>
                  <p className="text-xl font-medium text-slate-200">
                    {isDragging ? 'Drop your image here' : 'Drag & drop your image'}
                  </p>
                  <p className="text-slate-500 mt-1">or click to browse • PNG, JPG supported</p>
                </div>
              </div>
            </div>
          )}

          {/* Image Preview & Actions */}
          {imageFile && (
            <div className="space-y-6">
              {/* Preview */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-700 rounded-lg">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{imageFile.name}</p>
                      <p className="text-sm text-slate-500">
                        {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={reset}
                    disabled={isProcessing}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Image preview */}
                <div className="relative max-h-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full object-contain object-top max-h-64"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Progress */}
              {isProcessing && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{progress.status}</span>
                    {progress.total > 0 && (
                      <span className="text-slate-500">
                        Page {progress.current} of {progress.total}
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ 
                        width: progress.total > 0 
                          ? `${(progress.current / progress.total) * 100}%` 
                          : '0%' 
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!pdfBlob ? (
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className={`
                      flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold
                      transition-all duration-200
                      ${isProcessing
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                      }
                    `}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                          />
                        </svg>
                        Split into PDF
                      </>
                    )}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={downloadPdf}
                      className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold
                        bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                        text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40
                        transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                        />
                      </svg>
                      Download PDF
                    </button>
                    
                    <button
                      onClick={reset}
                      className="py-3 px-6 rounded-xl font-semibold border border-slate-600 
                        text-slate-300 hover:bg-slate-700 hover:border-slate-500
                        transition-all duration-200"
                    >
                      New Image
                    </button>
                  </>
                )}
              </div>

              {/* Success Message */}
              {pdfBlob && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>
                    PDF generated successfully! {progress.total} page{progress.total !== 1 ? 's' : ''} created with smart splitting.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              icon: '🎯', 
              title: 'Smart Detection', 
              desc: 'Finds safe whitespace to avoid cutting through text or images' 
            },
            { 
              icon: '📄', 
              title: 'A4 Format', 
              desc: 'Outputs standard A4-sized pages optimized for printing' 
            },
            { 
              icon: '🔒', 
              title: 'Client-Side', 
              desc: 'All processing happens in your browser - nothing uploaded' 
            },
          ].map((item, i) => (
            <div key={i} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-slate-200">{item.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
