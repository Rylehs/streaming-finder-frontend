import type { PhysicalOffer, PhysicalFormat } from "../types";

const FORMAT_STYLE: Record<PhysicalFormat, string> = {
  "4K UHD":  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Blu-ray": "bg-blue-100 text-blue-800 border-blue-200",
  "DVD":     "bg-gray-100 text-gray-700 border-gray-200",
};

export default function PhysicalCard({ offer }: { offer: PhysicalOffer }) {
  const inner = (
    <div className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-all ${
      offer.in_stock ? "bg-white hover:shadow-md" : "bg-gray-50 opacity-60"
    }`}>
      {/* Pochette */}
      <div className="shrink-0 w-10 h-14 flex items-center justify-center">
        {offer.image_url ? (
          <img src={offer.image_url} alt={offer.title} className="w-10 h-14 object-cover rounded shadow-sm" />
        ) : (
          <div className="w-10 h-14 bg-gray-200 rounded flex items-center justify-center text-xl">💿</div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-gray-800 leading-snug line-clamp-2">{offer.title}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          <span className={`text-xs border rounded-md px-1.5 py-0.5 font-semibold ${FORMAT_STYLE[offer.format] ?? "bg-gray-100"}`}>
            {offer.format}
          </span>
          {offer.edition && (
            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 rounded-md px-1.5 py-0.5">
              {offer.edition}
            </span>
          )}
          {!offer.in_stock && (
            <span className="text-xs text-gray-400 italic">Indisponible</span>
          )}
        </div>
      </div>

      {/* Prix + retailer */}
      <div className="shrink-0 text-right">
        {offer.price_eur != null ? (
          <p className="font-bold text-lg leading-none text-gray-900">
            {offer.price_eur.toFixed(2).replace(".", ",")} €
          </p>
        ) : (
          <p className="text-sm text-gray-400">—</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{offer.retailer}</p>
      </div>
    </div>
  );

  return offer.url ? (
    <a href={offer.url} target="_blank" rel="noopener noreferrer" className="block">{inner}</a>
  ) : (
    <div>{inner}</div>
  );
}
