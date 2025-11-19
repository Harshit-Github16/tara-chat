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
  metadataBase: new URL('https://tara4u.com'),
  title: {
    default: "Tara - Your AI Mental Health & Wellness Companion | Emotional Support 24/7",
    template: "%s | Tara - Mental Wellness Companion"
  },
  description: "Tara is your personal AI-powered mental health companion. Get 24/7 emotional support, chat with 100+ AI characters, track your mood, journal your thoughts, and receive personalized wellness insights. Start your mental wellness journey today - free to begin.",
  keywords: ["mental health app", "AI therapy", "emotional wellness", "mindfulness app", "mental health support", "AI companion", "mood tracker", "journal app", "therapy chat", "emotional support", "mental wellness", "AI counseling", "stress relief", "anxiety help", "depression support", "tara", "tara4u", "mental health india"],
  authors: [{ name: "Tara Team", url: "https://tara4u.com" }],
  creator: "Tara Team",
  publisher: "Tara",
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
    canonical: 'https://tara4u.com',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tara4u.com",
    siteName: "Tara - Mental Wellness Companion",
    title: "Tara - Your AI Mental Health & Wellness Companion | 24/7 Emotional Support",
    description: "Get personalized mental health support with Tara. Chat with 100+ AI characters, track moods, journal thoughts, and receive wellness insights. Free to start your journey.",
    images: [
      {
        url: "https://tara4u.com/taralogo.jpg",
        width: 1200,
        height: 630,
        alt: "Tara - AI Mental Health & Wellness Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tara - Your AI Mental Health & Wellness Companion",
    description: "Get 24/7 emotional support with Tara. Chat with 100+ AI characters, track moods, and receive personalized wellness insights. Free to start.",
    images: ["https://tara4u.com/taralogo.jpg"],
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
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <StructuredData />

        {/* Favicon Links */}
        <link rel="icon" href="https://d3oodytt0tuddk.cloudfront.net/images/favicon/favicon.ico" />
        <link rel="icon" href="https://d3oodytt0tuddk.cloudfront.net/images/favicon/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="https://d3oodytt0tuddk.cloudfront.net/images/favicon/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="https://d3oodytt0tuddk.cloudfront.net/images/favicon/apple-touch-icon.png" sizes="180x180" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Tara4U" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tara4U" />
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
