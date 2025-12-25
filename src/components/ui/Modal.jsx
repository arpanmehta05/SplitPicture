/**
 * Modal Component
 * Accessible dialog following Material Design 3
 * 
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Callback when modal is closed
 * @param {string} size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @param {boolean} closeOnOverlayClick - Close when clicking backdrop
 * @param {boolean} closeOnEscape - Close when pressing Escape
 */

import { useEffect, useCallback, useRef } from 'react'
import { CloseIcon } from '../icons'

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-[90vw]'
}

const Modal = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = ''
}) => {
  const modalRef = useRef(null)

  // Handle Escape key
  const handleKeyDown = useCallback((e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose?.()
    }
  }, [closeOnEscape, onClose])

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose?.()
    }
  }, [closeOnOverlayClick, onClose])

  // Focus trap and scroll lock
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      modalRef.current?.focus()
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleOverlayClick}
      />

      {/* Modal content */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative z-10 w-full
          bg-white rounded-2xl shadow-2xl
          animate-scale-in
          ${sizes[size]}
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  )
}

// Sub-components
Modal.Header = ({ children, onClose, className = '' }) => (
  <div className={`flex items-center justify-between p-6 border-b border-gray-100 ${className}`}>
    <div>{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="p-2 -mr-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close modal"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
    )}
  </div>
)

Modal.Title = ({ children, className = '' }) => (
  <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
    {children}
  </h2>
)

Modal.Body = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

Modal.Footer = ({ children, className = '' }) => (
  <div className={`flex items-center justify-end gap-3 p-6 pt-0 ${className}`}>
    {children}
  </div>
)

export default Modal
