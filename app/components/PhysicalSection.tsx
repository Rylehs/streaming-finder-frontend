"use client";

import { useState } from "react";
import type { PhysicalData, PhysicalOffer, PhysicalFormat } from "../types";

// ─── Constantes ──────────────────────────────────────────────────────────────

const FORMAT_STYLE: Record<PhysicalFormat, string> = {
  "4K UHD":  "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Blu-ray": "bg-blue-100 text-blue-800 border-blue-200",
  "DVD":     "bg-gray-100 text-gray-700 border-gray-200",
};

const EDITIONS = [
  { label: "Standard",        keyword: "" },
  { label: "Extended",        keyword: "Extended Edition" },
  { label: "Director's Cut",  keyword: "Director's Cut" },
  { label: "Steelbook",       keyword: "Steelbook" },
  { label: "Coffret",         keyword: "Coffret" },
  { label: "Trilogie / Pack", keyword: "Trilogie" },
  { label: "Intégrale",       keyword: "Intégrale" },
];

const RETAILERS = [
  { name: "bol.com",       build: (q: string) => `https://www.bol.com/be/fr/s/?q=${encodeURIComponent(q)}` },
  { name: "Amazon.com.be", build: (q: string) => `https://www.amazon.com.be/s?k=${encodeURIComponent(q)}&i=dvd` },
  { name: "Amazon.fr",     build: (q: string) => `https://www.amazon.fr/s?k=${encodeURIComponent(q)}&i=dvd&language=fr_FR` },
  { name: "Fnac.be",       build: (q: string) => `https://www.fnac.be/SearchResult/ResultList.aspx?Search=${encodeURIComponent(q)}&sectionId=1` },
];

// ─── Composant carte produit ─────────────────────────────────────────────────

function ProductCard({ offer }: { offer: PhysicalOffer }) {
  return (
    <a
      href={offer.url ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:shadow-md ${
        offer.in_stock ? "bg-white border-gray-200 hover:border-gray-400" : "bg-gray-50 border-gray-100 opacity-60"
      }`}
    >
      {/* Pochette */}
      <div className="shrink-0 w-9 h-12">
        {offer.image_url ? (
          <img src={offer.image_url} alt={offer.title} className="w-9 h-12 object-cover rounded shadow-sm" />
        ) : (
          <div className="w-9 h-12 bg-gray-200 rounded flex items-center justify-center text-base">💿</div>
        )}
      </div>

      {/* Infos */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">{offer.title}</p>
        <div className="flex flex-wrap gap-1 mt-1">
          <span className={`text-xs border rounded-md px-1.5 py-0.5 font-semibold ${FORMAT_STYLE[offer.format]}`}>
            {offer.format}
          </span>
          {offer.edition && (
            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 rounded-md px-1.5 py-0.5">
              {offer.edition}
            </span>
          )}
          {!offer.in_stock && <span className="text-xs text-gray-400 italic">Indisponible</span>}
        </div>
      </div>

      {/* Prix */}
      <div className="shrink-0 text-right">
        {offer.price_eur != null ? (
          <p className="font-bold text-base text-gray-900 leading-none">
            {offer.price_eur.toFixed(2).replace(".", ",")} €
          </p>
        ) : (
          <p className="text-sm text-gray-400">—</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{offer.retailer}</p>
      </div>
    </a>
  );
}

// ─── Grille fallback (liens par format × retailer) ───────────────────────────

function FallbackGrid({ data }: { data: PhysicalData }) {
  const [editionIdx, setEditionIdx] = useState(0);

  const FORMATS: { label: PhysicalFormat; keyword: string }[] = [
    { label: "4K UHD", keyword: "4K UHD" },
    { label: "Blu-ray", keyword: "Blu-ray" },
    { label: "DVD", keyword: "DVD" },
  ];

  const buildQuery = (fmtKeyword: string) => {
    const edKeyword = EDITIONS[editionIdx].keyword;
    return [(data.original_title || data.title), fmtKeyword, edKeyword].filter(Boolean).join(" ");
  };

  return (
    <div className="space-y-4">
      {/* Sélecteur édition */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Version</p>
        <div className="flex flex-wrap gap-2">
          {EDITIONS.map(({ label }, idx) => (
            <button key={label} onClick={() => setEditionIdx(idx)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                editionIdx === idx
                  ? "bg-purple-700 text-white border-purple-700"
                  : "text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-700"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille formats × retailers */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <div className="grid bg-gray-50 border-b border-gray-200"
          style={{ gridTemplateColumns: `120px repeat(${RETAILERS.length}, 1fr)` }}>
          <div className="px-3 py-2" />
          {RETAILERS.map(({ name }) => (
            <div key={name} className="px-1 py-2 text-xs font-semibold text-gray-500 text-center truncate">{name}</div>
          ))}
        </div>
        {FORMATS.map(({ label, keyword }, fi) => (
          <div key={label}
            className={`grid items-center ${fi < FORMATS.length - 1 ? "border-b border-gray-100" : ""}`}
            style={{ gridTemplateColumns: `120px repeat(${RETAILERS.length}, 1fr)` }}>
            <div className="px-3 py-3">
              <span className={`text-xs font-bold border rounded-md px-2 py-1 ${FORMAT_STYLE[label]}`}>{label}</span>
            </div>
            {RETAILERS.map(({ name, build }) => (
              <div key={name} className="py-3 text-center">
                <a href={build(buildQuery(keyword))} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 transition-all text-sm"
                  title={`${label} sur ${name}`}>↗</a>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center">Résultats automatiques indisponibles · Cliquez pour rechercher sur chaque site</p>
    </div>
  );
}

// ─── Section principale ───────────────────────────────────────────────────────

interface Props {
  data: PhysicalData | null;
  loading: boolean;
}

export default function PhysicalSection({ data, loading }: Props) {
  const [filter, setFilter] = useState<PhysicalFormat | "all">("all");

  const offers = data?.offers ?? [];

  // Masquer la section si : pas en cours de chargement ET (pas de données, pas de sortie physique, ou aucune offre trouvée)
  if (!loading && (!data || !data.has_physical || offers.length === 0)) return null;

  const visible = filter === "all" ? offers : offers.filter((o) => o.format === filter);
  const formats = [...new Set(offers.map((o) => o.format))] as PhysicalFormat[];

  return (
    <section>
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
        <span>💿</span>
        <span>Support physique</span>
      </h2>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-400 py-4">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Recherche des éditions disponibles…</span>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Filtre format si plusieurs formats trouvés */}
          {formats.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilter("all")}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  filter === "all" ? "bg-gray-800 text-white border-gray-800" : "text-gray-600 border-gray-300 hover:border-gray-500"
                }`}>
                Tous ({offers.length})
              </button>
              {formats.map((fmt) => (
                <button key={fmt} onClick={() => setFilter(fmt)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    filter === fmt ? "bg-gray-800 text-white border-gray-800" : "text-gray-600 border-gray-300 hover:border-gray-500"
                  }`}>
                  {fmt} ({offers.filter(o => o.format === fmt).length})
                </button>
              ))}
            </div>
          )}

          {/* Cartes produits triées par qualité puis prix */}
          <div className="space-y-2">
            {visible.map((offer, i) => <ProductCard key={`${offer.url}-${i}`} offer={offer} />)}
          </div>
        </div>
      )}
    </section>
  );
}
