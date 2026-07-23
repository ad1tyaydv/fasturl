import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk URL Shortener - Shorten Hundreds of Links at Once",
  description: "Shorten hundreds of URLs simultaneously with FastURL's bulk link shortener. Upload a CSV or paste a list to create short links in seconds.",
  alternates: {
    canonical: "/bulklinks",
  },
  openGraph: {
    title: "Bulk URL Shortener - Shorten Hundreds of Links at Once",
    description: "Shorten hundreds of URLs simultaneously with FastURL's bulk link shortener. Upload a CSV or paste a list.",
    url: "/bulklinks",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk URL Shortener - Shorten Hundreds of Links at Once",
    description: "Shorten hundreds of URLs simultaneously with FastURL's bulk link shortener.",
    images: ["/og-image.jpg"],
  },
};

export default function BulkLinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
