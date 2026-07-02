-- Storage policies for student-documents bucket
CREATE POLICY "students_upload_own_documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM students WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "students_view_own_documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM students WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "orgs_view_applicant_documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] IN (
    SELECT a.student_id::text FROM applications a
    JOIN placements p ON a.placement_id = p.id
    JOIN organizations o ON p.organization_id = o.id
    WHERE o.profile_id = auth.uid()
  )
);