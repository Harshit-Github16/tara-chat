"use client";
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
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faApple, faTwitter, faLinkedin, faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Image
              src="/taralogo.jpg"
              alt="Tara Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-xl font-bold text-indigo-600">Tara</span>
          </div>

          <div className="flex items-center gap-3">
            {/* <Link
              href="/login"
              className="rounded-full border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-200 transition-all"
            >
              Sign In
            </Link> */}
            <Link
              href="/login"
              className="rounded-full bg-indigo-200 px-5 py-2 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-300 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-indigo-50/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.05),transparent_50%)]"></div>

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  Your Personal
                  <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent"> Emotional </span>
                  Wellness Companion
                </h1>
                <p className="mt-6 text-lg text-gray-600 sm:text-xl">
                  Connect with 100+ AI characters, track your moods, journal your thoughts,
                  and get personalized insights for better emotional health.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-indigo-200 px-8 py-4 text-base font-semibold text-indigo-700 shadow-lg hover:bg-indigo-300 transition-all"
                  >Get Started
                    <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="#demo"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 px-8 py-4 text-base font-medium text-indigo-600 hover:bg-indigo-200 transition-all"
                  >
                    <FontAwesomeIcon icon={faPlay} className="h-4 w-4" />
                    Watch Demo
                  </Link>
                </div>
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 lg:justify-start">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-indigo-500" />
                    Free to start
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-indigo-500" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-indigo-500" />
                    Privacy focused
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-3xl border border-indigo-100 bg-white p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <FeaturePreview icon={faComments} title="Emotional Chat" desc="Express & reflect" />
                    <FeaturePreview icon={faBookOpen} title="Smart Journaling" desc="Guided insights" />
                    <FeaturePreview icon={faChartLine} title="Mood Analytics" desc="Track progress" />
                    <FeaturePreview icon={faUserAstronaut} title="100+ Characters" desc="Find your guide" />
                  </div>
                  <div className="mt-6 rounded-2xl bg-indigo-200 p-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/taralogo.jpg"
                        alt="Life Coach Avatar"
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Life Coach</div>
                        <div className="text-xs text-gray-600">Ready to unlock your potential? Let's grow together! 🚀</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-indigo-200 opacity-20"></div>
                <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-indigo-200 opacity-30"></div>
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
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-indigo-50/30 via-white to-indigo-50/20 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(99,102,241,0.05),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.03),transparent_50%)]"></div>

          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 mb-6">
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

              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
                <EnhancedStepCard
                  step="1"
                  title="Check In Daily"
                  description="Start your day with a personalized mood check-in. Our AI analyzes your emotional patterns and provides gentle guidance."
                  icon={faHeart}
                  features={["Quick 2-minute check-ins", "Mood pattern recognition", "Personalized insights"]}
                  color="indigo"
                />
                <EnhancedStepCard
                  step="2"
                  title="Chat & Journal"
                  description="Connect with AI companions or express yourself through guided journaling. Process emotions in a safe, supportive environment."
                  icon={faComments}
                  features={["100+ AI characters", "Guided prompts", "Private & secure"]}
                  color="indigo"
                />
                <EnhancedStepCard
                  step="3"
                  title="Track & Grow"
                  description="Visualize your emotional journey with beautiful analytics. Celebrate progress and identify areas for growth."
                  icon={faChartLine}
                  features={["Progress visualization", "Growth insights", "Achievement tracking"]}
                  color="indigo"
                />
              </div>
            </div>

            {/* Call to action */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-4 rounded-2xl bg-white border border-indigo-100 p-6 shadow-lg">
                <div className="flex -space-x-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-indigo-700 font-semibold text-sm">SJ</div>
                  <div className="h-10 w-10 rounded-full bg-indigo-200 border-2 border-white flex items-center justify-center text-indigo-700 font-semibold text-sm">MC</div>
                  <div className="h-10 w-10 rounded-full bg-indigo-300 border-2 border-white flex items-center justify-center text-indigo-800 font-semibold text-sm">ER</div>
                  <div className="h-10 w-10 rounded-full bg-indigo-300 border-2 border-white flex items-center justify-center text-indigo-800 font-semibold text-sm">+5K</div>
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
        <section className="py-20 bg-gradient-to-br from-white via-indigo-50/20 to-white relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.03),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.02),transparent_70%)]"></div>

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
                icon={faHeart}
                title="Clinically Informed"
                description="Built with input from mental health professionals"
                badge="Evidence-Based"
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
                      className={`h-12 w-12 rounded-full border-3 border-white flex items-center justify-center text-white font-semibold text-sm shadow-lg ${index % 4 === 0 ? 'bg-indigo-400' :
                        index % 4 === 1 ? 'bg-indigo-400' :
                          index % 4 === 2 ? 'bg-indigo-500' : 'bg-indigo-500'
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
        <section className="py-20 bg-gradient-to-br from-indigo-50/30 to-white overflow-hidden relative">
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
                  name="Sarah Johnson"
                  role="Marketing Manager"
                  rating={5}
                  review="Tara has completely changed how I handle stress. The AI characters feel so real and supportive. I especially love the mood tracking feature!"
                  avatar="SJ"
                />
                <ReviewCard
                  name="Michael Chen"
                  role="Software Developer"
                  rating={5}
                  review="As someone who struggles with anxiety, Tara's journaling prompts have been a game-changer. The insights help me understand my patterns better."
                  avatar="MC"
                />
                <ReviewCard
                  name="Emily Rodriguez"
                  role="Teacher"
                  rating={5}
                  review="The variety of AI characters means I always find someone who understands what I'm going through. It's like having a therapist available 24/7."
                  avatar="ER"
                />
                {/* Multiple duplicates for seamless infinite loop */}
                <ReviewCard
                  name="Sarah Johnson"
                  role="Marketing Manager"
                  rating={5}
                  review="Tara has completely changed how I handle stress. The AI characters feel so real and supportive. I especially love the mood tracking feature!"
                  avatar="SJ"
                />
                <ReviewCard
                  name="Michael Chen"
                  role="Software Developer"
                  rating={5}
                  review="As someone who struggles with anxiety, Tara's journaling prompts have been a game-changer. The insights help me understand my patterns better."
                  avatar="MC"
                />
                <ReviewCard
                  name="Emily Rodriguez"
                  role="Teacher"
                  rating={5}
                  review="The variety of AI characters means I always find someone who understands what I'm going through. It's like having a therapist available 24/7."
                  avatar="ER"
                />
                <ReviewCard
                  name="Sarah Johnson"
                  role="Marketing Manager"
                  rating={5}
                  review="Tara has completely changed how I handle stress. The AI characters feel so real and supportive. I especially love the mood tracking feature!"
                  avatar="SJ"
                />
                <ReviewCard
                  name="Michael Chen"
                  role="Software Developer"
                  rating={5}
                  review="As someone who struggles with anxiety, Tara's journaling prompts have been a game-changer. The insights help me understand my patterns better."
                  avatar="MC"
                />
                <ReviewCard
                  name="Emily Rodriguez"
                  role="Teacher"
                  rating={5}
                  review="The variety of AI characters means I always find someone who understands what I'm going through. It's like having a therapist available 24/7."
                  avatar="ER"
                />
              </div>
            </div>

            {/* Second Row - Right to Left */}
            <div className="relative overflow-hidden w-full">
              <div className="flex gap-6 animate-infinite-scroll-right">
                <ReviewCard
                  name="David Kim"
                  role="Entrepreneur"
                  rating={5}
                  review="The analytics dashboard is incredible. Seeing my emotional patterns visualized has helped me make better decisions about my mental health."
                  avatar="DK"
                />
                <ReviewCard
                  name="Lisa Thompson"
                  role="Nurse"
                  rating={5}
                  review="Working in healthcare is emotionally demanding. Tara helps me decompress and process difficult days. The privacy features give me peace of mind."
                  avatar="LT"
                />
                <ReviewCard
                  name="Alex Martinez"
                  role="Student"
                  rating={5}
                  review="College can be overwhelming, but Tara's daily check-ins and mood tracking help me stay balanced. The AI characters are like having supportive friends."
                  avatar="AM"
                />
                {/* Multiple duplicates for seamless infinite loop */}
                <ReviewCard
                  name="David Kim"
                  role="Entrepreneur"
                  rating={5}
                  review="The analytics dashboard is incredible. Seeing my emotional patterns visualized has helped me make better decisions about my mental health."
                  avatar="DK"
                />
                <ReviewCard
                  name="Lisa Thompson"
                  role="Nurse"
                  rating={5}
                  review="Working in healthcare is emotionally demanding. Tara helps me decompress and process difficult days. The privacy features give me peace of mind."
                  avatar="LT"
                />
                <ReviewCard
                  name="Alex Martinez"
                  role="Student"
                  rating={5}
                  review="College can be overwhelming, but Tara's daily check-ins and mood tracking help me stay balanced. The AI characters are like having supportive friends."
                  avatar="AM"
                />
                <ReviewCard
                  name="David Kim"
                  role="Entrepreneur"
                  rating={5}
                  review="The analytics dashboard is incredible. Seeing my emotional patterns visualized has helped me make better decisions about my mental health."
                  avatar="DK"
                />
                <ReviewCard
                  name="Lisa Thompson"
                  role="Nurse"
                  rating={5}
                  review="Working in healthcare is emotionally demanding. Tara helps me decompress and process difficult days. The privacy features give me peace of mind."
                  avatar="LT"
                />
                <ReviewCard
                  name="Alex Martinez"
                  role="Student"
                  rating={5}
                  review="College can be overwhelming, but Tara's daily check-ins and mood tracking help me stay balanced. The AI characters are like having supportive friends."
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
              }

              .animate-infinite-scroll-right {
                animation: infinite-scroll-right 30s linear infinite;
                width: max-content;
              }

              .animate-infinite-scroll-left:hover,
              .animate-infinite-scroll-right:hover {
                animation-play-state: paused;
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
                <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-8 shadow-xl">
                  <div className="text-center">
                    <div className="mx-auto h-20 w-20 rounded-full bg-indigo-200 flex items-center justify-center mb-6">
                      <FontAwesomeIcon icon={faHeart} className="h-10 w-10 text-indigo-600" />
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

        {/* Blog Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-50/30 to-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Latest from our blog
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Expert insights and tips for better emotional wellness
              </p>
            </div>

            <div className="mt-16 relative">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
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
              </div>

              <div className="flex justify-center mt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-200 px-6 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-200 transition-all"
                >
                  View All Articles
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                </Link>
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
                  Have questions about Tara? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>

                <div className="mt-8 space-y-6">
                  <ContactInfo
                    icon={faEnvelope}
                    title="Email us"
                    info="support@tara.com"
                    description="We'll get back to you within 24 hours"
                  />
                  <ContactInfo
                    icon={faPhone}
                    title="Call us"
                    info="+1 (555) 123-4567"
                    description="Mon-Fri from 8am to 6pm PST"
                  />
                  <ContactInfo
                    icon={faMapMarkerAlt}
                    title="Visit us"
                    info="123 Wellness Street, San Francisco, CA 94102"
                    description="Our headquarters"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-white p-8 shadow-lg">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="Doe"
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
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="Tell us more about your question or feedback..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-200 px-6 py-3 text-base font-semibold text-indigo-700 shadow-sm hover:bg-indigo-300 transition-all"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-50 to-white">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Ready to start your emotional wellness journey?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of users who are already improving their emotional health with Tara.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-200 px-8 py-4 text-base font-semibold text-indigo-700 shadow-lg hover:bg-indigo-300 transition-all"
              >
                <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
                Continue with Google
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-indigo-200 px-8 py-4 text-base font-medium text-indigo-600 hover:bg-indigo-200 transition-all"
              >
                <FontAwesomeIcon icon={faApple} className="h-5 w-5" />
                Continue with Apple
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Free to start • No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-indigo-50/30 via-white to-indigo-50/20 border-t border-indigo-100">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Image
                  src="/taralogo.jpg"
                  alt="Tara Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <span className="text-2xl font-bold text-indigo-600">Tara</span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your personal emotional wellness companion. Connect, reflect, and grow with AI-powered support that's always there for you.
              </p>
              <div className="flex space-x-4">
                <LightSocialLink icon={faTwitter} href="#" />
                <LightSocialLink icon={faLinkedin} href="#" />
                <LightSocialLink icon={faInstagram} href="#" />
                <LightSocialLink icon={faFacebook} href="#" />
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Product</h3>
              <ul className="space-y-3">
                <LightFooterLink href="#features" text="Features" />
                <LightFooterLink href="#how-it-works" text="How it Works" />
                <LightFooterLink href="/pricing" text="Pricing" />
                <LightFooterLink href="/api" text="API" />
                <LightFooterLink href="/integrations" text="Integrations" />
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Company</h3>
              <ul className="space-y-3">
                <LightFooterLink href="/about" text="About Us" />
                <LightFooterLink href="/blog" text="Blog" />
                <LightFooterLink href="/careers" text="Careers" />
                <LightFooterLink href="/press" text="Press Kit" />
                <LightFooterLink href="/partners" text="Partners" />
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Support</h3>
              <ul className="space-y-3">
                <LightFooterLink href="/help" text="Help Center" />
                <LightFooterLink href="/contact" text="Contact Us" />
                <LightFooterLink href="/status" text="System Status" />
                <LightFooterLink href="/privacy" text="Privacy Policy" />
                <LightFooterLink href="/terms" text="Terms of Service" />
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-12 border-t border-indigo-100 pt-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay updated</h3>
                <p className="text-gray-600">Get the latest tips and insights delivered to your inbox.</p>
              </div>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border border-indigo-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button className="rounded-lg bg-indigo-200 px-6 py-3 font-semibold text-indigo-700 hover:bg-indigo-300 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 border-t border-indigo-100 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/taralogo.jpg"
                alt="Tara Logo"
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-indigo-600">Tara</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">Emotional Wellness Platform</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>© 2024 Tara. All rights reserved.</span>
              <span>Made with ❤️ for better mental health</span>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}

function FeaturePreview({ icon, title, desc }) {
  return (
    <div className="rounded-xl border border-indigo-100 p-3">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-200 text-indigo-600">
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
    <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-200 text-indigo-600">
          <FontAwesomeIcon icon={icon} className="h-6 w-6" />
        </span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="mt-4 text-gray-600">{description}</p>
      <ul className="mt-4 space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-indigo-500" />
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
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-200 text-indigo-600 text-xl font-bold">
        {step}
      </div>
      <div className="mt-4 flex justify-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-200 text-indigo-500">
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
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600',
    indigo: 'from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600'
  };

  return (
    <div className="relative group">
      <div className="rounded-3xl border border-indigo-100 bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
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
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed mb-6">{description}</p>

          {/* Features */}
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <FontAwesomeIcon icon={faCheck} className="h-3 w-3 text-indigo-500 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-indigo-600">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function EnhancedStatCard({ number, label, description, icon, trend }) {
  return (
    <div className="group relative">
      <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
            <FontAwesomeIcon icon={icon} className="h-6 w-6" />
          </div>
          <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </div>
        </div>

        {/* Stats */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
            {number}
          </div>
          <div className="text-sm font-semibold text-gray-900 mb-1">{label}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
}

function TrustIndicator({ icon, title, description, badge }) {
  return (
    <div className="text-center group">
      <div className="relative inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 mb-4 group-hover:scale-110 transition-transform duration-300">
        <FontAwesomeIcon icon={icon} className="h-8 w-8" />
        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          ✓
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-3">{description}</p>
      <div className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
        <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />
        {badge}
      </div>
    </div>
  );
}

function ReviewCard({ name, role, rating, review, avatar }) {
  return (
    <div className="flex-shrink-0 w-80 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className="h-4 w-4 text-yellow-400" />
        ))}
      </div>
      <div className="relative mb-6">
        <FontAwesomeIcon icon={faQuoteLeft} className="absolute -top-2 -left-1 h-6 w-6 text-indigo-200" />
        <p className="text-gray-700 leading-relaxed pl-6 text-sm">{review}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-200 to-indigo-300 flex items-center justify-center text-indigo-700 font-semibold text-sm shadow-sm">
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
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-200 text-indigo-600">
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
    <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center rounded-full bg-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700">
          {category}
        </span>
        <span className="text-xs text-gray-500">•</span>
        <span className="text-xs text-gray-500">{readTime}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
          {date}
        </div>
        <div className="text-indigo-600 text-sm font-medium group-hover:gap-2 flex items-center gap-1 transition-all">
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
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-200 text-indigo-600">
          <FontAwesomeIcon icon={icon} className="h-5 w-5" />
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-indigo-600 font-medium">{info}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function SocialLink({ icon, href }) {
  return (
    <a
      href={href}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-indigo-200 hover:text-indigo-700 transition-all"
    >
      <FontAwesomeIcon icon={icon} className="h-5 w-5" />
    </a>
  );
}

function LightSocialLink({ icon, href }) {
  return (
    <a
      href={href}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200 hover:text-indigo-700 transition-all"
    >
      <FontAwesomeIcon icon={icon} className="h-5 w-5" />
    </a>
  );
}

function FooterLink({ href, text }) {
  return (
    <li>
      <a href={href} className="text-gray-300 hover:text-indigo-400 transition-colors">
        {text}
      </a>
    </li>
  );
}

function LightFooterLink({ href, text }) {
  return (
    <li>
      <a href={href} className="text-gray-600 hover:text-indigo-600 transition-colors">
        {text}
      </a>
    </li>
  );
}