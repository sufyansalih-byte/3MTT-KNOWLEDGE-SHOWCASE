import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  BookOpen,
  Briefcase,
  TrendingUp,
  Bell,
  Plus,
  Building2,
  MapPin,
  LogOut,
  User,
  ChevronRight,
  Loader2,
  FileCheck,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import { Button, Card, CardBody, Badge, EmptyState } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type TabType = 'overview' | 'applications' | 'logbook' | 'cv';

interface RealApplication {
  id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected' | 'withdrawn';
  created_at: string;
  placement_title: string;
  organization_name: string;
  organization_city: string;
  organization_state: string;
}

interface LogbookEntry {
  id: string;
  entry_date: string;
  activities: string;
  tools_used: string;
  created_at: string;
}

interface StudentDocument {
  id: string;
  document_type: 'id_card' | 'passport_photo' | 'siwes_letter';
  file_name: string;
  file_url: string;
  created_at: string;
}

const DOCUMENT_TYPES = [
  { type: 'id_card' as const, label: 'Institution ID Card', icon: CreditCard, accept: 'image/*,.pdf', description: 'Your valid school ID card (front and back if needed).' },
  { type: 'passport_photo' as const, label: 'Passport Photograph', icon: User, accept: 'image/*', description: 'A clear, white-background passport photo.' },
  { type: 'siwes_letter' as const, label: 'SIWES Introduction Letter', icon: FileText, accept: '.pdf,image/*', description: 'Official SIWES letter from your school IT unit.' },
];

