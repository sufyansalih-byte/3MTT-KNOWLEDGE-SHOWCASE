import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout/Layout';
import { supabase } from './lib/supabase';
import {
  HomePage,
  PlacementsPage,
  AuthPage,
  DashboardPage,
  StudentDashboardPage,
  OrganizationDashboardPage,
} from './pages';

function HistoryPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            🎓 The Story Behind SIWES
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            A Brief History of <span className="text-green-600">SIWES</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Understanding the Students Industrial Work Experience Scheme and
            how it shaped industrial training in Nigeria.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">How It Began</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The Students Industrial Work Experience Scheme (SIWES) was
            established in <strong>1973</strong> by the Industrial Training
            Fund (ITF). It was created to bridge the gap between the
            theoretical knowledge students gained in classrooms and the
            practical, hands-on skills demanded by Nigerian industries.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Before SIWES, graduates often left school with strong academic
            knowledge but little exposure to real workplace tools and
            processes, making the transition into employment difficult.
          </p>
        </div>
        <img
          src="https://disciplines.ng/wp-content/uploads/2024/06/Success-Stories-of-Nigerian-Technical-Graduates1.jpeg"
          alt="Nigerian technical graduates success stories"
          width={800}
          height={500}
          loading="lazy"
          className="rounded-2xl shadow-lg w-full h-72 object-cover"
        />
      </section>

      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <img
            src="https://images.squarespace-cdn.com/content/v1/5f8ddf43229afb1b31ff3ca0/4df99356-fb5f-48ba-abb0-e1ae365a9bd8/DSC_2231.jpg"
            alt="Students in technical training session"
            width={800}
            height={500}
            loading="lazy"
            className="rounded-2xl shadow-lg w-full h-72 object-cover order-2 md:order-1"
          />
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">How It Evolved</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              In <strong>1979</strong>, management of the scheme was
              transferred to the National Universities Commission (NUC) and
              the National Board for Technical Education (NBTE). The
              Industrial Training Fund resumed full management in{' '}
              <strong>1984</strong>, a structure that continues today.
            </p>
            <p className="text-gray-600 leading-relaxed">
              SIWES has grown to cover engineering, sciences, agriculture,
              and environmental studies, becoming mandatory for many
              Nigerian tertiary institutions.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Why SIWES Still Matters Today
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Real-World Skills', desc: 'Students apply classroom theory to actual industry tools, equipment, and workflows.' },
            { title: 'Improved Employability', desc: 'Graduates with SIWES experience are better prepared and more attractive to employers.' },
            { title: 'Industry Exposure', desc: 'Students build networks and understand workplace culture before graduation.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-green-600 py-14">
        <div className="max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            That's Where SIWES Connect Comes In
          </h2>
          <p className="text-green-50 leading-relaxed">
            Decades after SIWES began, students still struggle to find
            placements, and organizations struggle to find verified trainees.
            SIWES Connect Nigeria was built to digitize and simplify that
            decades-old process for a new generation.
          </p>
        </div>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            🛡️ About The Platform
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            About <span className="text-green-600">SIWES Connect Nigeria</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Connecting Nigerian vocational students with verified
            organizations for industrial training — built to make SIWES
            placement simple, transparent, and accessible.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">What We Do</h2>
          <p className="text-gray-600 leading-relaxed">
            SIWES Connect Nigeria is a placement platform that links students
            from polytechnics, colleges of education, and universities with
            verified companies and organizations offering industrial training
            (IT) attachments. Students create a profile and search for
            opportunities by skill, location, and industry, while
            organizations register, list openings, and review applicants —
            all in one place.
          </p>
        </div>
        <img
          src="https://disciplines.ng/wp-content/uploads/2024/06/Success-Stories-of-Nigerian-Technical-Graduates1.jpeg"
          alt="Nigerian students in technical training"
          width={800}
          height={500}
          loading="lazy"
          className="rounded-2xl shadow-lg w-full h-72 object-cover"
        />
      </section>

      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Our Aims &amp; Objectives
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Close the Placement Gap', desc: 'Eliminate the stress of students searching blindly for SIWES placements every year.' },
              { title: 'Verified Organizations', desc: 'Ensure every host organization on the platform is genuine, reducing placement scams.' },
              { title: 'Digitize the Process', desc: 'Replace manual letters and word-of-mouth referrals with a fast, searchable digital system.' },
              { title: 'Support Employability', desc: 'Help students gain relevant, skill-matched experience that strengthens their future careers.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 bg-gray-50 rounded-xl p-6 border">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Meet The Founder
        </h2>
        <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center text-4xl font-bold text-green-700 flex-shrink-0">
            SE
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Salihu Sufiyan Eneye
            </h3>
            <p className="text-green-600 font-medium mb-3">
              Founder, SIWES Connect Nigeria
            </p>
            <p className="text-gray-600 leading-relaxed">
              A Civil Engineering Technology graduate (HND, Federal
              Polytechnic Nasarawa) and 3MTT Data Analytics Fellow, Sufiyan
              experienced firsthand how difficult it can be for Nigerian
              students to secure SIWES placements. SIWES Connect Nigeria was
              built to solve that exact problem — giving students a
              transparent way to find host organizations, and giving
              organizations a transparent way to find trainees.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 text-gray-600">
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p>support@siwesconnect.ng</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Phone</p>
              <p>+234 800 000 0000</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Location</p>
              <p>Abuja, Nigeria</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface AdminOrgRow {
  id: string;
  name: string;
  industry: string | null;
  city: string | null;
  state: string | null;
  cac_number: string | null;
  contact_name: string | null;
  is_verified: boolean;
  created_at: string;
}

function downloadCSV(filename: string, rows: Record<string, any>[]) {
  if (rows.length === 0) {
    alert('No data available to export.');
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (val: any) => {
    const str = val === null || val === undefined ? '' : String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(',')),
  ].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function AdminDashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState<AdminOrgRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/auth/signin');
    } else if (profile && profile.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, profile, authLoading, navigate]);

  const fetchOrgs = async () => {
    setLoading(true);
    setFetchError(null);

    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, industry, city, state, address, description, website, cac_number, contact_name, is_verified, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to load organizations:', error.message);
      setFetchError(error.message);
      setOrgs([]);
    } else if (data) {
      setOrgs(data as AdminOrgRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (profile?.role === 'admin') fetchOrgs();
  }, [profile]);

const handleApprove = async (id: string, approve: boolean) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from('organizations')
      .update({ is_verified: approve })
      .eq('id', id);
    if (!error) {
      setOrgs((prev) =>
        prev.map((o) => (o.id === id ? { ...o, is_verified: approve } : o))
      );
    } else {
      console.error('Failed to update verification status:', error.message);
    }
    setUpdatingId(null);
  };

  const [exporting, setExporting] = useState<string | null>(null);

  const exportOrganizations = () => {
    downloadCSV('organizations.csv', orgs.map((o) => ({
      name: o.name,
      industry: o.industry || '',
      city: o.city || '',
      state: o.state || '',
      cac_number: o.cac_number || '',
      contact_name: o.contact_name || '',
      is_verified: o.is_verified ? 'Yes' : 'No',
      created_at: new Date(o.created_at).toLocaleDateString('en-NG'),
    })));
  };

  const exportStudents = async () => {
    setExporting('students');
    const { data } = await supabase
      .from('students')
      .select('institution, department, level, matric_number, created_at, profiles(full_name, email)');
    downloadCSV('students.csv', (data ?? []).map((s: any) => ({
      full_name: s.profiles?.full_name || '',
      email: s.profiles?.email || '',
      institution: s.institution || '',
      department: s.department || '',
      level: s.level || '',
      matric_number: s.matric_number || '',
      registered_on: new Date(s.created_at).toLocaleDateString('en-NG'),
    })));
    setExporting(null);
  };

  const exportApplications = async () => {
    setExporting('applications');
    const { data } = await supabase
      .from('applications')
      .select('status, cover_letter, created_at, students(institution, matric_number, profiles(full_name, email)), placements(title, organizations(name))');
    downloadCSV('applications.csv', (data ?? []).map((a: any) => ({
      student_name: a.students?.profiles?.full_name || '',
      student_email: a.students?.profiles?.email || '',
      institution: a.students?.institution || '',
      matric_number: a.students?.matric_number || '',
      placement_title: a.placements?.title || '',
      organization: a.placements?.organizations?.name || '',
      status: a.status,
      applied_on: new Date(a.created_at).toLocaleDateString('en-NG'),
    })));
    setExporting(null);
  };

  const exportAcceptedStudents = async () => {
    setExporting('accepted');
    const { data } = await supabase
      .from('applications')
      .select('created_at, students(institution, matric_number, profiles(full_name, email)), placements(title, organizations(name))')
      .eq('status', 'accepted');
    downloadCSV('accepted_students.csv', (data ?? []).map((a: any) => ({
      student_name: a.students?.profiles?.full_name || '',
      student_email: a.students?.profiles?.email || '',
      institution: a.students?.institution || '',
      matric_number: a.students?.matric_number || '',
      placement_title: a.placements?.title || '',
      organization: a.placements?.organizations?.name || '',
      accepted_on: new Date(a.created_at).toLocaleDateString('en-NG'),
    })));
    setExporting(null);
  };

  const exportPlacements = async () => {
    setExporting('placements');
    const { data } = await supabase
      .from('placements')
      .select('title, department, duration_weeks, slots_available, is_active, deadline, created_at, organizations(name, city, state)');
    downloadCSV('placements.csv', (data ?? []).map((p: any) => ({
      title: p.title,
      organization: p.organizations?.name || '',
      city: p.organizations?.city || '',
      state: p.organizations?.state || '',
      department: p.department || '',
      duration_weeks: p.duration_weeks || '',
      slots_available: p.slots_available,
      is_active: p.is_active ? 'Yes' : 'No',
      deadline: p.deadline ? new Date(p.deadline).toLocaleDateString('en-NG') : '',
      posted_on: new Date(p.created_at).toLocaleDateString('en-NG'),
    })));
    setExporting(null);
  };

  if (authLoading || (profile?.role === 'admin' && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }
  if (profile?.role !== 'admin') {
    return null;
  }

  const pending = orgs.filter((o) => !o.is_verified);
  const verified = orgs.filter((o) => o.is_verified);

  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="container-app">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-secondary-900">
              Admin Dashboard
            </h1>
            <p className="text-secondary-600 mt-1">
              Review and approve organization registrations
            </p>
          </div>
          <button
            onClick={async () => { await signOut(); window.location.href = '/'; }}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium"
          >
            Log Out
          </button>
        </div>

        {fetchError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
            Couldn't load organizations: {fetchError}. If this mentions a missing
            column, your Supabase <code>organizations</code> table may not have
            <code> cac_number</code> or <code>contact_name</code> yet.
          </div>
        )}

        <div className="mb-8 bg-white rounded-xl border border-secondary-200 p-4">
          <h2 className="font-semibold text-sm text-secondary-900 mb-3">Export Data for Analysis</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportOrganizations} className="px-3 py-2 bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 text-secondary-700 rounded-lg text-xs font-medium">
              Organizations (CSV)
            </button>
            <button onClick={exportStudents} disabled={exporting === 'students'} className="px-3 py-2 bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 text-secondary-700 rounded-lg text-xs font-medium disabled:opacity-50">
              {exporting === 'students' ? 'Exporting...' : 'Students (CSV)'}
            </button>
            <button onClick={exportApplications} disabled={exporting === 'applications'} className="px-3 py-2 bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 text-secondary-700 rounded-lg text-xs font-medium disabled:opacity-50">
              {exporting === 'applications' ? 'Exporting...' : 'All Applications (CSV)'}
            </button>
            <button onClick={exportAcceptedStudents} disabled={exporting === 'accepted'} className="px-3 py-2 bg-success-50 hover:bg-success-100 border border-success-200 text-success-700 rounded-lg text-xs font-medium disabled:opacity-50">
              {exporting === 'accepted' ? 'Exporting...' : 'Accepted Students (CSV)'}
            </button>
            <button onClick={exportPlacements} disabled={exporting === 'placements'} className="px-3 py-2 bg-secondary-50 hover:bg-secondary-100 border border-secondary-200 text-secondary-700 rounded-lg text-xs font-medium disabled:opacity-50">
              {exporting === 'placements' ? 'Exporting...' : 'Placements (CSV)'}
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="font-semibold text-lg text-secondary-900 mb-4">
            Pending Approval ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <div className="bg-white rounded-xl border border-secondary-200 p-8 text-center text-secondary-500">
              No organizations awaiting approval
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((org) => (
                <div key={org.id} className="bg-white rounded-xl border border-secondary-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{org.name}</h3>
                    <p className="text-sm text-secondary-500">
                      {org.industry || 'No industry listed'} • {org.city || '—'}, {org.state || '—'}
                    </p>
                    <p className="text-xs text-secondary-400 mt-1">
                      CAC: {org.cac_number || 'N/A'} • Contact: {org.contact_name || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(org.id, true)}
                      disabled={updatingId === org.id}
                      className="px-4 py-2 bg-success-600 hover:bg-success-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApprove(org.id, false)}
                      disabled={updatingId === org.id}
                      className="px-4 py-2 bg-error-50 hover:bg-error-100 text-error-700 border border-error-200 rounded-lg text-sm font-medium disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-semibold text-lg text-secondary-900 mb-4">
            Verified Organizations ({verified.length})
          </h2>
          {verified.length === 0 ? (
            <div className="bg-white rounded-xl border border-secondary-200 p-8 text-center text-secondary-500">
              No verified organizations yet
            </div>
          ) : (
            <div className="space-y-3">
              {verified.map((org) => (
                <div key={org.id} className="bg-white rounded-xl border border-secondary-200 p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{org.name}</h3>
                    <p className="text-sm text-secondary-500">{org.industry || 'No industry listed'} • {org.city || '—'}, {org.state || '—'}</p>
                  </div>
                  <span className="px-3 py-1 bg-success-50 text-success-700 rounded-full text-xs font-medium">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PlacementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [placement, setPlacement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [existingStatus, setExistingStatus] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [documentsCount, setDocumentsCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      if (!id) return;
const { data } = await supabase
        .from('placements')
        .select(`*, organizations(name, industry, city, state, address, description, website, is_verified)`)
        .eq('id', id)
        .maybeSingle();
      setPlacement(data);

      if (user && profile?.role === 'student') {
        const { data: stuRow } = await supabase
          .from('students')
          .select('id')
          .eq('profile_id', user.id)
          .maybeSingle();
        if (stuRow) {
          setStudentId(stuRow.id);

          const { data: docRow } = await supabase
            .from('student_documents')
            .select('id', { count: 'exact', head: false })
            .eq('student_id', stuRow.id);
          setDocumentsCount(docRow?.length ?? 0);

          const { data: appRow } = await supabase
            .from('applications')
            .select('id, status')
            .eq('student_id', stuRow.id)
            .eq('placement_id', id)
            .maybeSingle();
          if (appRow) {
            setAlreadyApplied(true);
            setExistingStatus(appRow.status);
          }
        } else {
          setDocumentsCount(0);
        }
      }
      setLoading(false);
    };
    fetchAll();
  }, [id, user, profile]);

  const handleApply = async () => {
    if (!studentId || !id) return;
    setSubmitting(true);
    const { error } = await supabase.from('applications').insert({
      student_id: studentId,
      placement_id: id,
      status: 'pending',
      cover_letter: coverNote || null,
    });
    if (!error) { setSubmitted(true); setShowModal(false); setAlreadyApplied(true); setExistingStatus('pending'); }
    setSubmitting(false);
  };

  const canApply = documentsCount !== null && documentsCount >= 3;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!placement) return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <div className="text-center">
        <p className="text-secondary-600 mb-4">Placement not found.</p>
        <button onClick={() => navigate('/placements')} className="text-primary-600 underline text-sm">Back to Placements</button>
      </div>
    </div>
  );

  const org = placement.organizations;

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="bg-white border-b border-secondary-100">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <button onClick={() => navigate('/placements')} className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-800 text-sm mb-4">
            ← Back to Placements
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-heading text-2xl font-bold text-secondary-900">{placement.title}</h1>
              <p className="text-primary-600 font-medium mt-1">{org?.name}</p>
              <p className="text-secondary-500 text-sm mt-0.5">{org?.city}, {org?.state} · {org?.industry}</p>
            </div>
            {alreadyApplied && (
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${existingStatus === 'accepted' ? 'bg-success-50 text-success-700' : existingStatus === 'rejected' ? 'bg-error-50 text-error-700' : 'bg-amber-50 text-amber-700'}`}>
                {existingStatus === 'accepted' ? '✅ Accepted' : existingStatus === 'rejected' ? '❌ Declined' : '⏳ Application Submitted'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Duration', value: placement.duration_weeks ? `${placement.duration_weeks} weeks` : 'Not specified' },
            { label: 'Slots Available', value: placement.slots_available ?? '—' },
            { label: 'Department', value: placement.department || 'Open' },
            { label: 'Deadline', value: placement.deadline ? new Date(placement.deadline).toLocaleDateString('en-NG') : 'Open' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl border border-secondary-200 p-4 text-center">
              <p className="text-xs text-secondary-500 mb-1">{item.label}</p>
              <p className="font-semibold text-secondary-900 text-sm">{item.value}</p>
            </div>
          ))}
        </div>

{placement.description && (
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h2 className="font-semibold text-secondary-900 mb-3">About This Placement</h2>
            <p className="text-secondary-600 text-sm leading-relaxed">{placement.description}</p>
          </div>
        )}

        {(org?.description || org?.website || org?.address) && (
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <h2 className="font-semibold text-secondary-900 mb-3">About {org?.name}</h2>
            {org?.description && (
              <p className="text-secondary-600 text-sm leading-relaxed mb-3">{org.description}</p>
            )}
            {org?.address && (
              <p className="text-secondary-500 text-xs mb-2">📍 {org.address}, {org.city}, {org.state}</p>
            )}
            {org?.website && (
              
                <a href={org.website.startsWith('http') ? org.website : `https://${org.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                Visit organization website →
              </a>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          {!user && (
            <div className="text-center">
              <p className="text-secondary-600 mb-4 text-sm">Sign in to apply for this SIWES placement.</p>
              <button onClick={() => navigate('/auth/signin')} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm">Sign In to Apply</button>
            </div>
          )}
          {user && profile?.role === 'organization' && (
            <p className="text-secondary-500 text-sm text-center">Organizations cannot apply for placements.</p>
          )}
          {user && profile?.role === 'admin' && (
            <p className="text-secondary-500 text-sm text-center">Viewing as admin.</p>
          )}
          {user && profile?.role === 'student' && !alreadyApplied && !canApply && (
            <div className="text-center">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-left">
                <p className="font-semibold text-amber-800 text-sm mb-1">Documents Required</p>
                <p className="text-amber-700 text-xs">
                  Upload all 3 verification documents ({documentsCount ?? 0}/3 completed) before applying.
                  Go to your dashboard to complete the upload.
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard/student')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm"
              >
                Go to Upload Documents
              </button>
            </div>
          )}
          {user && profile?.role === 'student' && !alreadyApplied && canApply && (
            <div className="text-center">
              <p className="text-secondary-600 text-sm mb-4">This placement is open. Click below to submit your application.</p>
              <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm">Apply for Attachment</button>
            </div>
          )}
          {submitted && (
            <div className="text-center text-success-700 font-semibold">
              ✅ Application submitted! Check your student dashboard to track its status.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="font-semibold text-lg text-secondary-900">Apply for Attachment</h2>
            <p className="text-sm text-secondary-600">Applying to: <span className="font-medium">{placement.title}</span> at {org?.name}</p>
            <div>
              <label className="block text-xs font-semibold text-secondary-700 mb-1.5">Cover Note (optional)</label>
              <textarea
                value={coverNote}
                onChange={e => setCoverNote(e.target.value)}
                rows={4}
                placeholder="Briefly introduce yourself and explain why you are interested in this attachment..."
                className="w-full px-3 py-2.5 rounded-xl border border-secondary-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-secondary-200 rounded-xl text-sm font-medium text-secondary-600 hover:bg-secondary-50">Cancel</button>
              <button onClick={handleApply} disabled={submitting} className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth routes - standalone layout */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/auth/signup" element={<AuthPage />} />
          <Route path="/auth/signin" element={<AuthPage />} />
          <Route path="/auth/:mode" element={<AuthPage />} />

          {/* Dashboard routes - protected layout */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/student" element={<StudentDashboardPage />} />
          <Route path="/dashboard/organization" element={<OrganizationDashboardPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboardPage />} />

          {/* Main app routes - with Layout (navbar/footer) */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/placements" element={<PlacementsPage />} />
            <Route path="/placements/:id" element={<PlacementDetailPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
