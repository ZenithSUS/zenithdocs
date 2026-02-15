import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  // Core
  title: {
    default: "ZenithDocs — AI-Powered Document Manager",
    template: "%s | ZenithDocs",
  },
  description:
    "ZenithDocs is an AI-powered document manager that helps you organize, search, and collaborate on documents effortlessly. Smarter workflows, faster results.",
  keywords: [
    "AI document manager",
    "document management",
    "AI-powered documents",
    "document organization",
    "smart document search",
    "document collaboration",
    "ZenithDocs",
  ],
  authors: [{ name: "ZenithDocs" }],
  creator: "ZenithDocs",
  publisher: "ZenithDocs",
  category: "Productivity",

  // Canonical & alternates
  alternates: {
    canonical: "/",
  },

  // Open Graph
  openGraph: {
    type: "website",

    siteName: "ZenithDocs",
    title: "ZenithDocs — AI-Powered Document Manager",
    description:
      "Organize, search, and collaborate on documents with the power of AI. ZenithDocs makes document management effortless.",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png", // Place a 1200×630 image at /public/og-image.png
        width: 1200,
        height: 630,
        alt: "ZenithDocs – AI-Powered Document Manager",
      },
    ],
  },

  // Twitter / X Card
  twitter: {
    card: "summary_large_image",
    site: "@zenithdocs", // Replace with your actual handle
    creator: "@zenithdocs",
    title: "ZenithDocs — AI-Powered Document Manager",
    description:
      "Organize, search, and collaborate on documents with the power of AI.",
    images: ["/og-image.png"],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // App / PWA
  applicationName: "ZenithDocs",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ZenithDocs",
  },

  // Icons — add these files to /public
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  // Verification — replace with your actual tokens
  // verification: {
  //   google: "YOUR_GOOGLE_SITE_VERIFICATION_TOKEN",
  //   // yandex: "YOUR_YANDEX_TOKEN",
  //   // bing: "YOUR_BING_TOKEN",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
