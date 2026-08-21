import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/ui';

export function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin');
    } else if (!loading && user && !profile) {
      navigate('/onboarding');
    } else if (!loading && profile) {
      if (profile.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (profile.role === 'organization') {
        navigate('/dashboard/organization');
      } else {
        navigate('/dashboard/student');
      }
    }
  }, [user, profile, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50">
      <LoadingSpinner size="lg" className="text-primary-600" />
    </div>
  );
}

export function StudentDashboardPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin');
    } else if (!loading && profile?.role === 'organization') {
      navigate('/dashboard/organization');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="lg" className="text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-app py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-secondary-900">
            Welcome back, {profile?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-secondary-600 mt-1">
            Track your applications and discover new opportunities
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Applications" value="0" subtitle="Total submitted" />
          <StatCard title="Pending" value="0" subtitle="Awaiting response" />
          <StatCard title="Interviews" value="0" subtitle="Scheduled" />
          <StatCard title="Offers" value="0" subtitle="Received" />
        </div>

        <div className="bg-white rounded-2xl border border-secondary-200 p-8 text-center">
          <p className="text-secondary-600">
            Your dashboard is ready. Complete your profile to start applying for placements.
          </p>
        </div>
      </div>
    </div>
  );
}

export function OrganizationDashboardPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth/signin');
    } else if (!loading && profile?.role === 'student') {
      navigate('/dashboard/student');
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-50">
        <LoadingSpinner size="lg" className="text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-app py-8">
        <div className="mb-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-secondary-900">
            Organization Dashboard
          </h1>
          <p className="text-secondary-600 mt-1">
            Manage your placements and review applications
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Active Placements" value="0" subtitle="Posted" />
          <StatCard title="Applications" value="0" subtitle="Total received" />
          <StatCard title="Pending Review" value="0" subtitle="Needs attention" />
          <StatCard title="Placed Students" value="0" subtitle="Accepted" />
        </div>

        <div className="bg-white rounded-2xl border border-secondary-200 p-8 text-center">
          <p className="text-secondary-600">
            Your organization dashboard is ready. Create your first placement to start receiving applications.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-secondary-200 p-6">
      <div className="text-3xl font-bold text-secondary-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-secondary-700">{title}</div>
      <div className="text-xs text-secondary-500">{subtitle}</div>
    </div>
  );
}