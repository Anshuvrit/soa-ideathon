const COLORS = {
  looking: 'bg-amber-50 text-amber-700 border-amber-200',
  'has-team': 'bg-blue-50 text-blue-700 border-blue-200',
  full: 'bg-gray-100 text-gray-700 border-gray-200',
  open: 'bg-green-50 text-green-700 border-green-200',
  submitted: 'bg-purple-50 text-purple-700 border-purple-200',
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  waitlisted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-gray-50 text-gray-600 border-gray-200',
};

export default function StatusBadge({ status }) {
  const cls = COLORS[status] || COLORS.pending;
  return (
    <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${cls}`}>
      {status?.replace('-', ' ')}
    </span>
  );
}
