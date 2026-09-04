import test from 'node:test';
import assert from 'node:assert';

interface Question {
  id: string;
  categoryId: string;
  title: string;
  difficulty: 'junior' | 'mid' | 'senior';
  tags: string[];
}

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
    { id: '1', categoryId: 'ios', title: 'SwiftUI', difficulty: 'mid', tags: ['swift'] },
    { id: '2', categoryId: 'ios', title: 'Actors', difficulty: 'senior', tags: ['concurrency'] },
    { id: '3', categoryId: 'android', title: 'Compose', difficulty: 'mid', tags: ['kotlin'] },
  ];

  const seniorOnly = questions.filter(q => q.difficulty === 'senior');
  assert.strictEqual(seniorOnly.length, 1);
  assert.strictEqual(seniorOnly[0].title, 'Actors');
});
