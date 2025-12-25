import { useState, useRef, useCallback } from 'react'
import { jsPDF } from 'jspdf'
import { 
  findSafeCutPoint, 
  yieldToMain, 
  validateFile, 
  generateOutputFilename,
  checkIfSinglePage
} from '../../../lib/pdfProcessor'

// Workflow stages
export const STAGES = {
  UPLOAD: 'upload',
  EDIT: 'edit',
  PROCESS: 'process'
}

/**
 * Custom hook for handling image to PDF processing
 */
export const useImageProcessor = () => {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' })
  const [pdfBlob, setPdfBlob] = useState(null)
  const [error, setError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [conversionMode, setConversionMode] = useState(null) // 'single' or 'split'
  const [stage, setStage] = useState(STAGES.UPLOAD) // Current workflow stage
  const [editedImageUrl, setEditedImageUrl] = useState(null) // Edited image from canvas
  
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const editorRef = useRef(null) // Reference to ImageEditor component

  /**
   * Single page conversion - for images that fit on one A4 page
   */
  const processSinglePage = async (img, imgWidth, imgHeight) => {
    setProgress({ current: 1, total: 1, status: 'Creating single-page PDF...' })
    await yieldToMain()
    
    // Determine orientation based on image aspect ratio
    const isLandscape = imgWidth > imgHeight
    const orientation = isLandscape ? 'landscape' : 'portrait'
    
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    })
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate dimensions to fit image within page while maintaining aspect ratio
    const imgAspect = imgWidth / imgHeight
    const pageAspect = pdfWidth / pdfHeight
    
    let finalWidth, finalHeight, offsetX, offsetY
    
    if (imgAspect > pageAspect) {
      // Image is wider - fit to width
      finalWidth = pdfWidth
      finalHeight = pdfWidth / imgAspect
      offsetX = 0
      offsetY = (pdfHeight - finalHeight) / 2
    } else {
      // Image is taller - fit to height
      finalHeight = pdfHeight
      finalWidth = pdfHeight * imgAspect
      offsetX = (pdfWidth - finalWidth) / 2
      offsetY = 0
    }
    
    // Create canvas for image
    const canvas = document.createElement('canvas')
    canvas.width = imgWidth
    canvas.height = imgHeight
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, imgWidth, imgHeight)
    ctx.drawImage(img, 0, 0)
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
    
    pdf.addImage(dataUrl, 'JPEG', offsetX, offsetY, finalWidth, finalHeight)
    
    setProgress({ current: 1, total: 1, status: 'Complete!' })
    
    return pdf.output('blob')
  }

  /**
   * Multi-page splitting - for long screenshots
   */
  const processMultiPage = async (img, imgWidth, imgHeight) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    const pixelsPerMm = imgWidth / pdfWidth
    const pageHeight = Math.floor(pdfHeight * pixelsPerMm)
    const estimatedPages = Math.ceil(imgHeight / pageHeight)
    
    setProgress({ current: 0, total: estimatedPages, status: 'Analyzing image...' })
    await yieldToMain()

    const canvas = canvasRef.current || document.createElement('canvas')
    canvas.width = imgWidth
    canvas.height = imgHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0)
    
    setProgress(p => ({ ...p, status: 'Reading pixel data...' }))
    await yieldToMain()
    const fullImageData = ctx.getImageData(0, 0, imgWidth, imgHeight)
    
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
      
      let proposedEndY = currentY + pageHeight
      let actualEndY
      
      if (proposedEndY >= imgHeight) {
        actualEndY = imgHeight
      } else {
        actualEndY = findSafeCutPoint(fullImageData, proposedEndY, imgWidth, imgHeight)
      }
      
      const sliceHeight = actualEndY - currentY
      
      sliceCanvas.height = sliceHeight
      sliceCtx.fillStyle = '#FFFFFF'
      sliceCtx.fillRect(0, 0, imgWidth, sliceHeight)
      sliceCtx.drawImage(
        img,
        0, currentY, imgWidth, sliceHeight,
        0, 0, imgWidth, sliceHeight
      )
      
      const sliceDataUrl = sliceCanvas.toDataURL('image/jpeg', 0.92)
      
      if (pageNum > 1) {
        pdf.addPage()
      }
      
      const scaleRatio = pdfWidth / imgWidth
      const pdfSliceHeight = sliceHeight * scaleRatio
      
      pdf.addImage(sliceDataUrl, 'JPEG', 0, 0, pdfWidth, pdfSliceHeight)
      
      currentY = actualEndY
      await yieldToMain()
    }

    setProgress({ current: pageNum, total: pageNum, status: 'Complete!' })
    
    return pdf.output('blob')
  }

  /**
   * Main processing function - auto-detects conversion mode
   * Uses edited image if available, otherwise uses original
   */
  const processImage = async () => {
    if (!imageFile) return
    
    setIsProcessing(true)
    setError(null)
    setPdfBlob(null)
    setProgress({ current: 0, total: 0, status: 'Loading image...' })
    setStage(STAGES.PROCESS)

    try {
      const img = new Image()
      // Use edited image if available, otherwise use original preview
      img.src = editedImageUrl || imagePreview
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = () => reject(new Error('Failed to load image'))
      })

      const imgWidth = img.naturalWidth
      const imgHeight = img.naturalHeight
      
      // Auto-detect: single page or multi-page split
      const isSinglePage = checkIfSinglePage(imgWidth, imgHeight)
      setConversionMode(isSinglePage ? 'single' : 'split')
      
      let blob
      if (isSinglePage) {
        setProgress({ current: 0, total: 1, status: 'Detected: Single page conversion' })
        await yieldToMain()
        blob = await processSinglePage(img, imgWidth, imgHeight)
      } else {
        setProgress({ current: 0, total: 0, status: 'Detected: Long screenshot - splitting...' })
        await yieldToMain()
        blob = await processMultiPage(img, imgWidth, imgHeight)
      }
      
      setPdfBlob(blob)
      
    } catch (err) {
      console.error('Processing error:', err)
      setError(err.message || 'An error occurred during processing')
    } finally {
      setIsProcessing(false)
    }
  }

  /**
   * Handle file selection from input or drag-drop
   */
  const handleFileSelect = useCallback((file) => {
    const validation = validateFile(file)
    
    if (!validation.valid) {
      setError(validation.error)
      return
    }
    
    if (validation.warning) {
      setError(validation.warning)
    } else {
      setError(null)
    }
    
    setImageFile(file)
    setPdfBlob(null)
    
    // Create preview
    const url = URL.createObjectURL(file)
    setImagePreview(url)
  }, [])

  /**
   * Drag and drop handlers
   */
  const dragHandlers = {
    onDragEnter: (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    },
    onDragLeave: (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    },
    onDragOver: (e) => {
      e.preventDefault()
      e.stopPropagation()
    },
    onDrop: (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileSelect(files[0])
      }
    }
  }

  /**
   * Handle file input change
   */
  const handleInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  /**
   * Download generated PDF
   */
  const downloadPdf = () => {
    if (!pdfBlob) return
    
    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = generateOutputFilename(imageFile?.name)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Reset all state
   */
  const reset = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(null)
    setPdfBlob(null)
    setError(null)
    setProgress({ current: 0, total: 0, status: '' })
    setConversionMode(null)
    setStage(STAGES.UPLOAD)
    setEditedImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Move to edit stage
   */
  const startEditing = () => {
    setStage(STAGES.EDIT)
  }

  /**
   * Skip editing and go directly to processing
   */
  const skipEditing = () => {
    setEditedImageUrl(null)
    processImage()
  }

  /**
   * Apply edits from editor and move to ready state
   */
  const applyEdits = () => {
    if (editorRef.current) {
      const editedUrl = editorRef.current.getEditedImageUrl()
      setEditedImageUrl(editedUrl)
    }
    setStage(STAGES.UPLOAD) // Go back to show preview with "Process" button
  }

  /**
   * Cancel editing and return to preview
   */
  const cancelEditing = () => {
    setEditedImageUrl(null)
    setStage(STAGES.UPLOAD)
  }

  /**
   * Open file picker
   */
  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  return {
    // State
    imageFile,
    imagePreview,
    isProcessing,
    progress,
    pdfBlob,
    error,
    isDragging,
    conversionMode,
    stage,
    editedImageUrl,
    
    // Refs
    fileInputRef,
    canvasRef,
    editorRef,
    
    // Actions
    processImage,
    handleInputChange,
    downloadPdf,
    reset,
    openFilePicker,
    dragHandlers,
    
    // Stage transitions
    startEditing,
    skipEditing,
    applyEdits,
    cancelEditing
  }
}

export default useImageProcessor
