import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { ConvexClientProvider } from '@/components/ConvexProvider';

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--font-bricolage-grotesque',
  weight: 'variable',
});

export const metadata: Metadata = {
  title: 'Parent Story — Voice journaling into bedtime stories',
  description:
    'Speak about your day and transform moments into gentle bedtime stories.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolageGrotesque.variable} antialiased`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
