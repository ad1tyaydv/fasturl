import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Expired - FastURL",
  description: "This shortened link has expired or reached its click limit.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExpiredLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
