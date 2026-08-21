import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff, ArrowLeft, MailCheck, Rocket, Building2 } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type AuthMode = 'signin' | 'signup';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile, signIn, signUp, loading: authLoading, error: authError } = useAuth();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [roleChosen, setRoleChosen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'organization'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [awaitingEmailConfirmation, setAwaitingEmailConfirmation] = useState(false);

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    const roleParam = searchParams.get('role');

    if (modeParam === 'signup') setMode('signup');
    if (roleParam === 'organization' || roleParam === 'student') {
      setRole(roleParam);
      setRoleChosen(true);
      setMode('signup');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user || awaitingEmailConfirmation) return;

    if (profile) {
      if (profile.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (profile.role === 'organization') {
        navigate('/dashboard/organization');
      } else {
        navigate('/dashboard/student');
      }
    } else if (!authLoading) {
      // User is signed in (email confirmation not required, or already confirmed)
      // but hasn't filled in their profile details yet.
      navigate('/onboarding');
    }
  }, [user, profile, authLoading, awaitingEmailConfirmation, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        }
      } else {
        const result = await signUp(email, password, role);
        if (result.error) {
          setError(result.error);
        } else if (result.needsEmailConfirmation) {
          setAwaitingEmailConfirmation(true);
        }
        // If confirmation isn't required, the useEffect above will redirect to /onboarding.
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    const nextMode = mode === 'signin' ? 'signup' : 'signin';
    setMode(nextMode);
    if (nextMode === 'signup') setRoleChosen(false);
    setAwaitingEmailConfirmation(false);
    setError(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <div className="w-full bg-gradient-to-br from-primary-600 to-primary-900 p-6 sm:p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center items-center text-center border-b-4 border-primary-500 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
        <div className="max-w-xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-medium">
            <Rocket className="w-3.5 h-3.5" />
            <span>3MTT Knowledge Showcase 2.0</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
            Empowering the next generation of Nigerian Tech Talent.
          </h2>
          <p className="text-primary-100 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Bridge the gap between institutional learning and industrial application directly from your mobile device.
          </p>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-start py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full bg-white p-6 sm:p-8 rounded-2xl border border-secondary-200/60 shadow-sm">
          <Link to="/" className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-800 text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="mb-6 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-secondary-900">
              SIWES<span className="text-primary-600">Connect</span>
            </span>
          </div>

          {awaitingEmailConfirmation ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <MailCheck className="w-7 h-7 text-primary-600" />
              </div>
              <h1 className="font-heading text-xl font-bold text-secondary-900 mb-2">Check your email</h1>
              <p className="text-sm text-secondary-500 mb-6">
                We've sent a confirmation link to <span className="font-medium text-secondary-800">{email}</span>.
                Click the link to verify your account, then you'll be taken to finish setting up your profile.
              </p>
              <button
                type="button"
                onClick={() => {
                  setAwaitingEmailConfirmation(false);
                  setMode('signin');
                }}
                className="text-primary-600 hover:text-primary-700 text-sm font-semibold"
              >
                Back to sign in
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="font-heading text-xl font-bold text-secondary-900 mb-1">
                  {mode === 'signin' ? 'Welcome back' : roleChosen ? (role === 'student' ? 'Create your student account' : 'Register your organization') : 'Create your account'}
                </h1>
                <p className="text-xs sm:text-sm text-secondary-500">
                  {mode === 'signin' ? 'Sign in to access your secure portal.' : 'Join thousands of students and host organizations across Nigeria.'}
                </p>
              </div>

              {mode === 'signup' && !roleChosen ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-secondary-700 mb-1">I want to sign up as a:</p>
                  <button
                    type="button"
                    onClick={() => { setRole('student'); setRoleChosen(true); }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-secondary-200 hover:border-primary-500 hover:bg-primary-50/50 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900 text-sm">Student</p>
                      <p className="text-xs text-secondary-500">Find and apply for verified SIWES placements</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRole('organization'); setRoleChosen(true); }}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-secondary-200 hover:border-primary-500 hover:bg-primary-50/50 transition-all text-left"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-900 text-sm">Host Organization</p>
                      <p className="text-xs text-secondary-500">Post SIWES openings and manage trainees</p>
                    </div>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {mode === 'signup' && (
                    <button
                      type="button"
                      onClick={() => setRoleChosen(false)}
                      className="inline-flex items-center gap-1.5 text-xs text-secondary-500 hover:text-primary-600 mb-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {role === 'student' ? 'Signing up as Student' : 'Signing up as Host Organization'} — change
                    </button>
                  )}

                  <Input label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

                  <div>
                    <label className="block text-xs font-semibold text-secondary-700 mb-1">Password</label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 pr-10 transition-all" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 z-10">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div className="pt-1">
                      <p className="text-[11px] text-secondary-400">
                        Signing up as <span className="font-semibold text-secondary-600">{role === 'student' ? 'Student' : 'Host Organization'}</span>.
                        You'll fill in the rest of your details after verifying your email.
                      </p>
                    </div>
                  )}

                  {(error || authError) && (
                    <div className="p-3 rounded-xl bg-error-50 border border-error-200">
                      <p className="text-xs text-error-700">{error || authError}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium" size="lg" isLoading={loading}>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>
              )}

              <div className="mt-5 text-center text-xs sm:text-sm space-y-2">
                <p className="text-secondary-500">
                  {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button type="button" onClick={toggleMode} className="text-primary-600 hover:text-primary-700 font-bold ml-0.5">
                    {mode === 'signin' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email) {
                        setError('Enter your email above first, then click "Forgot password?" again.');
                        return;
                      }
                      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: `${window.location.origin}/auth/reset-password`,
                      });
                      if (resetError) {
                        setError(resetError.message);
                      } else {
                        setError(null);
                        alert('Password reset link sent! Check your email.');
                      }
                    }}
                    className="text-secondary-400 hover:text-primary-600 underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
