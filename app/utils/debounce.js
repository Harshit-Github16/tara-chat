// Debounce utility to prevent multiple API calls
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle utility for heartbeat events
export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Request queue to prevent duplicate API calls
class RequestQueue {
    constructor() {
        this.pending = new Map();
    }

    async execute(key, requestFn) {
        // If request is already pending, return the existing promise
        if (this.pending.has(key)) {
            return this.pending.get(key);
        }

        // Create new request
        const promise = requestFn().finally(() => {
            this.pending.delete(key);
        });

        this.pending.set(key, promise);
        return promise;
    }
}

export const trackingQueue = new RequestQueue();