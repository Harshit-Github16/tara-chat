'use client';

export default function WelcomeScreen({ onNext }) {
    return (
        <div className="flex min-h-screen items-center justify-center p-6">
            <div className="max-w-lg text-center space-y-8 animate-fade-in">
                {/* Floating shapes animation */}
                <div className="relative">
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-20 left-20 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <img
                        src="/taralogo.jpg"
                        alt="Tara"
                        className="mx-auto h-24 w-24 rounded-full object-cover shadow-2xl border-4 border-white"
                    />
                </div>

                {/* Headline */}
                <div className="relative z-10 space-y-4">
                    <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                        Hi, I'm Tara.
                    </h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Your space to feel lighter, understood, and emotionally stronger.
                    </p>
                    <p className="text-base text-gray-600">
                        Let's personalize your journey — this will take less than a minute.
                    </p>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onNext}
                    className="relative z-10 inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-rose-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                    ✨ Begin
                </button>
            </div>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}
