import type { Metadata } from "next";
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

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://linkscope.faizyab.me";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  alternates: { canonical: "/" },
  title: "LinkScope — See how your links look everywhere",
  description: "Inspect, test, and debug how your website links appear across social platforms. Analyze Open Graph, Twitter Card, and SEO metadata with actionable recommendations.",
  keywords: ["link preview", "open graph", "twitter cards", "meta tags", "social media preview", "SEO audit", "metadata inspector"],
  authors: [{ name: "LinkScope" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "LinkScope — See how your links look everywhere",
    description: "Inspect, test, and debug how your website links appear across social platforms.",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og.svg`,
        width: 1200,
        height: 630,
        alt: "LinkScope — See how your links look everywhere",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkScope — See how your links look everywhere",
    description: "Inspect, test, and debug how your website links appear across social platforms.",
    images: [`${baseUrl}/og.svg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
