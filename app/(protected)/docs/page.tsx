"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/app/components/navbar';

const BlogContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const activeFeature = searchParams.get('feature');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFeatureChange = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('feature', id);
    } else {
      params.delete('feature');
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeFeature]);

  const featureContent = {
    core: {
      title: "Core Shortening Infrastructure",
      subtitle: "The Foundation of FastURL",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      description: `FastURL is built on a high-availability global edge network designed to handle millions of redirects per second. Our core infrastructure ensures your links resolve almost instantly while providing a professional appearance.`,
      points: [
        { label: "Instant URL Shortening", text: "Compress long URLs instantly, removing bloat and tracking parameters for a sleek link." },
        { label: "Custom Short Links", text: "Replace random characters with branded slugs to increase trust and click-through rates." },
        { label: "Fast Redirect Performance", text: "Anycast routing ensures users reach the nearest node for sub-100ms redirection." },
        { label: "Reliable Infrastructure", text: "High availability architecture ensures your links never go down during peak traffic." }
      ]
    },
    analytics: {
      title: "Deep Tracking & Analytics",
      subtitle: "Data-Driven Insights",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
      description: `Understand exactly who is clicking your links and where they are coming from. FastURL provides a robust suite of tracking tools that give you real-time data on your audience's behavior across different platforms and regions.`,
      points: [
        { label: "Total & Unique Click Tracking", text: "Distinguish between raw traffic and unique individual visitors to measure true reach." },
        { label: "IP & Geographic Tracking", text: "Identify the location of your visitors to optimize your regional marketing efforts." },
        { label: "Device & Referrer Tracking", text: "See if users are on Mobile or Desktop and identify the source site bringing them in." },
        { label: "Real-Time Click Analytics", text: "Watch your campaign performance live as clicks happen in real-time." }
      ]
    },
    security: {
      title: "Secure Share & Link Control",
      subtitle: "Advanced Privacy Features",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
      description: `Security is the backbone of FastURL. Our security suite allows you to go beyond simple redirection by adding layers of protection that keep your sensitive data safe and your links under your total control.`,
      points: [
        { label: "Password Protection", text: "Require a unique key before visitors can access the destination URL." },
        { label: "Link Expiration", text: "Set specific dates or click limits after which the link automatically deactivates." },
        { label: "Secure HTTPS Links", text: "Every link generated is encrypted with SSL to ensure safe browsing for your users." },
        { label: "Spam Protection", text: "Advanced filtering to prevent your links from being used for malicious intent." }
      ]
    },
    customization: {
      title: "Branding & Customization",
      subtitle: "Make it Your Own",
      image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=1200",
      description: `Transform generic links into powerful marketing assets. With our customization features, your links act as an extension of your brand identity, ensuring consistency across every touchpoint.`,
      points: [
        { label: "Custom Domain Support", text: "Use your own branded domain (e.g., links.yourbrand.com) instead of our default." },
        { label: "QR Code Generation", text: "Instantly create high-resolution QR codes for any shortened link for print media." },
        { label: "Link Preview Customization", text: "Control the title and image that appears when your link is shared on social media." },
        { label: "Campaign & UTM Support", text: "Easily attach UTM parameters to track marketing campaigns within Google Analytics." }
      ]
    },
    management: {
      title: "Advanced Link Management",
      subtitle: "Workflow Efficiency",
      image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=1200",
      description: `Managing thousands of links shouldn't be a chore. Our dashboard is designed for speed and efficiency, allowing power users to manage their entire digital footprint from a single interface.`,
      points: [
        { label: "Bulk URL Shortening", text: "Shorten hundreds of links at once through our bulk creation engine." },
        { label: "Search & Filter Dashboard", text: "Find any link in seconds using our advanced real-time search and filtering." },
        { label: "API & CSV Access", text: "Integration-ready tools for developers and large-scale data management (Future)." },
        { label: "One-Click Management", text: "Edit, delete, or copy links instantly without refreshing the page." }
      ]
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    if (value.length > 3 && !activeFeature) {
      const elements = document.querySelectorAll('p, h2, h3, h1');
      for (const element of Array.from(elements)) {
        if (element.textContent?.toLowerCase().includes(value)) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          break;
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-blue-100">
      <Head>
        <title>FastURL.in | Professional SEO Optimized Link Management</title>
        <meta name="description" content="Discover FastURL.in, the modern, fast, and secure URL shortener." />
      </Head>

      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-12">
        {activeFeature && featureContent[activeFeature as keyof typeof featureContent] ? (
          <div className="animate-in fade-in duration-500">
            <button 
              onClick={() => handleFeatureChange(null)}
              className="mb-10 flex items-center text-sm font-bold tracking-wide text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← BACK TO OVERVIEW
            </button>
            
            <header className="mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                {featureContent[activeFeature as keyof typeof featureContent].subtitle}
              </span>
              <h1 className="mt-2 text-4xl font-black text-gray-900 md:text-5xl">
                {featureContent[activeFeature as keyof typeof featureContent].title}
              </h1>
            </header>

            <img 
              src={featureContent[activeFeature as keyof typeof featureContent].image} 
              alt={activeFeature}
              className="mb-12 h-[400px] w-full rounded-3xl object-cover shadow-xl"
            />

            <div className="max-w-3xl">
              <p className="mb-16 text-lg leading-relaxed text-gray-600">
                {featureContent[activeFeature as keyof typeof featureContent].description}
              </p>

              <div className="space-y-16">
                {featureContent[activeFeature as keyof typeof featureContent].points.map((point, idx) => (
                  <section key={idx} className="border-l-4 border-blue-600 pl-8">
                    <h3 className="text-xl font-bold text-gray-900">{point.label}</h3>
                    <p className="mt-4 leading-relaxed text-gray-600">
                      {point.text}
                    </p>
                  </section>
                ))}
              </div>
            </div>

            <div className="mt-24 border-t border-gray-100 pt-12">
              <button 
                onClick={() => handleFeatureChange(null)}
                className="rounded-full bg-gray-900 px-8 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all"
              >
                Return to Main Blog
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">

            <section className="mb-24 text-center">
              <h1 className="text-5xl font-black tracking-tight text-gray-900 md:text-7xl">
                The Science of <span className="text-blue-600">Short Links</span>
              </h1>
              <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-gray-500">
                A link is more than a destination; it's a data-rich gateway. 
                Explore our professional ecosystem designed for speed, brand, and growth.
              </p>
            </section>

            <div className="grid gap-16 md:grid-cols-2">
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">What is FastURL?</h2>
                <p className="leading-relaxed text-gray-600">
                  FastURL is a link management ecosystem built for performance. We transform 
                  long, user-unfriendly URLs into professional digital assets that track 
                  every interaction while loading in less than 100ms.
                </p>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Experience Centric</h2>
                <p className="leading-relaxed text-gray-600">
                  With a clean modern UI and mobile-responsive design, FastURL makes sharing 
                  content effortless. From one-click copy to fast-loading pages, we prioritize 
                  the user experience of both you and your audience.
                </p>
              </section>
            </div>

            <section className="mt-32">
              <h2 className="mb-12 text-3xl font-black text-gray-900">Explore Capabilities</h2>
              <div className="grid gap-8 md:grid-cols-3">
                {/* Feature Card: Core */}
                <div onClick={() => handleFeatureChange('core')} className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="Core" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">Performance Infrastructure</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">High availability, low latency redirects, and custom slug engines.</p>
                  </div>
                </div>

                {/* Feature Card: Analytics */}
                <div onClick={() => handleFeatureChange('analytics')} className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600" className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="Analytics" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">Deep Tracking</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">Total clicks, unique visitors, geo-location, and device tracking.</p>
                  </div>
                </div>

                {/* Feature Card: Customization */}
                <div onClick={() => handleFeatureChange('customization')} className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=600" className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="Branding" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">Marketing & SEO</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">Custom domains, QR codes, and UTM parameter support.</p>
                  </div>
                </div>

                {/* Feature Card: Management */}
                <div onClick={() => handleFeatureChange('management')} className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600" className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="Management" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">Link Management</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">Bulk URL shortening, dashboard search, and management tools.</p>
                  </div>
                </div>

                {/* Feature Card: Security */}
                <div onClick={() => handleFeatureChange('security')} className="group cursor-pointer overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-xl">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600" className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="Security" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">Security Features</h3>
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">Password protection, link expiration, and spam filtering.</p>
                  </div>
                </div>
              </div>
            </section>

            <footer className="mt-32 rounded-[3rem] bg-gray-900 px-8 py-16 text-center text-white">
              <h2 className="text-4xl font-bold">Scale Your Branding</h2>
              <p className="mt-4 text-gray-400">Join thousands of users shortening links with FastURL.</p>
              <button className="mt-10 rounded-full bg-white px-12 py-4 font-bold text-black transition-all hover:bg-gray-200">
                Get Started for Free
              </button>
            </footer>
          </div>
        )}
      </main>
    </div>
  );
};

const FastURLBlog = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <BlogContent />
    </Suspense>
  );
};

export default FastURLBlog;