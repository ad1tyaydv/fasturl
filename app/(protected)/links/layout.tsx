import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Links - Manage Your Shortened URLs",
  description: "View, edit, and manage all your shortened URLs in one place. Track click performance, update destinations, and organize your links with FastURL.",
  alternates: {
    canonical: "/links",
  },
  openGraph: {
    title: "My Links - Manage Your Shortened URLs",
    description: "View, edit, and manage all your shortened URLs in one place. Track click performance and organize your links with FastURL.",
    url: "/links",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Links - Manage Your Shortened URLs",
    description: "View, edit, and manage all your shortened URLs in one place.",
    images: ["/og-image.jpg"],
  },
};

export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
