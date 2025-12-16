import { Poppins } from "next/font/google";
import "./critical.css";
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import StructuredData from './components/StructuredData';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import MobileOptimizer from './components/MobileOptimizer';
import ExitIntent from './components/ExitIntent';
import { Analytics } from "@vercel/analytics/react";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata = {
  metadataBase: new URL('https://www.tara4u.com'),
  title: {
    default: "AI Chatbot for Stress, Anxiety, Depression Signs & Mental Health Support | Tara4u",
    template: "%s | Tara4u - Mental Wellness Companion"
  },
  description: "Talk to Tara4u, an AI chatbot designed for mental health support, stress relief, depression signs, burnout and anxiety help. Start chatting now.",
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
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-icon.png',
      },
      {
        rel: 'mask-icon',
        url: '/icon-512x512.png',
        color: '#f43f5e',
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.tara4u.com",
    siteName: "Tara4u - Mental Wellness Companion",
    title: "AI Chatbot for Stress, Anxiety, Depression Signs & Mental Health Support | Tara4u",
    description: "Talk to Tara4u, an AI chatbot designed for mental health support, stress relief, depression signs, burnout and anxiety help. Start chatting now.",
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
    title: "AI Chatbot for Stress, Anxiety, Depression Signs & Mental Health Support | Tara4u",
    description: "Talk to Tara4u, an AI chatbot designed for mental health support, stress relief, depression signs, burnout and anxiety help. Start chatting now.",
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

        {/* Favicon and Icons */}
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512x512.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/icon-512x512.png" color="#f43f5e" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Tara4u" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tara4u" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#f43f5e" />
        <meta name="msapplication-TileColor" content="#f43f5e" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <link rel="manifest" href="/manifest.json" />
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />

        {/* Preload critical assets */}
        <link rel="preload" href="/taralogo.avif" as="image" type="image/avif" />
        <link rel="preload" href="/taralogo.webp" as="image" type="image/webp" />

        {/* Google Analytics - Deferred */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-R6HNEYQSP3"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-R6HNEYQSP3', {
                'send_page_view': false
              });
              window.addEventListener('load', function() {
                gtag('event', 'page_view');
              });
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
              <MobileOptimizer />
              {children}
              <PWAInstallPrompt />
              <ExitIntent />
              <Analytics />
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
