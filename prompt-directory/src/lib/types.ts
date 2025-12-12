export interface Prompt {
  id: string;
  name: string;
  filename: string;
  content: string;
  tool: string;
  category: string;
  path: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  prompts: Prompt[];
  promptCount: number;
}

export interface Category {
  name: string;
  tools: Tool[];
}
