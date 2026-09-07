export type DifficultyLevel = 'junior' | 'mid' | 'senior';
export type QuestionType = 'technical' | 'system_design' | 'behavioral' | 'coding';
export type Language = 'tr' | 'en';

export interface LocalizedCategory {
  name: string;
  description: string;
}

export interface Category {
  id: string;
  slug: string;
  icon: string;
  display_order: number;
  tr: LocalizedCategory;
  en: LocalizedCategory;
}

export interface LocalizedQuestionContent {
  title: string;
  question_text: string;
  ideal_answer: string;
  hints: string[];
  key_points: string[];
}

export interface Question {
  id: string;
  category_id?: string;
  difficulty: DifficultyLevel;
  q_type: QuestionType;
  tags: string[];
  tr: LocalizedQuestionContent;
  en: LocalizedQuestionContent;
}

// Helper to access localized question fields smoothly
export function getQuestionContent(question: Question, lang: Language): LocalizedQuestionContent {
  return lang === 'en' ? question.en : question.tr;
}

// Helper to access localized category fields smoothly
export function getCategoryContent(category: Category, lang: Language): LocalizedCategory {
  return lang === 'en' ? category.en : category.tr;
}
