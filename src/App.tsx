/**
 * Contentstack DXP Demo Application
 *
 * This app demonstrates the integration of all Contentstack
 * Digital Experience Platform products:
 * - CMS (Content Management)
 * - Personalize (A/B Testing & Segmentation)
 * - Automate (Workflow Automation)
 * - Brand Kit (AI-Powered Content)
 * - Launch (Frontend Hosting)
 * - Marketplace (Extensions & Integrations)
 * - Data & Insights (Analytics)
 */
import { useEffect } from 'react';
import {
  Layers,
  Github,
  ExternalLink,
  Heart,
  Sparkles
} from 'lucide-react';
import { PersonalizedHero } from './components/PersonalizedHero';
import { ProductShowcase } from './components/ProductShowcase';
import { ContentDemo } from './components/ContentDemo';
import { AutomateDemo } from './components/AutomateDemo';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { initializePersonalization } from './lib/personalize';
import { analytics } from './lib/analytics';

function App() {
  useEffect(() => {
    // Initialize Contentstack Personalize on app load
    initializePersonalization();

    // Track app load
    analytics.trackContentView('app', 'main', 'Contentstack DXP Demo');
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-lg">Contentstack</div>
                <div className="text-xs text-slate-400">DXP Demo</div>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#products" className="text-slate-300 hover:text-white transition-colors">Products</a>
              <a href="#content" className="text-slate-300 hover:text-white transition-colors">Content</a>
              <a href="#automate" className="text-slate-300 hover:text-white transition-colors">Automate</a>
              <a href="#analytics" className="text-slate-300 hover:text-white transition-colors">Analytics</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/contentstack"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.contentstack.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium transition-colors"
              >
                <span>Docs</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section - Personalize Demo */}
        <PersonalizedHero />

        {/* Products Section */}
        <section id="products">
          <ProductShowcase />
        </section>

        {/* Content Section - CMS Demo */}
        <section id="content">
          <ContentDemo />
        </section>

        {/* Automate Section */}
        <section id="automate">
          <AutomateDemo />
        </section>

        {/* Analytics Section - Data & Insights Demo */}
        <section id="analytics">
          <AnalyticsDashboard />
        </section>

        {/* Brand Kit & Marketplace Section */}
        <section className="py-20 bg-slate-900">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Brand Kit */}
              <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-500 to-orange-500 opacity-10 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm mb-6">
                    <Sparkles className="w-4 h-4" />
                    <span>Brand Kit</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    AI-Powered Brand Consistency
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Create content that stays true to your brand with AI-powered generation,
                    Voice Profiles, and a Knowledge Vault of your brand assets.
                  </p>
                  <div className="space-y-3">
                    {['Knowledge Vault for brand assets', 'Voice Profiles for tone consistency', 'AI content generation', 'Brand guideline enforcement'].map((feature) => (
                      <div key={feature} className="flex items-center gap-3 text-slate-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Marketplace */}
              <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500 to-violet-500 opacity-10 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
                    <Layers className="w-4 h-4" />
                    <span>Marketplace</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Extend Your Platform
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Discover and install apps, integrations, and extensions that add
                    powerful capabilities to your Contentstack implementation.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['Algolia', 'Cloudinary', 'Commercetools', 'Salesforce', 'Twilio', 'Shopify'].map((app) => (
                      <span
                        key={app}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-sm border border-slate-700 hover:border-indigo-500/50 transition-colors cursor-pointer"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Section */}
            <div className="mt-8 relative overflow-hidden p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-500 to-teal-500 opacity-10 blur-3xl" />
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-4">
                    🚀 Contentstack Launch
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Deploy This App with Launch
                  </h3>
                  <p className="text-slate-400 max-w-2xl">
                    Connect your Git repository, configure build settings, and deploy to a
                    global CDN with automatic cache invalidation when content changes.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors whitespace-nowrap">
                  Deploy Now
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-slate-400">
                Contentstack DXP Demo
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <span>Built with</span>
              <Heart className="w-4 h-4 text-rose-500" />
              <span>using React + Vite + Tailwind</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="https://www.contentstack.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Contentstack
              </a>
              <a href="https://www.contentstack.com/docs" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Documentation
              </a>
              <a href="https://github.com/contentstack" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
