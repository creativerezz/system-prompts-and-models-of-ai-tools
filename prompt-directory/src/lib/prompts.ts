import fs from 'fs';
import path from 'path';
import { Prompt, Tool } from './types';

const PROMPTS_DIR = path.join(process.cwd(), '..');

const EXCLUDED_DIRS = ['.git', '.github', 'assets', 'node_modules', 'prompt-directory'];

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function categorize(toolName: string): string {
  const categories: Record<string, string[]> = {
    'AI Assistants': ['Claude Code', 'Devin AI', 'Manus Agent', 'Perplexity', 'Junie', 'Cluely', 'dia', 'Comet Assistant', 'NotionAi'],
    'Code Editors': ['Cursor Prompts', 'VSCode Agent', 'Windsurf', 'Augment Code', 'CodeBuddy Prompts', 'Trae', 'Amp', 'Xcode', 'Z.ai Code', 'Qoder'],
    'AI Platforms': ['Google', 'Anthropic', 'v0 Prompts and Tools', 'Same.dev', 'Lovable', 'Replit', 'Leap.new'],
    'Open Source': ['Open Source prompts', 'Bolt', 'Cline', 'Codex CLI', 'Gemini CLI', 'RooCode', 'Lumo'],
    'Specialized Tools': ['Warp.dev', 'Traycer AI', 'Orchids.app', 'Emergent', 'Poke', 'Kiro'],
  };

  for (const [category, tools] of Object.entries(categories)) {
    if (tools.some(t => toolName.includes(t))) {
      return category;
    }
  }
  return 'Other';
}

function readPromptsFromDir(dirPath: string, toolName: string, category: string): Prompt[] {
  const prompts: Prompt[] = [];

  try {
    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isFile() && (item.endsWith('.txt') || item.endsWith('.md'))) {
        // Skip README files
        if (item.toLowerCase() === 'readme.md') continue;

        try {
          const content = fs.readFileSync(itemPath, 'utf-8');
          const name = item.replace(/\.(txt|md)$/, '');

          prompts.push({
            id: slugify(`${toolName}-${name}`),
            name,
            filename: item,
            content,
            tool: toolName,
            category,
            path: itemPath,
          });
        } catch {
          // Skip files that can't be read
        }
      } else if (stat.isDirectory() && !EXCLUDED_DIRS.includes(item)) {
        // Recursively read subdirectories
        const subPrompts = readPromptsFromDir(itemPath, `${toolName}/${item}`, category);
        prompts.push(...subPrompts);
      }
    }
  } catch {
    // Skip directories that can't be read
  }

  return prompts;
}

export function getAllTools(): Tool[] {
  const tools: Tool[] = [];

  try {
    const items = fs.readdirSync(PROMPTS_DIR);

    for (const item of items) {
      if (EXCLUDED_DIRS.includes(item)) continue;

      const itemPath = path.join(PROMPTS_DIR, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        const category = categorize(item);
        const prompts = readPromptsFromDir(itemPath, item, category);

        if (prompts.length > 0) {
          tools.push({
            id: slugify(item),
            name: item,
            category,
            prompts,
            promptCount: prompts.length,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error reading prompts directory:', error);
  }

  return tools.sort((a, b) => a.name.localeCompare(b.name));
}

export function getToolBySlug(slug: string): Tool | undefined {
  const tools = getAllTools();
  return tools.find(t => t.id === slug);
}

export function getPromptById(toolSlug: string, promptId: string): Prompt | undefined {
  const tool = getToolBySlug(toolSlug);
  if (!tool) return undefined;
  return tool.prompts.find(p => p.id === promptId);
}

export function searchPrompts(query: string): Prompt[] {
  const tools = getAllTools();
  const allPrompts = tools.flatMap(t => t.prompts);
  const lowerQuery = query.toLowerCase();

  return allPrompts.filter(
    p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.tool.toLowerCase().includes(lowerQuery) ||
      p.content.toLowerCase().includes(lowerQuery)
  );
}

export function getAllCategories(): string[] {
  const tools = getAllTools();
  const categories = new Set(tools.map(t => t.category));
  return Array.from(categories).sort();
}

export function getToolsByCategory(category: string): Tool[] {
  const tools = getAllTools();
  return tools.filter(t => t.category === category);
}
