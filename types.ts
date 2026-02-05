
export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface Module {
  id: string;
  title: string;
  objective: string;
  whyItMatters: string;
  explanation: string;
  btcExample: string;
  commonMistakes: string[];
  rulesSummary: string[];
  journalTask: string;
  level: Level;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
}

export interface CheckpointRequirement {
  id: string;
  text: string;
}
