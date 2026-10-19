/**
 * Created by 11Hopem
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TelemetryLogger, scrubSensitiveData, toFirestoreFields } from '../src/telemetry/logger';
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

test('Telemetry: scrubSensitiveData redacts TCKN, credit cards and tokens', () => {
  const payload = {
    candidate: 'John Doe',
    password: 'password123',
    token: 'jwt-abc',
    tckn: '12345678901',
    note: 'Candidate TCKN: 23456789012'
  };

  const clean = scrubSensitiveData(payload) as any;
  assert.equal(clean.candidate, 'John Doe');
  assert.equal(clean.password, '***REDACTED***');
  assert.equal(clean.token, '***REDACTED***');
  assert.equal(clean.tckn, '***REDACTED***');
  assert.equal(clean.note.includes('***TCKN_REDACTED***'), true);
});

test('Telemetry: toFirestoreFields maps types to Firestore REST format', () => {
  const sample = {
    interviewId: 'int-123',
    questions: 15,
    score: 85.5,
    passed: true,
    deleted: null
  };
  const fields = toFirestoreFields(sample) as any;
  assert.equal(fields.interviewId.stringValue, 'int-123');
  assert.equal(fields.questions.integerValue, '15');
  assert.equal(fields.score.doubleValue, 85.5);
  assert.equal(fields.passed.booleanValue, true);
  assert.equal(fields.deleted.nullValue, null);
});

test('Telemetry: multi-level logging and collection routing', () => {
  const logger = new TelemetryLogger({ appName: 'interview-routing-test', autoCapture: false });

  const sec = logger.security('Admin access checked', { granted: true });
  assert.equal(sec?.level, 'SECURITY');
  assert.equal(sec?.targetCollection, 'security_audit_logs');

  const crash = logger.crash('WebRTC audio channel crashed');
  assert.equal(crash?.level, 'CRASH');
  assert.equal(crash?.targetCollection, 'crash_logs');

  const tel = logger.telemetry('question_answered', { questionIndex: 3 });
  assert.equal(tel?.level, 'TELEMETRY');
  assert.equal(tel?.targetCollection, 'telemetry_logs');

  const vis = logger.visitor('interview_lobby');
  assert.equal(vis?.level, 'VISITOR');
  assert.equal(vis?.targetCollection, 'visitor_logs');
});
