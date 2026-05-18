import { ChevronRight } from "lucide-react";

export default function SeoBestPracticesPage() {
  return (
    <article className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl pb-20">
      <div className="text-[10px] sm:text-xs text-muted-foreground mb-6 sm:mb-8 flex items-center gap-2 uppercase tracking-wider font-semibold">
        <span>Docs</span>
        <ChevronRight size={12} />
        <span className="text-primary">SEO</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 font-one leading-[1.1]">
        SEO Best Practices for Short Links
      </h1>
      
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 sm:mb-12 pb-8 border-b border-border font-three">
        Optimizing your short links for search engines is crucial for maintaining your brand's visibility and ensuring that your content reaches the right audience.
      </p>

      <div className="space-y-10 sm:space-y-12">
        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Use Branded Domains
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Generic short links (like bit.ly or tinyurl.com) can sometimes be flagged by spam filters or viewed with suspicion by users. Using a branded domain (e.g., links.yourbrand.com) establishes trust and improves click-through rates, which indirectly signals quality to search engines.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Descriptive Slugs
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Instead of random characters (e.g., /a7b2), use descriptive slugs (e.g., /summer-guide). Keywords in the URL help search engines understand the content of the page you're linking to and can improve the relevance of your links in search results.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            301 Permanent Redirects
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            FastURL uses 301 redirects by default. A 301 redirect tells search engines that the page has moved permanently to the new location, passing 90-99% of the ranking power (link equity) to the redirected page. This is the most SEO-friendly way to redirect a link.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Monitor Link Health
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Broken links are detrimental to SEO. Use FastURL's dashboard to monitor your links and update "Redirect To" targets if your destination pages change. This ensures that you never lose link equity due to 404 errors.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Avoid Excessive Redirect Chains
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Redirecting a short link to another short link that then redirects to a final destination creates a chain. Search engine crawlers might stop following chains if they are too long, and it increases latency for users. FastURL ensures a direct hop to your destination.
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
