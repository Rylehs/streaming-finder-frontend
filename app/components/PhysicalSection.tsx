"use client";

import { useState } from "react";
import type { PhysicalData } from "../types";

const FORMATS = [
  { label: "4K UHD",  keyword: "4K UHD",  style: "bg-yellow-50 text-yellow-800 border-yellow-200" },
  { label: "Blu-ray", keyword: "Blu-ray",  style: "bg-blue-50 text-blue-800 border-blue-200" },
  { label: "DVD",     keyword: "DVD",      style: "bg-gray-50 text-gray-700 border-gray-200" },
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
  { name: "bol.com",         build: (q: string) => `https://www.bol.com/be/fr/s/?q=${encodeURIComponent(q)}` },
  { name: "Amazon.com.be",   build: (q: string) => `https://www.amazon.com.be/s?k=${encodeURIComponent(q)}&i=dvd` },
  { name: "Amazon.fr",       build: (q: string) => `https://www.amazon.fr/s?k=${encodeURIComponent(q)}&i=dvd&language=fr_FR` },
  { name: "Fnac.be",         build: (q: string) => `https://www.fnac.be/SearchResult/ResultList.aspx?Search=${encodeURIComponent(q)}&sectionId=1` },
];

interface Props {
  data: PhysicalData | null;
  loading: boolean;
}

export default function PhysicalSection({ data, loading }: Props) {
  const [editionIdx, setEditionIdx] = useState(0);

  if (!loading && (!data || !data.has_physical)) return null;

  const buildQuery = (formatKeyword: string) => {
    const title = data?.original_title || data?.title || "";
    const edKeyword = EDITIONS[editionIdx].keyword;
    return [title, formatKeyword, edKeyword].filter(Boolean).join(" ");
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
        <div className="space-y-4">
          {/* Sélecteur d'édition — s'applique à tous les formats */}
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

          {/* Matrice formats × retailers */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            {/* En-tête retailers */}
            <div className="grid bg-gray-50 border-b border-gray-200"
              style={{ gridTemplateColumns: `140px repeat(${RETAILERS.length}, 1fr)` }}>
              <div className="px-4 py-2.5" />
              {RETAILERS.map(({ name }) => (
                <div key={name} className="px-2 py-2.5 text-xs font-semibold text-gray-500 text-center truncate">
                  {name}
                </div>
              ))}
            </div>

            {/* Lignes formats */}
            {FORMATS.map(({ label, keyword, style }, fi) => (
              <div
                key={label}
                className={`grid items-center ${fi < FORMATS.length - 1 ? "border-b border-gray-100" : ""}`}
                style={{ gridTemplateColumns: `140px repeat(${RETAILERS.length}, 1fr)` }}
              >
                {/* Badge format */}
                <div className="px-4 py-3">
                  <span className={`text-xs font-bold border rounded-md px-2 py-1 ${style}`}>
                    {label}
                  </span>
                </div>

                {/* Lien par retailer */}
                {RETAILERS.map(({ name, build }) => (
                  <div key={name} className="px-2 py-3 text-center">
                    <a
                      href={build(buildQuery(keyword))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-400 hover:bg-white transition-all text-sm"
                      title={`${label} sur ${name}`}
                    >
                      ↗
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
