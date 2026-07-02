
CREATE POLICY "student_upload_own_docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'student-documents' AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM students WHERE profile_id = auth.uid()));

CREATE POLICY "student_read_own_docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'student-documents' AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM students WHERE profile_id = auth.uid()));

CREATE POLICY "student_update_own_docs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'student-documents' AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM students WHERE profile_id = auth.uid()));

CREATE POLICY "org_read_applicant_docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'student-documents' AND (storage.foldername(name))[1] IN (
    SELECT a.student_id::text FROM applications a
    JOIN placements p ON p.id = a.placement_id
    JOIN organizations o ON o.id = p.organization_id
    WHERE o.profile_id = auth.uid()));
