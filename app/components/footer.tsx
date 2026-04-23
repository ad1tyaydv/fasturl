"use client";

import { NewTwitterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks: Array<{ title: string; links: Array<{ name: string; href: string; external?: boolean }> }> = [
    {
      title: "Features",
      links: [
        { name: "Link Editor", href: "/" },
        { name: "Link Management", href: "/links?types=links" },
        { name: "Branded Links", href: "/links?types=links" },
        { name: "Short URL Tracking", href: "/analytics" },
        { name: "QR Code Generator", href: "/qr" },
        { name: "Short URL API", href: "/apikeys" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "/docs" },
        { name: "For Developers", href: "/docs" },
        { name: "Our Proven Process", href: "/docs" },
        { name: "About Us", href: "/docs" },
      ],
    },
    {
      title: "Contact Us",
      links: [
        { name: "Help Desk", href: "https://mail.google.com/mail/?view=cm&fs=1&to=fasturl@tutamail.com", external: true },
        { name: "Contact Sales", href: "https://mail.google.com/mail/?view=cm&fs=1&to=fasturl@tutamail.com", external: true },
        { name: "Contact Support", href: "https://mail.google.com/mail/?view=cm&fs=1&to=fasturl@tutamail.com", external: true },
        { name: "Report Abuse", href: "https://mail.google.com/mail/?view=cm&fs=1&to=fasturl@tutamail.com", external: true },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/legal/terms" },
        { name: "Privacy Policy", href: "/legal/privacyPolicy" },
        { name: "Cookie Policy", href: "/legal/cookies" },
      ],
    },
  ];


  return (
    <footer className="bg-[#141414] text-white border-t border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          
          {footerLinks.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h4 className="font-one font-three text-lg text-white">{section.title}</h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href} 
                      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-neutral-400 hover:text-blue-500 transition-colors text-sm font-one"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 flex flex-col items-center lg:items-end justify-center lg:justify-start gap-6 lg:ml-auto">
            <div className="flex gap-6">
              <span className="text-neutral-500">Follow us on</span>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                <HugeiconsIcon icon={NewTwitterIcon} />
              </Link>
            </div>

            <div className="text-center lg:text-right">
              <h2 className="text-4xl font-three font-black tracking-tighter mb-2 text-white">
                FASTURL
              </h2>
              <p className="text-xs text-neutral-500 font-one leading-relaxed">
                © {currentYear} FASTURL LLC <br />
                All Rights Reserved
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}