import Link from 'next/link';
import { Tool } from '@/lib/types';

const iconMap: Record<string, string> = {
  'AI Assistants': '🤖',
  'Code Editors': '💻',
  'AI Platforms': '🌐',
  'Open Source': '📖',
  'Specialized Tools': '🔧',
  'Other': '📁',
};

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tool/${tool.id}`}>
      <div className="group relative bg-[#141414] border border-[#262626] rounded-xl p-6 hover:border-indigo-500/50 hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">{iconMap[tool.category] || '📁'}</div>
          <span className="px-2 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-full">
            {tool.promptCount} prompt{tool.promptCount !== 1 ? 's' : ''}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-neutral-500">{tool.category}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tool.prompts.slice(0, 3).map((prompt) => (
            <span
              key={prompt.id}
              className="px-2 py-1 text-xs bg-[#262626] text-neutral-400 rounded-md truncate max-w-[120px]"
            >
              {prompt.name}
            </span>
          ))}
          {tool.prompts.length > 3 && (
            <span className="px-2 py-1 text-xs bg-[#262626] text-neutral-500 rounded-md">
              +{tool.prompts.length - 3} more
            </span>
          )}
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-200 pointer-events-none" />
      </div>
    </Link>
  );
}
