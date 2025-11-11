import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';
import StructuredData from './components/StructuredData';

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

  manifest: '/site.webmanifest',
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
      </head>
      <body className={`${poppins.variable} antialiased`}>
        <ErrorBoundary>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
