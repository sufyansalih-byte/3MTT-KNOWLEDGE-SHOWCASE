import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, CardBody, Badge, Input } from '../components/ui';
import {
  Users,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  Building2,
  MapPin,
  Calendar,
  ChevronDown,
  Search,
  TrendingUp,
  Bell,
  Plus,
  Home,
  LogOut,
  FileText,
  ExternalLink,
  FileCheck,
} from 'lucide-react';

const NIGERIA_STATES: { state: string; cities: string[] }[] = [
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

type TabType = 'overview' | 'applications' | 'placements' | 'profile';
type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

interface ApplicantDocument {
  id: string;
  document_type: 'id_card' | 'passport_photo' | 'siwes_letter';
  file_name: string;
  file_url: string;
}

interface Applicant {
  id: string;
  application_id: string;
  name: string;
  email: string;
  institution: string;
  department: string;
  level: string;
  matric_number: string;
  application_date: string;
  placement_title: string;
  status: ApplicationStatus;
  cover_letter: string;
  documents: ApplicantDocument[];
}

interface PlacementRow {
  id: string;
  title: string;
  department: string | null;
  slots_available: number;
  is_active: boolean;
  deadline: string | null;
}

export function OrganizationDashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [orgId, setOrgId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [placements, setPlacements] = useState<PlacementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState(false);

  interface NotificationRow {
    id: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
  }
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    setNotifications(data ?? []);
  }, [user]);

  const markNotificationRead = async (notifId: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
    setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n)));
  };

  // Create placement modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formState, setFormState] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formDuration, setFormDuration] = useState('');
  const [formSlots, setFormSlots] = useState('1');
  const [formDeadline, setFormDeadline] = useState('');
  const [creating, setCreating] = useState(false);

  const availableCities = NIGERIA_STATES.find((s) => s.state === formState)?.cities ?? [];

  // Edit Profile state
  const [profileDescription, setProfileDescription] = useState('');
  const [profileWebsite, setProfileWebsite] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profileContactName, setProfileContactName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) navigate('/auth/signin');
    else if (profile && profile.role !== 'organization') navigate('/dashboard');
  }, [user, profile, authLoading, navigate]);

  // Data fetching
  const fetchData = useCallback(async () => {
  if (!user) return;
  setLoading(true);

  const { data: orgRow } = await supabase
    .from('organizations')
    .select('id, is_verified')
    .eq('profile_id', user.id)
    .maybeSingle();

  if (!orgRow) {
    setLoading(false);
    return;
  }

  setOrgId(orgRow.id);
  setIsVerified(orgRow.is_verified);

  const { data: fullOrgRow } = await supabase
    .from('organizations')
    .select('description, website, address, contact_name')
    .eq('id', orgRow.id)
    .maybeSingle();

  if (fullOrgRow) {
    setProfileDescription(fullOrgRow.description || '');
    setProfileWebsite(fullOrgRow.website || '');
    setProfileAddress(fullOrgRow.address || '');
    setProfileContactName(fullOrgRow.contact_name || '');
  }

  const { data: placementsData } = await supabase
    .from('placements')
    .select('id, title, department, slots_available, is_active, deadline')
    .eq('organization_id', orgRow.id)
    .order('created_at', { ascending: false });

  setPlacements(placementsData ?? []);

  const ids = (placementsData ?? []).map((p: any) => p.id);

  if (ids.length > 0) {
    const { data: appsData } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        cover_letter,
        created_at,
        placement_id,
        placements(title),
        students(
          id,
          institution,
          department,
          level,
          matric_number,
          profiles(full_name, email)
        )
      `)
      .in('placement_id', ids)
      .order('created_at', { ascending: false });

    const shaped: Applicant[] = (appsData ?? []).map((row: any) => ({
      id: row.students?.id ?? row.id,
      application_id: row.id,
      name: row.students?.profiles?.full_name ?? 'Unknown Student',
      email: row.students?.profiles?.email ?? '',
      institution: row.students?.institution ?? '',
      department: row.students?.department ?? '',
      level: row.students?.level ?? '',
      matric_number: row.students?.matric_number ?? '',
      application_date: row.created_at,
      placement_title: row.placements?.title ?? '',
      status: row.status,
      cover_letter: row.cover_letter ?? '',
      documents: [],
    }));

    setApplicants(shaped);
  }

  setLoading(false);
}, [user]);

const handleSaveProfile = async () => {
  if (!orgId) return;

  setSavingProfile(true);
  setProfileSaved(false);

  const { error } = await supabase
    .from('organizations')
    .update({
      description: profileDescription || null,
      website: profileWebsite || null,
      address: profileAddress || null,
      contact_name: profileContactName || null,
    })
    .eq('id', orgId);

  setSavingProfile(false);

  if (!error) {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }
};

useEffect(() => {
  if (user) fetchData();
}, [user, fetchData]);

useEffect(() => {
  if (user) fetchNotifications();
}, [user, fetchNotifications]);
  // Handlers
  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleSelectApplicant = async (applicant: Applicant) => {
    setSelectedApplicant({ ...applicant, documents: [] });
    setLoadingDocuments(true);

const { data: docs } = await supabase
      .from('student_documents')
      .select('id, document_type, file_name, file_url')
      .eq('student_id', applicant.id);

    if (docs && docs.length > 0) {
      const docsWithSignedUrls = await Promise.all(
        docs.map(async (doc) => {
          const { data: signedData } = await supabase.storage
            .from('student-documents')
            .createSignedUrl(doc.file_url, 3600);
          return { ...doc, file_url: signedData?.signedUrl ?? doc.file_url };
        })
      );
      setSelectedApplicant((prev) => prev ? { ...prev, documents: docsWithSignedUrls as ApplicantDocument[] } : null);
    }
    setLoadingDocuments(false);
  };

  const handleStatusUpdate = async (applicantId: string, newStatus: ApplicationStatus) => {
    const appId = applicants.find((a) => a.id === applicantId)?.application_id;
    if (!appId) return;
    setUpdatingId(applicantId);
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId);
    if (!error) {
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicantId ? { ...a, status: newStatus } : a))
      );
      setSelectedApplicant((prev) =>
        prev?.id === applicantId ? { ...prev, status: newStatus } : prev
      );
    }
    setUpdatingId(null);
  };

  const handleCreatePlacement = async () => {
    if (!orgId || !formTitle) return;
    setCreating(true);
    const locationStr = formCity && formState ? `${formCity}, ${formState}` : formState || null;
    const { error } = await supabase.from('placements').insert({
      organization_id: orgId,
      title: formTitle,
      description: formDescription || null,
      department: formDepartment || null,
      location: locationStr,
      duration_weeks: parseInt(formDuration) || null,
      slots_available: parseInt(formSlots) || 1,
      requirements: [],
      is_active: true,
      deadline: formDeadline || null,
    });
    if (!error) {
      setShowCreateModal(false);
      setFormTitle('');
      setFormDescription('');
      setFormDepartment('');
      setFormState('');
      setFormCity('');
      setFormDuration('');
      setFormSlots('1');
      setFormDeadline('');
      fetchData();
    }
    setCreating(false);
  };

  // Helpers
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success" dot>Accepted</Badge>;
      case 'rejected':
        return <Badge variant="error" dot>Rejected</Badge>;
      default:
        return <Badge variant="warning" dot>Pending</Badge>;
    }
  };

  const filteredApplicants = applicants.filter((a) => {
    const matchSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    totalApplicants: applicants.length,
    pending: applicants.filter((a) => a.status === 'pending').length,
    accepted: applicants.filter((a) => a.status === 'accepted').length,
    activePlacements: placements.filter((p) => p.is_active).length,
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-secondary-100 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-sm text-secondary-500">Welcome back,</p>
            <h1 className="font-heading font-bold text-lg text-secondary-900">
              {profile?.full_name?.split(' ')[0] || 'Organization'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
            >
              <Home className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
              >
                <Bell className="w-4 h-4" />
                {notifications.some((n) => !n.is_read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl border border-secondary-200 shadow-lg z-50 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-secondary-500 text-center">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-left p-3 border-b border-secondary-100 last:border-0 hover:bg-secondary-50 ${!n.is_read ? 'bg-primary-50/50' : ''}`}
                      >
                        <p className="text-xs text-secondary-800">{n.message}</p>
                        <p className="text-[10px] text-secondary-400 mt-1">{new Date(n.created_at).toLocaleDateString('en-NG')}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="flex overflow-x-auto px-4 pb-3 gap-2 scrollbar-hide border-t border-secondary-100 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'overview' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'applications' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
            }`}
          >
            <Users className="w-4 h-4" />
            Trainees
            {stats.pending > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === 'applications' ? 'bg-white/20 text-white' : 'bg-warning-100 text-warning-700'
                }`}
              >
                {stats.pending}
              </span>
            )}
          </button>
         <button
            onClick={() => setActiveTab('placements')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'placements' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Placements
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'profile' ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="container-app py-6 lg:py-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl font-bold text-secondary-900">Organization Dashboard</h1>
            <p className="text-secondary-600 mt-1">
              Manage your SIWES placements and review trainee applications
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary-50 border border-secondary-200 text-secondary-700 hover:bg-secondary-100"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl bg-secondary-50 border border-secondary-200 text-secondary-700 hover:bg-secondary-100 transition-all"
              >
                <Bell className="w-5 h-5" />
                {notifications.some((n) => !n.is_read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-500 rounded-full" />
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-secondary-200 shadow-lg z-50 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-sm text-secondary-500 text-center">No notifications yet.</p>
                  ) : (
                    notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`w-full text-left p-3 border-b border-secondary-100 last:border-0 hover:bg-secondary-50 ${!n.is_read ? 'bg-primary-50/50' : ''}`}
                      >
                        <p className="text-xs text-secondary-800">{n.message}</p>
                        <p className="text-[10px] text-secondary-400 mt-1">{new Date(n.created_at).toLocaleDateString('en-NG')}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden lg:flex gap-2 mb-8 border-b border-secondary-200 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-[1px] ${
              activeTab === 'overview'
                ? 'text-primary-700 border-primary-600 bg-primary-50'
                : 'text-secondary-500 border-transparent hover:text-secondary-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-[1px] ${
              activeTab === 'applications'
                ? 'text-primary-700 border-primary-600 bg-primary-50'
                : 'text-secondary-500 border-transparent hover:text-secondary-700'
            }`}
          >
            Trainee Applications
            {stats.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-warning-100 text-warning-700">
                {stats.pending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('placements')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-[1px] ${
              activeTab === 'placements'
                ? 'text-primary-700 border-primary-600 bg-primary-50'
                : 'text-secondary-500 border-transparent hover:text-secondary-700'
            }`}
          >
            Manage Placements
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-[1px] ${
              activeTab === 'profile'
                ? 'text-primary-700 border-primary-600 bg-primary-50'
                : 'text-secondary-500 border-transparent hover:text-secondary-700'
            }`}
          >
            Edit Profile
          </button>
        </div>

        {/* Unverified Warning */}
        {!isVerified && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <span className="text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-amber-900 text-sm">Account Pending Admin Verification</p>
              <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
                Your organization is under review. Placements you create will not appear to students until an admin
                approves your CAC registration. This usually takes less than 24 hours.
              </p>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              <Card className="p-4 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-secondary-900">{stats.totalApplicants}</p>
                    <p className="text-xs lg:text-sm text-secondary-500">Total Trainees</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-warning-100 text-warning-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-secondary-900">{stats.pending}</p>
                    <p className="text-xs lg:text-sm text-secondary-500">Awaiting Decision</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-success-100 text-success-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-secondary-900">{stats.accepted}</p>
                    <p className="text-xs lg:text-sm text-secondary-500">Accepted</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 lg:p-6">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl lg:text-3xl font-bold text-secondary-900">{stats.activePlacements}</p>
                    <p className="text-xs lg:text-sm text-secondary-500">Active Placements</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Trainees */}
            <Card>
              <CardBody className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg text-secondary-900">Recent Trainee Applications</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveTab('applications')}
                    rightIcon={<ChevronDown className="w-4 h-4 rotate-[-90deg]" />}
                  >
                    View All
                  </Button>
                </div>

                {applicants.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                    <p className="text-secondary-600">No applications yet</p>
                    <p className="text-sm text-secondary-500 mt-1">
                      Create a placement to start receiving trainee applications.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applicants.slice(0, 4).map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary-50 hover:bg-secondary-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-bold text-sm flex items-center justify-center">
                            {applicant.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-secondary-900 truncate">{applicant.name}</p>
                            <p className="text-xs text-secondary-500 truncate">
                              {applicant.institution} • {applicant.department}
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          {getStatusBadge(applicant.status)}
                          <Button size="sm" variant="ghost" onClick={() => handleSelectApplicant(applicant)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="justify-start h-auto py-4 px-4"
                onClick={() => setActiveTab('applications')}
              >
                <Users className="w-5 h-5 text-accent-600" />
                <div className="text-left ml-3">
                  <p className="font-medium text-secondary-900">Review Applications</p>
                  <p className="text-xs text-secondary-500">{stats.pending} pending</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="justify-start h-auto py-4 px-4"
                onClick={() => setActiveTab('placements')}
              >
                <Briefcase className="w-5 h-5 text-primary-600" />
                <div className="text-left ml-3">
                  <p className="font-medium text-secondary-900">Manage Placements</p>
                  <p className="text-xs text-secondary-500">{stats.activePlacements} active</p>
                </div>
              </Button>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Search by name, institution, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
                className="px-4 py-3 rounded-xl border border-secondary-200 bg-white text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Applicants List */}
            <div className="space-y-4">
              {filteredApplicants.length === 0 ? (
                <Card>
                  <CardBody className="py-12">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                      <p className="text-secondary-900 font-medium">No trainees found</p>
                      <p className="text-sm text-secondary-500 mt-1">Try adjusting your filters or search query</p>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                filteredApplicants.map((applicant) => (
                  <Card key={applicant.id} hover>
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {/* Applicant Info */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-700 font-bold text-lg flex items-center justify-center flex-shrink-0">
                            {applicant.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-secondary-900">{applicant.name}</h3>
                            <p className="text-sm text-secondary-500">{applicant.email}</p>
                            <div className="space-y-1 mt-2 text-sm text-secondary-600">
                              <p className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-secondary-400" />
                                {applicant.institution}
                              </p>
                              <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-secondary-400" />
                                {applicant.department} • {applicant.level}
                              </p>
                              <p className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-secondary-400" />
                                Applied: {new Date(applicant.application_date).toLocaleDateString('en-NG')}
                              </p>
                              <p className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-secondary-400" />
                                Placement: {applicant.placement_title}
                              </p>
                              {applicant.matric_number && (
                                <p className="text-xs text-secondary-500">Matric No: {applicant.matric_number}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex-shrink-0">{getStatusBadge(applicant.status)}</div>
                      </div>

                      {/* Cover Letter */}
                      {applicant.cover_letter && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-secondary-500 mb-1">Cover Note:</p>
                          <p className="text-sm text-secondary-600 line-clamp-2">{applicant.cover_letter}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-secondary-100">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSelectApplicant(applicant)}
                          leftIcon={<Eye className="w-4 h-4" />}
                        >
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" leftIcon={<MessageSquare className="w-4 h-4" />}>
                          Message
                        </Button>
                        <div className="flex-1" />
                        {applicant.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-success-600 text-white hover:bg-success-700"
                              onClick={() => handleStatusUpdate(applicant.id, 'accepted')}
                              disabled={updatingId === applicant.id}
                              leftIcon={<CheckCircle2 className="w-4 h-4" />}
                            >
                              Accept for Attachment
                            </Button>
                            <Button
                              size="sm"
                              className="bg-error-50 text-error-700 border border-error-200 hover:bg-error-100"
                              onClick={() => handleStatusUpdate(applicant.id, 'rejected')}
                              disabled={updatingId === applicant.id}
                              leftIcon={<XCircle className="w-4 h-4" />}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

       {/* Edit Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <CardBody className="p-4 lg:p-6 max-w-xl">
              <h2 className="font-semibold text-lg text-secondary-900 mb-4">Edit Organization Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Company Description</label>
                  <textarea
                    rows={4}
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                    placeholder="Briefly describe what your organization does and what trainees can expect to learn."
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={profileWebsite}
                    onChange={(e) => setProfileWebsite(e.target.value)}
                    placeholder="https://yourcompany.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder="e.g. 15 Industrial Layout Road"
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">HR Representative / Contact Name</label>
                  <input
                    type="text"
                    value={profileContactName}
                    onChange={(e) => setProfileContactName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button onClick={handleSaveProfile} disabled={savingProfile}>
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {profileSaved && (
                    <span className="text-success-600 text-sm font-medium">Saved!</span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Placements Tab */}
        {activeTab === 'placements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-secondary-900">Your SIWES Placements</h2>
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)}>
                Post New Placement
              </Button>
            </div>

            {placements.length === 0 && isVerified && (
              <Card>
                <CardBody className="py-12">
                  <div className="text-center">
                    <Briefcase className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
                    <p className="text-secondary-900 font-medium">No placements posted yet</p>
                    <p className="text-sm text-secondary-500 mt-1 mb-4">
                      Create your first SIWES placement listing to start receiving trainee applications.
                    </p>
                    <Button onClick={() => setShowCreateModal(true)}>Post New Placement</Button>
                  </div>
                </CardBody>
              </Card>
            )}

            {placements.length === 0 && !isVerified && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800">
                  You can create placements now, but they will only become visible to students after admin verifies your
                  organization.
                </div>
                <div className="text-center">
                  <Button onClick={() => setShowCreateModal(true)}>Post New Placement</Button>
                </div>
              </div>
            )}

            {placements.length > 0 && (
              <div className="space-y-4">
                {placements.map((placement) => (
                  <Card key={placement.id} hover>
                    <CardBody className="p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-accent-100 text-accent-600 flex items-center justify-center">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-secondary-900">{placement.title}</h3>
                              <p className="text-sm text-secondary-500">{placement.department || 'General'}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-secondary-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {applicants.filter((a) => a.placement_title === placement.title).length} trainees applied
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              {placement.slots_available} slots available
                            </span>
                            {placement.deadline && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Deadline: {new Date(placement.deadline).toLocaleDateString('en-NG')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={placement.is_active ? 'success' : 'secondary'} dot>
                            {placement.is_active ? 'Active' : 'Closed'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Placement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-semibold">Post a New SIWES Placement</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-white/70 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-secondary-700 mb-1">Placement Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Engineering Intern — Civil Dept."
                  className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary-700 mb-1">
                  What will the trainee be doing?
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the daily tasks, department activities, and what the student will learn during attachment."
                  className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    placeholder="e.g. Engineering"
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">State</label>
                  <select
                    value={formState}
                    onChange={(e) => {
                      setFormState(e.target.value);
                      setFormCity('');
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Select state</option>
                    {NIGERIA_STATES.map((s) => (
                      <option key={s.state} value={s.state}>{s.state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">City</label>
                  <select
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    disabled={!formState}
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:bg-secondary-100 disabled:text-secondary-400"
                  >
                    <option value="">{formState ? 'Select city' : 'Select state first'}</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Duration</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="">Select duration</option>
                    <option value="16">4 Months (ND SIWES)</option>
                    <option value="24">6 Months (University SIWES)</option>
                    <option value="52">12 Months (Extended / Full-Year Attachment)</option>
                    <option value="12">3 Months (Special attachment)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary-700 mb-1">Available Slots</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formSlots}
                    onChange={(e) => setFormSlots(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary-700 mb-1">
                  Application Deadline (optional)
                </label>
                <input
                  type="date"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-secondary-100 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreatePlacement}
                disabled={creating || !formTitle}
              >
                {creating ? 'Posting...' : 'Post Placement'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Trainee Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedApplicant(null)} />
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-secondary-100 px-4 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-secondary-900">Trainee Application Details</h2>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-2 rounded-lg hover:bg-secondary-100 transition-colors"
              >
                <XCircle className="w-5 h-5 text-secondary-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Top Section */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-700 font-bold text-xl flex items-center justify-center">
                  {selectedApplicant.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-secondary-900">{selectedApplicant.name}</h3>
                  <p className="text-secondary-500 text-sm">{selectedApplicant.email}</p>
                  <div className="mt-1">{getStatusBadge(selectedApplicant.status)}</div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary-50 rounded-xl p-3">
                  <p className="text-xs text-secondary-500">Institution</p>
                  <p className="font-medium text-secondary-900 text-sm">{selectedApplicant.institution}</p>
                </div>
                <div className="bg-secondary-50 rounded-xl p-3">
                  <p className="text-xs text-secondary-500">Department</p>
                  <p className="font-medium text-secondary-900 text-sm">{selectedApplicant.department}</p>
                </div>
                <div className="bg-secondary-50 rounded-xl p-3">
                  <p className="text-xs text-secondary-500">Level</p>
                  <p className="font-medium text-secondary-900 text-sm">{selectedApplicant.level}</p>
                </div>
                <div className="bg-secondary-50 rounded-xl p-3">
                  <p className="text-xs text-secondary-500">Matric No.</p>
                  <p className="font-medium text-secondary-900 text-sm">
                    {selectedApplicant.matric_number || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Applied for */}
              <div>
                <p className="text-xs font-semibold text-secondary-500 uppercase mb-1">Applied for:</p>
                <p className="font-semibold text-secondary-900">{selectedApplicant.placement_title}</p>
                <p className="text-xs text-secondary-500">
                  Applied on {new Date(selectedApplicant.application_date).toLocaleDateString('en-NG')}
                </p>
              </div>

              {/* Cover Note */}
              {selectedApplicant.cover_letter && (
                <div>
                  <p className="text-xs font-semibold text-secondary-500 uppercase mb-2">Cover Note</p>
                  <div className="bg-secondary-50 rounded-xl p-4 text-sm text-secondary-700 leading-relaxed">
                    {selectedApplicant.cover_letter}
                  </div>
                </div>
              )}

              {/* Documents */}
              <div>
                <p className="text-xs font-semibold text-secondary-500 uppercase mb-2">Uploaded Documents</p>
                {loadingDocuments ? (
                  <div className="flex items-center gap-2 py-4 text-secondary-500">
                    <div className="animate-spin h-4 w-4 border-2 border-secondary-400 border-t-transparent rounded-full" />
                    <span className="text-sm">Loading documents…</span>
                  </div>
                ) : selectedApplicant.documents.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                    This trainee has not uploaded any verification documents yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[
                      { type: 'id_card', label: 'Institution ID Card' },
                      { type: 'passport_photo', label: 'Passport Photograph' },
                      { type: 'siwes_letter', label: 'SIWES Introduction Letter' },
                    ].map((docType) => {
                      const doc = selectedApplicant.documents.find((d) => d.document_type === docType.type);
                      return (
                        <div
                          key={docType.type}
                          className="flex items-center justify-between p-3 rounded-xl bg-secondary-50 border border-secondary-100"
                        >
                          <div className="flex items-center gap-3">
                            {docType.type === 'passport_photo' && doc ? (
                              <img
                                src={doc.file_url}
                                alt="Passport"
                                className="w-10 h-10 rounded-lg object-cover border border-secondary-200 flex-shrink-0"
                              />
                            ) : doc ? (
                              <FileCheck className="w-5 h-5 text-success-500" />
                            ) : (
                              <FileText className="w-5 h-5 text-secondary-300" />
                            )}
                            <div>
                              <p className="font-medium text-sm text-secondary-800">{docType.label}</p>
                              {doc && (
                                <p className="text-xs text-secondary-500 truncate max-w-[200px]">{doc.file_name}</p>
                              )}
                            </div>
                          </div>
                          {doc ? (
                            
                              <a href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                            >
                              View
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-secondary-400">Not uploaded</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Contact Info - shown once accepted */}
              {selectedApplicant.status === 'accepted' && (
                <div className="bg-success-50 border border-success-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-success-800 uppercase mb-2">
                    Trainee Accepted — Contact Details
                  </p>
                  <p className="text-sm text-secondary-700">
                    <span className="font-medium">Email:</span>{' '}
                    <a href={`mailto:${selectedApplicant.email}`} className="text-primary-600 hover:underline">
                      {selectedApplicant.email}
                    </a>
                  </p>
                  <p className="text-xs text-secondary-500 mt-2">
                    Reach out directly to arrange resumption details and next steps for the attachment.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-secondary-100 flex gap-3">
                <div className="flex-1" />
                {selectedApplicant.status === 'pending' && (
                  <>
                    <Button
                      className="bg-success-600 text-white hover:bg-success-700"
                      onClick={() => handleStatusUpdate(selectedApplicant.id, 'accepted')}
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Accept for Attachment
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleStatusUpdate(selectedApplicant.id, 'rejected')}
                      leftIcon={<XCircle className="w-4 h-4" />}
                    >
                      Decline
                    </Button>
                  </>
                )}
                {selectedApplicant.status === 'accepted' && (
                  <div className="text-success-700 text-sm font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Accepted for attachment
                  </div>
                )}
                {selectedApplicant.status === 'rejected' && (
                  <div className="text-error-600 text-sm font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Application declined
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
