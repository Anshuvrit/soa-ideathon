import { Link } from 'react-router-dom';

const RULES = [
  ['Max 6 members', 'Teams are capped at six students — enforced automatically.'],
  ['At least 1 female member', 'Every team needs at least one female member before it can submit.'],
  ['One team per student', "You can't be in two teams at once."],
  ['Same college only', 'Team members must all be from your college.'],
  ['Locked after submission', 'Once submitted, the roster is locked unless an admin reopens it.'],
];

export default function LandingPage() {
  return (
    <div>
      <section className="flex flex-col items-center py-12 text-center">
        <span className="mb-4 rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-semibold text-brand-700">
          SOA Ideathon → SIH 2026
        </span>
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-gray-900 sm:text-5xl">
          Find your team. <span className="text-brand-600">Build your idea.</span> Prep with confidence.
        </h1>
        <p className="mt-4 max-w-xl text-base text-gray-600">
          A college-restricted platform for SOA students to form compliant 6-member teams, discover
          teammates by skill, and get ready for SIH 2026 — all in one place.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/teams" className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Find a Team
          </Link>
          <Link
            to="/teams/create"
            className="rounded-lg border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-700 hover:border-brand-400"
          >
            Create a Team
          </Link>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          This is an unofficial team-formation and preparation tool — not the official SIH registration system.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {RULES.map(([title, desc]) => (
          <div key={title} className="rounded-xl border border-gray-200 bg-white p-5">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{desc}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-brand-900 px-6 py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to get started?</h2>
        <p className="mt-2 text-brand-100">Sign in with your college email to build your profile and start matching.</p>
        <Link
          to="/auth/signin"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-900 hover:bg-brand-50"
        >
          Sign in
        </Link>
      </section>
    </div>
  );
}
