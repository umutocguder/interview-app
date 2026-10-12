/**
 * Created by 11Hopem
 * Contact: umutocgdr@gmail.com
 *
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under proprietary software license terms.
 * Any unauthorized reproduction, transfer, or distribution is strictly prohibited.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  createInterviewBackup,
  verifyInterviewBackupIntegrity,
  restoreInterviewFromBackup,
  LATEST_BACKUP_PATH,
  CHECKSUM_LOG_PATH
} from '../../backend/services/backupService.mjs';

test('Interview Backup: createInterviewBackup generates verified snapshot and checksums', () => {
  const meta = createInterviewBackup();
  assert.ok(meta.sha256, 'SHA256 must be present');
  assert.ok(meta.questionsSize > 0, 'Questions dataset size must be greater than zero');
  assert.ok(fs.existsSync(LATEST_BACKUP_PATH), 'Latest backup file must exist');
  assert.ok(fs.existsSync(CHECKSUM_LOG_PATH), 'Checksums log must exist');

  const content = fs.readFileSync(LATEST_BACKUP_PATH, 'utf-8');
  const computedHash = crypto.createHash('sha256').update(content).digest('hex');
  assert.strictEqual(computedHash, meta.sha256, 'SHA256 must match file content');
});

test('Interview Backup: verifyInterviewBackupIntegrity validates active backup file', () => {
  const isValid = verifyInterviewBackupIntegrity();
  assert.strictEqual(isValid, true, 'Backup integrity should be valid');
});

test('Interview Backup: restoreInterviewFromBackup parses and returns valid datasets', () => {
  const restored = restoreInterviewFromBackup();
  assert.ok(restored.datasets, 'Datasets must be present');
  assert.ok(restored.datasets.supabaseSeed.available, 'Supabase seed must be available');
  assert.ok(restored.datasets.swiftQuestions.available, 'Swift questions must be available');
});
