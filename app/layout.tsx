import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { UserProvider } from "./components/userContext";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FastURL - Free URL Shortener, Analytics & Branded Links",
    template: "%s | FastURL"
  },
  description: "FastURL is a professional link management platform to shorten URLs, create branded links, generate QR codes, and track real-time analytics. Perfect for marketing, social media, and business insights.",
  keywords: [
    "URL shortener",
    "link shortener",
    "branded links",
    "custom domain shortener",
    "link analytics",
    "QR code generator",
    "bulk link shortening",
    "free url shortener",
    "marketing links",
    "track link clicks"
  ],
  authors: [{ name: "FastURL Team" }],
  creator: "FastURL",
  publisher: "FastURL",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "FastURL - Professional Link Management & Analytics",
    description: "Shorten links, track clicks, and manage your brand with FastURL's advanced link management suite.",
    url: "https://fasturl.in",
    siteName: "FastURL",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "fasturl - Professional Link Management",
    description: "Shorten, track, and manage your links with ease.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
