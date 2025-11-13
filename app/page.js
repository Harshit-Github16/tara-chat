"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faBookOpen,
  faUserAstronaut,
  faHeart,
  faChartLine,
  faShield,
  faMobile,
  faArrowRight,
  faPlay,
  faCheck,
  faStar,
  faQuoteLeft,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faCalendarAlt,
  faUser,
  faPaperPlane,

  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faApple, faTwitter, faLinkedin, faInstagram, faFacebook, faWhatsapp, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import FAQSchema, { COMMON_FAQS } from "./components/FAQSchema";
// import Footer from "./components/Footer";
import Head from "next/head";
export default function Home() {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [activeSection, setActiveSection] = useState('home');

  // Handle PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'how-it-works', 'testimonials'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>

        <title>Tara - AI Mental Health & Wellness Companion | Emotional Support Chat</title>

        <meta name="description" content="Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth. Chat with 100+ AI characters, track moods, and build healthy habits." />

        <meta name="keywords" content="mental health app, AI companion, emotional wellness, mindfulness, therapy chat, mood tracking, journal app, personal growth, mental wellness, AI therapy, celebrity chat, emotional support" />

        <link rel="canonical" href="https://yourdomain.com" />

        <meta property="og:title" content="Tara - AI Mental Health & Wellness Companion" />

        <meta property="og:description" content="Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth." />

        <meta property="og:type" content="website" />

        <meta property="og:url" content="https://yourdomain.com" />

        <meta property="og:image" content="https://yourdomain.com/taralogo.jpg" />

        <script

          type="application/ld+json"

          dangerouslySetInnerHTML={{

            __html: JSON.stringify({

              "@context": "https://schema.org",

              "@type": "WebSite",

              "name": "Tara",

              "url": "https://yourdomain.com",

              "description": "AI-powered mental health and wellness companion",

              "potentialAction": {

                "@type": "SearchAction",

                "target": "https://yourdomain.com/search?q={search_term_string}",

                "query-input": "required name=search_term_string"

              }

            })

          }}

        />

      </Head>
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo - Left */}
          <div className="flex items-center gap-2">
            <Image
              src="/taralogo.jpg"
              alt="Tara Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              priority
            />
            <span className="text-xl font-bold text-rose-600">Tara</span>
          </div>

          {/* Navigation Menu - Center */}
          <nav className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            <a
              href="#home"
              className={`text-sm font-medium transition-all duration-300 ${activeSection === 'home'
                ? 'text-rose-600 font-semibold'
                : 'text-gray-700 hover:text-rose-600'
                }`}
            >
              Home
            </a>
            <a
              href="#features"
              className={`text-sm font-medium transition-all duration-300 ${activeSection === 'features'
                ? 'text-rose-600 font-semibold'
                : 'text-gray-700 hover:text-rose-600'
                }`}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className={`text-sm font-medium transition-all duration-300 ${activeSection === 'how-it-works'
                ? 'text-rose-600 font-semibold'
                : 'text-gray-700 hover:text-rose-600'
                }`}
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className={`text-sm font-medium transition-all duration-300 ${activeSection === 'testimonials'
                ? 'text-rose-600 font-semibold'
                : 'text-gray-700 hover:text-rose-600'
                }`}
            >
              Testimonials
            </a>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-3">
            {/* Install App Button */}
            {showInstallPrompt && (
              <button
                onClick={handleInstall}
                className="hidden sm:flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-all"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Install App
              </button>
            )}

            <Link
              href="/login"
              className="btn-shine rounded-full bg-rose-200 px-5 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header >

      <main>
        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden bg-gradient-to-br from-rose-50/50 via-white to-rose-50/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.05),transparent_50%)]"></div>

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                {/* <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 mb-4">
                  <span className="font-bold">TARA</span> = Talk, Align, Reflect, Act
                </div> */}
                <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  Talk
                  <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent"> Heal </span>
                  Grow
                </h1>
                <h2 className="text-2xl font-semibold ">
                  Your Personal Emotional Wellness Companion


                </h2>
                <p className="mt-6 text-lg text-gray-600 sm:text-xl">
                  Connect with 100+ AI characters, track your moods, journal your thoughts,
                  and get personalized insights for better emotional health.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/login"
                    className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-rose-200 px-8 py-4 text-base font-semibold text-rose-700 shadow-lg hover:bg-rose-300 transition-all"
                  >Get Started
                    <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  {/* <Link
                    href="#demo"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 px-8 py-4 text-base font-medium text-rose-600 hover:bg-rose-200 transition-all"
                  >
                    <FontAwesomeIcon icon={faPlay} className="h-4 w-4" />
                    Watch Demo
                  </Link> */}
                </div>

              </div>

              <div className="relative">
                <div className="relative rounded-3xl border border-rose-100 bg-white p-6 sm:p-8 shadow-2xl w-full max-w-full lg:min-w-[500px]">
                  <div className="grid grid-cols-2 gap-4">
                    <FeaturePreview icon={faComments} title="Emotional Chat" desc="Express & reflect" />
                    <FeaturePreview icon={faBookOpen} title="Smart Journaling" desc="Guided insights" />
                    <FeaturePreview icon={faChartLine} title="Mood Analytics" desc="Track progress" />
                    <FeaturePreview icon={faUserAstronaut} title="100+ Characters" desc="Find your guide" />
                  </div>
                  <div className="mt-6 rounded-2xl bg-rose-200 p-4">
                    <div className="flex items-center gap-3">

                      <div>
                        <div className="text-sm font-semibold text-gray-900">Life Coach</div>
                        <div className="text-xs text-gray-600">Ready to unlock your potential? Let's grow together! 🚀</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 lg:justify-start">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <FontAwesomeIcon icon={faCheck} className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500 flex-shrink-0" />
                      <span className="whitespace-nowrap">Free to start</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <FontAwesomeIcon icon={faCheck} className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500 flex-shrink-0" />
                      <span className="whitespace-nowrap">End-to-End Encryption</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <FontAwesomeIcon icon={faCheck} className="h-3 w-3 sm:h-4 sm:w-4 text-rose-500 flex-shrink-0" />
                      <span className="whitespace-nowrap">Non-Judgmental</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-rose-200 opacity-20"></div>

                <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-rose-200 opacity-30"></div>
              </div>

            </div>
          </div>

        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Everything you need for emotional wellness
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Comprehensive tools designed to support your mental health journey
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={faComments}
                title="AI Emotional Chat"
                description="Connect with 100+ unique AI characters, each designed to provide different types of emotional support and guidance."
                features={["Personalized conversations", "24/7 availability", "Multiple personality types"]}
              />
              <FeatureCard
                icon={faBookOpen}
                title="Smart Journaling"
                description="Guided journaling with AI-powered prompts and insights to help you process emotions and track growth."
                features={["Daily prompts", "Mood tracking", "Progress insights"]}
              />
              <FeatureCard
                icon={faChartLine}
                title="Emotional Analytics"
                description="Visualize your emotional patterns with beautiful charts and get personalized recommendations."
                features={["Mood trends", "Trigger analysis", "Recovery insights"]}
              />
              <FeatureCard
                icon={faHeart}
                title="Wellness Tracking"
                description="Monitor your emotional health with streak tracking, mood meters, and wellness goals."
                features={["Daily check-ins", "Streak rewards", "Goal setting"]}
              />
              <FeatureCard
                icon={faShield}
                title="Privacy First"
                description="Your emotional data is encrypted and private. We never share your personal information."
                features={["End-to-end encryption", "Local storage", "GDPR compliant"]}
              />
              <FeatureCard
                icon={faMobile}
                title="Cross Platform"
                description="Access your emotional wellness tools anywhere with our responsive web app and mobile support."
                features={["Web app", "Mobile optimized", "Offline support"]}
              />
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(244,63,94,0.05),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(244,63,94,0.03),transparent_50%)]"></div>

          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-4 py-2 text-sm font-medium text-rose-700 mb-6">
                <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
                Simple & Effective
              </div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                How Tara works
              </h2>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Transform your emotional wellness in just three simple steps. Our AI-powered platform makes mental health support accessible and personalized.
              </p>
            </div>

            <div className="mt-20 relative">
              {/* Connection lines for desktop */}
              <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
                <svg className="w-full h-8" viewBox="0 0 800 32" fill="none">
                  <path
                    d="M100 16 L350 16 M450 16 L700 16"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="8 8"
                    className="animate-pulse"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
                      <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8 items-stretch">
                <EnhancedStepCard
                  step="1"
                  title="Check In Daily"
                  description="Start your day with a personalized mood check-in. Our AI analyzes your emotional patterns and provides gentle guidance for better mental wellness."
                  icon={faHeart}
                  features={["Quick 2-minute check-ins", "Mood pattern recognition", "Personalized insights"]}
                  color="indigo"
                />
                <EnhancedStepCard
                  step="2"
                  title="Chat & Journal"
                  description="Connect with AI companions or express yourself through guided journaling. Process emotions in a safe, supportive environment designed for growth."
                  icon={faComments}
                  features={["100+ AI characters", "Guided prompts", "Private & secure"]}
                  color="indigo"
                />
                <EnhancedStepCard
                  step="3"
                  title="Track & Grow"
                  description="Visualize your emotional journey with beautiful analytics. Celebrate progress and identify areas for growth with detailed insights and recommendations."
                  icon={faChartLine}
                  features={["Progress visualization", "Growth insights", "Achievement tracking"]}
                  color="indigo"
                />
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-4 rounded-2xl bg-white border border-rose-100 p-6 shadow-lg">
                <div className="flex -space-x-2">
                  <div className="h-10 w-10 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center text-rose-700 font-semibold text-sm">SJ</div>
                  <div className="h-10 w-10 rounded-full bg-rose-200 border-2 border-white flex items-center justify-center text-rose-700 font-semibold text-sm">MC</div>
                  <div className="h-10 w-10 rounded-full bg-rose-300 border-2 border-white flex items-center justify-center text-rose-800 font-semibold text-sm">ER</div>
                  <div className="h-10 w-10 rounded-full bg-rose-300 border-2 border-white flex items-center justify-center text-rose-800 font-semibold text-sm">+5K</div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Join 10,000+ users already improving their wellness</p>
                  <p className="text-xs text-gray-600">Start your journey today - it's free!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-gradient-to-br from-white via-rose-50/20 to-white relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.03),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.02),transparent_70%)]"></div>

          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 mb-6">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                Live Statistics
              </div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                Trusted by thousands
              </h2>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Join a growing community of people who have transformed their emotional wellness with Tara
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8">
                <EnhancedStatCard
                  number="10K+"
                  label="Active Users"
                  description="Growing daily"
                  icon={faHeart}
                  trend="+23%"
                />
                <EnhancedStatCard
                  number="100+"
                  label="AI Characters"
                  description="Unique personalities"
                  icon={faUserAstronaut}
                  trend="New weekly"
                />
                <EnhancedStatCard
                  number="50K+"
                  label="Journal Entries"
                  description="Written this month"
                  icon={faBookOpen}
                  trend="+156%"
                />
                <EnhancedStatCard
                  number="4.9★"
                  label="User Rating"
                  description="From 2,000+ reviews"
                  icon={faStar}
                  trend="Excellent"
                />
              </div>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <TrustIndicator
                icon={faShield}
                title="Privacy Protected"
                description="End-to-end encryption keeps your data secure"
                badge="GDPR Compliant"
              />
              <TrustIndicator
                icon={faUserAstronaut}
                title="AI-Powered Support"
                description="Advanced AI technology provides personalized emotional guidance 24/7"
                badge="Always Available"
              />
              <TrustIndicator
                icon={faChartLine}
                title="Proven Results"
                description="87% of users report improved emotional wellness"
                badge="Research Backed"
              />
            </div>

            {/* Social proof avatars */}
            <div className="mt-12 text-center">
              <div className="flex justify-center items-center gap-4 mb-4">
                <div className="flex -space-x-3">
                  {['SJ', 'MC', 'ER', 'DK', 'LT', 'AM', 'JS', 'KP'].map((initials, index) => (
                    <div
                      key={initials}
                      className={`h-12 w-12 rounded-full border-3 border-white flex items-center justify-center text-white font-semibold text-sm shadow-lg ${index % 4 === 0 ? 'bg-rose-400' :
                        index % 4 === 1 ? 'bg-rose-400' :
                          index % 4 === 2 ? 'bg-rose-500' : 'bg-rose-500'
                        }`}
                      style={{ zIndex: 10 - index }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900">Real people, real results</p>
                  <p className="text-xs text-gray-600">Join our community today</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-20 bg-gradient-to-br from-rose-50/30 to-white overflow-hidden relative" id="testimonials">
          {/* Header with container */}
          <div className="mx-auto max-w-7xl px-6 mb-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                What our users say
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Real stories from people who transformed their emotional wellness with Tara
              </p>
            </div>
          </div>

          {/* Full width slider */}
          <div className="space-y-8">
            {/* First Row - Left to Right */}
            <div className="relative overflow-hidden w-full">
              <div className="flex gap-6 animate-infinite-scroll-left">
                <ReviewCard
                  name="Priya Sharma"
                  role="Marketing Manager"
                  rating={5}
                  review="Tara ne meri stress handle karne ki tarika hi badal diya. AI characters bahut real aur supportive lagte hain. Mood tracking feature toh kamaal ka hai!"
                  avatar="PS"
                />
                <ReviewCard
                  name="Rahul Verma"
                  role="Software Developer"
                  rating={5}
                  review="Anxiety ke saath struggle karte hue, Tara ke journaling prompts ne meri life change kar di. Insights se mujhe apne patterns samajhne mein madad milti hai."
                  avatar="RV"
                />
                <ReviewCard
                  name="Anjali Patel"
                  role="Teacher"
                  rating={5}
                  review="AI characters ki variety se mujhe hamesha koi na koi mil jata hai jo mujhe samajhta hai. Yeh 24/7 available therapist jaisa hai!"
                  avatar="AP"
                />
                {/* Multiple duplicates for seamless infinite loop */}
                <ReviewCard
                  name="Priya Sharma"
                  role="Marketing Manager"
                  rating={5}
                  review="Tara ne meri stress handle karne ki tarika hi badal diya. AI characters bahut real aur supportive lagte hain. Mood tracking feature toh kamaal ka hai!"
                  avatar="PS"
                />
                <ReviewCard
                  name="Rahul Verma"
                  role="Software Developer"
                  rating={5}
                  review="Anxiety ke saath struggle karte hue, Tara ke journaling prompts ne meri life change kar di. Insights se mujhe apne patterns samajhne mein madad milti hai."
                  avatar="RV"
                />
                <ReviewCard
                  name="Anjali Patel"
                  role="Teacher"
                  rating={5}
                  review="AI characters ki variety se mujhe hamesha koi na koi mil jata hai jo mujhe samajhta hai. Yeh 24/7 available therapist jaisa hai!"
                  avatar="AP"
                />
                <ReviewCard
                  name="Priya Sharma"
                  role="Marketing Manager"
                  rating={5}
                  review="Tara ne meri stress handle karne ki tarika hi badal diya. AI characters bahut real aur supportive lagte hain. Mood tracking feature toh kamaal ka hai!"
                  avatar="PS"
                />
                <ReviewCard
                  name="Rahul Verma"
                  role="Software Developer"
                  rating={5}
                  review="Anxiety ke saath struggle karte hue, Tara ke journaling prompts ne meri life change kar di. Insights se mujhe apne patterns samajhne mein madad milti hai."
                  avatar="RV"
                />
                <ReviewCard
                  name="Anjali Patel"
                  role="Teacher"
                  rating={5}
                  review="AI characters ki variety se mujhe hamesha koi na koi mil jata hai jo mujhe samajhta hai. Yeh 24/7 available therapist jaisa hai!"
                  avatar="AP"
                />
              </div>
            </div>

            {/* Second Row - Right to Left */}
            <div className="relative overflow-hidden w-full pb-2">
              <div className="flex gap-6 animate-infinite-scroll-right">
                <ReviewCard
                  name="Vikram Singh"
                  role="Entrepreneur"
                  rating={5}
                  review="Analytics dashboard toh kamaal ka hai! Apne emotional patterns ko visualize karke mental health ke better decisions le pata hoon."
                  avatar="VS"
                />
                <ReviewCard
                  name="Sneha Reddy"
                  role="Nurse"
                  rating={5}
                  review="Healthcare mein kaam karna emotionally demanding hai. Tara mujhe difficult days process karne mein help karta hai. Privacy features se peace of mind milta hai."
                  avatar="SR"
                />
                <ReviewCard
                  name="Arjun Mehta"
                  role="Student"
                  rating={5}
                  review="College overwhelming ho sakta hai, lekin Tara ke daily check-ins aur mood tracking se balanced rehta hoon. AI characters supportive friends jaise hain!"
                  avatar="AM"
                />
                {/* Multiple duplicates for seamless infinite loop */}
                <ReviewCard
                  name="Vikram Singh"
                  role="Entrepreneur"
                  rating={5}
                  review="Analytics dashboard toh kamaal ka hai! Apne emotional patterns ko visualize karke mental health ke better decisions le pata hoon."
                  avatar="VS"
                />
                <ReviewCard
                  name="Sneha Reddy"
                  role="Nurse"
                  rating={5}
                  review="Healthcare mein kaam karna emotionally demanding hai. Tara mujhe difficult days process karne mein help karta hai. Privacy features se peace of mind milta hai."
                  avatar="SR"
                />
                <ReviewCard
                  name="Arjun Mehta"
                  role="Student"
                  rating={5}
                  review="College overwhelming ho sakta hai, lekin Tara ke daily check-ins aur mood tracking se balanced rehta hoon. AI characters supportive friends jaise hain!"
                  avatar="AM"
                />
                <ReviewCard
                  name="Vikram Singh"
                  role="Entrepreneur"
                  rating={5}
                  review="Analytics dashboard toh kamaal ka hai! Apne emotional patterns ko visualize karke mental health ke better decisions le pata hoon."
                  avatar="VS"
                />
                <ReviewCard
                  name="Sneha Reddy"
                  role="Nurse"
                  rating={5}
                  review="Healthcare mein kaam karna emotionally demanding hai. Tara mujhe difficult days process karne mein help karta hai. Privacy features se peace of mind milta hai."
                  avatar="SR"
                />
                <ReviewCard
                  name="Arjun Mehta"
                  role="Student"
                  rating={5}
                  review="College overwhelming ho sakta hai, lekin Tara ke daily check-ins aur mood tracking se balanced rehta hoon. AI characters supportive friends jaise hain!"
                  avatar="AM"
                />
              </div>
            </div>
          </div>

          {/* Custom CSS for animations */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes infinite-scroll-left {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(calc(-100% / 3));
                }
              }

              @keyframes infinite-scroll-right {
                0% {
                  transform: translateX(calc(-100% / 3));
                }
                100% {
                  transform: translateX(0);
                }
              }

              .animate-infinite-scroll-left {
                animation: infinite-scroll-left 30s linear infinite;
                width: max-content;
                will-change: transform;
              }

              .animate-infinite-scroll-right {
                animation: infinite-scroll-right 30s linear infinite;
                width: max-content;
                will-change: transform;
              }

              /* Disable animations on mobile for better performance */
              @media (max-width: 768px) {
                .animate-infinite-scroll-left,
                .animate-infinite-scroll-right {
                  animation: none;
                  overflow-x: auto;
                  scroll-snap-type: x mandatory;
                  -webkit-overflow-scrolling: touch;
                }
              }

              .animate-infinite-scroll-left:hover,
              .animate-infinite-scroll-right:hover {
                animation-play-state: paused;
              }

              @media (prefers-reduced-motion: reduce) {
                .animate-infinite-scroll-left,
                .animate-infinite-scroll-right {
                  animation: none;
                }
              }y-state: paused;
              }
            `
          }} />
        </section>

        {/* Why Choose Tara */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Why choose Tara for your emotional wellness?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We're more than just an app - we're your partner in emotional growth
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
              <div>
                <div className="space-y-8">
                  <BenefitItem
                    icon={faHeart}
                    title="Scientifically Backed"
                    description="Our approach is based on proven psychological principles and cognitive behavioral therapy techniques."
                  />
                  <BenefitItem
                    icon={faShield}
                    title="Complete Privacy"
                    description="Your emotional data stays private with end-to-end encryption. We never share or sell your information."
                  />
                  <BenefitItem
                    icon={faUserAstronaut}
                    title="Personalized Experience"
                    description="AI learns your preferences and adapts to provide increasingly personalized support over time."
                  />
                  <BenefitItem
                    icon={faChartLine}
                    title="Track Real Progress"
                    description="See measurable improvements in your emotional wellness with detailed analytics and insights."
                  />
                </div>
              </div>
              <div className="relative">
                <div className="rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-8 shadow-xl">
                  <div className="text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-rose-200 flex items-center justify-center mb-6">
                      <FontAwesomeIcon icon={faHeart} className="h-10 w-10 text-rose-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Start Your Journey Today</h3>
                    <p className="text-gray-600 mb-6">Join thousands who have already improved their emotional wellness</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} className="h-5 w-5 text-yellow-400" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">4.9/5 from 2,000+ reviews</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section with Auto Slider */}
        <section className="py-20 bg-gradient-to-br from-rose-100/30 to-rose-50/30 overflow-hidden">
          <div className="mx-auto max-w-full px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Latest from our blog
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Expert insights and tips for better emotional wellness
              </p>
            </div>

            <div className="mt-16 relative ">
              <div className="overflow-hidden">
                <div className="flex gap-6 animate-blog-slider">
                  <BlogCard
                    title="5 Daily Habits for Better Emotional Health"
                    excerpt="Discover simple yet powerful daily practices that can significantly improve your emotional well-being and resilience."
                    date="Nov 1, 2024"
                    readTime="5 min read"
                    category="Wellness Tips"
                  />
                  <BlogCard
                    title="Understanding Your Emotional Patterns"
                    excerpt="Learn how to identify and break negative emotional cycles using data-driven insights and mindful awareness."
                    date="Oct 28, 2024"
                    readTime="7 min read"
                    category="Psychology"
                  />
                  <BlogCard
                    title="The Science Behind AI Emotional Support"
                    excerpt="Explore how artificial intelligence is revolutionizing mental health support and what makes it so effective."
                    date="Oct 25, 2024"
                    readTime="6 min read"
                    category="Technology"
                  />
                  <BlogCard
                    title="Mindfulness Techniques for Daily Life"
                    excerpt="Simple mindfulness practices you can incorporate into your daily routine to reduce stress and improve mental clarity."
                    date="Oct 20, 2024"
                    readTime="4 min read"
                    category="Mindfulness"
                  />
                  {/* Duplicate for seamless loop */}
                  <BlogCard
                    title="5 Daily Habits for Better Emotional Health"
                    excerpt="Discover simple yet powerful daily practices that can significantly improve your emotional well-being and resilience."
                    date="Nov 1, 2024"
                    readTime="5 min read"
                    category="Wellness Tips"
                  />
                  <BlogCard
                    title="Understanding Your Emotional Patterns"
                    excerpt="Learn how to identify and break negative emotional cycles using data-driven insights and mindful awareness."
                    date="Oct 28, 2024"
                    readTime="7 min read"
                    category="Psychology"
                  />
                  <BlogCard
                    title="The Science Behind AI Emotional Support"
                    excerpt="Explore how artificial intelligence is revolutionizing mental health support and what makes it so effective."
                    date="Oct 25, 2024"
                    readTime="6 min read"
                    category="Technology"
                  />
                  <BlogCard
                    title="Mindfulness Techniques for Daily Life"
                    excerpt="Simple mindfulness practices you can incorporate into your daily routine to reduce stress and improve mental clarity."
                    date="Oct 20, 2024"
                    readTime="4 min read"
                    category="Mindfulness"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-6 py-3 text-sm font-medium text-rose-600 hover:bg-rose-200 transition-all"
                >
                  View All Articles
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Blog Slider Animation CSS */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes blog-slider {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }

              .animate-blog-slider {
                animation: blog-slider 40s linear infinite;
                width: max-content;
                will-change: transform;
              }

              /* Disable blog slider animation on mobile */
              @media (max-width: 768px) {
                .animate-blog-slider {
                  animation: none;
                  overflow-x: auto;
                  scroll-snap-type: x mandatory;
                  -webkit-overflow-scrolling: touch;
                }
              }

              .animate-blog-slider:hover {
                animation-play-state: paused;
              }

              @media (prefers-reduced-motion: reduce) {
                .animate-blog-slider {
                  animation: none;
                }
              }
            `
          }} />
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-20 bg-gradient-to-br from-rose-50/20 to-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Everything you need to know about Tara and emotional wellness
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
              {/* Left Side - FAQ Image */}
              <div className="relative">
                <div className="sticky top-8">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                    <Image
                      src="/faqimg.jpg"
                      alt="FAQ - Mental Health Support"
                      width={600}
                      height={700}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-300/20 to-transparent"></div>

                    {/* Overlay Content */}
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          Need More Help?
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          Can't find what you're looking for? Our support team is here to help you 24/7.
                        </p>
                        <Link
                          href="#contact"
                          className=" btn-shine inline-flex items-center gap-2 bg-rose-200 text-rose-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-rose-300 transition-colors"
                        >
                          Contact Support
                          <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-rose-200 rounded-full opacity-20"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-rose-300 rounded-full opacity-30"></div>
                </div>
              </div>

              {/* Right Side - FAQ Accordion */}
              <div>
                <FAQAccordion faqs={COMMON_FAQS} />
              </div>
            </div>
          </div>
        </section>



        {/* CTA Section */}
        <section className="relative py-20 bg-gradient-to-br from-rose-100 via-rose-50 to-white overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.1),transparent_50%)]"></div>

          <div className="relative mx-auto max-w-5xl px-6">
            <div className="rounded-3xl border border-rose-200 bg-white/80 backdrop-blur-sm p-12 shadow-2xl">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 mb-6">
                  <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
                  Start Your Journey Today
                </div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                  Ready to start your emotional wellness journey?
                </h2>
                <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                  Join thousands of users who are already improving their emotional health with Tara.
                  Begin your transformation today - it's free to start!
                </p>

                {/* <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Link
                    href="/login"
                    className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-rose-200 px-10 py-5 text-lg font-semibold text-rose-700 shadow-lg hover:bg-rose-300 hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
                    Continue with Google
                    <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>


                  <div className="relative inline-block">
              
                    <span className="absolute -top-2 -right-2 rounded-full bg-rose-600 text-white text-xs font-semibold px-2 py-0.5 shadow-md z-10">
                      Coming Soon
                    </span>

                    <Link
                      href="/login"
                      className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full border-2 border-rose-200 bg-white px-10 py-5 text-lg font-semibold text-rose-600 hover:bg-rose-50 transition-all transform hover:scale-105"
                    >
                      <FontAwesomeIcon icon={faApple} className="h-5 w-5" />
                      Continue with Apple
                    </Link>
                  </div>
                </div> */}
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  {/* Google Button */}
                  <Link
                    href="/login"
                    className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-rose-200 md:px-6 py-3 sm:px-10 sm:py-5 text-base sm:text-lg font-semibold text-rose-700 shadow-lg hover:bg-rose-300 hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
                    Continue with Google
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  {/* Apple Button with Coming Soon Tag */}
                  <div className="relative inline-block w-full sm:w-auto">
                    {/* Coming Soon Tag */}
                    <span className="absolute -top-2 -right-2 rounded-full bg-rose-600 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 shadow-md z-10">
                      Coming Soon
                    </span>

                    <Link
                      href="/login"
                      className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full border-2 border-rose-200 bg-white px-6 py-3 sm:px-10 sm:py-5 text-base sm:text-lg font-semibold text-rose-600 hover:bg-rose-50 transition-all transform hover:scale-105 w-full sm:w-auto"
                    >
                      <FontAwesomeIcon icon={faApple} className="h-5 w-5" />
                      Continue with Apple
                    </Link>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500" />
                    Free to start
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500" />
                    End-to-End Encryption
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-green-500" />
                    Cancel anytime
                  </div>
                </div>


                <div className="mt-10 pt-8 border-t border-rose-100">
                  <div className="flex items-center justify-center gap-8 flex-wrap">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">10K+</div>
                      <div className="text-xs text-gray-600">Active Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">4.9★</div>
                      <div className="text-xs text-gray-600">User Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">100+</div>
                      <div className="text-xs text-gray-600">AI Characters</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">24/7</div>
                      <div className="text-xs text-gray-600">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Contact Form */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  Get in touch
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Have questions about Tara? We'd love to hear from you. Send us a message or connect with us on social media.
                </p>

                <div className="mt-8 space-y-6">
                  <ContactInfo
                    icon={faEnvelope}
                    title="Email us"
                    info="hello@tara4u.com"
                    description="We'll get back to you within 24 hours"
                  />

                  {/* Social Media Section */}
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect with us</h3>
                    <div className="flex gap-3">
                      <a
                        href="https://twitter.com/tara4u_official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 hover:bg-rose-200 transition-all"
                        aria-label="Twitter/X"
                      >
                        <FontAwesomeIcon icon={faXTwitter} className="h-6 w-6" />
                      </a>

                      <a
                        href="https://www.linkedin.com/company/tara4u"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 hover:bg-rose-200 transition-all"
                        aria-label="LinkedIn"
                      >
                        <FontAwesomeIcon icon={faLinkedin} className="h-6 w-6" />
                      </a>

                      <a
                        href="https://www.instagram.com/tara4u.official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 hover:bg-rose-200 transition-all"
                        aria-label="Instagram"
                      >
                        <FontAwesomeIcon icon={faInstagram} className="h-6 w-6" />
                      </a>

                      <a
                        href="https://www.facebook.com/tara4u.official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 hover:bg-rose-200 transition-all"
                        aria-label="Facebook"
                      >
                        <FontAwesomeIcon icon={faFacebook} className="h-6 w-6" />
                      </a>

                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 hover:bg-rose-200 transition-all"
                        aria-label="WhatsApp"
                      >
                        <FontAwesomeIcon icon={faWhatsapp} className="h-6 w-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-rose-100 bg-white p-8 shadow-lg">
                <form
                  action="mailto:hello@tara4u.com"
                  method="POST"
                  encType="text/plain"
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        placeholder="Doe"
                      // required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                      placeholder="Tell us more about your question or feedback..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className=" btn-shine w-full inline-flex items-center justify-center gap-2 rounded-lg bg-rose-200 px-6 py-3 text-base font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20 border-t border-rose-100">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/taralogo.jpg"
                  alt="Tara Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                  loading="lazy"
                />
                <span className="text-xl font-bold text-rose-600">Tara</span>
              </div>
              <p className="text-gray-600 mb-4 text-sm">
                Your personal emotional Well being companion.
              </p>
              <div className="flex space-x-3">
                <LightSocialLink icon={faTwitter} href="#" />
                <LightSocialLink icon={faLinkedin} href="#" />
                <LightSocialLink icon={faInstagram} href="#" />
                <LightSocialLink icon={faFacebook} href="#" />
                <LightSocialLink icon={faWhatsapp} href="#" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <LightFooterLink href="#features" text="Features" />
                <LightFooterLink href="#how-it-works" text="How it Works" />
                <LightFooterLink href="/blog" text="Blog" />
                <LightFooterLink href="/about" text="About Us" />


              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Others</h3>
              <ul className="space-y-2 text-sm">
                <LightFooterLink href="/contact" text="Contact Us" />

                <LightFooterLink href="/privacy-policy" text="Privacy Policy" />
                <LightFooterLink href="/terms-of-service" text="Terms of Service" />
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-6 border-t border-rose-100 pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>© 2025 Tara. All rights reserved.</span>
            </div>
            <div className="text-sm text-gray-500">
              <span>Made with ❤️ for better mental Well being</span>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}

