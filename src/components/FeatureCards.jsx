/**
 * FeatureCards Component
 * Displays feature highlights - Google Material Design style
 */

// SVG Icon Components
const AutoDetectIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
)

const SmartSplitIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
)

const A4FormatIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
)

const PrivacyIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
)

// Default features data with icon components
const defaultFeatures = [
  { 
    icon: AutoDetectIcon, 
    title: 'Auto-Detect Mode', 
    desc: 'Automatically detects if your image needs single-page or multi-page conversion' 
  },
  { 
    icon: SmartSplitIcon, 
    title: 'Smart Splitting', 
    desc: 'Finds safe whitespace to avoid cutting through text or images in long screenshots' 
  },
  { 
    icon: A4FormatIcon, 
    title: 'A4 Format', 
    desc: 'Outputs standard A4-sized pages optimized for printing' 
  },
  { 
    icon: PrivacyIcon, 
    title: 'Private & Secure', 
    desc: 'All processing happens in your browser — nothing uploaded to servers' 
  },
]

/**
 * Single Feature Card
 */
const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
    <div className="mb-3">
      <Icon />
    </div>
    <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
    <p className="text-xs text-gray-500 mt-1">{desc}</p>
  </div>
)

/**
 * Feature Cards Grid
 */
const FeatureCards = ({ features = defaultFeatures }) => {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {features.map((feature, index) => (
        <FeatureCard 
          key={index}
          icon={feature.icon}
          title={feature.title}
          desc={feature.desc}
        />
      ))}
    </div>
  )
}

export default FeatureCards
export { FeatureCard, defaultFeatures }
