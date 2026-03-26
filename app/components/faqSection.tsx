"use client";

import { useState } from "react";
import { IoChevronDownOutline } from "react-icons/io5";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What is Shortly?",
    answer: "Shortly is a powerful URL shortening service that allows you to transform long, complex links into short, memorable URLs. It helps you track analytics, manage links, and create QR codes all in one dashboard."
  },
  {
    question: "How does Shortly work?",
    answer: "When you enter a long URL, Shortly generates a unique key for that link and stores it in our database. When someone clicks your short link, we instantly redirect them to the original destination while tracking the click data."
  },
  {
    question: "What are the benefits of using Shortly?",
    answer: "Shortly provides detailed analytics (clicks, location, devices), custom aliases for branding, password protection for sensitive links, and bulk creation tools to save you time."
  },
  {
    question: "What is a custom URL shortener?",
    answer: "A custom shortener allows you to use your own brand name in the link (e.g., yourbrand.co/sale) instead of a generic domain, increasing trust and click-through rates by up to 34%."
  },
  {
    question: "How do I shorten a URL for free?",
    answer: "You can use Shortly's homepage to shorten individual links for free. To manage multiple links or access premium features like Bulk Shortening, you can create a free account or upgrade to a premium plan."
  },
  {
    question: "How do I know the service is reliable?",
    answer: "Shortly is built on scalable cloud infrastructure with 99.9% uptime. We handle millions of redirects daily and use advanced encryption to ensure your data and your users' privacy are protected."
  }
];


export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  
  return (
    <section className="py-24 px-4 bg-[#141414] transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        <div className="lg:w-1/3">
          <h2 className="text-4xl sm:text-5xl font-three font-bold text-white leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-neutral-400 font-one text-lg">
            Have questions about Shortly? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
          </p>
        </div>

        <div className="lg:w-2/3 border-t border-neutral-800">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border-b border-neutral-800 transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full py-6 flex items-center justify-between text-left group cursor-pointer"
              >
                <span className={`text-lg font-three font-bold transition-colors ${openIndex === index ? 'text-blue-500' : 'text-white group-hover:text-blue-500'}`}>
                  {faq.question}
                </span>
                <IoChevronDownOutline 
                  size={20} 
                  className={`text-neutral-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-blue-500' : ''}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-neutral-400 font-one leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}