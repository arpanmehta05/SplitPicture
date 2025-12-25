import { LockIcon, BoltIcon } from '../icons'

const FeatureGrid = ({ features, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 ${className}`}>
      {features.map((feature, index) => (
        <FeatureCard key={index} {...feature} />
      ))}
    </div>
  )
}

const FeatureCard = ({
  icon: Icon,
  iconBgColor = 'bg-gray-100',
  iconColor = 'text-gray-600',
  title,
  description
}) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200">
      <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

// Pre-defined feature sets for different tools
export const MERGE_FEATURES = [
  {
    icon: LockIcon,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    title: '100% Private',
    description: 'Files never leave your browser'
  },
  {
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Drag to Reorder',
    description: 'Arrange pages in any order'
  },
  {
    icon: BoltIcon,
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Lightning Fast',
    description: 'Instant client-side merging'
  }
]

export const EDIT_FEATURES = [
  {
    icon: LockIcon,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    title: '100% Secure',
    description: 'All editing happens locally'
  },
  {
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Live Preview',
    description: 'See changes in real-time'
  },
  {
    icon: BoltIcon,
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Non-Destructive',
    description: 'Original file stays intact'
  }
]

export const SPLIT_FEATURES = [
  {
    icon: LockIcon,
    iconBgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    title: '100% Private',
    description: 'Files never uploaded to servers'
  },
  {
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Quick Edit',
    description: 'Edit images before converting'
  },
  {
    icon: BoltIcon,
    iconBgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: 'Instant Results',
    description: 'Fast client-side processing'
  }
]

export default FeatureGrid
