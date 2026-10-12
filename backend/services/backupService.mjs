/**
 * Created by 11Hopem
 * Contact: umutocgdr@gmail.com
 *
 * Copyright (c) 2026 11hopem. All rights reserved.
 * Licensed under proprietary software license terms.
 * Any unauthorized reproduction, transfer, or distribution is strictly prohibited.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_ROOT = path.resolve(__dirname, '..');
const ROOT_DIR = path.resolve(BACKEND_ROOT, '..');

export const BACKUP_DIR = path.join(BACKEND_ROOT, 'data', 'backups');
export const SEED_SQL_PATH = path.join(BACKEND_ROOT, 'supabase', 'seed.sql');
export const QUESTIONS_PATH = path.join(ROOT_DIR, 'web', 'src', 'data', 'swift-questions.ts');
export const LATEST_BACKUP_PATH = path.join(BACKUP_DIR, 'interview_latest_backup.json');
export const CHECKSUM_LOG_PATH = path.join(BACKUP_DIR, 'interview_checksums.json');

export function createInterviewBackup() {
  let seedSqlContent = '';
  if (fs.existsSync(SEED_SQL_PATH)) {
    seedSqlContent = fs.readFileSync(SEED_SQL_PATH, 'utf-8');
  }

  let questionsContent = '';
  if (fs.existsSync(QUESTIONS_PATH)) {
    questionsContent = fs.readFileSync(QUESTIONS_PATH, 'utf-8');
  }

  const payload = {
    version: '1.0.0',
    platform: 'Swift & iOS Interview Simulator',
    timestamp: new Date().toISOString(),
    datasets: {
      supabaseSeed: {
        available: !!seedSqlContent,
        length: seedSqlContent.length,
        sha256: seedSqlContent ? crypto.createHash('sha256').update(seedSqlContent).digest('hex') : null
      },
      swiftQuestions: {
        available: !!questionsContent,
        length: questionsContent.length,
        sha256: questionsContent ? crypto.createHash('sha256').update(questionsContent).digest('hex') : null
      }
    }
  };

  const rawJson = JSON.stringify(payload, null, 2);

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const sha256 = crypto.createHash('sha256').update(rawJson).digest('hex');
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const timestampedPath = path.join(BACKUP_DIR, `interview_backup_${dateStr}.json`);

  fs.writeFileSync(timestampedPath, rawJson, 'utf-8');
  fs.writeFileSync(LATEST_BACKUP_PATH, rawJson, 'utf-8');

  const metadata = {
    timestamp: new Date().toISOString(),
    platform: payload.platform,
    seedSize: seedSqlContent.length,
    questionsSize: questionsContent.length,
    sha256,
    fileSize: Buffer.byteLength(rawJson, 'utf-8'),
    backupFile: path.basename(timestampedPath),
    latestBackupFile: path.basename(LATEST_BACKUP_PATH)
  };

  let checksumLog = [];
  if (fs.existsSync(CHECKSUM_LOG_PATH)) {
    try {
      checksumLog = JSON.parse(fs.readFileSync(CHECKSUM_LOG_PATH, 'utf-8'));
      if (!Array.isArray(checksumLog)) checksumLog = [];
    } catch {
      checksumLog = [];
    }
  }

  checksumLog.unshift(metadata);
  if (checksumLog.length > 30) checksumLog = checksumLog.slice(0, 30);
  fs.writeFileSync(CHECKSUM_LOG_PATH, JSON.stringify(checksumLog, null, 2), 'utf-8');

  return metadata;
}

export function verifyInterviewBackupIntegrity() {
  if (!fs.existsSync(LATEST_BACKUP_PATH)) return false;

  try {
    const raw = fs.readFileSync(LATEST_BACKUP_PATH, 'utf-8');
    const parsed = JSON.parse(raw);
    return !!(
      parsed.datasets &&
      parsed.datasets.supabaseSeed &&
      parsed.datasets.supabaseSeed.available &&
      parsed.datasets.swiftQuestions &&
      parsed.datasets.swiftQuestions.available
    );
  } catch {
    return false;
  }
}

export function restoreInterviewFromBackup() {
  if (!fs.existsSync(LATEST_BACKUP_PATH)) {
    throw new Error('Latest backup file does not exist');
  }

  const raw = fs.readFileSync(LATEST_BACKUP_PATH, 'utf-8');
  return JSON.parse(raw);
}
