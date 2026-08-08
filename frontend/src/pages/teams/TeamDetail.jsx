import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import SkillChip from '../../components/SkillChip';
import StatusBadge from '../../components/StatusBadge';
import SixSeatIndicator from '../../components/SixSeatIndicator';

export default function TeamDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  async function load() {
    try {
      const res = await client.get(`/teams/${id}`);
      setTeam(res.data.team);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function sendRequest(e) {
    e.preventDefault();
    setRequesting(true);
    setError('');
    try {
      await client.post(`/teams/${id}/request`, { message });
      setRequestSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setRequesting(false);
    }
  }

  async function respondToRequest(rid, action) {
    setError('');
    try {
      await client.put(`/teams/${id}/request/${rid}`, { action });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!team) return <p className="text-sm text-red-600">{error || 'Team not found.'}</p>;

  const isLeader = String(team.leaderId?._id) === String(user?._id);
  const isMember = team.members?.some((m) => String(m._id) === String(user?._id));

  return (
    <div className="mx-auto max-w-2xl">
      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
            <p className="text-sm text-gray-500">{team.college} · led by {team.leaderId?.name}</p>
          </div>
          <StatusBadge status={team.status} />
        </div>

        {team.shortDesc && <p className="mt-4 text-sm text-gray-700">{team.shortDesc}</p>}

        <div className="mt-4">
          <SixSeatIndicator filled={team.members?.length || 0} />
        </div>

        {team.requiredSkills?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase text-gray-400">Roles needed</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {team.requiredSkills.map((s) => <SkillChip key={s}>{s}</SkillChip>)}
            </div>
          </div>
        )}

        {team.themes?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase text-gray-400">Themes</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {team.themes.map((t) => <SkillChip key={t}>{t}</SkillChip>)}
            </div>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-xs font-semibold uppercase text-gray-400">Members</h3>
          <ul className="mt-2 space-y-1">
            {team.members?.map((m) => (
              <li key={m._id} className="text-sm text-gray-700">
                {m.name} {String(m._id) === String(team.leaderId?._id) && <span className="text-xs text-brand-600">(Leader)</span>}
              </li>
            ))}
          </ul>
        </div>

        {!isMember && !isLeader && team.status !== 'submitted' && !team.isLocked && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            {requestSent ? (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Join request sent!</p>
            ) : (
              <form onSubmit={sendRequest} className="space-y-3">
                <label className="text-sm font-medium text-gray-700">Send a join request</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Introduce yourself and say why you'd be a good fit..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={requesting}
                  className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
                >
                  {requesting ? 'Sending...' : 'Send request'}
                </button>
              </form>
            )}
          </div>
        )}

        {isLeader && team.pendingRequests?.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <h3 className="text-xs font-semibold uppercase text-gray-400">Pending join requests</h3>
            <div className="mt-3 space-y-3">
              {team.pendingRequests.map((r) => (
                <div key={r._id} className="rounded-lg border border-gray-200 p-3">
                  <p className="text-sm font-semibold text-gray-800">{r.fromUser?.name}</p>
                  {r.message && <p className="mt-1 text-sm text-gray-600">{r.message}</p>}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => respondToRequest(r._id, 'accept')}
                      className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondToRequest(r._id, 'reject')}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isMember && (
          <div className="mt-6 border-t border-gray-100 pt-4">
            <Link to="/my-team" className="text-sm font-semibold text-brand-600 hover:underline">Go to My Team workspace →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
