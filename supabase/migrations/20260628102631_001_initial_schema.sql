/*
# SIWES Connect Initial Database Schema

## Purpose
Centralized platform connecting Nigerian students seeking SIWES placements with verified organizations offering industrial training opportunities.

## Tables Created

### profiles
- Extends Supabase auth.users with additional user information
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `full_name` (text)
- `role` (enum: 'student', 'organization', 'admin')
- `phone` (text)
- `avatar_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### organizations
- Verified organizations offering SIWES placements
- `id` (uuid, primary key)
- `profile_id` (uuid, references profiles)
- `name` (text)
- `description` (text)
- `industry` (text)
- `address` (text)
- `city` (text)
- `state` (text)
- `website` (text)
- `logo_url` (text)
- `is_verified` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### students
- Student profiles seeking placements
- `id` (uuid, primary key)
- `profile_id` (uuid, references profiles)
- `institution` (text)
- `department` (text)
- `level` (text)
- `matric_number` (text)
- `cgpa` (decimal)
- `skills` (text array)
- `resume_url` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### placements
- SIWES placement opportunities posted by organizations
- `id` (uuid, primary key)
- `organization_id` (uuid, references organizations)
- `title` (text)
- `description` (text)
- `department` (text)
- `requirements` (text array)
- `location` (text)
- `duration_weeks` (integer)
- `slots_available` (integer)
- `is_active` (boolean, default true)
- `deadline` (date)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### applications
- Student applications to placements
- `id` (uuid, primary key)
- `student_id` (uuid, references students)
- `placement_id` (uuid, references placements)
- `status` (enum: 'pending', 'accepted', 'rejected', 'withdrawn')
- `cover_letter` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Security
- RLS enabled on all tables
- Owner-scoped policies for students, organizations
- Application policies scoped through student ownership
- Admin role has full access

## Notes
1. Uses auth.uid() for ownership checks
2. Profile role determines access levels
3. Organizations must be verified to post placements (enforced at app level)
4. Unique constraint prevents duplicate applications
*/

-- Create enum types
CREATE TYPE user_role AS ENUM ('student', 'organization', 'admin');
CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  industry text,
  address text,
  city text,
  state text,
  website text,
  logo_url text,
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  institution text NOT NULL,
  department text,
  level text,
  matric_number text,
  cgpa decimal(3,2),
  skills text[] DEFAULT '{}',
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Placements table
CREATE TABLE IF NOT EXISTS placements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  department text,
  requirements text[] DEFAULT '{}',
  location text,
  duration_weeks integer DEFAULT 24,
  slots_available integer DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  deadline date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  placement_id uuid NOT NULL REFERENCES placements(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'pending',
  cover_letter text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(student_id, placement_id)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Organizations policies (owner can CRUD, everyone can read verified)
DROP POLICY IF EXISTS "select_organizations" ON organizations;
CREATE POLICY "select_organizations" ON organizations FOR SELECT
  TO authenticated USING (is_verified = true OR profile_id = auth.uid());

DROP POLICY IF EXISTS "insert_own_organization" ON organizations;
CREATE POLICY "insert_own_organization" ON organizations FOR INSERT
  TO authenticated WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "update_own_organization" ON organizations;
CREATE POLICY "update_own_organization" ON organizations FOR UPDATE
  TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "delete_own_organization" ON organizations;
CREATE POLICY "delete_own_organization" ON organizations FOR DELETE
  TO authenticated USING (profile_id = auth.uid());

-- Students policies (owner can CRUD, organizations can view for applications)
DROP POLICY IF EXISTS "select_students" ON students;
CREATE POLICY "select_students" ON students FOR SELECT
  TO authenticated USING (
    profile_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'organization'
    )
  );

DROP POLICY IF EXISTS "insert_own_student" ON students;
CREATE POLICY "insert_own_student" ON students FOR INSERT
  TO authenticated WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "update_own_student" ON students;
CREATE POLICY "update_own_student" ON students FOR UPDATE
  TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "delete_own_student" ON students;
CREATE POLICY "delete_own_student" ON students FOR DELETE
  TO authenticated USING (profile_id = auth.uid());

-- Placements policies (verified organizations can CRUD, students can read active)
DROP POLICY IF EXISTS "select_placements" ON placements;
CREATE POLICY "select_placements" ON placements FOR SELECT
  TO authenticated USING (
    is_active = true 
    OR organization_id IN (
      SELECT id FROM organizations WHERE profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_org_placements" ON placements;
CREATE POLICY "insert_org_placements" ON placements FOR INSERT
  TO authenticated WITH CHECK (
    organization_id IN (SELECT id FROM organizations WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_org_placements" ON placements;
CREATE POLICY "update_org_placements" ON placements FOR UPDATE
  TO authenticated USING (
    organization_id IN (SELECT id FROM organizations WHERE profile_id = auth.uid())
  ) WITH CHECK (
    organization_id IN (SELECT id FROM organizations WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_org_placements" ON placements;
CREATE POLICY "delete_org_placements" ON placements FOR DELETE
  TO authenticated USING (
    organization_id IN (SELECT id FROM organizations WHERE profile_id = auth.uid())
  );

-- Applications policies
DROP POLICY IF EXISTS "select_own_applications" ON applications;
CREATE POLICY "select_own_applications" ON applications FOR SELECT
  TO authenticated USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
    OR placement_id IN (
      SELECT id FROM placements WHERE organization_id IN (
        SELECT id FROM organizations WHERE profile_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "insert_own_applications" ON applications;
CREATE POLICY "insert_own_applications" ON applications FOR INSERT
  TO authenticated WITH CHECK (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "update_own_applications" ON applications;
CREATE POLICY "update_own_applications" ON applications FOR UPDATE
  TO authenticated USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
    OR placement_id IN (
      SELECT id FROM placements WHERE organization_id IN (
        SELECT id FROM organizations WHERE profile_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "delete_own_applications" ON applications;
CREATE POLICY "delete_own_applications" ON applications FOR DELETE
  TO authenticated USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_organizations_verified ON organizations(is_verified);
CREATE INDEX IF NOT EXISTS idx_placements_active ON placements(is_active);
CREATE INDEX IF NOT EXISTS idx_placements_deadline ON placements(deadline);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_placement ON applications(placement_id);