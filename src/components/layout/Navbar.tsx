import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  GraduationCap,
  LayoutDashboard,
  User,
  LogIn,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const publicNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Placements', href: '/placements' },
  { label: 'Brief History', href: '/history' },
  { label: 'About', href: '/about' },
];

export function Navbar() {
  const { user, profile, signOut, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getDashboardPath = () => {
    if (!profile) return '/';
    return profile.role === 'organization' ? '/dashboard/organization' : '/dashboard/student';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-secondary-100">
      <div className="container-app">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl text-secondary-900">
              SIWES<span className="text-primary-600">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive(item.href)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="w-20 h-9 bg-secondary-100 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                    {profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-sm font-medium text-secondary-700 max-w-[120px] truncate">
                    {profile?.full_name || 'User'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-secondary-200 shadow-lg py-2 z-50 animate-slide-down">
                      <div className="px-4 py-2 border-b border-secondary-100">
                        <p className="text-sm font-medium text-secondary-800">{profile?.full_name}</p>
                        <p className="text-xs text-secondary-500">{profile?.email}</p>
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 capitalize">
                          {profile?.role}
                        </span>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>

                      <div className="border-t border-secondary-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            signOut();
                          }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-error-600 hover:bg-error-50"
                        >
                          <LogIn className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-secondary-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-secondary-700" />
            ) : (
              <Menu className="w-6 h-6 text-secondary-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-secondary-100 animate-slide-down">
          <div className="container-app py-4 space-y-1">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-colors
                  ${isActive(item.href)
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-secondary-600 hover:bg-secondary-50'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 mt-4 border-t border-secondary-100 space-y-2">
              {loading ? (
                <div className="h-10 bg-secondary-100 rounded-xl animate-pulse" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                      {profile?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-secondary-800">{profile?.full_name}</p>
                      <p className="text-xs text-secondary-500">{profile?.email}</p>
                    </div>
                  </div>

                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary-600 hover:bg-secondary-50"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary-600 hover:bg-secondary-50"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-error-600 hover:bg-error-50"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth/signin" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}