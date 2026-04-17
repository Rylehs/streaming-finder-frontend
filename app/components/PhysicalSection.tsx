"use client";

import { useState } from "react";
import type { PhysicalData, PhysicalFormat } from "../types";

const FORMATS: { value: PhysicalFormat; keyword: string }[] = [
  { value: "DVD",     keyword: "DVD" },
  { value: "Blu-ray", keyword: "Blu-ray" },
  { value: "4K UHD",  keyword: "4K UHD" },
];

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
  {
    name: "bol.com",
    build: (q: string) => `https://www.bol.com/be/fr/s/?q=${encodeURIComponent(q)}`,
  },
  {
    name: "Amazon.fr",
    build: (q: string) =>
      `https://www.amazon.fr/s?k=${encodeURIComponent(q)}&i=dvd&language=fr_FR`,
  },
  {
    name: "Fnac.be",
    build: (q: string) =>
      `https://www.fnac.be/SearchResult/ResultList.aspx?Search=${encodeURIComponent(q)}&sectionId=1`,
  },
];

interface Props {
  data: PhysicalData | null;
  loading: boolean;
}

export default function PhysicalSection({ data, loading }: Props) {
  const [format, setFormat] = useState<PhysicalFormat>("Blu-ray");
  const [editionIdx, setEditionIdx] = useState(0);

  if (!loading && (!data || !data.has_physical)) return null;

  const buildQuery = () => {
    const title = data?.original_title || data?.title || "";
    const fmtKeyword = FORMATS.find((f) => f.value === format)?.keyword ?? format;
    const edKeyword = EDITIONS[editionIdx].keyword;
    return [title, fmtKeyword, edKeyword].filter(Boolean).join(" ");
  };

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
          <span>Vérification…</span>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5">
          {/* Qualité */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Qualité</p>
            <div className="flex gap-2">
              {FORMATS.map(({ value }) => (
                <button
                  key={value}
                  onClick={() => setFormat(value)}
                  className={`text-sm px-4 py-2 rounded-xl border font-medium transition-all ${
                    format === value
                      ? "bg-gray-900 text-white border-gray-900"
                      : "text-gray-600 border-gray-300 hover:border-gray-600 hover:text-gray-900"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Version / Édition */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Version</p>
            <div className="flex flex-wrap gap-2">
              {EDITIONS.map(({ label }, idx) => (
                <button
                  key={label}
                  onClick={() => setEditionIdx(idx)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    editionIdx === idx
                      ? "bg-purple-700 text-white border-purple-700"
                      : "text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Liens retailers */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Trouver sur</p>
            <div className="space-y-2">
              {RETAILERS.map(({ name, build }) => (
                <a
                  key={name}
                  href={build(buildQuery())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 hover:border-gray-400 transition-all group"
                >
                  <span className="font-medium text-gray-800 group-hover:text-gray-900">{name}</span>
                  <span className="text-xs text-gray-400 group-hover:text-gray-600">
                    Rechercher ↗
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
