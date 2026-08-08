import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/admin/stats').then((res) => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <p className="text-sm text-gray-500">Loading...</p>;

  const cards = [
    ['Total students', stats.totalUsers],
    ['Total teams', stats.totalTeams],
    ['Open / forming', stats.openTeams],
    ['Submitted', stats.submitted],
    ['Shortlisted', stats.shortlisted],
    ['Waitlisted', stats.waitlisted],
    ['Rejected', stats.rejected],
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
            <p className="text-2xl font-bold text-brand-700">{value}</p>
            <p className="mt-1 text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin/users" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-300">Manage users</Link>
        <Link to="/admin/teams" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-300">Manage teams</Link>
        <Link to="/admin/content" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-300">Edit content</Link>
        <Link to="/admin/export" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-300">Export data</Link>
      </div>
    </div>
  );
}
