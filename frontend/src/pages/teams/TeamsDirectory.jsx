import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';
import TeamCard from '../../components/TeamCard';
import { SKILLS, THEMES } from '../../constants';

export default function TeamsDirectoryPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ skill: '', theme: '', sameCollege: false, q: '' });

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.skill) params.set('skill', filters.skill);
    if (filters.theme) params.set('theme', filters.theme);
    if (filters.sameCollege) params.set('sameCollege', 'true');
    if (filters.q) params.set('q', filters.q);

    client
      .get(`/teams?${params.toString()}`)
      .then((res) => setTeams(res.data.teams || []))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find a Team</h1>
          <p className="text-sm text-gray-500">Browse open teams looking for teammates.</p>
        </div>
        <Link to="/teams/create" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          + Create a team
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <input
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          placeholder="Search team name..."
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        />
        <select
          value={filters.skill}
          onChange={(e) => setFilters((f) => ({ ...f, skill: e.target.value }))}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Any skill</option>
          {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={filters.theme}
          onChange={(e) => setFilters((f) => ({ ...f, theme: e.target.value }))}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        >
          <option value="">Any theme</option>
          {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={filters.sameCollege}
            onChange={(e) => setFilters((f) => ({ ...f, sameCollege: e.target.checked }))}
            className="h-4 w-4 accent-brand-600"
          />
          My college only
        </label>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-gray-500">Loading teams...</p>
      ) : teams.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">No teams match your filters yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((t) => <TeamCard key={t._id} team={t} />)}
        </div>
      )}
    </div>
  );
}
