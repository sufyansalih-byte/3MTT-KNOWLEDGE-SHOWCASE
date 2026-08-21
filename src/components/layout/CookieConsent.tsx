import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'siwes_cookie_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) setVisible(true);
    } catch {
      // If localStorage is unavailable, don't block rendering the app.
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      // Ignore storage errors — the banner will just reappear next visit.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-secondary-900 text-white rounded-2xl shadow-xl border border-secondary-700 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <p className="text-sm text-secondary-200 flex-1 leading-relaxed">
          We use only essential session cookies to keep you signed in securely. We don't use tracking,
          advertising, or third-party analytics cookies.{' '}
          <Link to="/cookies" className="underline text-white hover:text-primary-300">
            Learn more
          </Link>
        </p>
        <button
          type="button"
          onClick={accept}
          className="w-full sm:w-auto flex-shrink-0 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
