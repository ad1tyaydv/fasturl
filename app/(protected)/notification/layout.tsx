import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications - FastURL",
  description: "View your FastURL notifications and alerts.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotificationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
