/**
 * Contentstack Automate Integration
 *
 * This module provides utilities for working with Contentstack Automate.
 * Automate is configured in the Contentstack dashboard, but you can:
 * 1. Trigger automations via webhooks
 * 2. Receive webhook callbacks from automations
 * 3. Display automation status in your UI
 */

// ============================================
// Types for Automate Events
// ============================================

export interface AutomateWebhookPayload {
  event: string;
  module: string;
  api_key: string;
  data: {
    entry?: {
      uid: string;
      title: string;
      content_type: {
        uid: string;
        title: string;
      };
      locale: string;
      version: number;
      [key: string]: unknown;
    };
    asset?: {
      uid: string;
      filename: string;
      url: string;
      [key: string]: unknown;
    };
    workflow?: {
      uid: string;
      name: string;
      [key: string]: unknown;
    };
  };
  triggered_at: string;
}

export interface AutomationLog {
  id: string;
  automationName: string;
  trigger: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  details?: string;
}

// ============================================
// Automation Event Types
// ============================================

export const AutomateEvents = {
  // Entry events
  ENTRY_CREATED: 'entry.create',
  ENTRY_UPDATED: 'entry.update',
  ENTRY_DELETED: 'entry.delete',
  ENTRY_PUBLISHED: 'entry.publish',
  ENTRY_UNPUBLISHED: 'entry.unpublish',

  // Asset events
  ASSET_CREATED: 'asset.create',
  ASSET_UPDATED: 'asset.update',
  ASSET_DELETED: 'asset.delete',
  ASSET_PUBLISHED: 'asset.publish',
  ASSET_UNPUBLISHED: 'asset.unpublish',

  // Workflow events
  WORKFLOW_STAGE_CHANGED: 'workflow.stage_changed',
} as const;

// ============================================
// Local Automation Log Storage (for demo)
// ============================================

class AutomationLogger {
  private logs: AutomationLog[] = [];
  private maxLogs = 50;
  private listeners: Set<(logs: AutomationLog[]) => void> = new Set();

  addLog(log: Omit<AutomationLog, 'id' | 'timestamp'>): void {
    const newLog: AutomationLog = {
      ...log,
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date(),
    };

    this.logs.unshift(newLog);

    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    console.log('⚡ Automation:', log.automationName, '-', log.status);
    this.notifyListeners();
  }

  getLogs(): AutomationLog[] {
    return [...this.logs];
  }

  subscribe(listener: (logs: AutomationLog[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.getLogs()));
  }

  clearLogs(): void {
    this.logs = [];
    this.notifyListeners();
  }
}

export const automationLogger = new AutomationLogger();

// ============================================
// Webhook Handler (for receiving Automate callbacks)
// ============================================

/**
 * Process incoming webhook from Contentstack Automate
 * This would typically be called from a backend API route
 */
export function handleAutomateWebhook(payload: AutomateWebhookPayload): void {
  const eventParts = payload.event.split('.');
  const module = eventParts[0];
  const action = eventParts[1];

  let automationName = `${module} ${action}`;
  let details = '';

  if (payload.data.entry) {
    automationName = `Entry ${action}: ${payload.data.entry.title}`;
    details = `Content Type: ${
      payload.data.entry.content_type?.title || 'Unknown'
    }`;
  } else if (payload.data.asset) {
    automationName = `Asset ${action}: ${payload.data.asset.filename}`;
    details = `URL: ${payload.data.asset.url}`;
  }

  automationLogger.addLog({
    automationName,
    trigger: payload.event,
    status: 'success',
    details,
  });
}

// ============================================
// Simulate Automation Events (for demo)
// ============================================

export function simulateAutomationEvent(
  eventType: string,
  contentTitle: string
): void {
  automationLogger.addLog({
    automationName: `Simulated: ${eventType}`,
    trigger: eventType,
    status: 'success',
    details: `Content: ${contentTitle}`,
  });
}

// ============================================
// Example Automation Configurations
// ============================================

export const exampleAutomations = [
  {
    name: 'Notify on Publish',
    description: 'Send Slack notification when blog post is published',
    trigger: AutomateEvents.ENTRY_PUBLISHED,
    contentType: 'blog_post',
    actions: ['Send Slack Message', 'Update Analytics'],
  },
  {
    name: 'CDN Cache Purge',
    description: 'Purge CDN cache when any content is updated',
    trigger: AutomateEvents.ENTRY_UPDATED,
    contentType: 'any',
    actions: ['Call Webhook (CDN Purge API)'],
  },
  {
    name: 'Translation Sync',
    description: 'Trigger translation workflow for new entries',
    trigger: AutomateEvents.ENTRY_CREATED,
    contentType: 'blog_post',
    actions: ['Call Translation Service', 'Create Draft Entries'],
  },
  {
    name: 'Backup on Delete',
    description: 'Archive content before deletion',
    trigger: AutomateEvents.ENTRY_DELETED,
    contentType: 'any',
    actions: ['Store in Archive', 'Send Email Alert'],
  },
];
