export const A4_ASPECT_RATIO = 1.414 // A4 is 210mm x 297mm (height/width)
export const A4_ASPECT_RATIO_LANDSCAPE = 0.707 // A4 landscape (width/height)
export const WHITESPACE_SEARCH_RANGE = 80 // Max pixels to search in each direction
export const WHITE_TOLERANCE = 250 // RGB threshold for "white" (accounts for JPG artifacts)
export const SINGLE_PAGE_TOLERANCE = 1.2 // 20% tolerance for single page detection


export const checkIfSinglePage = (imgWidth, imgHeight) => {
  const imgAspect = imgHeight / imgWidth
  const maxPortraitRatio = A4_ASPECT_RATIO * SINGLE_PAGE_TOLERANCE
  const isLandscape = imgWidth > imgHeight
  
  if (isLandscape) {
    const landscapeRatio = imgWidth / imgHeight
    return landscapeRatio <= (1 / A4_ASPECT_RATIO_LANDSCAPE) * SINGLE_PAGE_TOLERANCE
  } else {
    return imgAspect <= maxPortraitRatio
  }
}


export const isRowWhitespace = (imageData, rowY, width) => {
  const startIndex = rowY * width * 4
  for (let x = 0; x < width; x++) {
    const i = startIndex + x * 4
    const r = imageData.data[i]
    const g = imageData.data[i + 1]
    const b = imageData.data[i + 2]
    const a = imageData.data[i + 3]

    if (a > 10 && (r < WHITE_TOLERANCE || g < WHITE_TOLERANCE || b < WHITE_TOLERANCE)) {
      return false
    }
  }
  return true
}

export const findSafeCutPoint = (imageData, proposedY, width, height) => {

  if (isRowWhitespace(imageData, proposedY, width)) {
    return proposedY
  }
  for (let offset = 1; offset <= WHITESPACE_SEARCH_RANGE; offset++) {
    const checkY = proposedY + offset
    if (checkY >= height) break
    
    if (isRowWhitespace(imageData, checkY, width)) {
      return checkY
    }
  }

  for (let offset = 1; offset <= WHITESPACE_SEARCH_RANGE; offset++) {
    const checkY = proposedY - offset
    if (checkY <= 0) break
    
    if (isRowWhitespace(imageData, checkY, width)) {
      return checkY
    }
  }

  return proposedY
}

export const yieldToMain = () => new Promise(resolve => setTimeout(resolve, 0))

export const validateFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' }
  }

  if (!file.type.match(/^image\/(png|jpe?g)$/i)) {
    return { valid: false, error: 'Please upload a PNG or JPG image' }
  }
  
  if (file.size > 20 * 1024 * 1024) {
    return { valid: true, warning: 'Warning: Large files may cause performance issues' }
  }
  
  return { valid: true }
}

export const formatFileSize = (bytes) => {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

export const generateOutputFilename = (originalName) => {
  return `${originalName?.replace(/\.[^.]+$/, '') || 'output'}-split.pdf`
}
