import type { StreamingOffer } from "../types";

const ACCESS_COLORS: Record<string, string> = {
  subscription: "bg-emerald-100 text-emerald-800 border-emerald-200",
  free:         "bg-sky-100 text-sky-800 border-sky-200",
  rent:         "bg-amber-100 text-amber-800 border-amber-200",
  buy:          "bg-violet-100 text-violet-800 border-violet-200",
};

const ACCESS_ICONS: Record<string, string> = {
  subscription: "✓",
  free:         "◈",
  rent:         "⏱",
  buy:          "⬇",
};

interface Props {
  offer: StreamingOffer;
  highlight?: boolean;  // dans mes abonnements → bordure bleue
  dimmed?: boolean;     // abonnement non possédé → atténué
}

export default function OfferCard({ offer, highlight, dimmed }: Props) {
  const colorClass = highlight
    ? "bg-blue-50 text-blue-900 border-blue-400 shadow-sm"
    : ACCESS_COLORS[offer.access_type] ?? "bg-gray-100 text-gray-800 border-gray-200";

  return (
    <div className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-all ${colorClass} ${dimmed ? "opacity-40" : ""}`}>
      {/* Logo plateforme */}
      <div className="shrink-0 w-10 h-10 flex items-center justify-center">
        {offer.platform_logo ? (
          <img
            src={offer.platform_logo}
            alt={offer.platform}
            className="w-10 h-10 rounded-lg object-contain"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center text-lg font-bold">
            {offer.platform[0]}
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold truncate">{offer.platform}</p>
          {highlight && (
            <span className="text-xs bg-blue-500 text-white rounded-full px-2 py-0.5 shrink-0">
              Mon abonnement
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {offer.qualities.map((q) => (
            <span key={q} className="text-xs bg-white/50 rounded px-1.5 py-0.5 font-mono">
              {q}
            </span>
          ))}
          {offer.french_audio && (
            <span className="text-xs bg-white/50 rounded px-1.5 py-0.5">audio FR</span>
          )}
          {!offer.french_audio && offer.french_subtitles && (
            <span className="text-xs bg-white/50 rounded px-1.5 py-0.5">sous-titres FR</span>
          )}
        </div>
      </div>

      {/* Prix + label */}
      <div className="shrink-0 text-right">
        <p className="font-bold text-lg leading-none">
          {offer.price_eur != null
            ? `${offer.price_eur.toFixed(2).replace(".", ",")} €`
            : offer.access_type === "free" ? "Gratuit" : "Inclus"}
        </p>
        <p className="text-xs mt-1 opacity-70 flex items-center gap-1 justify-end">
          <span>{ACCESS_ICONS[offer.access_type]}</span>
          <span>{offer.access_label}</span>
        </p>
      </div>
    </div>
  );
}
