import type { StreamingOffer, AccessType } from "../types";
import OfferCard from "./OfferCard";

const SECTIONS: { type: AccessType; label: string; emoji: string }[] = [
  { type: "subscription", label: "Inclus dans un abonnement", emoji: "✓" },
  { type: "free",         label: "Gratuit",                   emoji: "◈" },
  { type: "rent",         label: "Location",                  emoji: "⏱" },
  { type: "buy",          label: "Achat",                     emoji: "⬇" },
];

interface Props {
  offers: StreamingOffer[];
  loading: boolean;
  mySubscriptions: Set<string>;
}

export default function OfferSection({ offers, loading, mySubscriptions }: Props) {
  const byType = (type: AccessType) => offers.filter((o) => o.access_type === type);
  const inMySubs = offers.filter(
    (o) => o.access_type === "subscription" && mySubscriptions.has(o.platform)
  );

  if (!loading && offers.length === 0) {
    return (
      <p className="text-center text-gray-400 py-12">
        Aucune offre trouvée en Belgique avec audio ou sous-titres français.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Section prioritaire : dans mes abonnements */}
      {inMySubs.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-blue-600 mb-3">
            <span>★</span>
            <span>Dans mes abonnements</span>
          </h2>
          <div className="space-y-2">
            {inMySubs.map((offer, i) => (
              <OfferCard key={`mysub-${offer.platform}-${i}`} offer={offer} highlight />
            ))}
          </div>
        </section>
      )}

      {/* Toutes les offres par catégorie */}
      {SECTIONS.map(({ type, label, emoji }) => {
        const group = byType(type);
        if (group.length === 0) return null;
        return (
          <section key={type}>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
              <span>{emoji}</span>
              <span>{label}</span>
            </h2>
            <div className="space-y-2">
              {group.map((offer, i) => (
                <OfferCard
                  key={`${offer.platform}-${i}`}
                  offer={offer}
                  dimmed={
                    mySubscriptions.size > 0 &&
                    type === "subscription" &&
                    !mySubscriptions.has(offer.platform)
                  }
                />
              ))}
            </div>
          </section>
        );
      })}

      {loading && (
        <div className="flex items-center gap-3 text-gray-400 py-4">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Recherche des offres en cours…</span>
        </div>
      )}
    </div>
  );
}
