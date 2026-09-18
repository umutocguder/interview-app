/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11 Hopem Software Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TelemetryLogger } from '../src/telemetry/logger';
import { FIREBASE_ECOSYSTEM_CONFIG } from '../src/telemetry/firebaseConfig';

test('Telemetry: Firebase ecosystem config verification', () => {
  assert.equal(FIREBASE_ECOSYSTEM_CONFIG.projectId, 'hopem-software-cloud');
  assert.equal(FIREBASE_ECOSYSTEM_CONFIG.account, 'umutocgdr@gmail.com');
  assert.ok(FIREBASE_ECOSYSTEM_CONFIG.errorReportingUrl.includes('hopem-software-cloud'));
});

test('Telemetry: Logger captures info and error logs', () => {
  const logger = new TelemetryLogger({ appName: 'interview-prep-test', autoCapture: false });
  
  const entry = logger.info('Candidate started mock interview', { role: 'iOS Senior', questions: 10 });
  assert.ok(entry);
  assert.equal(entry.level, 'INFO');
  assert.equal(entry.appName, 'interview-prep-test');
  assert.equal(entry.context.role, 'iOS Senior');

  const errEntry = logger.error('Audio recording failed', { code: 500 });
  assert.ok(errEntry);
  assert.equal(errEntry.level, 'ERROR');

  const recents = logger.getRecentLogs(10);
  assert.equal(recents.length, 2);
});

test('Telemetry: Zero-crash guarantee on invalid parameters', () => {
  const logger = new TelemetryLogger({ appName: 'interview-prep-test', autoCapture: false });
  const entry = logger.log('', null as any);
  assert.ok(entry);
  assert.equal(entry.level, 'INFO');
  
  const errEntry = logger.error(new Error('Simulated runtime error'));
  assert.ok(errEntry);
  assert.equal(errEntry.message, 'Simulated runtime error');
});
