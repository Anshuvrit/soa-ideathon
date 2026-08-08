import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import AnnouncementBanner from '../components/AnnouncementBanner';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (user?.teamId) {
        const teamRes = await client.get(`/teams/${user.teamId}`);
        setTeam(teamRes.data.team);
      }
      const annRes = await client.get('/announcements');
      setAnnouncements(annRes.data.announcements || []);
      setLoading(false);
    })();
  }, [user?.teamId]);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  const isLeader = team && String(team.leaderId?._id) === String(user._id);
  const pending = isLeader ? team.pendingRequests || [] : [];

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      </div>

      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase text-gray-400">Join requests for {team.name}</h2>
          <div className="mt-3 space-y-3">
            {pending.map((r) => (
              <div key={r._id} className="rounded-lg border border-gray-200 bg-white p-3">
                <p className="text-sm font-semibold text-gray-800">{r.fromUser?.name} wants to join</p>
                {r.message && <p className="mt-1 text-sm text-gray-600">{r.message}</p>}
                <Link to={`/teams/${team._id}`} className="mt-2 inline-block text-xs font-semibold text-brand-600 hover:underline">
                  Review request →
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase text-gray-400">Announcements</h2>
        <div className="mt-3 space-y-3">
          {announcements.length === 0 ? (
            <p className="text-sm text-gray-500">Nothing yet — check back soon.</p>
          ) : (
            announcements.map((a) => <AnnouncementBanner key={a._id} {...a} />)
          )}
        </div>
      </section>
    </div>
  );
}
