/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { FIREBASE_ECOSYSTEM_CONFIG } from './firebaseConfig';

export interface LogEntry {
  timestamp: string;
  level: string;
  appName: string;
  appVersion: string;
  projectId: string;
  message: string;
  context: Record<string, unknown>;
}

export class TelemetryLogger {
  public appName: string;
  public appVersion: string;
  public projectId: string;
  public localKey: string;
  public maxLocalLogs: number;
  public inMemoryBuffer: LogEntry[];
  public cloudEndpoint: string;
  public autoCapture: boolean;

  constructor(config: {
    appName?: string;
    appVersion?: string;
    projectId?: string;
    localKey?: string;
    maxLocalLogs?: number;
    cloudEndpoint?: string;
    autoCapture?: boolean;
  } = {}) {
    this.appName = config.appName || 'interview-prep-app';
    this.appVersion = config.appVersion || '1.0.0';
    this.projectId = config.projectId || FIREBASE_ECOSYSTEM_CONFIG.projectId;
    this.localKey = config.localKey || `${this.appName}_telemetry_logs`;
    this.maxLocalLogs = config.maxLocalLogs || 100;
    this.inMemoryBuffer = [];
    this.cloudEndpoint = config.cloudEndpoint || FIREBASE_ECOSYSTEM_CONFIG.errorReportingUrl;
    this.autoCapture = config.autoCapture !== false;

    if (this.autoCapture && typeof window !== 'undefined') {
      this.attachGlobalListeners();
    }
  }

  private attachGlobalListeners(): void {
    try {
      window.addEventListener('error', (event) => {
        this.error(event.message || 'Window error', {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.crash(event.reason?.message || 'Unhandled Promise Rejection', {
          stack: event.reason?.stack
        });
      });
    } catch (_) {}
  }

  public log(level: string, message: unknown, context: Record<string, unknown> = {}): LogEntry | null {
    try {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: (level || 'INFO').toUpperCase(),
        appName: this.appName,
        appVersion: this.appVersion,
        projectId: this.projectId,
        message: typeof message === 'string' ? message : ((message as Error)?.message || JSON.stringify(message)),
        context: context || {}
      };

      this.inMemoryBuffer.push(entry);
      if (this.inMemoryBuffer.length > this.maxLocalLogs) {
        this.inMemoryBuffer.shift();
      }

      if (typeof localStorage !== 'undefined') {
        try {
          const stored = JSON.parse(localStorage.getItem(this.localKey) || '[]');
          stored.push(entry);
          if (stored.length > this.maxLocalLogs) {
            stored.shift();
          }
          localStorage.setItem(this.localKey, JSON.stringify(stored));
        } catch (_) {}
      }

      if (entry.level === 'ERROR' || entry.level === 'CRASH') {
        this.dispatchToCloud(entry);
      }

      return entry;
    } catch (_) {
      return null;
    }
  }

  public info(msg: unknown, ctx?: Record<string, unknown>) { return this.log('INFO', msg, ctx); }
  public warn(msg: unknown, ctx?: Record<string, unknown>) { return this.log('WARN', msg, ctx); }
  public error(msg: unknown, ctx?: Record<string, unknown>) { return this.log('ERROR', msg, ctx); }
  public crash(msg: unknown, ctx?: Record<string, unknown>) { return this.log('CRASH', msg, ctx); }

  private dispatchToCloud(entry: LogEntry): void {
    if (this.cloudEndpoint && typeof fetch !== 'undefined') {
      try {
        fetch(this.cloudEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventTime: entry.timestamp,
            serviceContext: { service: entry.appName, version: entry.appVersion },
            message: `[${entry.level}] ${entry.message}\nContext: ${JSON.stringify(entry.context)}`
          }),
          mode: 'no-cors'
        }).catch(() => {});
      } catch (_) {}
    }
  }

  public getRecentLogs(limit = 50): LogEntry[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem(this.localKey) || '[]');
        if (stored.length > 0) return stored.slice(-limit);
      }
      return this.inMemoryBuffer.slice(-limit);
    } catch (_) {
      return this.inMemoryBuffer.slice(-limit);
    }
  }

  public exportLogsAsJson(): string {
    try {
      const logs = this.getRecentLogs(100);
      return JSON.stringify(logs, null, 2);
    } catch (_) {
      return '[]';
    }
  }

  public clearLogs(): void {
    try {
      this.inMemoryBuffer = [];
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.localKey);
      }
    } catch (_) {}
  }
}

export const logger = new TelemetryLogger({ appName: 'interview-prep-app' });
