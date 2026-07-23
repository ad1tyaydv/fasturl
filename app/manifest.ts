import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FastURL - URL Shortener & Link Management",
    short_name: "FastURL",
    description:
      "Professional link management platform to shorten URLs, create branded links, generate QR codes, and track real-time analytics.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1D9BF0",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
