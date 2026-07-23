import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - FastURL",
  description:
    "Sign in to your FastURL account to manage shortened URLs, track analytics, and access your link management dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SigninLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
