import { ChevronRight } from "lucide-react";

export default function BrandedLinksSeoPage() {
  return (
    <article className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl pb-20">
      <div className="text-[10px] sm:text-xs text-muted-foreground mb-6 sm:mb-8 flex items-center gap-2 uppercase tracking-wider font-semibold">
        <span>Docs</span>
        <ChevronRight size={12} />
        <span className="text-primary">SEO</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 font-one leading-[1.1]">
        Branded Links and SEO
      </h1>
      
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 sm:mb-12 pb-8 border-b border-border font-three">
        Branded links are not just for aesthetic appeal; they play a significant role in your digital marketing strategy and search engine optimization.
      </p>

      <div className="space-y-10 sm:space-y-12">
        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Enhanced Trust and CTR
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Click-through rate (CTR) is a vital metric for search engines. When users see a branded link (e.g., brand.com/sale), they are more likely to click compared to a generic one. High CTR signals to search engines that your content is relevant and trustworthy.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Keyword Integration
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Branded links allow you to include keywords in the URL even when sharing on platforms that would otherwise truncate or hide long URLs. This helps maintain keyword density and relevance across the web.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Social Signals
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Search engines consider social signals (shares, likes, mentions) as a factor in ranking. Branded links are shared more often because they look professional and safe, increasing your brand's footprint on social media and its impact on SEO.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Link Equity Preservation
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            When you use your own domain for shortening, you are essentially building "link juice" for your own domain rather than a third-party service. This helps in building the overall authority of your domain.
          </p>
        </section>
      </div>

      <div className="mt-20 sm:mt-24 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-widest">
        <span>FastURL Documentation</span>
        <span>Last updated: May 9, 2026</span>
      </div>
    </article>
  );
}
