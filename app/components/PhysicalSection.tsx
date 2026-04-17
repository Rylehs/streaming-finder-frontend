"use client";

import { useState } from "react";
import type { PhysicalOffer, PhysicalFormat } from "../types";
import PhysicalCard from "./PhysicalCard";

type Filter = "all" | PhysicalFormat;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all",     label: "Tous" },
  { value: "4K UHD",  label: "4K UHD" },
  { value: "Blu-ray", label: "Blu-ray" },
  { value: "DVD",     label: "DVD" },
];

interface Props {
  offers: PhysicalOffer[];
  loading: boolean;
}

export default function PhysicalSection({ offers, loading }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  if (!loading && offers.length === 0) return null;

  const visible = filter === "all" ? offers : offers.filter((o) => o.format === filter);
  const hasFormat = (fmt: PhysicalFormat) => offers.some((o) => o.format === fmt);

  return (
    <section>
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-500 mb-3">
        <span>💿</span>
        <span>Support physique</span>
      </h2>

      {offers.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {FILTERS.map(({ value, label }) => {
            const active = filter === value;
            const disabled = value !== "all" && !hasFormat(value as PhysicalFormat);
            return (
              <button
                key={value}
                onClick={() => !disabled && setFilter(value)}
                disabled={disabled}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  active
                    ? "bg-gray-800 text-white border-gray-800"
                    : disabled
                    ? "text-gray-300 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 border-gray-300 hover:border-gray-500 hover:text-gray-800"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        {visible.map((offer, i) => (
          <PhysicalCard key={`${offer.format}-${offer.title}-${i}`} offer={offer} />
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-gray-400 py-4">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Recherche support physique…</span>
        </div>
      )}
    </section>
  );
}
