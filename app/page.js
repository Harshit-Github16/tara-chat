"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  faBullseye,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faApple, faTwitter, faLinkedin, faInstagram, faFacebook, faWhatsapp, faXTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons";
import FAQSchema, { COMMON_FAQS } from "./components/FAQSchema";
import LoginModal from "./components/LoginModal";
import OnboardingModal from "./components/OnboardingModal";
import { useAuth } from "./contexts/AuthContext";
// import Footer from "./components/Footer";
import Head from "next/head";
export default function Home() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileFeaturesDropdown, setShowMobileFeaturesDropdown] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);
  const [currentMoodIndex, setCurrentMoodIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const moods = ['Sad', 'Low', 'Stressed', 'Anxious', 'Overwhelmed', 'Pressure at work', 'Financial pressure', 'Need someone to talk to', 'Social pressure', 'Lonely', 'Tired', 'Confused'];

  // Cleanup dropdown timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeout) clearTimeout(dropdownTimeout);
    };
  }, [dropdownTimeout]);

  // Typing effect for mood text
  useEffect(() => {
    const currentMood = moods[currentMoodIndex];
    let timeout;

    if (!isDeleting && displayedText === currentMood) {
      // Pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayedText === '') {
      // Move to next mood
      setIsDeleting(false);
      setCurrentMoodIndex((prevIndex) => (prevIndex + 1) % moods.length);
    } else {
      // Type or delete character
      const typingSpeed = isDeleting ? 30 : 50;
      timeout = setTimeout(() => {
        setDisplayedText(prev => {
          if (isDeleting) {
            return currentMood.substring(0, prev.length - 1);
          } else {
            return currentMood.substring(0, prev.length + 1);
          }
        });
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentMoodIndex, moods]);

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

  // Check for openLogin and showOnboarding query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('openLogin') === 'true') {
      setShowLoginModal(true);
      // Clean up URL without reloading
      window.history.replaceState({}, '', '/');
    }

    if (urlParams.get('showOnboarding') === 'true') {
      setShowOnboardingModal(true);
      // Clean up URL without reloading
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'how-it-works', 'blogs'];
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

  const handleLoginSuccess = (isNewUser, userData) => {
    // Check if there's a redirect URL stored
    const redirectUrl = localStorage.getItem('redirectAfterLogin');

    if (isNewUser || !userData.isOnboardingComplete) {
      setShowOnboardingModal(true);
    } else if (redirectUrl && redirectUrl !== '/') {
      // Redirect to the stored URL
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectUrl);
    } else {
      router.push('/welcome');
    }
  };

  const handleOnboardingComplete = () => {
    // Check if there's a redirect URL stored
    const redirectUrl = localStorage.getItem('redirectAfterLogin');

    if (redirectUrl && redirectUrl !== '/') {
      // Redirect to the stored URL
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectUrl);
    } else {
      router.push('/welcome');
    }
  };

  const handleTalkNowClick = (e) => {
    e.preventDefault();
    if (user && user.isOnboardingComplete) {
      router.push('/welcome');
    } else if (user && !user.isOnboardingComplete) {
      setShowOnboardingModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Head>

        <title>Tara - AI Mental Health & Wellness Companion | Emotional Support Chat</title>

        <meta name="description" content="Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth. Chat with 100+ AI characters, track moods, and build healthy habits." />

        <meta name="keywords" content="mental health app, AI companion, emotional wellness, mindfulness, therapy chat, mood tracking, journal app, personal growth, mental wellness, AI therapy, celebrity chat, emotional support" />

        <link rel="canonical" href="https://www.tara4u.com" />

        <meta property="og:title" content="Tara - AI Mental Health & Wellness Companion" />

        <meta property="og:description" content="Transform your mental wellness journey with Tara - your AI-powered companion for mindfulness, emotional support, and personal growth." />

        <meta property="og:type" content="website" />

        <meta property="og:url" content="https://www.tara4u.com" />

        <meta property="og:image" content="https://www.tara4u.com/taralogo.jpg" />

        <script

          type="application/ld+json"

          dangerouslySetInnerHTML={{

            __html: JSON.stringify({

              "@context": "https://schema.org",

              "@type": "WebSite",

              "name": "Tara",

              "url": "https://www.tara4u.com",

              "description": "AI-powered mental health and wellness companion",

              "potentialAction": {

                "@type": "SearchAction",

                "target": "https://www.tara4u.com/search?q={search_term_string}",

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
            <span className="text-xl font-bold text-rose-500">Tara4u</span>
          </div>

          {/* Navigation Menu - Center */}
          <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (dropdownTimeout) clearTimeout(dropdownTimeout);
                setShowFeaturesDropdown(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setShowFeaturesDropdown(false);
                }, 200);
                setDropdownTimeout(timeout);
              }}
            >
              <button
                className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 flex items-center gap-1"
              >
                Features
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${showFeaturesDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showFeaturesDropdown && (
                <div
                  className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-rose-100 py-2 z-50"
                  onMouseEnter={() => {
                    if (dropdownTimeout) clearTimeout(dropdownTimeout);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setShowFeaturesDropdown(false);
                    }, 200);
                    setDropdownTimeout(timeout);
                  }}
                >
                  <Link
                    href="/chatlist"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faComments} className="h-4 w-4" />
                    Chat List
                  </Link>
                  <Link
                    href="/journal"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />
                    Journals
                  </Link>
                  <Link
                    href="/goals"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faBullseye} className="h-4 w-4" />
                    Goals
                  </Link>
                  <Link
                    href="/insights"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faChartLine} className="h-4 w-4" />
                    Insights
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-all duration-300"
            >
              About Us
            </Link>

            <a
              href="/blog"
              className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-all duration-300"
            >
              Blogs
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
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-gray-700 hover:text-rose-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

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

            <button
              onClick={handleTalkNowClick}
              className="btn-shine rounded-full bg-rose-200 px-5 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all"
            >
              Start Talking
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-rose-100 bg-white">
            <div className="px-6 py-4 space-y-3">
              {/* Features Dropdown */}
              <div>
                <button
                  onClick={() => setShowMobileFeaturesDropdown(!showMobileFeaturesDropdown)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors py-2"
                >
                  Features
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${showMobileFeaturesDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showMobileFeaturesDropdown && (
                  <div className="pl-4 mt-2 space-y-2">
                    <Link
                      href="/chatlist"
                      className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <FontAwesomeIcon icon={faComments} className="h-4 w-4" />
                      Chat List
                    </Link>
                    <Link
                      href="/journal"
                      className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />
                      Journals
                    </Link>
                    <Link
                      href="/goals"
                      className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <FontAwesomeIcon icon={faBullseye} className="h-4 w-4" />
                      Goals
                    </Link>
                    <Link
                      href="/insights"
                      className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <FontAwesomeIcon icon={faChartLine} className="h-4 w-4" />
                      Insights
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="block text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                About Us
              </Link>

              <Link
                href="/blog"
                className="block text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Blogs
              </Link>

              <Link
                href="/contact"
                className="block text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors py-2"
                onClick={() => setShowMobileMenu(false)}
              >
                Contact
              </Link>

              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleTalkNowClick();
                }}
                className="w-full mt-4 rounded-full bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all"
              >
                Start Talking
              </button>
            </div>
          </div>
        )}
      </header >

      <main>
        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden bg-gradient-to-br from-rose-50/50 via-white to-rose-50/30">
          <div className="absolute inset-0 bg-radial-1"></div>
          <div className="absolute inset-0 bg-radial-2"></div>

          <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12 py-12 lg:py-20">
            <div className="grid grid-cols-1 items-center gap-8 lg:gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="text-center lg:text-left">
                {/* <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-medium text-rose-700 mb-4">
                  <span className="font-bold">TARA</span> = Talk, Align, Reflect, Act
                </div> */}
                <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl flex flex-wrap items-baseline gap-2">
                  <span className="text-gray-900">Feeling</span>
                  <span className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent">
                    {displayedText}
                    <span className="animate-blink">|</span>
                    <span className="text-gray-900">?</span>
                  </span>
                </h1>
                <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-700">
                  You're stronger than you think, Your mind deserves a place to breathe
                </h2>
                <p className="mt-6 text-lg text-gray-600">
                  Talk, Align, Reflect, Act (Tara) helps you to heal and find clarity with an AI companion, Tara4u is built to understand your emotions and support your mental wellbeing 24/7 and holds space for your feelings, help you calm the chaos, and guide you back to emotional balance—anytime you need.
                </p>
                {/* Quick reassurance */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Available 24/7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Completely Private</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>No Judgment</span>
                  </div>
                </div>

              </div>

              {/* Mobile Frame Mockup */}
              <div className="relative flex justify-center lg:justify-end">
                {/* Mobile Device Frame */}
                <div className="relative w-[280px] sm:w-[320px] md:w-[340px] lg:w-[360px]">
                  {/* Phone Frame */}
                  <div className="relative bg-gray-900 rounded-[2.5rem] md:rounded-[3rem] p-2 md:p-3 shadow-2xl">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 md:w-40 h-6 md:h-7 bg-gray-900 rounded-b-3xl z-10"></div>

                    {/* Screen */}
                    <div className="relative bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden h-[520px] sm:h-[580px] md:h-[620px] lg:h-[650px]">
                      {/* Chat Header */}
                      <div className="bg-rose-200 px-3 md:px-4 py-3 md:py-4 flex items-center gap-2 md:gap-3 shadow-sm">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white flex items-center justify-center">
                          <FontAwesomeIcon icon={faHeart} className="h-4 w-4 md:h-5 md:w-5 text-rose-500" />
                        </div>
                        <div className="flex-1">
                          <div className="text-gray-800 font-semibold text-xs md:text-sm">Emotional Support</div>
                          <div className="text-gray-600 text-[10px] md:text-xs flex items-center gap-1">
                            <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-green-500"></div>
                            Always here for you
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="p-3 md:p-4 space-y-3 md:space-y-4 bg-rose-50/30 h-[calc(100%-120px)] md:h-[calc(100%-140px)] overflow-y-auto">
                        {/* User Message 1 */}
                        <div className="flex gap-1.5 md:gap-2 items-start justify-end">
                          <div className="bg-rose-200 rounded-2xl rounded-tr-sm px-3 md:px-4 py-2 md:py-3 shadow-sm max-w-[75%]">
                            <p className="text-xs md:text-sm text-gray-800">Hi</p>
                            <span className="text-[10px] md:text-xs text-gray-600 mt-1 block text-right">Just now</span>
                          </div>
                        </div>

                        {/* AI Message 1 */}
                        <div className="flex gap-1.5 md:gap-2 items-start">
                          <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon icon={faHeart} className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </div>
                          <div className="bg-white rounded-2xl rounded-tl-sm px-3 md:px-4 py-2 md:py-3 shadow-sm max-w-[75%]">
                            <p className="text-xs md:text-sm text-gray-800">Hello, How are you feeling today?</p>
                            <span className="text-[10px] md:text-xs text-gray-400 mt-1 block">Just now</span>
                          </div>
                        </div>

                        {/* User Message 2 */}
                        <div className="flex gap-1.5 md:gap-2 items-start justify-end">
                          <div className="bg-rose-200 rounded-2xl rounded-tr-sm px-3 md:px-4 py-2 md:py-3 shadow-sm max-w-[75%]">
                            <p className="text-xs md:text-sm text-gray-800">A bit low due to stress</p>
                            <span className="text-[10px] md:text-xs text-gray-600 mt-1 block text-right">Just now</span>
                          </div>
                        </div>

                        {/* AI Message 2 */}
                        <div className="flex gap-1.5 md:gap-2 items-start">
                          <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon icon={faHeart} className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </div>
                          <div className="bg-white rounded-2xl rounded-tl-sm px-3 md:px-4 py-2 md:py-3 shadow-sm max-w-[75%]">
                            <p className="text-xs md:text-sm text-gray-800">What happened? Please tell me if anything bothering you lately? I am here for you</p>
                            <span className="text-[10px] md:text-xs text-gray-400 mt-1 block">Just now</span>
                          </div>
                        </div>

                        {/* User Message 3 */}
                        <div className="flex gap-1.5 md:gap-2 items-start justify-end">
                          <div className="bg-rose-200 rounded-2xl rounded-tr-sm px-3 md:px-4 py-2 md:py-3 shadow-sm max-w-[75%]">
                            <p className="text-xs md:text-sm text-gray-800">I have been facing many challenges and due to that I am unable to sleep. I am thinking about those issues day and night</p>
                            <span className="text-[10px] md:text-xs text-gray-600 mt-1 block text-right">Just now</span>
                          </div>
                        </div>

                        {/* Typing Indicator */}
                        <div className="flex gap-1.5 md:gap-2 items-start">
                          <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center flex-shrink-0">
                            <FontAwesomeIcon icon={faHeart} className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </div>
                          <div className="bg-white rounded-2xl rounded-tl-sm px-3 md:px-4 py-1.5 md:py-2 shadow-sm">
                            <div className="flex gap-1">
                              <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Input Area */}
                      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 md:px-4 py-2 md:py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full px-3 md:px-4 py-1.5 md:py-2">
                            <p className="text-xs md:text-sm text-gray-400">Type your message...</p>
                          </div>
                          <button className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge - Bottom Left */}
                  <div className="absolute -bottom-4 md:-bottom-6 left-2 md:left-4 bg-white rounded-lg md:rounded-xl shadow-xl px-2 md:px-3 py-1.5 md:py-2 border border-rose-100 z-20">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <FontAwesomeIcon icon={faCheck} className="h-2.5 w-2.5 md:h-3 md:w-3 text-green-500" />
                      <span className="text-[10px] md:text-xs font-semibold text-gray-800 whitespace-nowrap">100% Private</span>
                    </div>
                  </div>

                  {/* Floating Badge - Top Right */}
                  <div className="absolute top-12 md:top-16 -right-4 md:-right-6 bg-white rounded-lg md:rounded-xl shadow-xl px-2 md:px-3 py-1.5 md:py-2 border border-rose-100 z-20">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] md:text-xs font-semibold text-gray-800 whitespace-nowrap">Always Online</span>
                    </div>
                  </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-rose-200 opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-rose-300 opacity-20 blur-2xl"></div>
              </div>

            </div>
          </div>

        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gradient-to-br from-rose-50 via-purple-50/30 to-blue-50/30">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-100 to-purple-100 px-5 py-2 text-sm font-semibold text-rose-700 mb-6">
                <FontAwesomeIcon icon={faStar} className="h-4 w-4" />
                Real Benefits, Real Results
              </div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                Why Choose Tara?
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Transform your emotional wellness with features designed for real results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Benefit 1 - Improved Emotional Stability */}
              <div className="group relative bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl border border-rose-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faHeart} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Improved Emotional Stability</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Build resilience and maintain emotional balance through consistent support and guided reflection. Learn to navigate life's ups and downs with confidence.
                  </p>
                </div>
              </div>

              {/* Benefit 2 - Early Detection */}
              <div className="group relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Early Detection of Mental Health Risks</h3>
                  <p className="text-gray-600 leading-relaxed">
                    AI-powered mood tracking identifies patterns and potential concerns early, helping you take proactive steps toward better mental health.
                  </p>
                </div>
              </div>

              {/* Benefit 3 - Reduced Stress & Anxiety */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faComments} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Reduced Stress & Anxiety</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Express your worries in a judgment-free space. Our AI companions provide calming support and practical coping strategies whenever you need them.
                  </p>
                </div>
              </div>

              {/* Benefit 4 - Goal Setting & Personal Growth */}
              <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faBullseye} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Goal Setting & Personal Growth</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Set meaningful wellness goals and track your progress. AI-powered insights help you stay motivated and celebrate every milestone.
                  </p>
                </div>
              </div>

              {/* Benefit 5 - Purpose & Direction */}
              <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faArrowRight} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Purpose & Direction</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Discover clarity and meaning through guided journaling and reflection. Find your path forward with personalized insights and support.
                  </p>
                </div>
              </div>

              {/* Benefit 6 - Privacy & Safe Space */}
              <div className="group relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border border-pink-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faShield} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Privacy & Safe Space to Express</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your thoughts are completely private with end-to-end encryption. Express yourself freely without fear of judgment or data breaches.
                  </p>
                </div>
              </div>

              {/* Benefit 7 - Better Sleep Quality */}
              <div className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faClock} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Better Sleep Quality</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Release daily stress through evening journaling and calming conversations. Clear your mind for more restful, rejuvenating sleep.
                  </p>
                </div>
              </div>

              {/* Benefit 8 - Enhanced Self-Awareness */}
              <div className="group relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl border border-teal-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-teal-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Enhanced Self-Awareness</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Understand your emotions, triggers, and patterns better. Gain deep insights into what makes you feel your best and what holds you back.
                  </p>
                </div>
              </div>

              {/* Benefit 9 - Improved Relationships */}
              <div className="group relative bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-3xl border border-violet-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faUserAstronaut} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Improved Relationships</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Better emotional regulation leads to healthier connections. Learn communication skills and empathy through guided conversations.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <button
                onClick={handleTalkNowClick}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all group"
              >
                Start Your Wellness Journey
                <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-4 text-sm text-gray-600">Free to start • No credit card required</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative py-20 bg-white overflow-hidden">
          {/* Animated SVG Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Floating Hearts */}
            <svg className="absolute top-10 left-10 w-16 h-16 text-rose-200 animate-float" style={{ animationDelay: '0s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>

            <svg className="absolute top-32 right-20 w-12 h-12 text-rose-100 animate-float" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>

            {/* Floating Circles */}
            <div className="absolute top-20 right-10 w-24 h-24 rounded-full bg-rose-100 opacity-30 animate-pulse-slow"></div>
            <div className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-rose-200 opacity-20 animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-rose-100 opacity-25 animate-float" style={{ animationDelay: '2s' }}></div>

            {/* Sparkles */}
            <svg className="absolute bottom-32 right-32 w-8 h-8 text-rose-300 animate-spin-slow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2.163 7.837L22 10l-7.837 2.163L12 20l-2.163-7.837L2 10l7.837-2.163L12 0z" />
            </svg>

            <svg className="absolute top-1/3 right-1/3 w-6 h-6 text-rose-200 animate-spin-slow" style={{ animationDelay: '1s' }} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0l2.163 7.837L22 10l-7.837 2.163L12 20l-2.163-7.837L2 10l7.837-2.163L12 0z" />
            </svg>

            {/* Wavy Lines */}
            <svg className="absolute bottom-10 left-1/3 w-40 h-20 text-rose-100 opacity-50" viewBox="0 0 200 100">
              <path d="M0,50 Q50,20 100,50 T200,50" stroke="currentColor" strokeWidth="2" fill="none" className="animate-wave" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 px-5 py-2 text-sm font-semibold text-blue-700 mb-6">
                <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
                Complete Wellness Suite
              </div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                Everything you need for emotional wellness
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Comprehensive tools designed to support your mental health journey
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 - AI Emotional Chat */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faComments} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Emotional Chat</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Connect with 100+ unique AI characters, each designed to provide different types of emotional support and guidance.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Personalized conversations</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">24/7 availability</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Multiple personality types</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 2 - Smart Journaling */}
              <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faBookOpen} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Journaling</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Guided journaling with AI-powered prompts and insights to help you process emotions and track growth.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Daily prompts</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Mood tracking</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Progress insights</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 3 - Emotional Analytics */}
              <div className="group relative bg-gradient-to-br from-cyan-50 to-teal-50 rounded-3xl border border-cyan-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Emotional Analytics</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Visualize your emotional patterns with beautiful charts and get personalized recommendations.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm">Mood trends</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm">Trigger analysis</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm">Recovery insights</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 4 - Wellness Tracking */}
              <div className="group relative bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl border border-rose-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faHeart} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Wellness Tracking</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Monitor your emotional health with streak tracking, mood meters, and wellness goals.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-rose-500" />
                      <span className="text-sm">Daily check-ins</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-rose-500" />
                      <span className="text-sm">Streak rewards</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-rose-500" />
                      <span className="text-sm">Goal setting</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 5 - Privacy First */}
              <div className="group relative bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl border border-emerald-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faShield} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Privacy First</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Your emotional data is encrypted and private. We never share your personal information.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">End-to-end encryption</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">Local storage</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">GDPR compliant</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Feature 6 - Cross Platform */}
              <div className="group relative bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl border border-violet-100 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-100/20 rounded-tr-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faMobile} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Cross Platform</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Access your emotional wellness tools anywhere with our responsive web app and mobile support.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-violet-500" />
                      <span className="text-sm">Web app</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-violet-500" />
                      <span className="text-sm">Mobile optimized</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-700">
                      <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-violet-500" />
                      <span className="text-sm">Offline support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-3"></div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl"></div>

          <div className="mx-auto max-w-[1600px] px-6 lg:px-12 relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-5 py-2 text-sm font-semibold text-purple-700 mb-6">
                <FontAwesomeIcon icon={faStar} className="h-4 w-4" />
                Everything Included
              </div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                Your Complete Wellness Toolkit
              </h2>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Get access to everything you need for your emotional wellness journey - all in one place
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {/* 100+ Celebrities */}
              <div className="group relative bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl border border-rose-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-200/20 rounded-bl-full"></div>
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    NEW
                  </div>
                </div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faUserAstronaut} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">100+</h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">AI Celebrities & Characters</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Chat with your favorite personalities and get inspired by their wisdom</p>
                </div>
              </div>

              {/* Smart Goals */}
              <div className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border border-indigo-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-200/20 rounded-bl-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faBullseye} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered</h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">Smart Goal Suggestions</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Get personalized wellness goals based on your mood patterns and progress</p>
                </div>
              </div>

              {/* Mood Tracking */}
              <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/20 rounded-bl-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faHeart} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">12 Moods</h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">Advanced Mood Tracking</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Track your emotional journey with 12 distinct mood states and detailed analytics</p>
                </div>
              </div>

              {/* Journal Prompts */}
              <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border border-green-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/20 rounded-bl-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faBookOpen} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Unlimited</h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">AI Journal Prompts</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Get personalized journaling prompts that adapt to your emotional state</p>
                </div>
              </div>

              {/* Insights Dashboard */}
              <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border border-orange-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/20 rounded-bl-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Real-time</h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">Insights Dashboard</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Visualize your progress with beautiful charts and actionable insights</p>
                </div>
              </div>

              {/* 24/7 Support */}
              <div className="group relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border border-blue-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/20 rounded-bl-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faComments} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">24/7</h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">Always Available</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Your AI companion is always ready to listen, anytime you need support</p>
                </div>
              </div>

              {/* Privacy First */}
              <div className="group relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl border border-teal-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-teal-200/20 rounded-bl-full"></div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faShield} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">100%</h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">Private & Secure</p>
                  <p className="text-sm text-gray-600 leading-relaxed">End-to-end encryption ensures your data stays completely private</p>
                </div>
              </div>

              {/* Free to Start */}
              <div className="group relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl border border-pink-100 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-pink-200/20 rounded-bl-full"></div>
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    FREE
                  </div>
                </div>
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg">
                    <FontAwesomeIcon icon={faHeart} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">₹0</h3>
                  <p className="text-base font-semibold text-gray-800 mb-2">Free to Start</p>
                  <p className="text-sm text-gray-600 leading-relaxed">Begin your wellness journey today with no credit card required</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <button
                onClick={handleTalkNowClick}
                className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-8 py-4 text-base font-semibold text-rose-700 shadow-lg hover:bg-rose-300 transition-all group"
              >
                Start Your Free Journey
                <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-4 text-sm text-gray-600">No credit card required • Get started in 2 minutes</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-radial-4"></div>
          <div className="absolute inset-0 bg-radial-5"></div>

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
          <div className="absolute inset-0 bg-radial-5"></div>
          <div className="absolute inset-0 bg-radial-5"></div>

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
                  role="Founder"
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
                  role="Founder"
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
                  role="Founder"
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

                {/* Corner decorations */}
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-rose-200 opacity-20"></div>
                <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-rose-200 opacity-30"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section with Auto Slider */}
        <section id="blogs" className="py-20 bg-gradient-to-br from-rose-100/30 to-rose-50/30 overflow-hidden">
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




        <section className="relative py-20 bg-gradient-to-br from-rose-100 via-rose-50 to-white overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-radial-strong"></div>
          <div className="absolute inset-0 bg-radial-1"></div>

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
                  <button
                    onClick={handleTalkNowClick}
                    className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full bg-rose-200 md:px-6 py-3 sm:px-10 sm:py-5 text-base sm:text-lg font-semibold text-rose-700 shadow-lg hover:bg-rose-300 hover:shadow-xl transition-all transform hover:scale-105 w-full sm:w-auto"
                  >
                    <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
                    Continue with Google
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                  </button>

                  {/* Apple Button with Coming Soon Tag */}
                  <div className="relative inline-block w-full sm:w-auto">
                    {/* Coming Soon Tag */}
                    {/* <span className="absolute -top-2 -right-2 rounded-full bg-rose-600 text-white text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 shadow-md z-10">
                      Coming Soon
                    </span> */}

                    <button
                      onClick={handleTalkNowClick}
                      className="btn-shine group inline-flex items-center justify-center gap-2 rounded-full border-2 border-rose-200 bg-white px-6 py-3 sm:px-10 sm:py-5 text-base sm:text-lg font-semibold text-rose-600 hover:bg-rose-50 transition-all transform hover:scale-105 w-full sm:w-auto"
                    >
                      <FontAwesomeIcon icon={faApple} className="h-5 w-5" />
                      Continue with Apple
                    </button>
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
                  {/* Email Contact */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-200">
                        <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-rose-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Email us</h3>
                      <a href="mailto:hello@tara4u.com" className="text-rose-600 hover:text-rose-700 font-medium">
                        hello@tara4u.com
                      </a>
                      <p className="mt-1 text-sm text-gray-600">We'll get back to you within 24 hours</p>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect with us</h3>
                    <div className="flex flex-wrap gap-3">
                      <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors">
                        <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Twitter</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors">
                        <FontAwesomeIcon icon={faInstagram} className="h-5 w-5 text-pink-600" />
                        <span className="text-sm font-medium text-gray-700">Instagram</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors">
                        <FontAwesomeIcon icon={faLinkedin} className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                      </a>
                      <a href="#" className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-rose-200 hover:bg-rose-50 transition-colors">
                        <FontAwesomeIcon icon={faFacebook} className="h-5 w-5 text-blue-700" />
                        <span className="text-sm font-medium text-gray-700">Facebook</span>
                      </a>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white border border-rose-100">
                      <div className="flex items-center gap-2 text-rose-600 mb-2">
                        <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                        <span className="text-sm font-semibold">Response Time</span>
                      </div>
                      <p className="text-sm text-gray-600">Usually within 24 hours</p>
                    </div>
                    <div className="p-4 rounded-xl bg-white border border-rose-100">
                      <div className="flex items-center gap-2 text-rose-600 mb-2">
                        <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
                        <span className="text-sm font-semibold">Support</span>
                      </div>
                      <p className="text-sm text-gray-600">We're here to help you</p>
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
        </section >
      </main >

      {/* Footer */}
      < footer className="bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20 border-t border-rose-100" >
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
                <span className="text-xl font-bold text-rose-500">Tara4u</span>
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
      </footer >

      {/* Fixed Bottom Buttons */}
      < div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-rose-100 shadow-lg" >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Continue with Google */}
            <button
              onClick={handleTalkNowClick}
              className="btn-shine flex-1 flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-rose-400 rounded-full px-4 py-3 font-semibold text-gray-700 hover:text-rose-600 transition-all shadow-sm hover:shadow-md"
            >
              <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-red-500" />
              <span className="hidden sm:inline">Continue with</span> Google
            </button>

            {/* Continue with Apple */}
            <button
              onClick={handleTalkNowClick}
              className="btn-shine flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-900 rounded-full px-4 py-3 font-semibold text-white transition-all shadow-sm hover:shadow-md"
            >
              <FontAwesomeIcon icon={faApple} className="h-5 w-5" />
              <span className="hidden sm:inline">Continue with</span> Apple
            </button>
          </div>
        </div>
      </div >

      {/* Login Modal */}
      < LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)
        }
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Onboarding Modal */}
      < OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onComplete={handleOnboardingComplete}
      />
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