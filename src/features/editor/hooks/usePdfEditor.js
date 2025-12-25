import { useState, useRef, useCallback, useEffect } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

export const TOOLS = {
  SELECT: 'select',
  ERASER: 'eraser',
  TEXT: 'text'
}

export function usePdfEditor() {
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageScale, setPageScale] = useState(1.5)
  const [activeTool, setActiveTool] = useState(TOOLS.SELECT)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState(null)
  const [annotations, setAnnotations] = useState({})
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentWhiteout, setCurrentWhiteout] = useState(null)
  const [editingTextId, setEditingTextId] = useState(null)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  const containerRef = useRef(null)
  const pdfDocRef = useRef(null)
  const pageAnnotations = annotations[currentPage] || { whiteouts: [], texts: [] }

  const loadPdf = useCallback(async (file) => {
    if (!file || file.type !== 'application/pdf') {
      setError('Please select a valid PDF file')
      return
    }
    
    setIsLoading(true)
    setError(null)
    try {
      const arrayBuffer = await file.arrayBuffer()
      // Create copies of the ArrayBuffer since pdfjs transfers it to worker (detaches original)
      const pdfJsBuffer = arrayBuffer.slice(0)
      const pdfLibBuffer = arrayBuffer.slice(0)
      
      const pdf = await pdfjsLib.getDocument({ data: pdfJsBuffer }).promise
      pdfDocRef.current = await PDFDocument.load(pdfLibBuffer)
      
      setPdfFile(file)
      setPdfDoc(pdf)
      setNumPages(pdf.numPages)
      setCurrentPage(1)
      setAnnotations({})
    } catch (err) {
      console.error('Error loading PDF:', err)
      setError('Failed to load PDF. Please try another file.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setPdfDoc(null)
    setPdfFile(null)
    setAnnotations({})
    setCurrentPage(1)
    setActiveTool(TOOLS.SELECT)
    setEditingTextId(null)
    setError(null)
  }, [])

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(numPages, page)))
    setEditingTextId(null)
  }, [numPages])

  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage])
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage])

  const selectTool = useCallback((tool) => {
    setActiveTool(tool)
    setEditingTextId(null)
  }, [])

  const dropHandlers = {
    onDragEnter: (e) => { e.preventDefault(); setIsDragging(true) },
    onDragLeave: (e) => { e.preventDefault(); setIsDragging(false) },
    onDragOver: (e) => { e.preventDefault() },
    onDrop: (e) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file?.type === 'application/pdf') {
        loadPdf(file)
      } else {
        setError('Please drop a PDF file')
      }
    }
  }

  const handleInputChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file) loadPdf(file)
  }, [loadPdf])

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const getCanvasCoords = useCallback((e) => {
    const canvas = overlayCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }, [])

  const handleMouseDown = useCallback((e) => {
    const coords = getCanvasCoords(e)

    if (activeTool === TOOLS.ERASER) {
      setIsDrawing(true)
      setCurrentWhiteout({ x: coords.x, y: coords.y, width: 0, height: 0, startX: coords.x, startY: coords.y })
    } else if (activeTool === TOOLS.TEXT) {
      const clickedText = pageAnnotations.texts.find(t => {
        const textWidth = Math.max((t.text || '').length * t.fontSize * 0.6, 100)
        return coords.x >= t.x && coords.x <= t.x + textWidth &&
               coords.y >= t.y - t.fontSize && coords.y <= t.y + 4
      })

      if (clickedText) {
        setEditingTextId(clickedText.id)
      } else {
        // Create new text
        const newText = {
          id: Date.now(),
          x: coords.x,
          y: coords.y,
          text: '',
          fontSize: 14,
          color: '#000000'
        }
        setAnnotations(prev => ({
          ...prev,
          [currentPage]: {
            ...pageAnnotations,
            texts: [...pageAnnotations.texts, newText]
          }
        }))
        setEditingTextId(newText.id)
      }
    }
  }, [activeTool, getCanvasCoords, pageAnnotations, currentPage])

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || activeTool !== TOOLS.ERASER || !currentWhiteout) return

    const coords = getCanvasCoords(e)
    const width = coords.x - currentWhiteout.startX
    const height = coords.y - currentWhiteout.startY

    setCurrentWhiteout(prev => ({
      ...prev,
      x: width >= 0 ? prev.startX : coords.x,
      y: height >= 0 ? prev.startY : coords.y,
      width: Math.abs(width),
      height: Math.abs(height)
    }))
  }, [isDrawing, activeTool, currentWhiteout, getCanvasCoords])

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentWhiteout && currentWhiteout.width > 5 && currentWhiteout.height > 5) {
      setAnnotations(prev => ({
        ...prev,
        [currentPage]: {
          ...pageAnnotations,
          whiteouts: [...pageAnnotations.whiteouts, {
            x: currentWhiteout.x,
            y: currentWhiteout.y,
            width: currentWhiteout.width,
            height: currentWhiteout.height
          }]
        }
      }))
    }
    setIsDrawing(false)
    setCurrentWhiteout(null)
  }, [isDrawing, currentWhiteout, currentPage, pageAnnotations])

  // Text editing
  const handleTextInput = useCallback((e) => {
    if (!editingTextId) return

    setAnnotations(prev => ({
      ...prev,
      [currentPage]: {
        ...pageAnnotations,
        texts: pageAnnotations.texts.map(t =>
          t.id === editingTextId ? { ...t, text: e.target.value } : t
        )
      }
    }))
  }, [editingTextId, currentPage, pageAnnotations])

  const finishTextEdit = useCallback(() => {
    if (editingTextId) {
      setAnnotations(prev => ({
        ...prev,
        [currentPage]: {
          ...pageAnnotations,
          texts: pageAnnotations.texts.filter(t => t.text.trim() !== '' || t.id !== editingTextId)
        }
      }))
      setEditingTextId(null)
    }
  }, [editingTextId, currentPage, pageAnnotations])

  // Render annotations on overlay canvas
  const renderAnnotations = useCallback(() => {
    const overlay = overlayCanvasRef.current
    if (!overlay) return

    const ctx = overlay.getContext('2d')
    ctx.clearRect(0, 0, overlay.width, overlay.height)

    const annots = annotations[currentPage] || { whiteouts: [], texts: [] }

    // Draw whiteouts
    ctx.fillStyle = '#FFFFFF'
    annots.whiteouts.forEach(w => {
      ctx.fillRect(w.x, w.y, w.width, w.height)
    })

    // Draw current whiteout being drawn
    if (currentWhiteout) {
      ctx.fillRect(currentWhiteout.x, currentWhiteout.y, currentWhiteout.width, currentWhiteout.height)
    }

    // Draw text elements
    annots.texts.forEach(t => {
      ctx.font = `${t.fontSize}px Arial`
      ctx.fillStyle = t.color
      ctx.fillText(t.text, t.x, t.y)

      // Draw selection box if editing
      if (t.id === editingTextId) {
        const metrics = ctx.measureText(t.text || 'Type here')
        ctx.strokeStyle = '#1A73E8'
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.strokeRect(t.x - 4, t.y - t.fontSize, Math.max(metrics.width + 8, 100), t.fontSize + 8)
        ctx.setLineDash([])
      }
    })
  }, [annotations, currentPage, currentWhiteout, editingTextId])

  // Save PDF with annotations
  const savePdf = useCallback(async () => {
    if (!pdfDocRef.current) return

    setIsSaving(true)
    setError(null)
    try {
      const pdfDocCopy = await PDFDocument.load(await pdfDocRef.current.save())
      const pages = pdfDocCopy.getPages()

      // Apply annotations to each page
      for (const [pageNum, annots] of Object.entries(annotations)) {
        const page = pages[parseInt(pageNum) - 1]
        if (!page) continue

        const { width, height } = page.getSize()
        const canvas = canvasRef.current
        const scaleX = width / canvas.width
        const scaleY = height / canvas.height

        // Draw whiteouts
        annots.whiteouts.forEach(w => {
          page.drawRectangle({
            x: w.x * scaleX,
            y: height - (w.y + w.height) * scaleY,
            width: w.width * scaleX,
            height: w.height * scaleY,
            color: rgb(1, 1, 1)
          })
        })

        // Draw texts
        for (const t of annots.texts) {
          if (!t.text.trim()) continue
          
          const font = await pdfDocCopy.embedFont('Helvetica')
          page.drawText(t.text, {
            x: t.x * scaleX,
            y: height - t.y * scaleY,
            size: t.fontSize * scaleY,
            font,
            color: rgb(0, 0, 0)
          })
        }
      }

      const pdfBytes = await pdfDocCopy.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `edited-${pdfFile.name}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Save error:', err)
      setError('Failed to save PDF')
    } finally {
      setIsSaving(false)
    }
  }, [annotations, pdfFile])

  // Render page effect
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return

    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage)
      const viewport = page.getViewport({ scale: pageScale })
      
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      canvas.width = viewport.width
      canvas.height = viewport.height
      
      if (overlayCanvasRef.current) {
        overlayCanvasRef.current.width = viewport.width
        overlayCanvasRef.current.height = viewport.height
      }

      await page.render({
        canvasContext: ctx,
        viewport: viewport
      }).promise

      renderAnnotations()
    }

    renderPage()
  }, [pdfDoc, currentPage, pageScale, renderAnnotations])

  // Re-render annotations when they change
  useEffect(() => {
    renderAnnotations()
  }, [renderAnnotations])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && editingTextId) {
        finishTextEdit()
      }
      if (e.key === 'Escape') {
        setEditingTextId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingTextId, finishTextEdit])

  // Get editing text element
  const editingText = pageAnnotations.texts.find(t => t.id === editingTextId)

  return {
    // State
    pdfFile,
    pdfDoc,
    numPages,
    currentPage,
    pageScale,
    activeTool,
    isLoading,
    isSaving,
    isDragging,
    error,
    annotations,
    editingText,
    editingTextId,
    currentWhiteout,
    
    // Refs
    fileInputRef,
    canvasRef,
    overlayCanvasRef,
    containerRef,
    
    // Actions
    loadPdf,
    reset,
    savePdf,
    selectTool,
    goToPage,
    nextPage,
    prevPage,
    setPageScale,
    
    // Handlers
    dropHandlers,
    handleInputChange,
    openFilePicker,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTextInput,
    finishTextEdit,
    
    // Computed
    hasAnnotations: Object.keys(annotations).length > 0,
    canSave: pdfDoc && !isSaving
  }
}

export default usePdfEditor
