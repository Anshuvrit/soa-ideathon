export default function SkillChip({ children }) {
  return (
    <span className="inline-block rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 border border-brand-100">
      {children}
    </span>
  );
}
