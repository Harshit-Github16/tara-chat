"use client";
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    const styles = {
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            icon: faCheckCircle,
            iconColor: 'text-green-500'
        },
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: faExclamationCircle,
            iconColor: 'text-red-500'
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: faInfoCircle,
            iconColor: 'text-blue-500'
        }
    };

    const style = styles[type] || styles.success;

    return (
        <div className={`fixed top-4 right-4 z-[9999] animate-slide-in-right`}>
            <div className={`${style.bg} ${style.border} border rounded-xl shadow-lg p-4 min-w-[300px] max-w-md`}>
                <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={style.icon} className={`${style.iconColor} h-5 w-5 flex-shrink-0 mt-0.5`} />
                    <p className={`${style.text} text-sm font-medium flex-1`}>{message}</p>
                    <button
                        onClick={onClose}
                        className={`${style.text} hover:opacity-70 transition-opacity`}
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Toast Container Component
export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                    duration={toast.duration}
                />
            ))}
        </div>
    );
}
