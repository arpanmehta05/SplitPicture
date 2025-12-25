import { Link } from 'react-router-dom'
import { Navbar } from '../components/layout'
import { Card, Button } from '../components/ui'
import { 
  DocumentIcon, 
  SplitIcon, 
  MergeIcon, 
  PencilIcon, 
  LockIcon, 
  BoltIcon,
  SparklesIcon,
  ChevronRightIcon
} from '../components/icons'

function ToolCard({ title, description, icon: Icon, color, to, comingSoon = false }) {
  const cardContent = (
    <div 
      className={`
        group relative overflow-hidden rounded-2xl p-6 h-full
        transition-all duration-300 ease-out
        ${comingSoon 
          ? 'bg-gray-100 cursor-not-allowed' 
          : `${color} cursor-pointer hover:shadow-xl hover:-translate-y-1`
        }
      `}
    >

      <div className={`
        w-14 h-14 rounded-xl flex items-center justify-center mb-4
        ${comingSoon ? 'bg-gray-200 text-gray-400' : 'bg-white/20 text-white'}
        transition-transform duration-300 group-hover:scale-110
      `}>
        <Icon className="w-7 h-7" />
      </div>

      <h3 className={`font-bold text-lg mb-2 ${comingSoon ? 'text-gray-400' : 'text-white'}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${comingSoon ? 'text-gray-400' : 'text-white/90'}`}>
        {description}
      </p>

      {comingSoon && (
        <div className="absolute top-4 right-4 bg-gray-300 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
          Coming Soon
        </div>
      )}

      {!comingSoon && (
        <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ChevronRightIcon className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )

  if (comingSoon) return cardContent

  return (
    <Link to={to} className="block h-full">
      {cardContent}
    </Link>
  )
}

function FeatureCard({ icon: Icon, iconBg, iconColor, title, description }) {
  return (
    <Card variant="elevated" className="hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </Card>
  )
}

const tools = [
  {
    title: 'Smart Image to PDF',
    description: 'Convert long screenshots and images into perfectly split, multi-page PDF documents.',
    icon: SplitIcon,
    color: 'bg-gradient-to-br from-rose-500 to-orange-500',
    to: '/split-pdf'
  },
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into a single document in seconds.',
    icon: MergeIcon,
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    to: '/merge-pdf'
  },
  {
    title: 'Edit PDF',
    description: 'Whiteout mistakes and add text overlays to fix any PDF document.',
    icon: PencilIcon,
    color: 'bg-gradient-to-br from-emerald-500 to-teal-500',
    to: '/edit-pdf'
  },
  {
    title: 'Compress PDF',
    description: 'Reduce file size while maintaining quality for easy sharing.',
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'bg-gradient-to-br from-violet-500 to-purple-500',
    to: '/compress-pdf',
    comingSoon: true
  },
  {
    title: 'PDF to Word',
    description: 'Transform PDF files back to editable Word documents.',
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-gradient-to-br from-amber-500 to-yellow-500',
    to: '/pdf-to-word',
    comingSoon: true
  },
  {
    title: 'Protect PDF',
    description: 'Add password protection to secure your sensitive PDF files.',
    icon: LockIcon,
    color: 'bg-gradient-to-br from-pink-500 to-rose-500',
    to: '/protect-pdf',
    comingSoon: true
  }
]

const features = [
  {
    icon: LockIcon,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    title: 'Privacy First',
    description: 'All processing happens in your browser. Your files never leave your device — we don\'t store or upload anything.'
  },
  {
    icon: BoltIcon,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    title: 'Lightning Fast',
    description: 'No waiting for uploads or server processing. Get instant results powered by modern browser APIs.'
  },
  {
    icon: ({ className }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    title: '100% Free',
    description: 'No hidden fees, no premium tiers, no limits. All tools are completely free to use, forever.'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#1A73E8] rounded-lg flex items-center justify-center">
                <DocumentIcon className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">DocuFix Suite</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                to="/split-pdf" 
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Tools
              </Link>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#1A73E8] rounded-full text-sm font-medium mb-6">
            <SparklesIcon className="w-4 h-4" />
            100% Free & Privacy First
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Fix your documents{' '}
            <span className="text-[#1A73E8]">instantly</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            All the tools you need to work with PDFs in one place. Edit, merge, convert, 
            and more — completely free, right in your browser.
          </p>
          <Button
            as={Link}
            to="/edit-pdf"
            size="xl"
            className="shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
          >
            Get Started — It's Free
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              All PDF Tools
            </h2>
            <p className="text-gray-600">
              Choose from our growing collection of PDF tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Why choose DocuFix Suite?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Simple, secure, and designed with your productivity in mind
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-6 h-6 bg-[#1A73E8] rounded flex items-center justify-center">
                <DocumentIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <span>DocuFix Suite © 2025</span>
            </div>
            <p className="text-gray-400 text-sm">
              Made with ❤️ for productivity
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
