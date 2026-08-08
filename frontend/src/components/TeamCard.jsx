import { Link } from 'react-router-dom';
import SkillChip from './SkillChip';
import StatusBadge from './StatusBadge';
import SixSeatIndicator from './SixSeatIndicator';

export default function TeamCard({ team }) {
  return (
    <Link
      to={`/teams/${team._id}`}
      className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-bold text-gray-900">{team.name}</h3>
        <StatusBadge status={team.status} />
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {team.college} · led by {team.leaderId?.name || 'Unknown'}
      </p>
      {team.shortDesc && <p className="mt-2 line-clamp-2 text-sm text-gray-600">{team.shortDesc}</p>}

      {team.requiredSkills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {team.requiredSkills.slice(0, 4).map((s) => (
            <SkillChip key={s}>{s}</SkillChip>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <SixSeatIndicator filled={team.members?.length || 0} />
      </div>
    </Link>
  );
}
