import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat"
});

export const metadata: Metadata = {
  title: "EJ | Creative Technologist",
  description: "Modern portfolio landing page with interactive 3D background."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${montserrat.variable} bg-surface-900 font-body text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