export function StudentDashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const [applications, setApplications] = useState<RealApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);

  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>([]);
  const [logbookLoading, setLogbookLoading] = useState(false);
  const [newEntry, setNewEntry] = useState({ activities: '', tools_used: '' });

  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  interface NotificationRow {
    id: string;
    message: string;
    link: string | null;
    is_read: boolean;
    created_at: string;
  }
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;

    const resolveStudentId = async () => {
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Could not resolve student id:', error.message);
        setApplicationsLoading(false);
        return;
      }

      if (data) {
        setStudentId(data.id);
      } else {
        setApplicationsLoading(false);
      }
    };

    resolveStudentId();
  }, [user]);

  const fetchApplications = useCallback(async () => {
    if (!studentId) return;

    setApplicationsLoading(true);

    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        created_at,
        placements (
          title,
          organizations (
            name,
            city,
            state
          )
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch applications:', error);
      setApplicationsLoading(false);
      return;
    }

    const shaped: RealApplication[] = (data ?? []).map((row: any) => ({
      id: row.id,
      status: row.status,
      created_at: row.created_at,
      placement_title: row.placements?.title ?? 'Unknown Placement',
      organization_name: row.placements?.organizations?.name ?? '',
      organization_city: row.placements?.organizations?.city ?? '',
      organization_state: row.placements?.organizations?.state ?? '',
    }));

    setApplications(shaped);
    setApplicationsLoading(false);
  }, [studentId]);

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

  const fetchDocuments = useCallback(async () => {
  
  const fetchDocuments = useCallback(async () => {
    if (!studentId) return;

    setDocumentsLoading(true);

    const { data, error } = await supabase
      .from('student_documents')
      .select('*')
      .eq('student_id', studentId);

    if (error) {
      console.error('Failed to fetch documents:', error);
    } else {
      setDocuments(data ?? []);
    }

    setDocumentsLoading(false);
  }, [studentId]);

  const fetchLogbookEntries = useCallback(async () => {
    if (!studentId) return;

    setLogbookLoading(true);

    const { data, error } = await supabase
      .from('logbook_entries')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch logbook entries:', error);
    } else {
      setLogbookEntries(data ?? []);
    }

    setLogbookLoading(false);
  }, [studentId]);

useEffect(() => {
    if (studentId) {
      fetchApplications();
      fetchDocuments();
      fetchLogbookEntries();
    }
  }, [studentId, fetchApplications, fetchDocuments, fetchLogbookEntries]);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  const handleDocumentUpload = async (documentType: 'id_card' | 'passport_photo' | 'siwes_letter', file: File) => {
    if (!studentId) return;

    setUploadingType(documentType);
    setUploadError(null);

    try {
      const fileExt = file.name.split('.').pop() || 'pdf';
      const fileName = `${studentId}/${documentType}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('student-documents')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { error: dbError } = await supabase
        .from('student_documents')
        .upsert(
          {
            student_id: studentId,
            document_type: documentType,
            file_name: file.name,
            file_url: fileName,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'student_id,document_type' }
        );

      if (dbError) {
        throw new Error(dbError.message);
      }

      await fetchDocuments();
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploadingType(null);
    }
  };

  const handleLogoutAction = async () => {
    await signOut();
    window.location.href = '/';
  };

  const handleAddLogbookEntry = async () => {
    if (!studentId || !newEntry.activities) return;

    setLogbookLoading(true);

    const { error } = await supabase
      .from('logbook_entries')
      .insert({
        student_id: studentId,
        entry_date: new Date().toISOString().split('T')[0],
        activities: newEntry.activities,
        tools_used: newEntry.tools_used || null,
      });

    if (!error) {
      setNewEntry({ activities: '', tools_used: '' });
      await fetchLogbookEntries();
    } else {
      console.error('Failed to save entry:', error);
      setLogbookLoading(false);
    }
  };

  const getDocumentByType = (type: string) => documents.find((d) => d.document_type === type);

  const allDocumentsUploaded = documents.length >= 3 &&
    ['id_card', 'passport_photo', 'siwes_letter'].every((type) => getDocumentByType(type));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-success-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-error-500" />;
      case 'pending':
      case 'submitted':
      case 'reviewing':
        return <Clock className="w-5 h-5 text-warning-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-secondary-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'approved':
        return <Badge variant="success" dot>{status}</Badge>;
      case 'rejected':
        return <Badge variant="error" dot>{status}</Badge>;
      case 'pending':
      case 'submitted':
      case 'reviewing':
        return <Badge variant="warning" dot>{status}</Badge>;
      default:
        return <Badge variant="secondary" dot>{status}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const stats = {
    totalApplications: applications.length,
    pending: applications.filter((a) => a.status === 'pending' || a.status === 'reviewing').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    logbookEntries: logbookEntries.length,
    documentsUploaded: documents.length,
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile Shell Header */}
      <div className="lg:hidden bg-white border-b border-secondary-100 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-secondary-500">Welcome back,</p>
              <h1 className="font-heading font-bold text-lg text-secondary-900">
                {profile?.full_name?.split(' ')[0] || 'Student'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('/placements')} className="p-2 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 text-xs font-medium">Browse</button>
              <button onClick={handleLogoutAction} className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 text-xs font-medium">Log Out</button>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl bg-secondary-100 text-secondary-600"
                >
                  <Bell className="w-5 h-5" />
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
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto px-4 pb-2 gap-2 scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'applications', label: 'Applications', icon: Briefcase },
            { id: 'logbook', label: 'SIWES Logbook', icon: BookOpen },
            { id: 'cv', label: 'Upload Documents', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'cv' && documents.length < 3 && (
                <span className="w-2 h-2 rounded-full bg-error-500" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="container-app py-6 lg:py-8 px-4 max-w-7xl mx-auto">
        {/* Desktop Interface Header Component */}
        <div className="hidden lg:flex items-center justify-between mb-8 border-b border-secondary-200 pb-5">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-secondary-900">Student Dashboard</h1>
            <p className="text-secondary-600 mt-1">Track your applications, manage your logbook, and upload documents</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/placements')} className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 rounded-xl text-sm font-medium transition-all">
              <Briefcase className="w-4 h-4" />
              Browse Placements
            </button>
            <button onClick={handleLogoutAction} className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium transition-all">
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>

        <div className="hidden lg:flex gap-2 mb-8 border-b border-secondary-200 pb-3">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'applications', label: 'Applications', icon: Briefcase },
            { id: 'logbook', label: 'SIWES Logbook', icon: BookOpen },
            { id: 'cv', label: 'Upload Documents', icon: FileText, badge: documents.length < 3 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium text-sm transition-all ${activeTab === tab.id ? 'border-primary-600 text-primary-600 font-semibold' : 'border-transparent text-secondary-500 hover:text-secondary-800'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.badge && (
                <span className="w-2 h-2 rounded-full bg-error-500" />
              )}
            </button>
          ))}
        </div>

        {!allDocumentsUploaded && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">SIWES Verification Pending</h4>
              <p className="text-xs sm:text-sm text-amber-700 mt-0.5">
                Upload all 3 required documents ({documents.length}/3 completed) to unlock placement applications.
              </p>
            </div>
            <button onClick={() => setActiveTab('cv')} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-medium transition-all self-start sm:self-center">Upload Documents</button>
          </div>
        )}

        {allDocumentsUploaded && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <h4 className="font-semibold text-emerald-900 text-sm">Portal Fully Activated</h4>
            <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">All required documents uploaded. You can now apply for SIWES placements.</p>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <Card><CardBody className="flex items-center gap-4"><div className="p-3 rounded-xl bg-primary-50 text-primary-600"><Briefcase /></div><div><h3 className="text-xl font-bold">{stats.totalApplications}</h3><p className="text-xs text-secondary-500">Applications</p></div></CardBody></Card>
              <Card><CardBody className="flex items-center gap-4"><div className="p-3 rounded-xl bg-warning-50 text-warning-600"><Clock /></div><div><h3 className="text-xl font-bold">{stats.pending}</h3><p className="text-xs text-secondary-500">Pending</p></div></CardBody></Card>
              <Card><CardBody className="flex items-center gap-4"><div className="p-3 rounded-xl bg-success-50 text-success-600"><CheckCircle2 /></div><div><h3 className="text-xl font-bold">{stats.accepted}</h3><p className="text-xs text-secondary-500">Accepted</p></div></CardBody></Card>
              <Card><CardBody className="flex items-center gap-4"><div className="p-3 rounded-xl bg-blue-50 text-blue-600"><BookOpen /></div><div><h3 className="text-xl font-bold">{stats.logbookEntries}</h3><p className="text-xs text-secondary-500">Log Entries</p></div></CardBody></Card>
              <Card><CardBody className="flex items-center gap-4"><div className="p-3 rounded-xl bg-accent-50 text-accent-600"><FileCheck /></div><div><h3 className="text-xl font-bold">{stats.documentsUploaded}/3</h3><p className="text-xs text-secondary-500">Documents</p></div></CardBody></Card>
            </div>

            <Card className="bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
              <CardBody className="p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-primary-900">Find Your Next Opportunity</h3>
                  <p className="text-sm text-primary-700 mt-1">
                    Browse verified SIWES placements from organizations across Nigeria
                  </p>
                </div>
                <Button
                  onClick={() => navigate('/placements')}
                  disabled={!allDocumentsUploaded}
                  className="bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50"
                >
                  {allDocumentsUploaded ? 'Browse Placements' : 'Upload Documents First'}
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h2 className="text-base font-bold mb-4 text-secondary-900">Recent Applications</h2>
                {applicationsLoading ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-secondary-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading…</span>
                  </div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="w-10 h-10 text-secondary-300 mx-auto mb-2" />
                    <p className="text-sm text-secondary-500">No applications yet. Browse placements to get started.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-secondary-100">
                    {applications.slice(0, 4).map((app) => (
                      <div key={app.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getStatusIcon(app.status)}</div>
                          <div>
                            <h4 className="font-medium text-sm text-secondary-900">{app.placement_title}</h4>
                            <p className="text-xs text-secondary-500">{app.organization_name}</p>
                          </div>
                        </div>
                        <div>{getStatusBadge(app.status)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'applications' && (
          <Card>
            <CardBody className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-secondary-900">Application Status Tracker</h2>
                <Button size="sm" variant="outline" rightIcon={<ChevronRight className="w-4 h-4" />} onClick={() => navigate('/placements')}>Find More</Button>
              </div>
              {applicationsLoading ? (
                <div className="flex items-center justify-center py-12 gap-2 text-secondary-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading your applications…</span>
                </div>
              ) : applications.length === 0 ? (
                <EmptyState title="No applications submitted" description={allDocumentsUploaded ? "Browse active placement listings to get started." : "Upload all required documents first to enable applications."} />
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="p-4 rounded-xl border border-secondary-100 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-secondary-800">{app.placement_title}</h3>
                          <p className="text-sm text-secondary-500 flex items-center gap-1.5 mt-1"><Building2 className="w-3.5 h-3.5" /> {app.organization_name}</p>
                          <p className="text-xs text-secondary-400 flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5" /> {app.organization_city}, {app.organization_state}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-secondary-400 border-t border-secondary-100 pt-3 mt-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Applied on {new Date(app.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {activeTab === 'logbook' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card className="border border-secondary-200/60 shadow-sm sticky top-24">
                <CardBody className="space-y-4">
                  <div>
                    <h3 className="font-heading font-bold text-secondary-900 text-base">New Journal Entry</h3>
                    <p className="text-xs text-secondary-500 mt-0.5">Document your technical tasks and milestones for the day.</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-secondary-700 mb-1.5 uppercase tracking-wider">Task Description & Activities</label>
                      <textarea
                        value={newEntry.activities}
                        onChange={(e) => setNewEntry({ ...newEntry, activities: e.target.value })}
                        placeholder="What did you build or test today?..."
                        className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white min-h-[120px] placeholder-secondary-400 text-secondary-800 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-secondary-700 mb-1.5 uppercase tracking-wider">Key Tools Used</label>
                      <input
                        type="text"
                        value={newEntry.tools_used}
                        onChange={(e) => setNewEntry({ ...newEntry, tools_used: e.target.value })}
                        placeholder="e.g. React, Git, SolidWorks"
                        className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white placeholder-secondary-400 text-secondary-800 transition-all"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddLogbookEntry}
                    disabled={!newEntry.activities || logbookLoading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-xl shadow-sm disabled:opacity-50"
                    size="sm"
                  >
                    {logbookLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Plus className="w-4 h-4 mr-1.5" />}
                    Save Entry to Journal
                  </Button>
                </CardBody>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-secondary-900 text-base">SIWES Work Journal</h3>
                  <p className="text-xs text-secondary-500 mt-0.5">Chronological log of your industrial training activities.</p>
                </div>
                <button
                  onClick={fetchLogbookEntries}
                  className="text-xs font-medium text-secondary-400 hover:text-secondary-600 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
              </div>
              {logbookLoading && logbookEntries.length === 0 ? (
                <div className="flex items-center justify-center py-12 gap-2 text-secondary-500">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading entries…</span>
                </div>
              ) : logbookEntries.length === 0 ? (
                <div className="p-8 rounded-2xl border border-secondary-200/60 bg-white text-center">
                  <BookOpen className="w-10 h-10 text-secondary-300 mx-auto mb-2" />
                  <p className="text-sm text-secondary-500">No journal entries yet. Add your first entry above.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {logbookEntries.map((entry) => (
                    <div key={entry.id} className="p-5 rounded-2xl border border-secondary-200/60 bg-white shadow-sm relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-600" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {new Date(entry.entry_date).toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[11px] font-medium text-secondary-400 uppercase tracking-wider">Saved to Cloud</span>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest block mb-1">Activities</span>
                          <p className="text-sm text-secondary-700 leading-relaxed font-normal">{entry.activities}</p>
                        </div>
                        {entry.tools_used && entry.tools_used.trim() && (
                          <div className="pt-2 border-t border-secondary-100 flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-bold text-secondary-400 uppercase tracking-widest mr-1">Tools:</span>
                            {entry.tools_used.split(',').map((tech, idx) => (
                              <span key={idx} className="text-xs text-secondary-600 bg-secondary-50 border border-secondary-200/60 px-2 py-0.5 rounded-md font-medium">{tech.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'cv' && (
          <div className="space-y-6 max-w-3xl mx-auto py-4">
            <div>
              <h2 className="font-heading font-bold text-xl text-secondary-900">Complete Your Portal Verification</h2>
              <p className="text-sm text-secondary-500 mt-1">
                Upload all 3 required documents to unlock placement applications. ({documents.length}/3 completed)
              </p>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-error-50 border border-error-200 text-error-700 text-sm">
                {uploadError}
              </div>
            )}

            {documentsLoading ? (
              <div className="flex items-center justify-center py-12 gap-2 text-secondary-500">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading documents…</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DOCUMENT_TYPES.map((docType) => {
                  const existingDoc = getDocumentByType(docType.type);
                  const IconComponent = docType.icon;
                  const isUploading = uploadingType === docType.type;

                  return (
                    <Card key={docType.type} className="border border-secondary-200/60 shadow-sm">
                      <CardBody className="text-center py-6">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${existingDoc ? 'bg-success-50 text-success-600' : 'bg-primary-50 text-primary-600'}`}>
                          {existingDoc ? <FileCheck className="w-6 h-6" /> : <IconComponent className="w-6 h-6" />}
                        </div>
                        <h4 className="font-bold text-sm text-secondary-900 mb-1">{docType.label}</h4>
                        <p className="text-xs text-secondary-400 mb-4 max-w-[180px] mx-auto">{docType.description}</p>

                        {isUploading ? (
                          <div className="border-2 border-dashed border-primary-300 rounded-xl p-4 bg-primary-50">
                            <Loader2 className="w-5 h-5 animate-spin mx-auto text-primary-600" />
                            <p className="text-xs text-primary-600 mt-2">Uploading…</p>
                          </div>
                        ) : existingDoc ? (
                          <div className="border-2 border-success-200 rounded-xl p-3 bg-success-50">
                            <p className="text-xs text-success-700 font-medium truncate">{existingDoc.file_name}</p>
                            <p className="text-[10px] text-success-500 mt-1">
                              Uploaded {new Date(existingDoc.created_at).toLocaleDateString()}
                            </p>
                            <label className="mt-2 inline-block text-xs text-primary-600 font-medium cursor-pointer hover:text-primary-700">
                              Replace
                              <input
                                type="file"
                                accept={docType.accept}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleDocumentUpload(docType.type, file);
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-secondary-200 rounded-xl p-4 bg-secondary-50 relative hover:border-primary-500 transition-all cursor-pointer">
                            <input
                              type="file"
                              accept={docType.accept}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleDocumentUpload(docType.type, file);
                              }}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            />
                            <Upload className="w-5 h-5 mx-auto text-secondary-400 mb-1" />
                            <span className="text-xs text-primary-600 font-medium">Choose File</span>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            )}

            <div className="p-4 rounded-xl bg-secondary-50 border border-secondary-200">
              <h4 className="font-semibold text-secondary-800 text-sm mb-2">Document Requirements</h4>
              <ul className="text-xs text-secondary-600 space-y-1.5">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getDocumentByType('id_card') ? 'text-success-500' : 'text-secondary-300'}`} />
                  <span>Institution ID Card – Your valid school identification card</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getDocumentByType('passport_photo') ? 'text-success-500' : 'text-secondary-300'}`} />
                  <span>Passport Photograph – White background, recent photo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getDocumentByType('siwes_letter') ? 'text-success-500' : 'text-secondary-300'}`} />
                  <span>SIWES Introduction Letter – Official letter from your school IT unit</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
