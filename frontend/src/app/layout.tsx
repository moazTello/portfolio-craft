import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});
const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "PortfolioCraft", template: "%s | PortfolioCraft" },
  description:
    "Build your professional portfolio in minutes. No code needed. Share your work, get hired, and grow your freelance business.",
  keywords: [
    "portfolio builder",
    "professional portfolio",
    "free portfolio website",
    "developer portfolio",
    "designer portfolio",
    "freelancer portfolio",
    "portfolio maker",
    "online portfolio",
    "CV website",
    "personal website",
  ],
  metadataBase: new URL("https://www.portfolio-craft.com"),
  authors: [{ name: "PortfolioCraft" }],
  creator: "PortfolioCraft",
  publisher: "PortfolioCraft",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://www.portfolio-craft.com/",
  },
  openGraph: {
    siteName: "PortfolioCraft",
    type: "website",
    url: "https://www.portfolio-craft.com",
    title: "PortfolioCraft — Build your professional portfolio in minutes",
    description:
      "Create a stunning portfolio website in minutes. No code needed. Custom domain, blog, booking system, and more.",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "PortfolioCraft" },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PortfolioCraft — Build your professional portfolio",
    description:
      "Create a stunning portfolio website in minutes. No code needed.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
