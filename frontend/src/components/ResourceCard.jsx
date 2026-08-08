export default function ResourceCard({ title, description, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-sm"
    >
      <h4 className="font-semibold text-gray-900">{title}</h4>
      {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      <span className="mt-2 inline-block text-xs font-medium text-brand-600">Open link →</span>
    </a>
  );
}
