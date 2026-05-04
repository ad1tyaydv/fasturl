"use client";
import { useState, useEffect } from 'react';
import { Search, FileText, ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import Navbar from '@/app/components/navbar';
import { docsData } from './docsData';
import { useRouter, useParams } from 'next/navigation';

export default function DocsClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const activeDocId = params.slug as string;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({ 
    basics: true, 
    features: true,
    management: true,
    analytics: true,
    advanced: true
  });

  const handleNavigation = (id: string) => {
    router.push(`/docs/${id}`);
    setIsSidebarOpen(false);
    
    const mainElement = document.getElementById('docs-content');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const filteredDocs = Object.values(docsData).filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarCategories = [
    { id: 'basics', label: 'Getting Started' },
    { id: 'management', label: 'Link Management' },
    { id: 'analytics', label: 'Analytics & Tracking' },
    { id: 'features', label: 'Core Features' },
    { id: 'advanced', label: 'Developer Tools' }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300 flex flex-col h-screen overflow-hidden">
      <div className="shrink-0 z-[60]">
        <Navbar />
      </div>
      
      <div className="flex flex-1 pt-2 h-full overflow-hidden relative"> 
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-8 right-8 z-[55] p-4 bg-primary text-primary-foreground rounded-full shadow-2xl active:scale-95 transition-all border border-primary-foreground/10"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <aside className={`
          fixed top-[88px] bottom-0 left-0 z-50 w-72 bg-background border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-full
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-5 border-b border-border">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                <Search size={16} />
              </div>
              <input 
                type="text" 
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-border py-2.5 pl-10 pr-3 rounded-xl outline-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/50 text-sm text-foreground font-one"
              />
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {filteredDocs.length === 0 ? (
              <div className="px-2 py-4 text-sm text-muted-foreground italic">No results</div>
            ) : (
              sidebarCategories.map(category => {
                const catDocs = filteredDocs.filter(doc => doc.category === category.id);
                if (catDocs.length === 0) return null;
                return (
                  <div key={category.id} className="mb-6 last:mb-20 lg:last:mb-6">
                    <button 
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-2 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {category.label}
                      {openCategories[category.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {openCategories[category.id] && (
                      <ul className="space-y-1">
                        {catDocs.map((doc) => (
                          <li key={doc.id}>
                            <button
                              onClick={() => handleNavigation(doc.id)}
                              className={`w-full text-left px-3 py-2.5 flex items-center gap-2 text-sm rounded-lg transition-all cursor-pointer ${
                                activeDocId === doc.id 
                                  ? 'bg-primary/10 text-primary font-semibold' 
                                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                              }`}
                            >
                              <FileText size={14} className={activeDocId === doc.id ? "text-primary" : "text-muted-foreground"} />
                              <span className="truncate">{doc.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })
            )}
          </nav>
        </aside>

        <main id="docs-content" className="flex-1 overflow-y-auto custom-scrollbar bg-background p-6 sm:p-10 md:p-12 lg:py-16 lg:pl-12 lg:pr-24">
          {children}
        </main>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
