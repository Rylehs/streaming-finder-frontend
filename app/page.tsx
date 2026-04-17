"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ContentResult, ContentType, StreamingOffer, PhysicalData } from "./types";
import SearchBar from "./components/SearchBar";
import FilmHero from "./components/FilmHero";
import OfferSection from "./components/OfferSection";
import PhysicalSection from "./components/PhysicalSection";
import SubscriptionPanel from "./components/SubscriptionPanel";
import { useSubscriptions } from "./hooks/useSubscriptions";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const CONTENT_TYPES: { value: ContentType; label: string; emoji: string }[] = [
  { value: "movie", label: "Films",  emoji: "🎬" },
  { value: "tv",    label: "Séries", emoji: "📺" },
];

const EMPTY_CONTENT = (id: number, type: ContentType): ContentResult => ({
  tmdb_id: id,
  content_type: type,
  title: "",
  original_title: "",
  year: null,
  synopsis: null,
  poster_url: null,
  duration_min: null,
  number_of_seasons: null,
  number_of_episodes: null,
});

export default function Home() {
  const [contentType, setContentType] = useState<ContentType>("movie");
  const [content, setContent] = useState<ContentResult | null>(null);
  const [offers, setOffers] = useState<StreamingOffer[]>([]);
  const [physicalData, setPhysicalData] = useState<PhysicalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [physicalLoading, setPhysicalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSubPanel, setShowSubPanel] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const { selected, toggle, hydrated } = useSubscriptions();
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Fetch commun ──────────────────────────────────────────────────────────
  async function fetchAndDisplay(tmdbId: number, type: ContentType) {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setOffers([]);
    setPhysicalData(null);
    setError(null);
    setLoading(true);
    setPhysicalLoading(true);

    const [streamingResult, physicalResult] = await Promise.allSettled([
      fetch(`${API}/availability/${tmdbId}?type=${type}`, { signal }),
      fetch(`${API}/physical/${tmdbId}?type=${type}`, { signal }),
    ]);

    try {
      if (streamingResult.status === "rejected") throw streamingResult.reason;
      const res = streamingResult.value;
      if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
      const data = await res.json();
      if (data.content) setContent(data.content as ContentResult);
      setOffers((data.offers ?? []) as StreamingOffer[]);
      if (!data.offers?.length) setError(data.message);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError")
        setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }

    try {
      if (physicalResult.status === "rejected") throw physicalResult.reason;
      const res = physicalResult.value;
      if (res.ok) setPhysicalData((await res.json()) as PhysicalData);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
    } finally {
      setPhysicalLoading(false);
    }
  }

  // ── Chargement automatique depuis l'URL (?id=...&type=...) ───────────────
  useEffect(() => {
    const id = parseInt(searchParams.get("id") ?? "", 10);
    const typeParam = searchParams.get("type");
    if (!id) return;
    const type: ContentType = typeParam === "tv" ? "tv" : "movie";
    setContentType(type);
    setContent(EMPTY_CONTENT(id, type));
    fetchAndDisplay(id, type);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sélection depuis la barre de recherche ────────────────────────────────
  async function handleSelect(item: ContentResult) {
    router.replace(`?id=${item.tmdb_id}&type=${contentType}`, { scroll: false });
    setContent(item);
    fetchAndDisplay(item.tmdb_id, contentType);
  }

  function handleTypeChange(type: ContentType) {
    setContentType(type);
    setContent(null);
    setOffers([]);
    setPhysicalData(null);
    setError(null);
    router.replace("/", { scroll: false });
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-100 sticky top-0 z-40 px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="flex items-center gap-3">
            {/* Toggle Film / Série */}
            <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
              {CONTENT_TYPES.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  onClick={() => handleTypeChange(value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    contentType === value
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1">
              <p className="text-xs text-gray-400 text-right">Belgique · Français</p>
            </div>

            {/* Bouton Mes abonnements */}
            <div className="relative">
              <button
                onClick={() => setShowSubPanel((v) => !v)}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-700"
              >
                <span>⚙</span>
                <span className="hidden sm:inline">Abonnements</span>
                {hydrated && selected.size > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {selected.size}
                  </span>
                )}
              </button>
              {showSubPanel && (
                <SubscriptionPanel
                  selected={selected}
                  onToggle={toggle}
                  onClose={() => setShowSubPanel(false)}
                />
              )}
            </div>
          </div>

          <SearchBar onSelect={handleSelect} contentType={contentType} />
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {!content && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">{contentType === "tv" ? "📺" : "🔍"}</p>
            <p className="text-lg">
              {contentType === "tv"
                ? "Recherchez une série pour voir où la regarder"
                : "Recherchez un film pour voir où le regarder"}
            </p>
            <p className="text-sm mt-2">Disponibilités en Belgique · Audio ou sous-titres français</p>
          </div>
        )}

        {content && (
          <>
            <FilmHero content={content} />
            <hr className="border-gray-200" />
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}
            <OfferSection offers={offers} loading={loading} mySubscriptions={selected} />
            <PhysicalSection data={physicalData} loading={physicalLoading} />
          </>
        )}
      </div>
    </main>
  );
}
