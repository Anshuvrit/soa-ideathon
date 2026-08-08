import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../../api/client';
import SkillChip from '../../components/SkillChip';
import StatusBadge from '../../components/StatusBadge';

export default function PublicProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get(`/public/users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;
  if (!user) return <p className="text-sm text-gray-500">{error || 'This profile could not be found.'}</p>;

  return (
    <div className="mx-auto max-w-xl">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500">
              {user.college} {user.branch ? `· ${user.branch}` : ''} {user.year ? `· Year ${user.year}` : ''}
            </p>
          </div>
          <StatusBadge status={user.status} />
        </div>

        {user.skills?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase text-gray-400">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {user.skills.map((s) => <SkillChip key={s}>{s}</SkillChip>)}
            </div>
          </div>
        )}

        {user.themes?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase text-gray-400">Interested themes</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {user.themes.map((t) => <SkillChip key={t}>{t}</SkillChip>)}
            </div>
          </div>
        )}

        {(user.socials?.github || user.socials?.linkedin || user.socials?.portfolio) && (
          <div className="mt-4">
            <h3 className="text-xs font-semibold uppercase text-gray-400">Links</h3>
            <div className="mt-2 flex flex-col gap-1 text-sm">
              {user.socials?.github && <a href={user.socials.github} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">GitHub</a>}
              {user.socials?.linkedin && <a href={user.socials.linkedin} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">LinkedIn</a>}
              {user.socials?.portfolio && <a href={user.socials.portfolio} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">Portfolio</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
