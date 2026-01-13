/**
 * Analytics Dashboard Component
 *
 * Demonstrates Contentstack Data & Insights
 * with real-time metrics visualization.
 */
import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { useSessionStats } from '../hooks/useAnalytics';

interface MetricCard {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export function AnalyticsDashboard() {
  const sessionStats = useSessionStats();
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      label: 'Page Views',
      value: '12,847',
      change: 12.5,
      icon: <Eye className='w-5 h-5' />,
      color: 'blue',
    },
    {
      label: 'Unique Visitors',
      value: '3,421',
      change: 8.2,
      icon: <Users className='w-5 h-5' />,
      color: 'emerald',
    },
    {
      label: 'Avg. Session',
      value: '4m 32s',
      change: -2.1,
      icon: <Clock className='w-5 h-5' />,
      color: 'purple',
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      change: 15.7,
      icon: <MousePointer className='w-5 h-5' />,
      color: 'amber',
    },
  ]);

  const [liveVisitors, setLiveVisitors] = useState(127);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors((prev) => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    emerald: 'from-emerald-500 to-green-500',
    purple: 'from-purple-500 to-pink-500',
    amber: 'from-amber-500 to-orange-500',
  };

  const contentPerformance = [
    { title: 'Getting Started Guide', views: 3842, trend: 23 },
    { title: 'API Documentation', views: 2156, trend: -5 },
    { title: 'Personalization Tutorial', views: 1893, trend: 45 },
    { title: 'Automate Workflows', views: 1654, trend: 12 },
    { title: 'Brand Kit Setup', views: 987, trend: 8 },
  ];

  const audienceData = {
    devices: [
      {
        name: 'Desktop',
        percentage: 62,
        icon: <Monitor className='w-4 h-4' />,
      },
      {
        name: 'Mobile',
        percentage: 31,
        icon: <Smartphone className='w-4 h-4' />,
      },
      {
        name: 'Tablet',
        percentage: 7,
        icon: <Smartphone className='w-4 h-4' />,
      },
    ],
    regions: [
      { name: 'North America', percentage: 45 },
      { name: 'Europe', percentage: 32 },
      { name: 'Asia Pacific', percentage: 18 },
      { name: 'Other', percentage: 5 },
    ],
  };

  return (
    <section className='py-20 bg-gradient-to-b from-slate-800 to-slate-900'>
      <div className='container mx-auto px-6'>
        {/* Header */}
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12'>
          <div>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-4'>
              <BarChart3 className='w-4 h-4' />
              <span>Data & Insights</span>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-2'>
              Analytics Dashboard
            </h2>
            <p className='text-slate-400'>
              Real-time insights into content performance and user engagement
            </p>
          </div>

          {/* Live indicator */}
          <div className='flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-800 border border-slate-700'>
            <div className='relative'>
              <div className='w-3 h-3 rounded-full bg-emerald-500' />
              <div className='absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping' />
            </div>
            <div>
              <div className='text-2xl font-bold text-white'>
                {liveVisitors}
              </div>
              <div className='text-slate-400 text-sm'>visitors online</div>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className='relative overflow-hidden p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50'
              style={{ animationDelay: `${index * 0.1}s` }}>
              {/* Gradient accent */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${
                  colorMap[metric.color]
                } opacity-10 blur-2xl`}
              />

              <div className='relative'>
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${
                    colorMap[metric.color]
                  } text-white mb-4`}>
                  {metric.icon}
                </div>
                <div className='text-3xl font-bold text-white mb-1'>
                  {metric.value}
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-slate-400 text-sm'>{metric.label}</span>
                  <span
                    className={`flex items-center gap-1 text-sm ${
                      metric.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                    {metric.change >= 0 ? (
                      <ArrowUpRight className='w-4 h-4' />
                    ) : (
                      <ArrowDownRight className='w-4 h-4' />
                    )}
                    {Math.abs(metric.change)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Performance & Audience */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Content Performance */}
          <div className='p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50'>
            <div className='flex items-center gap-3 mb-6'>
              <TrendingUp className='w-5 h-5 text-purple-400' />
              <h3 className='text-xl font-bold text-white'>Top Content</h3>
            </div>
            <div className='space-y-4'>
              {contentPerformance.map((content, index) => (
                <div
                  key={content.title}
                  className='flex items-center gap-4 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors'>
                  <div className='w-8 h-8 flex items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 font-bold text-sm'>
                    {index + 1}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-white font-medium truncate'>
                      {content.title}
                    </h4>
                    <p className='text-slate-500 text-sm'>
                      {content.views.toLocaleString()} views
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      content.trend >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                    {content.trend >= 0 ? (
                      <ArrowUpRight className='w-4 h-4' />
                    ) : (
                      <ArrowDownRight className='w-4 h-4' />
                    )}
                    {Math.abs(content.trend)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audience Insights */}
          <div className='p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50'>
            <div className='flex items-center gap-3 mb-6'>
              <Globe className='w-5 h-5 text-teal-400' />
              <h3 className='text-xl font-bold text-white'>Audience</h3>
            </div>

            {/* Devices */}
            <div className='mb-6'>
              <h4 className='text-slate-400 text-sm mb-3'>By Device</h4>
              <div className='space-y-3'>
                {audienceData.devices.map((device) => (
                  <div key={device.name}>
                    <div className='flex items-center justify-between mb-1'>
                      <div className='flex items-center gap-2 text-white'>
                        {device.icon}
                        <span>{device.name}</span>
                      </div>
                      <span className='text-slate-400'>
                        {device.percentage}%
                      </span>
                    </div>
                    <div className='h-2 rounded-full bg-slate-700 overflow-hidden'>
                      <div
                        className='h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-1000'
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regions */}
            <div>
              <h4 className='text-slate-400 text-sm mb-3'>By Region</h4>
              <div className='grid grid-cols-2 gap-3'>
                {audienceData.regions.map((region) => (
                  <div
                    key={region.name}
                    className='p-3 rounded-xl bg-slate-900/50'>
                    <div className='text-2xl font-bold text-white mb-1'>
                      {region.percentage}%
                    </div>
                    <div className='text-slate-400 text-sm'>{region.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Session Stats (from actual tracking) */}
        <div className='mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/30'>
          <div className='flex items-center gap-2 text-slate-400 text-sm'>
            <Clock className='w-4 h-4' />
            <span>
              Your Session: {sessionStats.pageViews} page views •{' '}
              {sessionStats.totalEvents} events • Session ID:{' '}
              {sessionStats.sessionId.slice(0, 20)}...
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
