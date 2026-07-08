import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, Clock, Briefcase, Search, ArrowLeft } from 'lucide-react';
import {
  Card,
  CardBody,
  Button,
  Badge,
  Input,
  LoadingCard,
  EmptyState,
} from '../components/ui';
import { supabase } from '../lib/supabase';
import type { Placement } from '../types/database';

const industries = [
  { value: 'All', label: 'All Fields' },
  { value: 'engineering', label: 'Engineering & Technology' },
  { value: 'environmental', label: 'Environmental Sciences' },
  { value: 'sciences', label: 'Sciences' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'medical', label: 'Medical & Health Sciences' },
  { value: 'education', label: 'Education' },
  { value: 'arts_design', label: 'Arts & Design' },
  { value: 'hospitality', label: 'Hospitality & Management' },
  { value: 'mass_comm', label: 'Mass Communication & Media' },
  { value: 'veterinary', label: 'Veterinary Medicine' },
];

const states = [
  'All', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

export function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedState, setSelectedState] = useState('All');

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const { data, error } = await supabase
        .from('placements')
        .select(`
          *,
          organizations (
            id,
            name,
            logo_url,
            industry,
            city,
            state
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlacements(data || []);
    } catch (err) {
      console.error('Error fetching placements:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlacements = placements.filter((placement) => {
    const matchesSearch =
      placement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      placement.organizations?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry =
      selectedIndustry === 'All' ||
      placement.organizations?.industry?.trim().toLowerCase() === selectedIndustry.trim().toLowerCase();
    const matchesState =
      selectedState === 'All' ||
      placement.organizations?.state?.trim().toLowerCase() === selectedState.trim().toLowerCase();

    return matchesSearch && matchesIndustry && matchesState;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-100">
        <div className="container-app py-8 lg:py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-secondary-900 mb-2">
            Available Placements
          </h1>
          <p className="text-secondary-600">
            Discover verified SIWES opportunities from organizations across Nigeria
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-secondary-100 sticky top-16 lg:top-20 z-40">
        <div className="container-app py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search placements or organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-3">
             <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-4 py-3 rounded-xl border border-secondary-200 bg-white text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {industries.map((industry) => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 rounded-xl border border-secondary-200 bg-white text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state === 'All' ? 'All States' : state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-app py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        ) : filteredPlacements.length === 0 ? (
          <EmptyState
            variant="search"
            title="No placements found"
            description="Try adjusting your search criteria or browse all placements"
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setSelectedIndustry('All');
              setSelectedState('All');
            }}
          />
        ) : (
          <>
            <p className="text-secondary-600 mb-6">
              Showing <span className="font-medium text-secondary-900">{filteredPlacements.length}</span>{' '}
              {filteredPlacements.length === 1 ? 'placement' : 'placements'}
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlacements.map((placement) => {
                const daysRemaining = placement.deadline
                  ? getDaysRemaining(placement.deadline)
                  : null;

                return (
                  <Card key={placement.id} hover className="flex flex-col">
                    <CardBody className="flex-1">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {placement.organizations?.logo_url ? (
                            <img
                              src={placement.organizations.logo_url}
                              alt={placement.organizations.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building2 className="w-6 h-6 text-secondary-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-secondary-900 mb-1 truncate">
                            {placement.title}
                          </h3>
                          <p className="text-sm text-secondary-600 truncate">
                            {placement.organizations?.name}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5 mb-4">
                        <div className="flex items-center gap-2 text-sm text-secondary-600">
                          <MapPin className="w-4 h-4 text-secondary-400" />
                          <span>
                            {placement.organizations?.city}, {placement.organizations?.state}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-secondary-600">
                          <Briefcase className="w-4 h-4 text-secondary-400" />
                          <span>{placement.duration_weeks} weeks</span>
                        </div>
                        {daysRemaining !== null && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-secondary-400" />
                            <span
                              className={
                                daysRemaining <= 7 ? 'text-error-600' : 'text-secondary-600'
                              }
                            >
                              {daysRemaining} days remaining
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-secondary-600 line-clamp-2 mb-4">
                        {placement.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="primary" size="sm">
                          {placement.organizations?.industry}
                        </Badge>
                        {placement.slots_available <= 3 && (
                          <Badge variant="warning" size="sm">
                            {placement.slots_available} slots left
                          </Badge>
                        )}
                      </div>
                    </CardBody>
                    <div className="px-6 py-4 border-t border-secondary-100 bg-secondary-50 rounded-b-2xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-secondary-500">
                          Deadline: {placement.deadline ? formatDate(placement.deadline) : 'Open'}
                        </span>
                        <Link to={`/placements/${placement.id}`}>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
