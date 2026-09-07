import test from 'node:test';
import assert from 'node:assert';
import { translations, getTranslation } from '../src/lib/i18n.ts';
import { SWIFT_MASTER_QUESTIONS } from '../src/data/swift-questions.ts';
import { getQuestionContent, Language, Question } from '../src/lib/types.ts';

interface SessionAnswer {
  questionId: string;
  score: number; // 1 to 5
  timeSpentSeconds: number;
}

export function calculateInterviewSummary(answers: SessionAnswer[]): {
  averageScore: number;
  totalTimeMinutes: number;
  grade: 'Excellent' | 'Good' | 'Needs Practice';
} {
  if (answers.length === 0) {
    return { averageScore: 0, totalTimeMinutes: 0, grade: 'Needs Practice' };
  }

  const totalScore = answers.reduce((acc, curr) => acc + curr.score, 0);
  const avg = Number((totalScore / answers.length).toFixed(1));
  const totalSeconds = answers.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0);
  const totalTimeMinutes = Number((totalSeconds / 60).toFixed(1));

  let grade: 'Excellent' | 'Good' | 'Needs Practice' = 'Needs Practice';
  if (avg >= 4.0) grade = 'Excellent';
  else if (avg >= 3.0) grade = 'Good';

  return { averageScore: avg, totalTimeMinutes, grade };
}

test('Interview score summary calculation with high scores', () => {
  const answers: SessionAnswer[] = [
    { questionId: 'q1', score: 5, timeSpentSeconds: 120 },
    { questionId: 'q2', score: 4, timeSpentSeconds: 90 },
    { questionId: 'q3', score: 5, timeSpentSeconds: 150 },
  ];

  const summary = calculateInterviewSummary(answers);
  assert.strictEqual(summary.averageScore, 4.7);
  assert.strictEqual(summary.totalTimeMinutes, 6.0);
  assert.strictEqual(summary.grade, 'Excellent');
});

test('Interview summary for empty answers', () => {
  const summary = calculateInterviewSummary([]);
  assert.strictEqual(summary.averageScore, 0);
  assert.strictEqual(summary.grade, 'Needs Practice');
});

test('Question difficulty filter', () => {
  const questions: Question[] = [
    {
      id: '1',
      difficulty: 'mid',
      q_type: 'technical',
      tags: ['swift'],
      tr: { title: 'SwiftUI', question_text: 'Soru', ideal_answer: 'Cevap', hints: [], key_points: [] },
      en: { title: 'SwiftUI EN', question_text: 'Question', ideal_answer: 'Answer', hints: [], key_points: [] }
    },
    {
      id: '2',
      difficulty: 'senior',
      q_type: 'technical',
      tags: ['concurrency'],
      tr: { title: 'Actors', question_text: 'Soru 2', ideal_answer: 'Cevap 2', hints: [], key_points: [] },
      en: { title: 'Actors EN', question_text: 'Question 2', ideal_answer: 'Answer 2', hints: [], key_points: [] }
    }
  ];

  const seniorOnly = questions.filter(q => q.difficulty === 'senior');
  assert.strictEqual(seniorOnly.length, 1);
  assert.strictEqual(seniorOnly[0].tr.title, 'Actors');
  assert.strictEqual(seniorOnly[0].en.title, 'Actors EN');
});

test('i18n dictionary completeness for TR and EN', () => {
  const tr = getTranslation('tr');
  const en = getTranslation('en');

  assert.ok(tr.appName.length > 0);
  assert.ok(en.appName.length > 0);
  assert.strictEqual(tr.onlyBookmarks, 'Yıldızlılar');
  assert.strictEqual(en.onlyBookmarks, 'Starred');
  assert.strictEqual(tr.allDifficulties, 'Tümü');
  assert.strictEqual(en.allDifficulties, 'All');

  // Verify function keys work
  assert.strictEqual(tr.questionsCount(5), '5 soru');
  assert.strictEqual(en.questionsCount(5), '5 questions');
  assert.strictEqual(tr.questionNumber(1, 10), 'Soru 1/10');
  assert.strictEqual(en.questionNumber(1, 10), 'Question 1/10');
});

test('Swift Master Questions bilingual dataset completeness', () => {
  assert.ok(SWIFT_MASTER_QUESTIONS.length >= 30, `Expected at least 30 questions, found ${SWIFT_MASTER_QUESTIONS.length}`);

  for (const q of SWIFT_MASTER_QUESTIONS) {
    // Turkish validations
    const tr = getQuestionContent(q, 'tr');
    assert.ok(tr.title.length > 0, `Missing TR title for question ${q.id}`);
    assert.ok(tr.question_text.length > 10, `TR question_text too short for question ${q.id}`);
    assert.ok(tr.ideal_answer.length > 10, `TR ideal_answer too short for question ${q.id}`);
    assert.ok(Array.isArray(tr.key_points) && tr.key_points.length > 0, `TR key_points empty for question ${q.id}`);

    // English validations
    const en = getQuestionContent(q, 'en');
    assert.ok(en.title.length > 0, `Missing EN title for question ${q.id}`);
    assert.ok(en.question_text.length > 10, `EN question_text too short for question ${q.id}`);
    assert.ok(en.ideal_answer.length > 10, `EN ideal_answer too short for question ${q.id}`);
    assert.ok(Array.isArray(en.key_points) && en.key_points.length > 0, `EN key_points empty for question ${q.id}`);

    // Titles must be localized
    assert.notStrictEqual(tr.title, en.title, `TR and EN titles should be distinct localized strings for question ${q.id}`);
  }
});
