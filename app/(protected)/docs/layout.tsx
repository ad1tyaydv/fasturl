import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FastURL - Professional Link Management",
  description: "Learn how to use FastURL to shorten links, track analytics, manage custom domains, and integrate our developer API. Complete guide to professional link management.",
  keywords: [
    "URL shortener documentation",
    "link analytics guide",
    "custom domain setup",
    "short link API reference",
    "bulk link shortening",
    "QR code tracking",
    "branded links",
    "FastURL help",
    "link management tutorial"
  ],
  openGraph: {
    title: "FastURL Documentation - Mastering Link Management",
    description: "Comprehensive guides and API references for the FastURL link management platform.",
    type: "website",
    url: "https://fasturl.in/docs",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
