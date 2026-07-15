import { Link } from 'react-router-dom';
import { SearchX, Home } from 'lucide-react';
import FadeIn from '../components/FadeIn';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <FadeIn className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-6">
          <SearchX className="w-8 h-8 text-brand-600" />
        </div>
        <h1 className="text-3xl font-bold text-ink-900 mb-2">Page Not Found</h1>
        <p className="text-ink-500 mb-8">
          The page you're looking for doesn't exist, or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Home
        </Link>
      </FadeIn>
    </div>
  );
}
