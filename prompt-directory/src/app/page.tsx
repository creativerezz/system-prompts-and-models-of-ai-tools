import { Suspense } from 'react';
import { getAllTools, getAllCategories, searchPrompts } from '@/lib/prompts';
import ToolCard from '@/components/ToolCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import PromptCard from '@/components/PromptCard';

interface PageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const selectedCategory = params.category || null;

  const allTools = getAllTools();
  const categories = getAllCategories();

  // Filter tools by category
  let filteredTools = selectedCategory
    ? allTools.filter((t) => t.category === selectedCategory)
    : allTools;

  // Search results
  const searchResults = query ? searchPrompts(query) : [];
  const isSearching = query.length > 0;

  // Stats
  const totalPrompts = allTools.reduce((sum, t) => sum + t.promptCount, 0);
  const totalTools = allTools.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-indigo-500/20 to-transparent rounded-full blur-3xl opacity-50" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            AI System{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Prompts
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
            Explore system prompts from popular AI tools. Over{' '}
            <span className="text-white font-semibold">30,000+</span> lines of insights into
            AI tool structure and functionality.
          </p>
          <div className="flex justify-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalTools}</div>
              <div className="text-sm text-neutral-500">AI Tools</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{totalPrompts}</div>
              <div className="text-sm text-neutral-500">Prompts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{categories.length}</div>
              <div className="text-sm text-neutral-500">Categories</div>
            </div>
          </div>
          <Suspense fallback={<div className="h-12 bg-[#141414] rounded-xl animate-pulse max-w-2xl mx-auto" />}>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <Suspense fallback={<div className="h-10 bg-[#141414] rounded-full animate-pulse" />}>
            <CategoryFilter categories={categories} selectedCategory={selectedCategory} />
          </Suspense>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {isSearching ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Search Results{' '}
                  <span className="text-neutral-500 font-normal">({searchResults.length} found)</span>
                </h2>
              </div>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.slice(0, 30).map((prompt) => (
                    <PromptCard
                      key={prompt.id}
                      prompt={prompt}
                      toolSlug={prompt.tool.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                  <p className="text-neutral-500">Try a different search term</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {selectedCategory ? selectedCategory : 'All Tools'}{' '}
                  <span className="text-neutral-500 font-normal">({filteredTools.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#262626] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-neutral-500 text-sm">
            Data sourced from{' '}
            <a
              href="https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              system-prompts-and-models-of-ai-tools
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
