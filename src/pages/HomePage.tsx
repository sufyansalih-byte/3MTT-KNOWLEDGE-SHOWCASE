import { Link } from 'react-router-dom';
import { GraduationCap, Search, CheckCircle2 } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* SECTION 1: HERO */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20 px-6 text-center">
        <div className="inline-flex bg-white/10 border border-white/20 rounded-full text-xs px-3 py-1 mb-6">
          🛡️ Built for 3MTT Knowledge Showcase 2025 · ITF Official Program
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          Find Verified SIWES Placements Across Nigeria
        </h1>

        <p className="text-primary-100 max-w-xl mx-auto mt-4 text-base">
          Connecting Nigerian polytechnic and university students with verified host organizations — fully digital, transparent, and free.
        </p>

        <div className="flex gap-3 justify-center mt-8 flex-wrap">
          <Link
            to="/auth?role=student"
            className="bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            🎓 I'm a Student
          </Link>
          <Link
            to="/auth?role=organization"
            className="border-2 border-white/40 text-white px-6 py-3 rounded-xl hover:bg-white/10 font-medium transition-colors"
          >
            🏢 Register Organization
          </Link>
        </div>

        <p className="text-primary-200 text-sm mt-4">
          Already have an account?{' '}
          <Link to="/auth/signin" className="text-white underline hover:text-white/80">
            Sign in →
          </Link>
        </p>
      </section>

      {/* SECTION 2: STATS BAR */}
      <section className="bg-white border-b border-secondary-200 py-8 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          <div>
            <p className="text-3xl font-extrabold text-primary-600">1973</p>
            <p className="text-xs text-secondary-500 mt-1">Year SIWES was founded by ITF</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-primary-600">3–12 Months</p>
            <p className="text-xs text-secondary-500 mt-1">Duration varies by institution type</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-primary-600">36 + FCT</p>
            <p className="text-xs text-secondary-500 mt-1">States SIWES covers in Nigeria</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-primary-600">Free</p>
            <p className="text-xs text-secondary-500 mt-1">No cost to students or organizations</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section className="bg-secondary-50 py-16 px-6">
        <h2 className="font-heading text-2xl font-bold text-center text-secondary-900 mb-10">
          How SIWES Connect Works
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-200 text-center">
            <GraduationCap className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-secondary-900 mb-2">Create Your Profile</h3>
            <p className="text-sm text-secondary-600">
              Sign up as a student with your matric number and institution, or register your organization with your CAC number.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-200 text-center">
            <Search className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-secondary-900 mb-2">Browse & Apply</h3>
            <p className="text-sm text-secondary-600">
              Students browse verified placements filtered by state, industry, and duration. Apply with a cover letter in one click.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-secondary-200 text-center">
            <CheckCircle2 className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-secondary-900 mb-2">Get Placed & Log Hours</h3>
            <p className="text-sm text-secondary-600">
              Receive your placement confirmation and log your daily SIWES activities digitally — no paper logbook needed.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES */}
      <section className="bg-white py-16 px-6">
        <h2 className="font-heading text-2xl font-bold text-center text-secondary-900 mb-10">
          Everything You Need for SIWES
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-secondary-50 rounded-2xl p-6 border border-secondary-200">
            <h3 className="font-semibold text-secondary-900 mb-2">✅ Verified Organizations Only</h3>
            <p className="text-sm text-secondary-600">
              Every host organization is reviewed by an admin before appearing in search. No fake placements, no wasted trips.
            </p>
          </div>

          <div className="bg-secondary-50 rounded-2xl p-6 border border-secondary-200">
            <h3 className="font-semibold text-secondary-900 mb-2">📓 Digital SIWES Logbook</h3>
            <p className="text-sm text-secondary-600">
              Record your daily IT activities on your phone and use your SIWES Connect journal to accurately fill your institution's official paper logbook at the end of each day.
            </p>
          </div>

          <div className="bg-secondary-50 rounded-2xl p-6 border border-secondary-200">
            <h3 className="font-semibold text-secondary-900 mb-2">📊 Real-Time Application Tracker</h3>
            <p className="text-sm text-secondary-600">
              Know exactly where each application stands — pending, under review, accepted, or rejected.
            </p>
          </div>

          <div className="bg-secondary-50 rounded-2xl p-6 border border-secondary-200">
            <h3 className="font-semibold text-secondary-900 mb-2">📄 ITF-Compliant Process</h3>
            <p className="text-sm text-secondary-600">
              SIWES Connect follows the official ITF attachment process — from placement search to logbook submission.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: FOR ORGANIZATIONS */}
      <section className="bg-primary-50 border-y border-primary-100 py-16 px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-2">
              For Host Organizations
            </p>
            <h2 className="font-heading text-2xl font-bold text-secondary-900 mb-3">
              Post SIWES Openings and Find Verified Student Talent
            </h2>
            <p className="text-secondary-600 text-sm leading-relaxed mb-6">
              Whether you need 1 intern or 10, SIWES Connect lets you post placements, review applicants by skills and CGPA, and accept directly from your dashboard.
            </p>
            <Link
              to="/auth?role=organization"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-3 rounded-xl text-sm inline-block transition-colors"
            >
              Register Your Organization →
            </Link>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-secondary-700">Post unlimited SIWES placements at no cost</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-secondary-700">Review student applications with full profile visibility</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-secondary-700">Accept and reject applicants directly from your dashboard</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-secondary-700">Get admin-verified status to build student trust</span>
            </li>
          </ul>
        </div>
      </section>

      {/* SECTION 6: FOOTER (thin bar only) */}
      <footer className="bg-secondary-900 text-white py-4 px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-5xl mx-auto">
          <p className="text-secondary-400 text-xs">
            © 2025 SIWES Connect Nigeria — Built for the 3MTT Knowledge Showcase. Powered by ITF SIWES Program.
          </p>
          <Link
            to="/auth/signin"
            className="bg-secondary-800 hover:bg-secondary-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Admin Portal →
          </Link>
        </div>
      </footer>
    </div>
  );
}
