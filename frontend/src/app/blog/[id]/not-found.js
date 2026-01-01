import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
            <div className="text-center max-w-md mx-auto px-4">
                <FontAwesomeIcon icon={faNewspaper} className="h-24 w-24 text-gray-300 mb-6" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Blog Post Not Found</h1>
                <p className="text-gray-600 mb-6">
                    The article you're looking for doesn't exist or has been moved.
                    It might have been deleted or the URL might be incorrect.
                </p>
                <div className="space-y-3">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-full hover:bg-rose-700 transition-colors font-medium"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                        Back to Blog
                    </Link>
                    <div>
                        <Link
                            href="/"
                            className="text-rose-600 hover:text-rose-700 transition-colors"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}