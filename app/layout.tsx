import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { UserProvider } from "./components/userContext";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Generate short links for free, track analytics, and manage your URLs with ease.",
  description: "Generate short links, track analytics, and manage your URLs with ease for free. Fasturl is a powerful URL shortener and link management platform designed for individuals and businesses alike. Create custom short links, monitor real-time analytics, and organize your URLs all in one place. Whether you're a marketer looking to optimize campaigns or just want to share links more efficiently, Fasturl has you covered.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          {children}
          <Toaster theme="light" />
        </UserProvider>
        <Analytics/>
      </body>
    </html>
  );
}
