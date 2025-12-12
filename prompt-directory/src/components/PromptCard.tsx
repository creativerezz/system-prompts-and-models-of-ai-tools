import Link from 'next/link';
import { Prompt } from '@/lib/types';

export default function PromptCard({ prompt, toolSlug }: { prompt: Prompt; toolSlug: string }) {
  const previewContent = prompt.content.slice(0, 200).replace(/\n/g, ' ');

  return (
    <Link href={`/tool/${toolSlug}/${prompt.id}`}>
      <div className="group bg-[#141414] border border-[#262626] rounded-xl p-5 hover:border-indigo-500/50 hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {prompt.name}
          </h3>
          <span className="text-xs text-neutral-500 bg-[#262626] px-2 py-1 rounded ml-2 shrink-0">
            {prompt.filename.split('.').pop()?.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-neutral-400 line-clamp-3 font-mono">
          {previewContent}...
        </p>
        <div className="mt-4 flex items-center text-xs text-neutral-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          {prompt.content.length.toLocaleString()} characters
        </div>
      </div>
    </Link>
  );
}
