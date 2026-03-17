"use client";

import { useState, useEffect } from "react";

export interface Platform {
  id: string;   // correspond au clearName JustWatch
  label: string;
  logo?: string;
}

// Plateformes en Belgique proposant un abonnement (subscription)
export const BE_SUBSCRIPTION_PLATFORMS: Platform[] = [
  { id: "Netflix",                  label: "Netflix" },
  { id: "Amazon Prime Video",       label: "Prime Video" },
  { id: "Disney Plus",              label: "Disney+" },
  { id: "Apple TV Plus",            label: "Apple TV+" },
  { id: "Canal+",                   label: "Canal+" },
  { id: "HBO Max",                  label: "Max (HBO)" },
  { id: "Paramount Plus",           label: "Paramount+" },
  { id: "HBO Max Amazon Channel",   label: "Max via Prime" },
  { id: "MUBI",                     label: "MUBI" },
  { id: "Filmo",                    label: "Filmo" },
];

const STORAGE_KEY = "streaming-finder:subscriptions";

export function useSubscriptions() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSelected(new Set(JSON.parse(stored)));
    } catch {}
    setHydrated(true);
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }

  return { selected, toggle, hydrated };
}
