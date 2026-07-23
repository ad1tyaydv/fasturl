import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - Create Your FastURL Account",
  description:
    "Create a free FastURL account to start shortening URLs, generating QR codes, and tracking link analytics in seconds.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
