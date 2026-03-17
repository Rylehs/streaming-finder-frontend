"use client";

import { useState, useEffect, useRef } from "react";
import type { ContentResult, ContentType } from "../types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface Props {
  onSelect: (content: ContentResult) => void;
  contentType: ContentType;
}

export default function SearchBar({ onSelect, contentType }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ContentResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Vider les suggestions quand on change de type
  useEffect(() => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  }, [contentType]);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API}/search?q=${encodeURIComponent(query)}&type=${contentType}`
        );
        const data: ContentResult[] = await res.json();
        setSuggestions(data);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }, [query, contentType]);

  function handleSelect(item: ContentResult) {
    setQuery(item.title + (item.year ? ` (${item.year})` : ""));
    setOpen(false);
    onSelect(item);
  }

  const placeholder = contentType === "tv" ? "Rechercher une série..." : "Rechercher un film...";

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-200 focus-within:border-blue-400 transition-colors">
        <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none text-gray-800 placeholder-gray-400 text-lg bg-transparent"
          autoFocus
        />
        {loading && (
          <svg className="w-5 h-5 text-blue-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          {suggestions.map((item) => (
            <li
              key={item.tmdb_id}
              onClick={() => handleSelect(item)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              {item.poster_url ? (
                <img src={item.poster_url} alt={item.title} className="w-10 h-14 object-cover rounded-md shrink-0" />
              ) : (
                <div className="w-10 h-14 bg-gray-200 rounded-md shrink-0 flex items-center justify-center text-gray-400 text-xs">?</div>
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-sm text-gray-500">
                  {item.year && <span>{item.year}</span>}
                  {item.content_type === "movie" && item.duration_min && (
                    <span className="ml-2">{item.duration_min} min</span>
                  )}
                  {item.content_type === "tv" && item.number_of_seasons && (
                    <span className="ml-2">{item.number_of_seasons} saison{item.number_of_seasons > 1 ? "s" : ""}</span>
                  )}
                </p>
                {item.synopsis && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{item.synopsis}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
