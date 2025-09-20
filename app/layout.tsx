import type { Metadata } from "next";
import { Inter, Rubik, Grandstander } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800","900"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300","400","500","600","700","800","900"],
});

const grandstander = Grandstander({
  variable: "--font-grandstander",
  subsets: ["latin"],
  weight: ["400","500","600","700","800","900"],
});

export const metadata: Metadata = {
  title: "Parent Story — Calm journaling & story creation",
  description: "Reflect on your day and transform moments into gentle bedtime stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${rubik.variable} ${grandstander.variable} antialiased`}>
        <div className="relative min-h-screen">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </div>
      </body>
    </html>
  );
}
