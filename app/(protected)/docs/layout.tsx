import { Metadata } from "next";
import DocsClient from "./DocsClient";

export const metadata: Metadata = {
  title: "API Documentation - FastURL Developer Guide",
  description: "Learn how to use FastURL to shorten links, track analytics, manage custom domains, and integrate our developer API. Complete guide to professional link management.",
  alternates: {
    canonical: "/docs",
  },
  openGraph: {
    title: "FastURL API Documentation - Developer Guide",
    description: "Comprehensive guides and API references for the FastURL link management platform.",
    type: "website",
    url: "/docs",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FastURL API Documentation - Developer Guide",
    description: "Comprehensive guides and API references for FastURL.",
    images: ["/og-image.jpg"],
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DocsClient>{children}</DocsClient>;
}
