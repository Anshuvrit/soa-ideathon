export default function SixSeatIndicator({ filled = 0, total = 6 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-3.5 w-3.5 rounded-full border-2 ${
            i < filled ? 'border-brand-600 bg-brand-600' : 'border-gray-300 bg-white'
          }`}
        />
      ))}
      <span className="ml-2 text-xs font-medium text-gray-500">{filled}/{total}</span>
    </div>
  );
}
