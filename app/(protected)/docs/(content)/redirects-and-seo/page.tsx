import { ChevronRight } from "lucide-react";

export default function RedirectsAndSeoPage() {
  return (
    <article className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl pb-20">
      <div className="text-[10px] sm:text-xs text-muted-foreground mb-6 sm:mb-8 flex items-center gap-2 uppercase tracking-wider font-semibold">
        <span>Docs</span>
        <ChevronRight size={12} />
        <span className="text-primary">SEO</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6 font-one leading-[1.1]">
        Redirects and SEO: Deep Dive
      </h1>
      
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 sm:mb-12 pb-8 border-b border-border font-three">
        Understanding the technical aspects of redirects is essential for any SEO professional. FastURL ensures your redirects are optimized for performance and search engines.
      </p>

      <div className="space-y-10 sm:space-y-12">
        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            301 vs 302 Redirects
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            A 301 redirect is a permanent redirect, while a 302 is temporary. For SEO, 301 is almost always preferred as it passes link equity. FastURL uses high-performance 301 redirects to ensure your destination pages benefit from the authority of your short links.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Latency and Crawl Budget
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Search engines have a "crawl budget" for every site. If your redirects are slow, it consumes more of that budget and can slow down the indexing of your content. FastURL's infrastructure is optimized for sub-millisecond lookups, ensuring that search engine bots can crawl your links efficiently.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            Canonicalization Issues
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Redirects help in consolidating duplicate content. If you have multiple URLs pointing to the same content, using a short link as a single point of entry can help search engines identify the canonical (preferred) version of your page.
          </p>
        </section>

        <section className="group">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 font-one group-hover:text-primary transition-colors">
            HTTPS and Security
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-three">
            Security is a ranking factor. FastURL ensures all redirects happen over HTTPS, maintaining the secure connection from the short link click to the destination URL.
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
