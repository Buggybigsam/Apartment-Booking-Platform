import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { SessionProvider } from 'next-auth/react';
import './globals.css';

const bricolage = localFont({
  src: [
    { path: './fonts/BricolageGrotesque-Regular.woff2', weight: '400' },
    { path: './fonts/BricolageGrotesque-SemiBold.woff2', weight: '600' },
    { path: './fonts/BricolageGrotesque-Bold.woff2', weight: '700' },
  ],
  variable: '--font-display',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Fieldstay — A field guide to places worth staying',
  description: 'Book distinctive stays, documented like specimens.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}