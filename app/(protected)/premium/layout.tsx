import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans - Free, Essentials & Pro",
  description: "Choose the right FastURL plan for your needs. Free plan with 100 links/month, Essentials at $1/month with custom domains, or Pro at $3/month with unlimited links and API access.",
  alternates: {
    canonical: "/premium",
  },
  openGraph: {
    title: "FastURL Pricing - Free, Essentials & Pro Plans",
    description: "Choose the right FastURL plan. Free plan with 100 links/month, Essentials at $1/month, or Pro at $3/month with unlimited links.",
    url: "/premium",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FastURL Pricing - Free, Essentials & Pro Plans",
    description: "Choose the right FastURL plan for your needs.",
    images: ["/og-image.jpg"],
  },
};

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
