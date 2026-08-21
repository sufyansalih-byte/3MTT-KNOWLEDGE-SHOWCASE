import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { Button, Input, LoadingSpinner } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface StateData {
  state: string;
  cities: string[];
}

const NIGERIA_STATES: StateData[] = [
  { state: 'Abia', cities: ['Umuahia', 'Aba', 'Arochukwu', 'Ohafia'] },
  { state: 'Adamawa', cities: ['Yola', 'Mubi', 'Jimeta', 'Numan'] },
  { state: 'Akwa Ibom', cities: ['Uyo', 'Eket', 'Ikot Ekpene', 'Oron'] },
  { state: 'Anambra', cities: ['Awka', 'Onitsha', 'Nnewi', 'Ekwulobia'] },
  { state: 'Bauchi', cities: ['Bauchi', 'Azare', 'Misau', 'Ningi'] },
  { state: 'Bayelsa', cities: ['Yenagoa', 'Brass', 'Sagbama', 'Ogbia'] },
  { state: 'Benue', cities: ['Makurdi', 'Gboko', 'Otukpo', 'Katsina-Ala'] },
  { state: 'Borno', cities: ['Maiduguri', 'Biu', 'Bama', 'Dikwa'] },
  { state: 'Cross River', cities: ['Calabar', 'Ugep', 'Ikom', 'Ogoja'] },
  { state: 'Delta', cities: ['Asaba', 'Warri', 'Sapele', 'Ughelli'] },
  { state: 'Ebonyi', cities: ['Abakaliki', 'Afikpo', 'Onueke', 'Ezza'] },
  { state: 'Edo', cities: ['Benin City', 'Auchi', 'Ekpoma', 'Uromi'] },
  { state: 'Ekiti', cities: ['Ado-Ekiti', 'Ikere-Ekiti', 'Ise-Ekiti', 'Oye-Ekiti'] },
  { state: 'Enugu', cities: ['Enugu', 'Nsukka', 'Oji River', 'Awgu'] },
  { state: 'FCT (Abuja)', cities: ['Abuja Municipal', 'Gwagwalada', 'Kuje', 'Bwari', 'Kubwa'] },
  { state: 'Gombe', cities: ['Gombe', 'Kaltungo', 'Billiri', 'Dukku'] },
  { state: 'Imo', cities: ['Owerri', 'Orlu', 'Okigwe', 'Mbaise'] },
  { state: 'Jigawa', cities: ['Dutse', 'Hadejia', 'Gumel', 'Birnin Kudu'] },
  { state: 'Kaduna', cities: ['Kaduna', 'Zaria', 'Kafanchan', 'Kagoro'] },
  { state: 'Kano', cities: ['Kano', 'Wudil', 'Rano', 'Gwarzo'] },
  { state: 'Katsina', cities: ['Katsina', 'Funtua', 'Daura', 'Malumfashi'] },
  { state: 'Kebbi', cities: ['Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru'] },
  { state: 'Kogi', cities: ['Lokoja', 'Okene', 'Kabba', 'Idah'] },
  { state: 'Kwara', cities: ['Ilorin', 'Offa', 'Omu-Aran', 'Patigi'] },
  { state: 'Lagos', cities: ['Lagos Island', 'Ikeja', 'Lekki', 'Surulere', 'Badagry', 'Epe'] },
  { state: 'Nasarawa', cities: ['Lafia', 'Keffi', 'Akwanga', 'Nasarawa'] },
  { state: 'Niger', cities: ['Minna', 'Bida', 'Suleja', 'Kontagora'] },
  { state: 'Ogun', cities: ['Abeokuta', 'Sagamu', 'Ijebu Ode', 'Ota'] },
  { state: 'Ondo', cities: ['Akure', 'Ondo City', 'Owo', 'Ikare-Akoko'] },
  { state: 'Osun', cities: ['Osogbo', 'Ile-Ife', 'Ilesa', 'Ede'] },
  { state: 'Oyo', cities: ['Ibadan', 'Ogbomoso', 'Oyo Town', 'Saki'] },
  { state: 'Plateau', cities: ['Jos', 'Bukuru', 'Pankshin', 'Shendam'] },
  { state: 'Rivers', cities: ['Port Harcourt', 'Bonny', 'Eleme', 'Ahoada'] },
  { state: 'Sokoto', cities: ['Sokoto', 'Tambuwal', 'Wurno', 'Gwadabawa'] },
  { state: 'Taraba', cities: ['Jalingo', 'Wukari', 'Bali', 'Gembu'] },
  { state: 'Yobe', cities: ['Damaturu', 'Potiskum', 'Gashua', 'Nguru'] },
  { state: 'Zamfara', cities: ['Gusau', 'Kaura Namoda', 'Talata Mafara', 'Anka'] },
];

