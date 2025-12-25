import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'

// Tool constants
const TOOLS = {
  SELECT: 'select',
  ERASER: 'eraser',
  TEXT: 'text'
}

// Icons as components
const SelectIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
  </svg>
)

const EraserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
  </svg>
)

const TextIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
)

const UndoIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
)

const RedoIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
  </svg>
)

const ZoomInIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
  </svg>
)

const ZoomOutIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
  </svg>
)

/**
 * ImageEditor Component
 * A canvas-based image editor with select, eraser (whiteout), and text tools
 * Styled like Google Workspace floating toolbar
 */
const ImageEditor = forwardRef(({ imageUrl, onClose }, ref) => {
  // Canvas refs
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  
  // State
  const [activeTool, setActiveTool] = useState(TOOLS.SELECT)
  const [isDrawing, setIsDrawing] = useState(false)
  const [eraserSize, setEraserSize] = useState(20)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [textElements, setTextElements] = useState([])
  const [selectedTextId, setSelectedTextId] = useState(null)
  const [editingTextId, setEditingTextId] = useState(null)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [textDragOffset, setTextDragOffset] = useState({ x: 0, y: 0 })
  
  // Original image reference
  const originalImageRef = useRef(null)

  // Load image on mount
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      originalImageRef.current = img
      setCanvasSize({ width: img.naturalWidth, height: img.naturalHeight })
      setImageLoaded(true)
      
      // Initial render
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        saveToHistory()
      }
    }
    img.src = imageUrl
  }, [imageUrl])

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const imageData = canvas.toDataURL('image/png')
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push({
      imageData,
      textElements: JSON.parse(JSON.stringify(textElements))
    })
    
    // Limit history to 20 states
    if (newHistory.length > 20) {
      newHistory.shift()
    }
    
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex, textElements])

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1]
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        setTextElements(prevState.textElements)
        setHistoryIndex(historyIndex - 1)
      }
      img.src = prevState.imageData
    }
  }, [history, historyIndex])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1]
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        setTextElements(nextState.textElements)
        setHistoryIndex(historyIndex + 1)
      }
      img.src = nextState.imageData
    }
  }, [history, historyIndex])

  // Get canvas coordinates from mouse event
  const getCanvasCoords = useCallback((e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }, [])

  // Eraser drawing
  const drawWhite = useCallback((x, y) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.arc(x, y, eraserSize / 2, 0, Math.PI * 2)
    ctx.fill()
  }, [eraserSize])

  // Handle mouse down
  const handleMouseDown = useCallback((e) => {
    const coords = getCanvasCoords(e)
    
    if (activeTool === TOOLS.ERASER) {
      setIsDrawing(true)
      drawWhite(coords.x, coords.y)
    } else if (activeTool === TOOLS.TEXT) {
      // Check if clicking on existing text
      const clickedText = textElements.find(t => {
        const textWidth = t.text.length * t.fontSize * 0.6
        const textHeight = t.fontSize
        return coords.x >= t.x && coords.x <= t.x + textWidth &&
               coords.y >= t.y - textHeight && coords.y <= t.y
      })
      
      if (clickedText) {
        setEditingTextId(clickedText.id)
        setSelectedTextId(clickedText.id)
      } else {
        // Create new text element
        const newText = {
          id: Date.now(),
          x: coords.x,
          y: coords.y,
          text: '',
          fontSize: 16,
          fontFamily: 'Arial',
          color: '#000000'
        }
        setTextElements([...textElements, newText])
        setEditingTextId(newText.id)
        setSelectedTextId(newText.id)
      }
    } else if (activeTool === TOOLS.SELECT) {
      // Check if clicking on text for dragging
      const clickedText = textElements.find(t => {
        const textWidth = Math.max(t.text.length * t.fontSize * 0.6, 50)
        const textHeight = t.fontSize
        return coords.x >= t.x && coords.x <= t.x + textWidth &&
               coords.y >= t.y - textHeight && coords.y <= t.y
      })
      
      if (clickedText) {
        setSelectedTextId(clickedText.id)
        setIsDragging(true)
        setDragStart(coords)
        setTextDragOffset({
          x: coords.x - clickedText.x,
          y: coords.y - clickedText.y
        })
      } else {
        setSelectedTextId(null)
        setEditingTextId(null)
      }
    }
  }, [activeTool, getCanvasCoords, drawWhite, textElements])

  // Handle mouse move
  const handleMouseMove = useCallback((e) => {
    const coords = getCanvasCoords(e)
    
    if (activeTool === TOOLS.ERASER && isDrawing) {
      drawWhite(coords.x, coords.y)
    } else if (activeTool === TOOLS.SELECT && isDragging && selectedTextId) {
      setTextElements(prev => prev.map(t => 
        t.id === selectedTextId 
          ? { ...t, x: coords.x - textDragOffset.x, y: coords.y - textDragOffset.y }
          : t
      ))
    }
  }, [activeTool, isDrawing, isDragging, selectedTextId, getCanvasCoords, drawWhite, textDragOffset])

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false)
      saveToHistory()
    }
    if (isDragging) {
      setIsDragging(false)
      saveToHistory()
    }
  }, [isDrawing, isDragging, saveToHistory])

  // Render text elements on overlay canvas
  useEffect(() => {
    const overlay = overlayCanvasRef.current
    if (!overlay || !imageLoaded) return
    
    overlay.width = canvasSize.width
    overlay.height = canvasSize.height
    const ctx = overlay.getContext('2d')
    ctx.clearRect(0, 0, overlay.width, overlay.height)
    
    textElements.forEach(t => {
      ctx.font = `${t.fontSize}px ${t.fontFamily}`
      ctx.fillStyle = t.color
      ctx.fillText(t.text, t.x, t.y)
      
      // Draw selection box if selected
      if (t.id === selectedTextId) {
        const metrics = ctx.measureText(t.text)
        const textWidth = Math.max(metrics.width, 50)
        ctx.strokeStyle = '#1a73e8'
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.strokeRect(t.x - 4, t.y - t.fontSize - 2, textWidth + 8, t.fontSize + 8)
        ctx.setLineDash([])
      }
    })
  }, [textElements, selectedTextId, canvasSize, imageLoaded])

  // Handle text input
  const handleTextInput = useCallback((e) => {
    if (!editingTextId) return
    
    setTextElements(prev => prev.map(t =>
      t.id === editingTextId ? { ...t, text: e.target.value } : t
    ))
  }, [editingTextId])

  // Finish text editing
  const finishTextEdit = useCallback(() => {
    if (editingTextId) {
      // Remove empty text elements
      setTextElements(prev => prev.filter(t => t.text.trim() !== '' || t.id !== editingTextId))
      setEditingTextId(null)
      saveToHistory()
    }
  }, [editingTextId, saveToHistory])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && editingTextId) {
        finishTextEdit()
      }
      if (e.key === 'Escape') {
        setEditingTextId(null)
        setSelectedTextId(null)
      }
      if (e.key === 'Delete' && selectedTextId && !editingTextId) {
        setTextElements(prev => prev.filter(t => t.id !== selectedTextId))
        setSelectedTextId(null)
        saveToHistory()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [editingTextId, selectedTextId, finishTextEdit, undo, redo, saveToHistory])

  // Expose method to get final canvas with all edits
  useImperativeHandle(ref, () => ({
    getEditedCanvas: () => {
      // Create a final canvas combining base canvas and text overlay
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = canvasSize.width
      finalCanvas.height = canvasSize.height
      const ctx = finalCanvas.getContext('2d')
      
      // Draw base canvas (with eraser marks)
      ctx.drawImage(canvasRef.current, 0, 0)
      
      // Draw text elements
      textElements.forEach(t => {
        ctx.font = `${t.fontSize}px ${t.fontFamily}`
        ctx.fillStyle = t.color
        ctx.fillText(t.text, t.x, t.y)
      })
      
      return finalCanvas
    },
    getEditedImageUrl: () => {
      const finalCanvas = document.createElement('canvas')
      finalCanvas.width = canvasSize.width
      finalCanvas.height = canvasSize.height
      const ctx = finalCanvas.getContext('2d')
      
      ctx.drawImage(canvasRef.current, 0, 0)
      
      textElements.forEach(t => {
        ctx.font = `${t.fontSize}px ${t.fontFamily}`
        ctx.fillStyle = t.color
        ctx.fillText(t.text, t.x, t.y)
      })
      
      return finalCanvas.toDataURL('image/png')
    }
  }), [canvasSize, textElements])

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.25))

  // Get editing text element
  const editingText = textElements.find(t => t.id === editingTextId)

  if (!imageLoaded) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading editor...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Floating Toolbar - Google Material Design Style */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-white rounded-full shadow-lg border border-gray-200 px-2 py-1.5">
        {/* Select Tool */}
        <button
          onClick={() => setActiveTool(TOOLS.SELECT)}
          className={`p-2.5 rounded-full transition-all ${
            activeTool === TOOLS.SELECT 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Select / Move (V)"
        >
          <SelectIcon className="w-5 h-5" />
        </button>
        
        {/* Eraser Tool */}
        <button
          onClick={() => setActiveTool(TOOLS.ERASER)}
          className={`p-2.5 rounded-full transition-all ${
            activeTool === TOOLS.ERASER 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Eraser / Whiteout (E)"
        >
          <EraserIcon className="w-5 h-5" />
        </button>
        
        {/* Text Tool */}
        <button
          onClick={() => setActiveTool(TOOLS.TEXT)}
          className={`p-2.5 rounded-full transition-all ${
            activeTool === TOOLS.TEXT 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Add Text (T)"
        >
          <TextIcon className="w-5 h-5" />
        </button>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        {/* Eraser Size (only when eraser is active) */}
        {activeTool === TOOLS.ERASER && (
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">Size:</span>
            <input
              type="range"
              min="5"
              max="50"
              value={eraserSize}
              onChange={(e) => setEraserSize(Number(e.target.value))}
              className="w-20 h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:rounded-full"
            />
            <span className="text-xs text-gray-600 w-6">{eraserSize}</span>
          </div>
        )}
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Undo (Ctrl+Z)"
        >
          <UndoIcon className="w-5 h-5" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Redo (Ctrl+Shift+Z)"
        >
          <RedoIcon className="w-5 h-5" />
        </button>
        
        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-1"></div>
        
        {/* Zoom Controls */}
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Zoom Out"
        >
          <ZoomOutIcon className="w-5 h-5" />
        </button>
        <span className="text-xs text-gray-600 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Zoom In"
        >
          <ZoomInIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Text Input Overlay */}
      {editingText && (
        <div 
          className="absolute z-30 pointer-events-none"
          style={{
            left: `${(editingText.x / canvasSize.width) * 100}%`,
            top: `${((editingText.y - editingText.fontSize) / canvasSize.height) * 100}%`,
            transform: `scale(${zoom})`
          }}
        >
          <input
            type="text"
            value={editingText.text}
            onChange={handleTextInput}
            onBlur={finishTextEdit}
            autoFocus
            placeholder="Type here..."
            className="pointer-events-auto bg-blue-50 border-2 border-blue-500 rounded px-2 py-1 text-sm outline-none min-w-[100px]"
            style={{
              fontSize: `${editingText.fontSize}px`,
              fontFamily: editingText.fontFamily,
              color: editingText.color
            }}
          />
        </div>
      )}

      {/* Canvas Container */}
      <div 
        className="relative overflow-auto bg-gray-100 rounded-lg border border-gray-200"
        style={{ maxHeight: '60vh' }}
      >
        <div 
          className="relative inline-block"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            transition: 'transform 0.2s ease'
          }}
        >
          {/* Base Canvas (image + eraser marks) */}
          <canvas
            ref={canvasRef}
            className={`
              ${activeTool === TOOLS.ERASER ? 'cursor-crosshair' : ''}
              ${activeTool === TOOLS.TEXT ? 'cursor-text' : ''}
              ${activeTool === TOOLS.SELECT ? 'cursor-default' : ''}
            `}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* Overlay Canvas (text elements) */}
          <canvas
            ref={overlayCanvasRef}
            className="absolute top-0 left-0 pointer-events-none"
          />
        </div>
      </div>

      {/* Tool Instructions */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
        {activeTool === TOOLS.SELECT && (
          <span>Click and drag text elements to move them. Press Delete to remove selected text.</span>
        )}
        {activeTool === TOOLS.ERASER && (
          <span>Click and drag to whiteout areas. Adjust brush size with the slider.</span>
        )}
        {activeTool === TOOLS.TEXT && (
          <span>Click anywhere to add text. Press Enter to confirm or Escape to cancel.</span>
        )}
      </div>
    </div>
  )
})

ImageEditor.displayName = 'ImageEditor'

export default ImageEditor
