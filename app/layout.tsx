import type { Metadata } from "next";
import { Geist, Geist_Mono, Public_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://linkscope.faizyab.me";

export const metadata: Metadata = {
  title: "LinkScope — See how your links look everywhere",
  description: "Inspect, test, and debug how your website links appear across social platforms. Analyze Open Graph, Twitter Card, and SEO metadata with actionable recommendations.",
  keywords: ["link preview", "open graph", "twitter cards", "meta tags", "social media preview", "SEO audit", "metadata inspector"],
  authors: [{ name: "LinkScope" }],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "LinkScope — See how your links look everywhere",
    description: "Inspect, test, and debug how your website links appear across social platforms.",
    type: "website",
    images: [
      {
        url: `${baseUrl}/og.png`,
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
    images: [`${baseUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${publicSans.variable} dark`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
