import { useState, useCallback, useRef } from 'react'
import { PDFDocument } from 'pdf-lib'

/**
 * Custom hook for PDF merging functionality
 * Handles file management, drag-drop reordering, and PDF merge operation
 */
export function usePdfMerger() {
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [isMerging, setIsMerging] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const fileInputRef = useRef(null)

  // Add new PDF files to the list
  const addFiles = useCallback((newFiles) => {
    const pdfFiles = Array.from(newFiles).filter(f => f.type === 'application/pdf')
    if (pdfFiles.length === 0) {
      setError('Please select PDF files only')
      setTimeout(() => setError(null), 3000)
      return
    }
    
    const filesWithId = pdfFiles.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2)
    }))
    
    setFiles(prev => [...prev, ...filesWithId])
    setError(null)
  }, [])

  // Remove a file from the list
  const removeFile = useCallback((id) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }, [])

  // Clear all files
  const clearAll = useCallback(() => {
    setFiles([])
    setProgress('')
    setError(null)
  }, [])

  // Drag-drop handlers for file upload zone
  const dropHandlers = {
    onDragEnter: (e) => { e.preventDefault(); setIsDragging(true) },
    onDragLeave: (e) => { e.preventDefault(); setIsDragging(false) },
    onDragOver: (e) => { e.preventDefault() },
    onDrop: (e) => {
      e.preventDefault()
      setIsDragging(false)
      addFiles(e.dataTransfer.files)
    }
  }

  // File input change handler
  const handleInputChange = useCallback((e) => {
    addFiles(e.target.files)
    e.target.value = ''
  }, [addFiles])

  // Open file picker
  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  // Reordering drag handlers
  const reorderHandlers = {
    onDragStart: (index) => (e) => {
      setDraggedIndex(index)
      e.dataTransfer.effectAllowed = 'move'
    },
    onDragOver: (index) => (e) => {
      e.preventDefault()
      if (draggedIndex === null || draggedIndex === index) return
      
      setFiles(prev => {
        const newFiles = [...prev]
        const draggedFile = newFiles[draggedIndex]
        newFiles.splice(draggedIndex, 1)
        newFiles.splice(index, 0, draggedFile)
        return newFiles
      })
      setDraggedIndex(index)
    },
    onDragEnd: () => {
      setDraggedIndex(null)
    }
  }

  // Merge all PDFs into one
  const mergePdfs = useCallback(async () => {
    if (files.length < 2) return
    
    setIsMerging(true)
    setProgress('Starting merge...')
    setError(null)
    
    try {
      const mergedPdf = await PDFDocument.create()
      
      for (let i = 0; i < files.length; i++) {
        setProgress(`Processing ${files[i].name} (${i + 1}/${files.length})...`)
        
        const arrayBuffer = await files[i].file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(page => mergedPdf.addPage(page))
      }
      
      setProgress('Generating final PDF...')
      const mergedPdfBytes = await mergedPdf.save()
      
      // Download the merged PDF
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged-document.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setProgress('Merge complete!')
      setTimeout(() => setProgress(''), 3000)
    } catch (err) {
      console.error('Merge error:', err)
      setError('Failed to merge PDFs. Please try again.')
      setProgress('')
    } finally {
      setIsMerging(false)
    }
  }, [files])

  return {
    // State
    files,
    isDragging,
    isMerging,
    progress,
    error,
    draggedIndex,
    fileInputRef,
    
    // File operations
    addFiles,
    removeFile,
    clearAll,
    mergePdfs,
    
    // Handlers
    dropHandlers,
    handleInputChange,
    openFilePicker,
    reorderHandlers,
    
    // Computed
    canMerge: files.length >= 2 && !isMerging
  }
}

export default usePdfMerger
