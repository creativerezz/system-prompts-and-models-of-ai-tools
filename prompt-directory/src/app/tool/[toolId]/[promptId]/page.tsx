import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getPromptById, getAllTools } from '@/lib/prompts';
import CopyButton from '@/components/CopyButton';

interface PageProps {
  params: Promise<{ toolId: string; promptId: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  const params: { toolId: string; promptId: string }[] = [];

  for (const tool of tools) {
    for (const prompt of tool.prompts) {
      params.push({
        toolId: tool.id,
        promptId: prompt.id,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  const { toolId, promptId } = await params;
  const prompt = getPromptById(toolId, promptId);
  const tool = getToolBySlug(toolId);

  if (!prompt || !tool) {
    return {
      title: 'Prompt Not Found',
    };
  }

  return {
    title: `${prompt.name} - ${tool.name} | Prompt Directory`,
    description: `View the ${prompt.name} system prompt from ${tool.name}. ${prompt.content.slice(0, 150)}...`,
  };
}

export default async function PromptPage({ params }: PageProps) {
  const { toolId, promptId } = await params;
  const tool = getToolBySlug(toolId);
  const prompt = getPromptById(toolId, promptId);

  if (!tool || !prompt) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Breadcrumb */}
      <div className="border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap">
            <Link href="/" className="text-neutral-500 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-neutral-600">/</span>
            <Link href={`/tool/${tool.id}`} className="text-neutral-500 hover:text-white transition-colors">
              {tool.name}
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-white truncate max-w-[200px]">{prompt.name}</span>
          </nav>
        </div>
      </div>

      {/* Prompt Header */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{prompt.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-neutral-500">
                  From <span className="text-indigo-400">{tool.name}</span>
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-500">
                  {prompt.content.length.toLocaleString()} characters
                </span>
                <span className="text-neutral-600">•</span>
                <span className="px-2 py-0.5 text-xs bg-[#262626] text-neutral-400 rounded">
                  {prompt.filename}
                </span>
              </div>
            </div>
            <CopyButton content={prompt.content} />
          </div>
        </div>
      </section>

      {/* Prompt Content */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#262626]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-neutral-500 font-mono">{prompt.filename}</span>
            </div>
            <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
              <code className="text-neutral-300 whitespace-pre-wrap break-words">
                {prompt.content}
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* Other Prompts from this Tool */}
      {tool.prompts.length > 1 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[#262626]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-lg font-semibold text-white mb-4">
              Other prompts from {tool.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {tool.prompts
                .filter((p) => p.id !== prompt.id)
                .slice(0, 10)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/tool/${tool.id}/${p.id}`}
                    className="px-3 py-2 text-sm bg-[#141414] border border-[#262626] text-neutral-400 rounded-lg hover:border-indigo-500/50 hover:text-white transition-colors"
                  >
                    {p.name}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
