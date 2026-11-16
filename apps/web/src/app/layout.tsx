import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'SEWANEXA – Your Local Services, Connected (Nepal)',
  description:
    'Find and hire trusted local plumbers, electricians, mechanics, painters, and technicians in Nepal. Fast nearby booking with eSewa & Khalti support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ne">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mukta:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Google Identity Services (GIS) for Google OAuth One Tap & Button */}
        <script src="https://accounts.google.com/gsi/client" async defer />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

