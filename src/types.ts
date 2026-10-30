export interface STARData {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface JobKeyword {
  keyword: string;
  howToUse: string;
}

export interface TranslationData {
  coachMessage: string;
  headline: string;
  star: STARData;
  fullParagraph: string;
  keywords: JobKeyword[];
  replyText: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  translation?: TranslationData;
  timestamp: number;
}

export interface STARRecord {
  id: string;
  originalStory: string;
  headline: string;
  star: STARData;
  fullParagraph: string;
  keywords: JobKeyword[];
  targetJob?: string;
  tone?: string;
  timestamp: number;
  isBookmarked: boolean;
}

export type AppTab = 'chat' | 'records' | 'saved' | 'guide';

export type SavedDraft = STARRecord;
