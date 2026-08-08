import { useEffect, useState } from 'react';
import client from '../../api/client';
import StatusBadge from '../../components/StatusBadge';
import ComplianceBadge from '../../components/ComplianceBadge';

const STATUS_ACTIONS = ['shortlisted', 'waitlisted', 'rejected', 'submitted', 'open'];

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  async function load() {
    setLoading(true);
    const params = filter ? `?status=${filter}` : '';
    const res = await client.get(`/admin/teams${params}`);
    setTeams(res.data.teams || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function setTeamStatus(id, newStatus) {
    await client.put(`/admin/teams/${id}/status`, { status: newStatus });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Manage Teams</h1>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mt-4 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
      >
        <option value="">All statuses</option>
        {['open', 'full', 'submitted', 'shortlisted', 'waitlisted', 'rejected'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="mt-6 space-y-4">
          {teams.map((t) => (
            <div key={t._id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-bold text-gray-900">{t.name}</h3>
                  <p className="text-xs text-gray-500">{t.college} · led by {t.leaderId?.name}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <ComplianceBadge label="6 members" ok={t.compliance?.sizeOk} />
                <ComplianceBadge label="Female member" ok={t.compliance?.femaleOk} />
                <ComplianceBadge label="Same college" ok={t.compliance?.collegeOk} />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {STATUS_ACTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTeamStatus(t._id, s)}
                    disabled={t.status === s}
                    className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:border-brand-300 disabled:opacity-40"
                  >
                    Mark {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {teams.length === 0 && <p className="text-sm text-gray-500">No teams found.</p>}
        </div>
      )}
    </div>
  );
}
