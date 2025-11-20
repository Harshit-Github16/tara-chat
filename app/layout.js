import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import StructuredData from './components/StructuredData';
import PWAInstallPrompt from './components/PWAInstallPrompt';

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL('https://www.tara4u.com'),
  title: {
    default: "Tara4u - Your AI Mental Health & Wellness Companion | Emotional Support 24/7",
    template: "%s | Tara4u - Mental Wellness Companion"
  },
  description: "Your AI mental health companion. Get 24/7 emotional support, chat with 100+ AI characters, track moods, and journal thoughts. Free to start.",
  keywords: ["mental health app", "AI therapy", "emotional wellness", "mindfulness app", "mental health support", "AI companion", "mood tracker", "journal app", "therapy chat", "emotional support", "mental wellness", "AI counseling", "stress relief", "anxiety help", "depression support", "tara4u", "tara 4u", "mental health india", "Tara", "AI friend"],
  authors: [{ name: "Tara4u Team", url: "https://www.tara4u.com" }],
  creator: "Tara4u Team",
  publisher: "Tara4u",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  alternates: {
    canonical: 'https://www.tara4u.com',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/taralogo.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/taralogo.jpg', sizes: '16x16', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/taralogo.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/taralogo.jpg',
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.tara4u.com",
    siteName: "Tara4u - Mental Wellness Companion",
    title: "Tara4u - Your AI Mental Health & Wellness Companion | 24/7 Emotional Support",
    description: "Your AI mental health companion. 24/7 emotional support, 100+ AI characters, mood tracking, and journaling. Free to start.",
    images: [
      {
        url: "https://www.tara4u.com/taralogo.jpg",
        width: 1200,
        height: 630,
        alt: "Tara - AI Mental Health & Wellness Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tara4u - Your AI Mental Health & Wellness Companion",
    description: "24/7 AI emotional support. Chat with 100+ characters, track moods, journal thoughts. Free to start.",
    images: ["https://www.tara4u.com/taralogo.jpg"],
    creator: "@tara4u",
    site: "@tara4u",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "1tf2MCcwJHhddK0aBPazdX4QdaHRgyLtWyj7QhsN9gk",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <StructuredData />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Tara4u" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tara4u" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#f43f5e" />
        <link rel="manifest" href="/manifest.json" />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R6HNEYQSP3"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-R6HNEYQSP3');
            `,
          }}
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider>
              {children}
              <PWAInstallPrompt />
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