const getCitiesForState = (stateName: string): string[] => {
  const found = NIGERIA_STATES.find((s) => s.state === stateName);
  return found ? found.cities : [];
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, completeOnboarding, error: authError, signOut } = useAuth();

  const [role, setRole] = useState<'student' | 'organization'>('student');
  const [roleResolved, setRoleResolved] = useState(false);
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [industry, setIndustry] = useState('');
  const [cacNumber, setCacNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableCities = getCitiesForState(state);

  // Guards: unverified/unauthenticated users go back to sign in;
  // users who already have a profile are already onboarded.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth/signin');
      return;
    }
    if (profile) {
      const target =
        profile.role === 'admin'
          ? '/dashboard/admin'
          : profile.role === 'organization'
          ? '/dashboard/organization'
          : '/dashboard/student';
      navigate(target);
    }
  }, [user, profile, authLoading, navigate]);

  // Pull the intended role chosen at signup time out of the user's metadata.
  useEffect(() => {
    const resolveRole = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      const pendingRole = currentUser?.user_metadata?.pending_role;
      if (pendingRole === 'organization' || pendingRole === 'student') {
        setRole(pendingRole);
      }
      setRoleResolved(true);
    };
    if (user) resolveRole();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await completeOnboarding(fullName, role, {
        institution,
        matric_number: matricNumber,
        department: fieldOfStudy,
        industry,
        cac_number: cacNumber,
        contact_name: contactName,
        state,
        city,
        description,
        website,
        address,
      });

      if (result.error) {
        setError(result.error);
      } else {
        const target = role === 'organization' ? '/dashboard/organization' : '/dashboard/student';
        navigate(target);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !roleResolved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="lg" className="text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <div className="w-full bg-gradient-to-br from-primary-600 to-primary-900 p-6 sm:p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-center items-center text-center border-b-4 border-primary-500 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]" />
        <div className="max-w-xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-medium">
            <span>✅ Email verified</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold leading-tight">
            Just a few more details
          </h2>
          <p className="text-primary-100 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            Complete your {role === 'student' ? 'student' : 'organization'} profile to get to your dashboard.
          </p>
        </div>
      </div>

      <div className="w-full flex-1 flex flex-col justify-start py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto w-full bg-white p-6 sm:p-8 rounded-2xl border border-secondary-200/60 shadow-sm">
          <div className="mb-6 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-secondary-900">
              SIWES<span className="text-primary-600">Connect</span>
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'student' ? (
              <div className="space-y-4 border-l-2 border-green-600 pl-3 bg-secondary-50/50 p-3 rounded-r-xl">
                <Input label="Full Name" type="text" placeholder="Musa Ibrahim" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Field of Study</label>
                  <select
                    required
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Select your field</option>
                    <option value="engineering">Engineering & Technology</option>
                    <option value="environmental">Environmental Sciences (Architecture, Estate Mgmt, Surveying)</option>
                    <option value="sciences">Sciences (Computer Science, Biochemistry, Microbiology, etc.)</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="medical">Medical & Health Sciences</option>
                    <option value="education">Education</option>
                    <option value="arts_design">Arts & Design</option>
                    <option value="hospitality">Hospitality & Management</option>
                    <option value="mass_comm">Mass Communication & Media</option>
                    <option value="veterinary">Veterinary Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Matriculation Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 2021/123456"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Name of Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. University of Nigeria"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">State of Institution</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Select state</option>
                    {NIGERIA_STATES.map((s) => (
                      <option key={s.state} value={s.state}>
                        {s.state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4 border-l-2 border-primary-500 pl-3 bg-secondary-50/50 p-3 rounded-r-xl">
                <Input label="Company / Host Organization Name" type="text" placeholder="e.g. Innoson Motors or TechCorp" value={fullName} onChange={(e) => setFullName(e.target.value)} required />

                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Corporate CAC RC Number</label>
                  <input
                    type="text"
                    placeholder="RC-1234567"
                    value={cacNumber}
                    onChange={(e) => setCacNumber(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Street Address (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 15 Industrial Layout Road"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary-700 mb-1">State</label>
                    <select
                      required
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setCity('');
                      }}
                      className="w-full px-2.5 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    >
                      <option value="">Select state</option>
                      {NIGERIA_STATES.map((s) => (
                        <option key={s.state} value={s.state}>
                          {s.state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-secondary-700 mb-1">City</label>
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={!state}
                      className="w-full px-2.5 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-secondary-100 disabled:text-secondary-400"
                    >
                      <option value="">{state ? 'Select city' : 'Select state first'}</option>
                      {availableCities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-secondary-700 mb-1">Primary Sector</label>
                  <select
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-2.5 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Select sector</option>
                    <option value="engineering">Engineering & Technology</option>
                    <option value="environmental">Environmental Sciences</option>
                    <option value="sciences">Sciences</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="medical">Medical & Health Sciences</option>
                    <option value="education">Education</option>
                    <option value="arts_design">Arts & Design</option>
                    <option value="hospitality">Hospitality & Management</option>
                    <option value="mass_comm">Mass Communication & Media</option>
                    <option value="veterinary">Veterinary Medicine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">HR Representative / Contact Name</label>
                  <input
                    type="text"
                    placeholder="Enter officer name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Company Description (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe what your organization does and what trainees can expect to learn."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Company Website (optional)</label>
                  <input
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 bg-white text-secondary-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>
            )}

            {(error || authError) && (
              <div className="p-3 rounded-xl bg-error-50 border border-error-200">
                <p className="text-xs text-error-700">{error || authError}</p>
              </div>
            )}

            <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium" size="lg" isLoading={loading}>
              Complete Profile & Go to Dashboard
            </Button>
          </form>

          <button
            type="button"
            onClick={() => signOut()}
            className="mt-4 w-full text-center text-xs text-secondary-400 hover:text-error-600"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
