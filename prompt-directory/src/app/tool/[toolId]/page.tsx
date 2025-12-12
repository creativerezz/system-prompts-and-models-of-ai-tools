import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllTools } from '@/lib/prompts';
import PromptCard from '@/components/PromptCard';

interface PageProps {
  params: Promise<{ toolId: string }>;
}

export async function generateStaticParams() {
  const tools = getAllTools();
  return tools.map((tool) => ({
    toolId: tool.id,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { toolId } = await params;
  const tool = getToolBySlug(toolId);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: `${tool.name} - Prompt Directory`,
    description: `Explore ${tool.promptCount} system prompts from ${tool.name}. Part of the AI System Prompts collection.`,
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { toolId } = await params;
  const tool = getToolBySlug(toolId);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Breadcrumb */}
      <div className="border-b border-[#262626]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-neutral-500 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-neutral-600">/</span>
            <span className="text-white">{tool.name}</span>
          </nav>
        </div>
      </div>

      {/* Tool Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-[#262626]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shrink-0">
              {tool.category === 'AI Assistants' && '🤖'}
              {tool.category === 'Code Editors' && '💻'}
              {tool.category === 'AI Platforms' && '🌐'}
              {tool.category === 'Open Source' && '📖'}
              {tool.category === 'Specialized Tools' && '🔧'}
              {!['AI Assistants', 'Code Editors', 'AI Platforms', 'Open Source', 'Specialized Tools'].includes(tool.category) && '📁'}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{tool.name}</h1>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 text-sm font-medium bg-indigo-500/10 text-indigo-400 rounded-full">
                  {tool.category}
                </span>
                <span className="text-neutral-500">
                  {tool.promptCount} prompt{tool.promptCount !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prompts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-6">Available Prompts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tool.prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} toolSlug={tool.id} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
