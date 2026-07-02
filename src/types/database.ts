export type UserRole = 'student' | 'organization' | 'admin';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  profile_id: string;
  name: string;
  description?: string;
  industry?: string;
  address?: string;
  city?: string;
  state?: string;
  website?: string;
  logo_url?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Student {
  id: string;
  profile_id: string;
  institution: string;
  department?: string;
  level?: string;
  matric_number?: string;
  cgpa?: number;
  skills: string[];
  resume_url?: string;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Placement {
  id: string;
  organization_id: string;
  title: string;
  description?: string;
  department?: string;
  requirements: string[];
  location?: string;
  duration_weeks: number;
  slots_available: number;
  is_active: boolean;
  deadline?: string;
  created_at: string;
  updated_at: string;
  organizations?: Organization;
}

export interface Application {
  id: string;
  student_id: string;
  placement_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  created_at: string;
  updated_at: string;
  students?: Student;
  placements?: Placement;
}

export interface AuthState {
  user: Profile | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  isMenuOpen: boolean;
  currentPath: string;
}
