export default function AnnouncementBanner({ title, body, isOfficial, createdAt }) {
  return (
    <div className="rounded-xl border border-brand-100 bg-white p-4">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-gray-900">{title}</h4>
        {isOfficial && (
          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            Official
          </span>
        )}
      </div>
      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">{body}</p>
      {createdAt && <p className="mt-2 text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</p>}
    </div>
  );
}
