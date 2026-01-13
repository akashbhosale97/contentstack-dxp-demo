/**
 * Product Showcase Component
 *
 * Demonstrates all Contentstack DXP products with
 * interactive cards and live status indicators.
 */
import {
  Database,
  Wand2,
  Zap,
  Palette,
  Rocket,
  Store,
  BarChart3,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'configured' | 'available';
  features: string[];
  gradient: string;
}

const products: Product[] = [
  {
    id: 'cms',
    name: 'CMS',
    description:
      'Headless content management with powerful APIs and real-time collaboration.',
    icon: <Database className='w-8 h-8' />,
    status: 'active',
    features: ['Content Types', 'Entries', 'Assets', 'Webhooks'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'personalize',
    name: 'Personalize',
    description:
      'Deliver tailored experiences with A/B testing and audience segmentation.',
    icon: <Wand2 className='w-8 h-8' />,
    status: 'active',
    features: ['A/B Testing', 'Variants', 'Audiences', 'Edge Delivery'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'automate',
    name: 'Automate',
    description:
      'No-code workflows that connect your tools and automate repetitive tasks.',
    icon: <Zap className='w-8 h-8' />,
    status: 'configured',
    features: ['Workflows', 'Triggers', 'Connectors', 'Scheduling'],
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'brandkit',
    name: 'Brand Kit',
    description:
      'AI-powered content creation that stays true to your brand voice.',
    icon: <Palette className='w-8 h-8' />,
    status: 'configured',
    features: [
      'Knowledge Vault',
      'Voice Profiles',
      'AI Generation',
      'Guidelines',
    ],
    gradient: 'from-rose-500 to-red-500',
  },
  {
    id: 'launch',
    name: 'Launch',
    description:
      'Deploy and host your frontend with global CDN and instant cache invalidation.',
    icon: <Rocket className='w-8 h-8' />,
    status: 'active',
    features: ['Git Deploy', 'CDN Hosting', 'Preview URLs', 'Cache Control'],
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    description:
      'Extend functionality with pre-built apps, integrations, and extensions.',
    icon: <Store className='w-8 h-8' />,
    status: 'available',
    features: ['Apps', 'Extensions', 'Integrations', 'Custom Apps'],
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'analytics',
    name: 'Data & Insights',
    description:
      'Real-time analytics on content performance and user engagement.',
    icon: <BarChart3 className='w-8 h-8' />,
    status: 'active',
    features: ['Dashboards', 'Metrics', 'Audience Insights', 'Reports'],
    gradient: 'from-teal-500 to-cyan-500',
  },
];

const statusStyles = {
  active: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    label: 'Active',
    dot: 'bg-emerald-500',
  },
  configured: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    label: 'Configured',
    dot: 'bg-amber-500',
  },
  available: {
    bg: 'bg-slate-500/20',
    text: 'text-slate-400',
    label: 'Available',
    dot: 'bg-slate-500',
  },
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  const status = statusStyles[product.status];

  return (
    <div
      className='group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10'
      style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Gradient glow on hover */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}
      />

      {/* Status indicator */}
      <div
        className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full ${status.bg}`}>
        <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
        <span className={`text-xs font-medium ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Icon */}
      <div
        className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${product.gradient} text-white mb-4`}>
        {product.icon}
      </div>

      {/* Title */}
      <h3 className='text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-300 transition-all'>
        {product.name}
      </h3>

      {/* Description */}
      <p className='text-slate-400 text-sm mb-4 leading-relaxed'>
        {product.description}
      </p>

      {/* Features */}
      <div className='flex flex-wrap gap-2 mb-4'>
        {product.features.map((feature) => (
          <span
            key={feature}
            className='px-2 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50'>
            {feature}
          </span>
        ))}
      </div>

      {/* Action */}
      <button className='flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group/btn'>
        <span>Learn more</span>
        <ExternalLink className='w-4 h-4 group-hover/btn:translate-x-1 transition-transform' />
      </button>
    </div>
  );
}

export function ProductShowcase() {
  return (
    <section className='py-20 bg-slate-900'>
      <div className='container mx-auto px-6'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6'>
            <CheckCircle2 className='w-4 h-4' />
            <span>Complete DXP Suite</span>
          </div>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            All Contentstack Products
          </h2>
          <p className='text-xl text-slate-400 max-w-2xl mx-auto'>
            Integrated tools for content management, personalization,
            automation, and analytics.
          </p>
        </div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
