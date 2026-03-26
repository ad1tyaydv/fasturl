"use client";

import Link from "next/link";
import { 
  IoLogoFacebook, 
  IoLogoInstagram, 
  IoLogoLinkedin, 
  IoLogoTwitter 
} from "react-icons/io5";


export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Features",
      links: [
        { name: "Link Editor", href: "/features" },
        { name: "Link Management", href: "/urls" },
        { name: "Branded Links", href: "/premium" },
        { name: "Short URL Tracking", href: "/analytics" },
        { name: "QR Code Generator", href: "/qr-generator" },
        { name: "Short URL API", href: "/api-docs" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", href: "#" },
        { name: "For Developers", href: "#" },
        { name: "Our Proven Process", href: "#" },
        { name: "About Us", href: "#" },
      ],
    },
    {
      title: "Contact Us",
      links: [
        { name: "Help Desk", href: "#" },
        { name: "Contact Sales", href: "#" },
        { name: "Contact Support", href: "#" },
        { name: "Report Abuse", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "#" },
        { name: "Accessibility Statement", href: "#" },
        { name: "Privacy Manager", href: "#" },
      ],
    },
  ];

  
  return (
    <footer className="bg-[#141414] text-white border-t border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
          
          {footerLinks.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h4 className="font-one font-bold text-lg text-white">{section.title}</h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      href={link.href} 
                      className="text-neutral-400 hover:text-blue-500 transition-colors text-sm font-two"
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
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                <IoLogoFacebook size={22} />
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                <IoLogoInstagram size={22} />
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                <IoLogoLinkedin size={22} />
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-white transition-colors cursor-pointer">
                <IoLogoTwitter size={22} />
              </Link>
            </div>

            <div className="text-center lg:text-right">
              <h2 className="text-4xl font-one font-black tracking-tighter mb-2 text-white">
                SHORTLY
              </h2>
              <p className="text-xs text-neutral-500 font-two leading-relaxed">
                © {currentYear} Shortly LLC <br />
                All Rights Reserved
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}