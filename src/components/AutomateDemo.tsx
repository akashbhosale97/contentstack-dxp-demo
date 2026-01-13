/**
 * Automate Demo Component
 *
 * Visualizes Contentstack Automate workflows
 * with interactive flow diagram and setup instructions.
 */
import { useState } from 'react';
import {
  Zap,
  FileText,
  Bell,
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Info,
} from 'lucide-react';
import { exampleAutomations } from '../lib/automate';

interface WorkflowStep {
  id: string;
  type: 'trigger' | 'action' | 'connector';
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed';
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'trigger',
    type: 'trigger',
    name: 'Entry Published',
    description: 'When a blog post is published',
    icon: <FileText className='w-5 h-5' />,
    status: 'pending',
  },
  {
    id: 'action_1',
    type: 'action',
    name: 'Send Notification',
    description: 'Notify team via Slack',
    icon: <Bell className='w-5 h-5' />,
    status: 'pending',
  },
  {
    id: 'action_2',
    type: 'connector',
    name: 'Update CDN',
    description: 'Purge cache via webhook',
    icon: <Globe className='w-5 h-5' />,
    status: 'pending',
  },
  {
    id: 'complete',
    type: 'action',
    name: 'Workflow Complete',
    description: 'All tasks finished',
    icon: <CheckCircle className='w-5 h-5' />,
    status: 'pending',
  },
];

