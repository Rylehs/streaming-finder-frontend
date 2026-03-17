"use client";

import { useEffect, useRef } from "react";
import { BE_SUBSCRIPTION_PLATFORMS } from "../hooks/useSubscriptions";

interface Props {
  selected: Set<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
}

export default function SubscriptionPanel({ selected, onToggle, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Ferme en cliquant en dehors
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800 text-sm">Mes abonnements</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
      </div>
      <p className="text-xs text-gray-400 mb-3">
        Cochez vos abonnements actifs pour voir en priorité ce que vous pouvez regarder.
      </p>
      <div className="space-y-1">
        {BE_SUBSCRIPTION_PLATFORMS.map((p) => (
          <label
            key={p.id}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selected.has(p.id)}
              onChange={() => onToggle(p.id)}
              className="w-4 h-4 rounded accent-blue-500"
            />
            <span className="text-sm text-gray-700">{p.label}</span>
          </label>
        ))}
      </div>
      {selected.size > 0 && (
        <p className="text-xs text-blue-500 mt-3 text-center">
          {selected.size} abonnement{selected.size > 1 ? "s" : ""} sélectionné{selected.size > 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
