import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarbonWise AI | Personal Carbon Footprint Analyzer",
  description:
    "A production-ready SDG 13 dashboard for tracking personal carbon emissions, goals, analytics, and AI eco recommendations."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#071015"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