export function AutomateDemo() {
  const [steps, setSteps] = useState(workflowSteps);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const runWorkflow = () => {
    if (isRunning) return;

    setIsRunning(true);
    setCurrentStep(0);

    // Reset steps
    setSteps(workflowSteps.map((s) => ({ ...s, status: 'pending' })));

    // Animate through steps
    let step = 0;
    const interval = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(interval);
        setIsRunning(false);
        return;
      }

      setSteps((prev) =>
        prev.map((s, i) => ({
          ...s,
          status: i < step ? 'completed' : i === step ? 'active' : 'pending',
        }))
      );
      setCurrentStep(step);
      step++;
    }, 1000);
  };

  const resetWorkflow = () => {
    setSteps(workflowSteps.map((s) => ({ ...s, status: 'pending' })));
    setCurrentStep(-1);
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-emerald-500 bg-emerald-500/10';
      case 'active':
        return 'border-amber-500 bg-amber-500/10 animate-pulse';
      default:
        return 'border-slate-600 bg-slate-800';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'active':
        return 'text-amber-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <section className='py-20 bg-slate-800'>
      <div className='container mx-auto px-6'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6'>
            <Zap className='w-4 h-4' />
            <span>Contentstack Automate</span>
          </div>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-4'>
            Workflow Automation
          </h2>
          <p className='text-slate-400 max-w-2xl mx-auto'>
            Create no-code workflows that connect your tools and automate
            repetitive tasks. Watch the workflow execute in real-time!
          </p>
        </div>

        {/* Workflow Visualization */}
        <div className='max-w-4xl mx-auto'>
          {/* Controls */}
          <div className='flex items-center justify-center gap-4 mb-12'>
            <button
              onClick={runWorkflow}
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isRunning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-white'
              }`}>
              {isRunning ? (
                <Pause className='w-5 h-5' />
              ) : (
                <Play className='w-5 h-5' />
              )}
              {isRunning ? 'Running...' : 'Run Workflow'}
            </button>
            <button
              onClick={resetWorkflow}
              className='flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors'>
              <RotateCcw className='w-5 h-5' />
              Reset
            </button>
          </div>

          {/* Workflow Steps */}
          <div className='relative'>
            {/* Connection line */}
            <div className='absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-700 -translate-x-1/2' />

            {/* Progress line */}
            <div
              className='absolute left-1/2 top-0 w-0.5 bg-emerald-500 -translate-x-1/2 transition-all duration-500'
              style={{
                height: `${Math.min(
                  ((currentStep + 1) / steps.length) * 100,
                  100
                )}%`,
              }}
            />

            {/* Steps */}
            <div className='relative space-y-8'>
              {steps.map((step, index) => (
                <div key={step.id} className='flex items-center gap-6'>
                  {/* Left content (even index) */}
                  {index % 2 === 0 ? (
                    <>
                      <div className='flex-1 text-right'>
                        <div
                          className={`inline-block p-6 rounded-2xl border-2 transition-all duration-500 ${getStatusColor(
                            step.status
                          )}`}>
                          <div className='flex items-center gap-3 justify-end mb-2'>
                            <h3 className='text-lg font-bold text-white'>
                              {step.name}
                            </h3>
                            <div
                              className={`p-2 rounded-lg bg-slate-700 ${getIconColor(
                                step.status
                              )}`}>
                              {step.icon}
                            </div>
                          </div>
                          <p className='text-slate-400 text-sm'>
                            {step.description}
                          </p>
                          <div className='mt-3 text-xs text-slate-500'>
                            {step.type.charAt(0).toUpperCase() +
                              step.type.slice(1)}
                          </div>
                        </div>
                      </div>

                      {/* Center dot */}
                      <div
                        className={`relative z-10 w-4 h-4 rounded-full border-4 transition-all duration-500 ${
                          step.status === 'completed'
                            ? 'border-emerald-500 bg-emerald-500'
                            : step.status === 'active'
                            ? 'border-amber-500 bg-amber-500 scale-150'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      />

                      <div className='flex-1' />
                    </>
                  ) : (
                    <>
                      <div className='flex-1' />

                      {/* Center dot */}
                      <div
                        className={`relative z-10 w-4 h-4 rounded-full border-4 transition-all duration-500 ${
                          step.status === 'completed'
                            ? 'border-emerald-500 bg-emerald-500'
                            : step.status === 'active'
                            ? 'border-amber-500 bg-amber-500 scale-150'
                            : 'border-slate-600 bg-slate-800'
                        }`}
                      />

                      <div className='flex-1'>
                        <div
                          className={`inline-block p-6 rounded-2xl border-2 transition-all duration-500 ${getStatusColor(
                            step.status
                          )}`}>
                          <div className='flex items-center gap-3 mb-2'>
                            <div
                              className={`p-2 rounded-lg bg-slate-700 ${getIconColor(
                                step.status
                              )}`}>
                              {step.icon}
                            </div>
                            <h3 className='text-lg font-bold text-white'>
                              {step.name}
                            </h3>
                          </div>
                          <p className='text-slate-400 text-sm'>
                            {step.description}
                          </p>
                          <div className='mt-3 text-xs text-slate-500'>
                            {step.type.charAt(0).toUpperCase() +
                              step.type.slice(1)}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Example Automations from Library */}
          <div className='mt-16'>
            <h3 className='text-xl font-bold text-white mb-6 text-center'>
              Example Automations You Can Create
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {exampleAutomations.map((automation) => (
                <div
                  key={automation.name}
                  className='p-5 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-amber-500/50 transition-colors'>
                  <div className='flex items-start gap-4'>
                    <div className='p-2 rounded-lg bg-amber-500/10 text-amber-400'>
                      <Zap className='w-5 h-5' />
                    </div>
                    <div className='flex-1'>
                      <h4 className='text-white font-medium mb-1'>
                        {automation.name}
                      </h4>
                      <p className='text-slate-400 text-sm mb-3'>
                        {automation.description}
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        <span className='px-2 py-1 text-xs rounded bg-slate-800 text-slate-300'>
                          Trigger: {automation.trigger}
                        </span>
                        {automation.actions.map((action) => (
                          <span
                            key={action}
                            className='px-2 py-1 text-xs rounded bg-amber-500/10 text-amber-400'>
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Setup Instructions */}
          <div className='mt-12 p-6 rounded-2xl bg-slate-900/50 border border-amber-500/20'>
            <div className='flex items-start gap-4'>
              <div className='p-2 rounded-lg bg-amber-500/10 text-amber-400'>
                <Info className='w-5 h-5' />
              </div>
              <div className='flex-1'>
                <h4 className='text-white font-bold mb-2'>
                  How to Set Up Real Automations
                </h4>
                <p className='text-slate-400 text-sm mb-4'>
                  Contentstack Automate is configured in the dashboard, not via code.
                  Here's how to create real automations:
                </p>
                <ol className='list-decimal list-inside text-slate-300 text-sm space-y-2 mb-4'>
                  <li>Go to your Contentstack Dashboard</li>
                  <li>Click <strong>Automate</strong> in the left sidebar</li>
                  <li>Click <strong>"+ New Automation"</strong></li>
                  <li>Choose a <strong>Trigger</strong> (e.g., Entry Published)</li>
                  <li>Add <strong>Actions</strong> (e.g., Send Slack, Call Webhook)</li>
                  <li>Save and activate your automation</li>
                </ol>
                <a
                  href='https://www.contentstack.com/docs/developers/automate'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-colors'>
                  View Automate Documentation
                  <ExternalLink className='w-4 h-4' />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[
              {
                name: 'Content Publishing',
                desc: 'Notify when published',
                icon: <FileText className='w-4 h-4' />,
              },
              {
                name: 'Translation Sync',
                desc: 'Auto-translate content',
                icon: <Globe className='w-4 h-4' />,
              },
              {
                name: 'Team Notifications',
                desc: 'Slack & email alerts',
                icon: <Bell className='w-4 h-4' />,
              },
            ].map((workflow) => (
              <div
                key={workflow.name}
                className='flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700'>
                <div className='p-2 rounded-lg bg-amber-500/10 text-amber-400'>
                  {workflow.icon}
                </div>
                <div className='flex-1'>
                  <h4 className='text-white font-medium'>{workflow.name}</h4>
                  <p className='text-slate-500 text-sm'>{workflow.desc}</p>
                </div>
                <ArrowRight className='w-4 h-4 text-slate-500' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
