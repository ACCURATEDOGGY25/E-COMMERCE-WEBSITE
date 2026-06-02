import { TRUST_BADGES } from "@/lib/homeContent";

export function TrustBar() {
  return (
    <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:grid-cols-4">
      {TRUST_BADGES.map((badge) => (
        <div
          key={badge.label}
          className="flex flex-col items-center gap-2 text-center sm:flex-row sm:text-left"
        >
          <span className="text-2xl" aria-hidden>
            {badge.icon}
          </span>
          <span className="text-sm font-semibold text-gray-800">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