function FeaturePreview({ icon, title, desc }) {
  return (
    <div className="rounded-xl border border-rose-100 p-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-200 text-rose-600">
          <FontAwesomeIcon icon={icon} className="h-4 w-4" />
        </span>
        <div>
          <div className="text-xs font-semibold text-gray-900">{title}</div>
          <div className="text-xs text-gray-600">{desc}</div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, features }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-200 text-rose-600">
          <FontAwesomeIcon icon={icon} className="h-6 w-6" />
        </span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="mt-4 text-gray-600">{description}</p>
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-rose-500" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({ step, title, description, icon }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-200 text-rose-600 text-xl font-bold">
        {step}
      </div>
      <div className="mt-4 flex justify-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-200 text-rose-500">
          <FontAwesomeIcon icon={icon} className="h-6 w-6" />
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

function EnhancedStepCard({ step, title, description, icon, features, color }) {
  const colorClasses = {
    rose: 'from-rose-50 to-rose-100 border-rose-200 text-rose-600',
    indigo: 'from-rose-50 to-rose-100 border-rose-200 text-rose-600'
  };

  return (
    <div className="relative group">
      <div className="rounded-3xl border border-rose-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full min-h-[400px] flex flex-col">
        {/* Step number */}
        <div className="absolute -top-4 left-8">
          <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${colorClasses[color]} border-4 border-white shadow-lg flex items-center justify-center text-xl font-bold`}>
            {step}
          </div>
        </div>

        {/* Icon */}
        <div className="mt-4 mb-6 flex justify-center">
          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <FontAwesomeIcon icon={icon} className="h-8 w-8" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{description}</p>

          {/* Features */}
          <div className="space-y-2 mt-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-rose-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-rose-600">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function EnhancedStatCard({ number, label, description, icon, trend }) {
  return (
    <div className="group relative">
      <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform duration-300">
            <FontAwesomeIcon icon={icon} className="h-6 w-6" />
          </div>
          <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </div>
        </div>

        {/* Stats */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-rose-600 transition-colors">
            {number}
          </div>
          <div className="text-sm font-semibold text-gray-900 mb-1">{label}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}

function TrustIndicator({ icon, title, description, badge }) {
  return (
    <div className="text-center group">
      <div className="relative inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 text-rose-600 mb-4 group-hover:scale-110 transition-transform duration-300">
        <FontAwesomeIcon icon={icon} className="h-8 w-8" />
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          ✓
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-xs font-medium px-3 py-1 rounded-full">
        <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
        {badge}
      </div>
    </div>
  );
}

function ReviewCard({ name, role, rating, review, avatar }) {
  return (
    <div className="flex-shrink-0 w-80 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="h-4 w-4 text-yellow-400" />
        ))}
      </div>
      <div className="relative mb-6">
        <FontAwesomeIcon icon={faQuoteLeft} className="absolute -top-2 -left-1 h-6 w-6 text-rose-200" />
        <p className="text-gray-700 leading-relaxed pl-6 text-sm">{review}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 flex items-center justify-center text-rose-700 font-semibold text-sm shadow-sm">
          {avatar}
        </div>
        <div>
          <div className="font-semibold text-gray-900 text-sm">{name}</div>
          <div className="text-xs text-gray-600">{role}</div>
        </div>
      </div>
    </div>
  );
}

function BenefitItem({ icon, title, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-200 text-rose-600">
          <FontAwesomeIcon icon={icon} className="h-6 w-6" />
        </span>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function BlogCard({ title, excerpt, date, readTime, category }) {
  return (
    <div className="flex-shrink-0 w-80 lg:w-96 rounded-2xl border border-rose-100 bg-white p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center rounded-full bg-rose-200 px-3 py-1 text-xs font-medium text-rose-700">
          {category}
        </span>
        <span className="text-xs text-gray-500">•</span>
        <span className="text-xs text-gray-500">{readTime}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-rose-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
          {date}
        </div>
        <div className="text-rose-600 text-sm font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
          Read more
          <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon, title, info, description }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-200 text-rose-600">
          <FontAwesomeIcon icon={icon} className="h-5 w-5" />
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-rose-600 font-medium">{info}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function SocialLink({ icon, href }) {
  return (
    <a
      href={href}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-rose-200 hover:text-rose-700 transition-all"
    >
      <FontAwesomeIcon icon={icon} className="h-5 w-5" />
    </a>
  );
}

function LightSocialLink({ icon, href }) {
  return (
    <a
      href={href}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 hover:text-rose-700 transition-all"
    >
      <FontAwesomeIcon icon={icon} className="h-5 w-5" />
    </a>
  );
}

function FooterLink({ href, text }) {
  return (
    <li>
      <a href={href} className="text-gray-300 hover:text-rose-400 transition-colors">
        {text}
      </a>
    </li>
  );
}

function LightFooterLink({ href, text }) {
  return (
    <li>
      <a href={href} className="text-gray-600 hover:text-rose-600 transition-colors">
        {text}
      </a>
    </li>
  );
}
// FAQ Accordion Component
function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0); // First FAQ open by default

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-rose-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 pr-4">
              {faq.question}
            </h3>
            <div className="flex-shrink-0">
              <FontAwesomeIcon
                icon={openIndex === index ? faChevronUp : faChevronDown}
                className="h-5 w-5 text-rose-600 transition-transform duration-200"
              />
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="px-6 pb-5 pt-2">
              <div className="border-t border-rose-100 pt-4">
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}