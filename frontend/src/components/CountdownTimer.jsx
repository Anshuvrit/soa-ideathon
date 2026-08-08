import { useEffect, useState } from 'react';

function getTimeLeft(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
  };
}

export default function CountdownTimer({ target }) {
  const [t, setT] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft(target)), 60000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="flex gap-4">
      {[['Days', t.days], ['Hours', t.hours], ['Mins', t.minutes]].map(([label, val]) => (
        <div key={label} className="flex flex-col items-center rounded-lg bg-brand-900 px-4 py-3 text-white">
          <span className="text-2xl font-bold">{val}</span>
          <span className="text-xs uppercase tracking-wide text-brand-200">{label}</span>
        </div>
      ))}
    </div>
  );
}
