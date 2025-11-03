"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faBookOpen,
  faUserAstronaut,
  faGaugeHigh,
  faLightbulb,
  faHeart,
  faFire,
  faChartLine,
  faUsers,
  faShield,
  faMobile,
  faArrowRight,
  faPlay,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faApple } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-rose-200"></div>
            <span className="text-xl font-bold text-rose-600">Tara</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-rose-200 px-5 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-50/50 via-white to-rose-50/30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.05),transparent_50%)]"></div>

          <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-32">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  Your Personal
                  <span className="bg-gradient-to-r from-rose-500 to-rose-600 bg-clip-text text-transparent"> Emotional </span>
                  Wellness Companion
                </h1>
                <p className="mt-6 text-lg text-gray-600 sm:text-xl">
                  Connect with 100+ AI characters, track your moods, journal your thoughts,
                  and get personalized insights for better emotional health.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-rose-200 px-8 py-4 text-base font-semibold text-rose-700 shadow-lg hover:bg-rose-300 transition-all"
                  >
                    Start Your Journey
                    <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="#demo"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 px-8 py-4 text-base font-medium text-rose-600 hover:bg-rose-200 transition-all"
                  >
                    <FontAwesomeIcon icon={faPlay} className="h-4 w-4" />
                    Watch Demo
                  </Link>
                </div>
                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 lg:justify-start">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-rose-500" />
                    Free to start
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-rose-500" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-rose-500" />
                    Privacy focused
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative rounded-3xl border border-rose-100 bg-white p-8 shadow-2xl">
                  <div className="grid grid-cols-2 gap-4">
                    <FeaturePreview icon={faComments} title="Emotional Chat" desc="Express & reflect" />
                    <FeaturePreview icon={faBookOpen} title="Smart Journaling" desc="Guided insights" />
                    <FeaturePreview icon={faChartLine} title="Mood Analytics" desc="Track progress" />
                    <FeaturePreview icon={faUserAstronaut} title="100+ Characters" desc="Find your guide" />
                  </div>
                  <div className="mt-6 rounded-2xl bg-rose-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-rose-200"></div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">Calm Coach</div>
                        <div className="text-xs text-gray-600">How are you feeling today?</div>
                      </div>
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
        <section id="how-it-works" className="py-20 bg-gradient-to-br from-rose-50/30 to-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                How Tara works
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Simple steps to start your emotional wellness journey
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
              <StepCard
                step="1"
                title="Check In Daily"
                description="Start each day by checking in with your mood and emotions. Our AI helps you identify patterns."
                icon={faHeart}
              />
              <StepCard
                step="2"
                title="Chat & Journal"
                description="Connect with AI characters for support or write in your guided journal to process thoughts."
                icon={faComments}
              />
              <StepCard
                step="3"
                title="Track & Grow"
                description="View your progress with beautiful analytics and get personalized insights for growth."
                icon={faChartLine}
              />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Trusted by thousands
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
                <StatCard number="10K+" label="Active Users" />
                <StatCard number="100+" label="AI Characters" />
                <StatCard number="50K+" label="Journal Entries" />
                <StatCard number="4.9★" label="User Rating" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-rose-50 to-white">
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
                className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-200 px-8 py-4 text-base font-semibold text-rose-700 shadow-lg hover:bg-rose-300 transition-all"
              >
                <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
                Continue with Google
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-rose-200 px-8 py-4 text-base font-medium text-rose-600 hover:bg-rose-200 transition-all"
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
      <footer className="border-t border-rose-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Product</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-rose-600">Features</a></li>
                <li><a href="#" className="hover:text-rose-600">Pricing</a></li>
                <li><a href="#" className="hover:text-rose-600">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Company</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-rose-600">About</a></li>
                <li><a href="#" className="hover:text-rose-600">Blog</a></li>
                <li><a href="#" className="hover:text-rose-600">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Support</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-rose-600">Help Center</a></li>
                <li><a href="#" className="hover:text-rose-600">Contact</a></li>
                <li><a href="#" className="hover:text-rose-600">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-rose-600">Privacy</a></li>
                <li><a href="#" className="hover:text-rose-600">Terms</a></li>
                <li><a href="#" className="hover:text-rose-600">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-rose-100 pt-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-rose-200"></div>
              <span className="text-sm font-semibold text-rose-600">Tara</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Tara. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
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
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-200 text-rose-600ite to-rose-50 text-rose-500">
          <FontAwesomeIcon icon={icon} className="h-6 w-6" />
        </span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
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