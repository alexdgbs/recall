export type Difficulty = "basic" | "intermediate" | "technical";
export interface Concept {
  name: string;
  group: string;
  summary: string;
  returns: string;
  mutates: string;
  example: string;
}
export interface Question {
  id: string;
  difficulty: Difficulty;
  topic: string;
  concept: string;
  type: string;
  q: string;
  hint: string;
  code: string;
  options: string[];
  correct: number;
  explain: string;
  codeOptions?: boolean;
}
export interface Challenge {
  id: string;
  difficulty: Difficulty;
  title: string;
  description: string;
  functionName: string;
  template: string;
  tests: Array<{ args: unknown[]; expected: unknown }>;
}
