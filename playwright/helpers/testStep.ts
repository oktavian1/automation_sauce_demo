import { test, Page } from '@playwright/test';
import { logger } from '../common/logger';

/**
 * Execute a test step with evidence capture
 * Automatically takes screenshot on failure and attaches page source
 */
export async function stepWithEvidence<T>(
  name: string,
  page: Page,
  body: () => Promise<T>
): Promise<T> {
  return await test.step(name, async () => {
    logger.debug(`Step started: ${name}`);
    try {
      const result = await body();
      logger.info(`Step completed: ${name}`);
      return result;
    } catch (error) {
      logger.error(`Step failed: ${name}`, { error: String(error) });
      // Capture evidence on failure
      try {
        // Take screenshot
        const screenshot = await page.screenshot({ fullPage: true });
        await test.info().attach('screenshot', {
          body: screenshot,
          contentType: 'image/png',
        });

        // Attach page source
        const pageSource = await page.content();
        await test.info().attach('page-source', {
          body: pageSource,
          contentType: 'text/html',
        });

        // Attach console logs if available
        const logs = await page.evaluate(() => {
          return (window as any).consoleLogs || [];
        }).catch(() => []);
        
        if (logs.length > 0) {
          await test.info().attach('console-logs', {
            body: JSON.stringify(logs, null, 2),
            contentType: 'application/json',
          });
        }
      } catch (evidenceError) {
        console.warn('Failed to capture evidence:', evidenceError);
      }

      // Re-throw the original error
      throw error;
    }
  });
}

/**
 * Log information to test report
 */
export async function logToReport(message: string, details?: any): Promise<void> {
  await test.step(message, async () => {
    if (details) {
      await test.info().attach('details', {
        body: typeof details === 'object' ? JSON.stringify(details, null, 2) : String(details),
        contentType: typeof details === 'object' ? 'application/json' : 'text/plain',
      });
    }
  });
}

/**
 * Execute test step with custom attachment
 */
export async function stepWithAttachment<T>(
  name: string,
  body: () => Promise<T>,
  attachmentName: string,
  attachmentBody: string | Buffer,
  contentType: string = 'text/plain'
): Promise<T> {
  return await test.step(name, async () => {
    const result = await body();
    
    await test.info().attach(attachmentName, {
      body: attachmentBody,
      contentType,
    });
    
    return result;
  });
}

/**
 * Time a test step and log duration
 */
export async function timedStep<T>(
  name: string,
  body: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  return await test.step(name, async () => {
    const result = await body();
    const duration = Date.now() - startTime;
    
    await test.info().attach('timing', {
      body: `Step completed in ${duration}ms`,
      contentType: 'text/plain',
    });
    
    return result;
  });
}

/**
 * Execute multiple steps in sequence
 */
export async function executeSteps(
  page: Page,
  steps: Array<{ name: string; action: () => Promise<any> }>
): Promise<void> {
  for (const step of steps) {
    await stepWithEvidence(step.name, page, step.action);
  }
}