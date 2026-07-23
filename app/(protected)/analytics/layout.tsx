import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Analytics - Real-Time Click Tracking & Insights",
  description: "Track every click in real-time with FastURL analytics. View geographic data, device types, browsers, referral sources, and unique visitor counts for all your links.",
  alternates: {
    canonical: "/analytics",
  },
  openGraph: {
    title: "Link Analytics - Real-Time Click Tracking & Insights",
    description: "Track every click in real-time with FastURL analytics. View geographic data, device types, browsers, and referral sources.",
    url: "/analytics",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Analytics - Real-Time Click Tracking & Insights",
    description: "Track every click in real-time with FastURL analytics.",
    images: ["/og-image.jpg"],
  },
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
