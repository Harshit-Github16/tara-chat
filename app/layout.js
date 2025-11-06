import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Tara - AI Mental Health & Wellness Companion",
  description: "Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth. Chat with celebrities, track insights, and build healthy habits.",
  keywords: "mental health, AI companion, wellness, mindfulness, emotional support, therapy, meditation, personal growth, mental wellness, AI chat, celebrity chat, mood tracking, journal, insights",
  authors: [{ name: "Tara Team" }],
  creator: "Tara Team",
  publisher: "Tara",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "Tara",
    title: "Tara - AI Mental Health & Wellness Companion",
    description: "Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth.",
    images: [
      {
        url: "/taralogo.jpg",
        width: 1200,
        height: 630,
        alt: "Tara - AI Mental Health Companion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tara - AI Mental Health & Wellness Companion",
    description: "Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth.",
    images: ["/taralogo.jpg"],
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
