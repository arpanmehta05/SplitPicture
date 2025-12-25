/**
 * Alert Component
 * Dismissible notification following Material Design 3
 * 
 * @param {string} variant - 'info' | 'success' | 'warning' | 'error'
 * @param {string} title - Alert title
 * @param {boolean} dismissible - Show close button
 * @param {function} onDismiss - Callback when dismissed
 */

import { useState } from 'react'
import { 
  InfoIcon, 
  CheckCircleIcon, 
  AlertIcon, 
  ErrorIcon, 
  CloseIcon 
} from '../icons'

const variants = {
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-[#1A73E8]',
    title: 'text-blue-800',
    text: 'text-blue-700',
    Icon: InfoIcon
  },
  success: {
    bg: 'bg-green-50 border-green-200',
    icon: 'text-green-500',
    title: 'text-green-800',
    text: 'text-green-700',
    Icon: CheckCircleIcon
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-500',
    title: 'text-yellow-800',
    text: 'text-yellow-700',
    Icon: AlertIcon
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: 'text-red-500',
    title: 'text-red-800',
    text: 'text-red-700',
    Icon: ErrorIcon
  }
}

const Alert = ({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const { bg, icon, title: titleColor, text, Icon } = variants[variant]

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  if (!isVisible) return null

  return (
    <div
      className={`
        flex gap-3 p-4
        border rounded-xl
        ${bg}
        ${className}
      `}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${icon}`} />
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-medium ${titleColor}`}>
            {title}
          </h4>
        )}
        {children && (
          <div className={`text-sm ${title ? 'mt-1' : ''} ${text}`}>
            {children}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          onClick={handleDismiss}
          className={`
            p-1 -mr-1 rounded-lg
            hover:bg-black/5
            transition-colors
            ${text}
          `}
          aria-label="Dismiss alert"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Alert
