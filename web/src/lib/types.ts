export type DifficultyLevel = 'junior' | 'mid' | 'senior';
export type QuestionType = 'technical' | 'system_design' | 'behavioral' | 'coding';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  display_order: number;
}

export interface Question {
  id: string;
  category_id?: string;
  title: string;
  question_text: string;
  ideal_answer: string;
  hints: string[];
  key_points: string[];
  difficulty: DifficultyLevel;
  q_type: QuestionType;
  tags: string[];
}
