/**
 * Tooltip Component
 * Accessible tooltip following Material Design 3
 * 
 * @param {string} content - Tooltip text
 * @param {string} position - 'top' | 'bottom' | 'left' | 'right'
 * @param {number} delay - Delay before showing (ms)
 */

import { useState, useCallback, useRef } from 'react'

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
}

const arrows = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-800 border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-800 border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-800 border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-800 border-y-transparent border-l-transparent'
}

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  disabled = false,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef(null)

  const showTooltip = useCallback(() => {
    if (disabled) return
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }, [disabled, delay])

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }, [])

  if (!content) return children

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && (
        <div
          className={`
            absolute z-50 px-3 py-1.5
            text-sm text-white bg-gray-800
            rounded-lg whitespace-nowrap
            animate-fade-in
            ${positions[position]}
          `}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <span
            className={`
              absolute w-0 h-0
              border-4
              ${arrows[position]}
            `}
          />
        </div>
      )}
    </div>
  )
}

export default Tooltip
