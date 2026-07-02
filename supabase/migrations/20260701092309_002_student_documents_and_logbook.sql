-- Student documents table for storing mandatory verification documents
CREATE TABLE student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('id_card', 'passport_photo', 'siwes_letter')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, document_type)
);

-- Logbook entries table for SIWES daily activity logs
CREATE TABLE logbook_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  activities TEXT NOT NULL,
  tools_used TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE logbook_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies for student_documents
CREATE POLICY "select_own_documents" ON student_documents FOR SELECT
  TO authenticated USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
  );

CREATE POLICY "insert_own_documents" ON student_documents FOR INSERT
  TO authenticated WITH CHECK (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
  );

CREATE POLICY "update_own_documents" ON student_documents FOR UPDATE
  TO authenticated USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
  );

CREATE POLICY "delete_own_documents" ON student_documents FOR DELETE
  TO authenticated USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
  );

-- Allow organizations to view documents of students who applied to them
CREATE POLICY "org_view_applicant_documents" ON student_documents FOR SELECT
  TO authenticated USING (
    student_id IN (
      SELECT a.student_id FROM applications a
      JOIN placements p ON a.placement_id = p.id
      JOIN organizations o ON p.organization_id = o.id
      WHERE o.profile_id = auth.uid()
    )
  );

-- RLS policies for logbook_entries
CREATE POLICY "select_own_logbook" ON logbook_entries FOR SELECT
  TO authenticated USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
  );

CREATE POLICY "insert_own_logbook" ON logbook_entries FOR INSERT
  TO authenticated WITH CHECK (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
  );

CREATE POLICY "delete_own_logbook" ON logbook_entries FOR DELETE
  TO authenticated USING (
    student_id IN (SELECT id FROM students WHERE profile_id = auth.uid())
  );

-- Index for faster queries
CREATE INDEX idx_student_documents_student ON student_documents(student_id);
CREATE INDEX idx_logbook_entries_student ON logbook_entries(student_id);
CREATE INDEX idx_logbook_entries_date ON logbook_entries(entry_date DESC);