import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator - Create Dynamic QR Codes",
  description: "Generate dynamic QR codes for any URL with FastURL. Update destinations anytime without reprinting. Perfect for print media, packaging, and events.",
  alternates: {
    canonical: "/qr",
  },
  openGraph: {
    title: "QR Code Generator - Create Dynamic QR Codes",
    description: "Generate dynamic QR codes for any URL with FastURL. Update destinations anytime without reprinting.",
    url: "/qr",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Generator - Create Dynamic QR Codes",
    description: "Generate dynamic QR codes for any URL with FastURL.",
    images: ["/og-image.jpg"],
  },
};

export default function QRLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
