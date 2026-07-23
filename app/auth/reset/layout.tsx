import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password - FastURL",
  description:
    "Reset your FastURL account password securely via email verification.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
