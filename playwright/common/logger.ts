/*
  Logger utilitas berlevel untuk otomasi QA.
  - Output default: JSON line (cocok untuk CI parsing)
  - Dapat diturunkan (child) dengan context tambahan
  - Helper attachment Playwright/WDIO opsional
*/

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

export interface LoggerOptions {
  level?: LogLevel;
  json?: boolean; // JSON line output
  context?: Record<string, any>;
}

export class Logger {
  private level: LogLevel;
  private json: boolean;
  private context: Record<string, any>;

  constructor(opts: LoggerOptions = {}) {
    // CI: Only warnings and errors
    // Local: Full info logging
    const defaultLevel = process.env.CI ? 'warn' : 'info';
    this.level = opts.level ?? (process.env.LOG_LEVEL as LogLevel) ?? defaultLevel;
    this.json = opts.json ?? true;
    this.context = opts.context ?? {};
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  child(ctx: Record<string, any>) {
    return new Logger({ level: this.level, json: this.json, context: { ...this.context, ...ctx } });
  }

  private should(level: LogLevel) {
    return LEVEL_RANK[level] >= LEVEL_RANK[this.level];
  }

  private timestamp() {
    return new Date().toISOString();
  }

  private format(level: LogLevel, msg: string, extra?: any) {
    const base = { time: this.timestamp(), level, msg, ...this.context };
    if (this.json) {
      return JSON.stringify(extra ? { ...base, extra } : base);
    }
    return `[${base.time}] [${level.toUpperCase()}] ${msg}` + (extra ? ` ${JSON.stringify(extra)}` : '');
  }

  debug(msg: string, extra?: any) {
    if (!this.should('debug')) return;
    // eslint-disable-next-line no-console
    console.debug(this.format('debug', msg, extra));
  }
  info(msg: string, extra?: any) {
    if (!this.should('info')) return;
    // eslint-disable-next-line no-console
    console.info(this.format('info', msg, extra));
  }
  warn(msg: string, extra?: any) {
    if (!this.should('warn')) return;
    // eslint-disable-next-line no-console
    console.warn(this.format('warn', msg, extra));
  }
  error(msg: string, extra?: any) {
    if (!this.should('error')) return;
    // eslint-disable-next-line no-console
    console.error(this.format('error', msg, extra));
  }
}

export function createLogger(context?: Record<string, any>, level?: LogLevel) {
  return new Logger({ context, level });
}

export const logger = new Logger({ context: { svc: 'qa-automation' } });

// Helper attachment untuk Playwright: lampirkan teks ke laporan (Allure/HTML)
export async function attachTextPlaywright(
  testInfo: import('@playwright/test').TestInfo,
  name: string,
  content: string,
  contentType = 'text/plain'
) {
  await testInfo.attach(name, { body: Buffer.from(content), contentType });
}

// Helper attachment untuk WDIO (Allure)
export function attachTextWDIO(name: string, content: string, contentType = 'text/plain') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const allure = require('@wdio/allure-reporter').default;
    allure.addAttachment(name, content, contentType);
  } catch {
    // no-op jika tidak di lingkungan WDIO
  }
}
