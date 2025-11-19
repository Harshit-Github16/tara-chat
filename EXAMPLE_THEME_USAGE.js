// 🎨 Complete Theme System Usage Examples

// ============================================
// Example 1: Basic Page with Theme
// ============================================
'use client';
import ThemeSelector from '../components/ThemeSelector';
import { ThemedButton, ThemedCard } from '../components/ThemedComponents';

export default function MyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
            {/* Header with Theme Selector */}
            <header className="sticky top-0 z-10 border-b border-primary-100 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <h1 className="text-lg font-semibold text-primary-600">My App</h1>
                    <ThemeSelector />
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-7xl px-4 py-8">
                <ThemedCard className="p-6">
                    <h2 className="text-2xl font-bold text-primary-600 mb-4">Welcome!</h2>
                    <p className="text-gray-600 mb-4">This page uses the theme system.</p>
                    <ThemedButton variant="primary">Click Me</ThemedButton>
                </ThemedCard>
            </main>
        </div>
    );
}

// ============================================
// Example 2: Form with Theme
// ============================================
import { ThemedInput, ThemedTextarea } from '../components/ThemedComponents';

function MyForm() {
    return (
        <form className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                </label>
                <ThemedInput
                    type="text"
                    placeholder="Enter your name"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                </label>
                <ThemedTextarea
                    rows={4}
                    placeholder="Enter your message"
                />
            </div>

            <ThemedButton variant="primary" type="submit">
                Submit
            </ThemedButton>
        </form>
    );
}

// ============================================
// Example 3: Card Grid with Theme
// ============================================
function CardGrid() {
    const items = [
        { id: 1, title: 'Item 1', description: 'Description 1' },
        { id: 2, title: 'Item 2', description: 'Description 2' },
        { id: 3, title: 'Item 3', description: 'Description 3' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map(item => (
                <ThemedCard key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold text-primary-600 mb-2">
                        {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <ThemedButton variant="outline">Learn More</ThemedButton>
                </ThemedCard>
            ))}
        </div>
    );
}

// ============================================
// Example 4: Loading State with Theme
// ============================================
import { ThemedSpinner } from '../components/ThemedComponents';

function LoadingState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center">
            <div className="text-center">
                <ThemedSpinner />
                <p className="text-gray-600 mt-4">Loading...</p>
            </div>
        </div>
    );
}

// ============================================
// Example 5: Badge/Tag with Theme
// ============================================
import { ThemedBadge } from '../components/ThemedComponents';

function TagList() {
    const tags = ['React', 'Next.js', 'Tailwind', 'Theme'];

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
                <ThemedBadge key={tag}>{tag}</ThemedBadge>
            ))}
        </div>
    );
}

// ============================================
// Example 6: Button Variants
// ============================================
function ButtonExamples() {
    return (
        <div className="space-y-4">
            {/* Primary Button */}
            <button className="bg-primary-100 text-primary-600 hover:bg-primary-200 rounded-full px-4 py-2">
                Primary Button
            </button>

            {/* Outline Button */}
            <button className="border border-primary-200 text-primary-500 hover:bg-primary-50 rounded-full px-4 py-2">
                Outline Button
            </button>

            {/* Solid Button */}
            <button className="bg-primary-500 text-white hover:bg-primary-600 rounded-full px-4 py-2">
                Solid Button
            </button>

            {/* Ghost Button */}
            <button className="text-primary-600 hover:bg-primary-50 rounded-full px-4 py-2">
                Ghost Button
            </button>
        </div>
    );
}

// ============================================
// Example 7: Alert/Notification with Theme
// ============================================
function Alert({ message, type = 'info' }) {
    return (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-500" />
                <p className="text-primary-600 font-medium">{message}</p>
            </div>
        </div>
    );
}

// ============================================
// Example 8: Stats Card with Theme
// ============================================
function StatsCard({ label, value, icon }) {
    return (
        <ThemedCard className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-3xl font-bold text-primary-600 mt-1">{value}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600">{icon}</span>
                </div>
            </div>
        </ThemedCard>
    );
}

// ============================================
// Example 9: Programmatic Theme Change
// ============================================
import { useTheme } from '../context/ThemeContext';

function ThemeControls() {
    const { currentTheme, changeTheme, themes } = useTheme();

    return (
        <div className="space-y-4">
            <p className="text-gray-600">Current Theme: <strong>{currentTheme}</strong></p>

            <div className="flex gap-2">
                {Object.keys(themes).map(themeName => (
                    <button
                        key={themeName}
                        onClick={() => changeTheme(themeName)}
                        className={`px-4 py-2 rounded-full ${currentTheme === themeName
                                ? 'bg-primary-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {themes[themeName].name}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ============================================
// Example 10: Custom Styled Component
// ============================================
function CustomComponent() {
    return (
        <div
            style={{
                backgroundColor: 'var(--primary-light)',
                borderColor: 'var(--border)',
                color: 'var(--primary)',
                borderWidth: '1px',
                borderRadius: '1rem',
                padding: '1.5rem',
            }}
        >
            <h3 style={{ color: 'var(--primary-dark)' }}>
                Custom Styled Component
            </h3>
            <p style={{ color: 'var(--foreground)' }}>
                Using CSS variables directly for maximum flexibility.
            </p>
        </div>
    );
}

// ============================================
// Example 11: Responsive Theme Layout
// ============================================
function ResponsiveLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-10 border-b border-primary-100 bg-white/80 backdrop-blur">
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-lg font-semibold text-primary-600">App</h1>
                    <ThemeSelector />
                </div>
            </header>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed left-0 top-0 h-screen w-64 border-r border-primary-100 bg-white p-6">
                <h1 className="text-xl font-bold text-primary-600 mb-6">App</h1>
                <ThemeSelector />
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-4 lg:p-8">
                <ThemedCard className="p-6">
                    <h2 className="text-2xl font-bold text-primary-600">Content</h2>
                </ThemedCard>
            </main>
        </div>
    );
}

// ============================================
// Example 12: Theme-aware Animation
// ============================================
function AnimatedButton() {
    return (
        <button
            className="relative overflow-hidden bg-primary-100 text-primary-600 rounded-full px-6 py-3 font-medium transition-all hover:bg-primary-200 hover:shadow-lg"
            style={{
                '--shine-color': 'var(--primary)',
            }}
        >
            <span className="relative z-10">Animated Button</span>
            <div
                className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
                style={{
                    background: 'linear-gradient(90deg, transparent, var(--shine-color, #fff), transparent)',
                    opacity: 0.3,
                }}
            />
        </button>
    );
}

// ============================================
// CSS for animations (add to globals.css)
// ============================================
/*
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
*/
