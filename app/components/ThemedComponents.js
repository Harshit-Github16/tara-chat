'use client';

// Reusable themed components that use CSS variables
// Use these instead of hardcoded Tailwind classes

export function ThemedButton({ children, variant = 'primary', className = '', ...props }) {
    const baseStyles = 'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors';

    const variants = {
        primary: {
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
        },
        outline: {
            borderWidth: '1px',
            borderColor: 'var(--border)',
            color: 'var(--primary)',
        },
    };

    return (
        <button
            className={`${baseStyles} ${className}`}
            style={variants[variant]}
            {...props}
        >
            {children}
        </button>
    );
}

export function ThemedCard({ children, className = '', ...props }) {
    return (
        <div
            className={`rounded-2xl bg-white shadow-sm ${className}`}
            style={{ borderWidth: '1px', borderColor: 'var(--border)' }}
            {...props}
        >
            {children}
        </div>
    );
}

export function ThemedGradient({ children, className = '', ...props }) {
    return (
        <div
            className={className}
            style={{
                background: `linear-gradient(to bottom right, var(--primary-light), white, var(--primary-light))`,
            }}
            {...props}
        >
            {children}
        </div>
    );
}

export function ThemedInput({ className = '', ...props }) {
    return (
        <input
            className={`w-full rounded-lg px-3 py-2 text-sm outline-none ${className}`}
            style={{
                borderWidth: '1px',
                borderColor: 'var(--border)',
            }}
            onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
            }}
            {...props}
        />
    );
}

export function ThemedTextarea({ className = '', ...props }) {
    return (
        <textarea
            className={`w-full rounded-xl px-4 py-3 text-sm outline-none resize-none ${className}`}
            style={{
                borderWidth: '1px',
                borderColor: 'var(--border)',
            }}
            onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
            }}
            onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
            }}
            {...props}
        />
    );
}

export function ThemedBadge({ children, className = '', ...props }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}
            style={{
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
            }}
            {...props}
        >
            {children}
        </span>
    );
}

export function ThemedSpinner({ className = '' }) {
    return (
        <div
            className={`w-12 h-12 border-4 rounded-full animate-spin ${className}`}
            style={{
                borderColor: 'var(--border)',
                borderTopColor: 'var(--primary)',
            }}
        />
    );
}
