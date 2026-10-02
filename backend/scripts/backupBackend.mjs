/**
 * Created by 11hopem (11 Hopem Software Ltd. Şti.)
 * Contact: umutocgdr@gmail.com
 *
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under proprietary software license terms.
 * Any unauthorized reproduction, transfer, or distribution is strictly prohibited.
 */

import { createInterviewBackup, verifyInterviewBackupIntegrity } from '../services/backupService.mjs';

try {
  const meta = createInterviewBackup();
  const isValid = verifyInterviewBackupIntegrity();
  console.log(`[Interview Backup Success] File: ${meta.backupFile}, Platform: ${meta.platform}, Questions: ${meta.questionsSize} bytes, Size: ${meta.fileSize} bytes, Verified: ${isValid}`);
} catch (err) {
  console.error('[Interview Backup Error]:', err.message);
  process.exit(1);
}
