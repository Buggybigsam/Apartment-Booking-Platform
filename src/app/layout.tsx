import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import { Header } from '../components/Header';
import { EmailDrawer } from '../components/EmailDrawer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fieldstay — Apartment Booking Platform MVP',
  description: 'Connect with verified short-term and medium-term rental apartments with guaranteed availability calendars.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950`}>
        <AppProvider>
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <EmailDrawer />
          <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 Fieldstay MVP. Built for seamless apartment rentals & host property management.</p>
              <div className="flex gap-4 text-slate-400 font-mono text-[11px]">
                <span>Status: 99.4% Uptime</span>
                <span>Zero Double-Booking Engine</span>
              </div>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
