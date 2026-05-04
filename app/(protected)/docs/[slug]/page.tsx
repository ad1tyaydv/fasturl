import { docsData } from "../docsData";
import { ChevronRight, FileText } from "lucide-react";
import { notFound } from "next/navigation";

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activeDoc = docsData[slug];

  if (!activeDoc) {
    notFound();
  }

  return (
    <article className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl pb-20">
      <div className="text-[10px] sm:text-xs text-muted-foreground mb-6 sm:mb-8 flex items-center gap-2 uppercase tracking-wider font-semibold">
        <span>Docs</span>
        <ChevronRight size={12} />
        <span className="text-primary">{activeDoc.category}</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 font-one leading-[1.1]">
        {activeDoc.title}
      </h1>
      
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 sm:mb-12 pb-8 border-b border-border font-three">
        {activeDoc.description}
      </p>

      <div className="space-y-10 sm:space-y-12">
        {activeDoc.sections.map((section, idx) => (
          <section key={idx} className="group">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
              {section.subtitle}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
              {section.text}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-20 sm:mt-24 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-widest">
        <span>FastURL Documentation</span>
        <span>Last updated: Today</span>
      </div>
    </article>
  );
}
