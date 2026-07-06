# SIWES Connect Nigeria

**A digital placement platform connecting Nigerian polytechnic and university students with verified host organizations for mandatory Industrial Training (SIWES) attachments.**

Built for the **3MTT Knowledge Showcase 2.0** competition.

🔗 **Live Site:** [3-mtt-knowledge-showcase.vercel.app](https://3-mtt-knowledge-showcase.vercel.app)

---

## The Problem

The Students Industrial Work Experience Scheme (SIWES) has connected Nigerian students to industrial attachments since 1973 — but the process of actually *finding* a placement remains largely manual: word-of-mouth referrals, physical letters, and blind cold-calls to companies. Students struggle to find verified organizations willing to take trainees, and organizations struggle to find and vet genuine student applicants.

SIWES Connect Nigeria digitizes this process end-to-end: verified organizations post placements, students apply with mandatory identity documents, and organizations review real applicants through a secure dashboard — no more guesswork on either side.

---

## Core Features

- **Role-based accounts** — Student, Host Organization, and Admin, each with a dedicated dashboard and permissions enforced at the database level (Row Level Security)
- **Organization verification pipeline** — Organizations register with CAC registration details and must be approved by an admin before their placements go live to students
- **Mandatory document verification** — Students must upload three required documents (Institution ID Card, Passport Photograph, SIWES Introduction Letter) before they're able to apply to any placement, gated in real time
- **Secure private document storage** — Documents are stored in a private Supabase Storage bucket and served to organizations via short-lived signed URLs — never a public link
- **Placement browsing & application** — Students browse active, verified placements filtered by industry, state, and search term, then apply directly with an optional cover note
- **Applicant review pipeline** — Organizations view a full applicant profile (institution, department, matric number, cover note, uploaded documents) and accept or decline with one click
- **Cascading location selectors** — Nigeria's 36 states + FCT with dependent city dropdowns, used consistently across signup and placement creation
- **Digital SIWES logbook** — Students log daily/weekly training activities directly to the database, supplementing (not replacing) the physical paper logbook
- **Admin dashboard** — Organization approval queue, verified organizations list, and one-click CSV exports (organizations, students, all applications, accepted students, placements) for offline analysis in Excel or Power BI
- **Email verification** — New accounts must confirm their email address before signing in

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Backend / Database | Supabase (PostgreSQL, Auth, Storage) |
| Hosting | Vercel |
| Icons | Lucide React |

---

## Data Model

```
profiles           → id, email, full_name, role (student/organization/admin), reference_id
organizations       → profile_id, name, industry, cac_number, contact_name,
                      state, city, address, description, website, is_verified
students            → profile_id, institution, department, level, matric_number
placements          → organization_id, title, description, department, location,
                      duration_weeks, slots_available, is_active, deadline
applications        → student_id, placement_id, status, cover_letter
student_documents    → student_id, document_type, file_name, file_url
logbook_entries      → student_id, entry_date, activities, tools_used
```

All tables are protected with Row Level Security policies — students can only see their own data, organizations can only see applicants to their own placements, and admins have elevated read access for verification and reporting.

---

## Language & Domain Conventions

This platform deliberately uses SIWES-specific terminology throughout, not generic job-board language:

- **"Trainee"**, not "candidate" or "applicant"
- **"Host organization"**, not "employer"
- **"Attachment"**, not "job" or "internship"
- **"Placement"**, not "vacancy"
- SIWES duration reflects real program lengths (2–12 months), not a generic fixed term

---

## Getting Started Locally

```bash
# Clone the repository
git clone <repo-url>
cd siwes-connect

# Install dependencies
npm install

# Set up environment variables
# Create a .env file at the project root:
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run the dev server
npm run dev
```

The database schema, RLS policies, and storage bucket configuration are managed directly in the Supabase SQL Editor and Dashboard — see `/supabase` migrations if included, or the schema table above to recreate manually.

---

## Deployment

The app is deployed on Vercel with a `vercel.json` rewrite rule to support client-side routing (React Router) on page refresh:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) must be added in the Vercel project's Environment Variables settings, since `.env` is git-ignored by design.

---

## Author

**Salihu Sufiyan Eneye**
Civil Engineering Technology graduate (HND, Federal Polytechnic Nasarawa) · 3MTT Data Analytics Fellow

Built as a demonstration of full-stack development skills — authentication, relational database design, secure file storage, and role-based access control — applied to a real, longstanding problem in the Nigerian tertiary education system.
