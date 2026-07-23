import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Domains - Branded Short Links with Your Domain",
  description: "Connect your own domain to FastURL for branded short links. Set up custom domains like link.yourbrand.com with simple DNS configuration.",
  alternates: {
    canonical: "/domain",
  },
  openGraph: {
    title: "Custom Domains - Branded Short Links with Your Domain",
    description: "Connect your own domain to FastURL for branded short links. Set up custom domains with simple DNS configuration.",
    url: "/domain",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Domains - Branded Short Links with Your Domain",
    description: "Connect your own domain to FastURL for branded short links.",
    images: ["/og-image.jpg"],
  },
};

export default function DomainLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
