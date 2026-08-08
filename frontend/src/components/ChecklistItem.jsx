import { useState } from 'react';

export default function ChecklistItem({ label }) {
  const [checked, setChecked] = useState(false);
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2.5 hover:border-brand-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked((c) => !c)}
        className="h-4 w-4 accent-brand-600"
      />
      <span className={`text-sm ${checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{label}</span>
    </label>
  );
}
