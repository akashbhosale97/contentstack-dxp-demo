/**
 * Personalized Hero Component
 *
 * Demonstrates Contentstack Personalize integration
 * with dynamic content variants fetched from CMS.
 */
import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Zap, Loader2 } from 'lucide-react';
import { useVariant, usePersonalization } from '../hooks/usePersonalize';
import { useContentTracking } from '../hooks/useAnalytics';
import { useEntries } from '../hooks/useContent';
import type { HeroBanner } from '../lib/contentstack';

// Gradient options for different variants
const gradientOptions: Record<string, string> = {
  variant_default: 'from-violet-600 via-purple-600 to-indigo-700',
  variant_returning: 'from-emerald-500 via-teal-500 to-cyan-600',
  variant_eu: 'from-blue-600 via-indigo-600 to-violet-700',
};

// Icons for different variants
const iconOptions: Record<string, React.ReactNode> = {
  variant_default: <Sparkles className='w-6 h-6' />,
  variant_returning: <Zap className='w-6 h-6' />,
  variant_eu: <Sparkles className='w-6 h-6' />,
};

export function PersonalizedHero() {
  const { variant, loading: variantLoading } = useVariant('hero_experience');
  const { attributes } = usePersonalization();

  // Fetch all hero banners from CMS
  const { data: heroBanners, loading: bannersLoading } =
    useEntries<HeroBanner>('hero_banner');

  // Find the matching banner for the current variant
  const [currentBanner, setCurrentBanner] = useState<HeroBanner | null>(null);

  useEffect(() => {
    if (heroBanners.length > 0 && variant) {
      // Find banner matching the variant_id
      const matchingBanner = heroBanners.find(
        (banner) => banner.variant_id === variant
      );
      // Fall back to default variant or first banner
      setCurrentBanner(
        matchingBanner ||
          heroBanners.find((b) => b.variant_id === 'variant_default') ||
          heroBanners[0]
      );
    } else if (heroBanners.length > 0) {
      // No variant yet, use default
      setCurrentBanner(
        heroBanners.find((b) => b.variant_id === 'variant_default') ||
          heroBanners[0]
      );
    }
  }, [heroBanners, variant]);

  const isLoading = variantLoading || bannersLoading;
  const gradient =
    gradientOptions[variant || 'variant_default'] ||
    gradientOptions.variant_default;
  const icon =
    iconOptions[variant || 'variant_default'] || iconOptions.variant_default;

  // Track content view
  useContentTracking(
    'hero_banner',
    currentBanner?.uid || 'loading',
    currentBanner?.title || 'Loading...',
    variant || undefined
  );

  if (isLoading || !currentBanner) {
    return (
      <div className='min-h-[500px] flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='w-12 h-12 text-purple-500 animate-spin' />
          <p className='text-slate-400'>Loading personalized content...</p>
        </div>
      </div>
    );
  }

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} min-h-[500px] flex items-center`}>
      {/* Background image if available */}
      {currentBanner.background_image?.url && (
        <div
          className='absolute inset-0 bg-cover bg-center opacity-20'
          style={{
            backgroundImage: `url(${currentBanner.background_image.url})`,
          }}
        />
      )}

      {/* Animated background elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse' />
        <div
          className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-black/10 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: '1s' }}
        />
        <div
          className='absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-bounce'
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className='absolute inset-0 opacity-20'
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className='relative z-10 container mx-auto px-6 py-20 text-center'>
        {/* Personalization badge */}
        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8 animate-fade-in'>
          {icon}
          <span>Personalized for {attributes.userType || 'you'}</span>
        </div>

        {/* Main heading - from CMS */}
        <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-slide-up'>
          {currentBanner.title}
        </h1>

        {/* Subtitle - from CMS */}
        <p
          className='text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto animate-slide-up'
          style={{ animationDelay: '0.1s' }}>
          {currentBanner.subtitle}
        </p>

        {/* CTA Button - from CMS */}
        <a
          href={currentBanner.cta_link}
          className='group inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full font-semibold text-lg shadow-2xl shadow-black/25 hover:shadow-white/25 hover:scale-105 transition-all duration-300 animate-slide-up'
          style={{ animationDelay: '0.2s' }}>
          {currentBanner.cta_text}
          <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
        </a>

        {/* Variant indicator (for demo purposes) */}
        <div className='mt-12 flex flex-wrap items-center justify-center gap-4 text-white/50 text-sm'>
          <span className='px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm'>
            🎯 Variant: {variant || 'default'}
          </span>
          <span className='px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm'>
            📄 Banner UID: {currentBanner.uid}
          </span>
          <span className='px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm'>
            ☁️ Fetched from CMS
          </span>
        </div>
      </div>
    </section>
  );
}
