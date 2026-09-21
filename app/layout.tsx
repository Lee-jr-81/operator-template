import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BUSINESS } from "@/config/business";
import { DASHBOARD_THEME_SCRIPT } from "@/lib/dashboard/theme";
import { brandCssVars, rootSiteMetadata } from "@/lib/site-metadata";
import "./globals.css";

// Clone: swap these next/font imports, then point --font-heading and --font-body
// in app/globals.css at the new CSS variables.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = rootSiteMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={BUSINESS.locale.language}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={brandCssVars()}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: DASHBOARD_THEME_SCRIPT }}
        />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
