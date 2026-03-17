import type { ContentResult } from "../types";

interface Props {
  content: ContentResult;
}

export default function FilmHero({ content }: Props) {
  return (
    <div className="flex gap-5 items-start">
      {content.poster_url ? (
        <img
          src={content.poster_url}
          alt={content.title}
          className="w-24 rounded-xl shadow-lg shrink-0"
        />
      ) : (
        <div className="w-24 h-36 bg-gray-200 rounded-xl shrink-0" />
      )}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{content.title}</h1>
          <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 shrink-0">
            {content.content_type === "tv" ? "Série" : "Film"}
          </span>
        </div>
        <p className="text-gray-500 mt-1 text-sm flex flex-wrap gap-3">
          {content.year && <span>{content.year}</span>}
          {content.content_type === "movie" && content.duration_min && (
            <span>{content.duration_min} min</span>
          )}
          {content.content_type === "tv" && content.number_of_seasons && (
            <span>
              {content.number_of_seasons} saison{content.number_of_seasons > 1 ? "s" : ""}
              {content.number_of_episodes && ` · ${content.number_of_episodes} épisodes`}
            </span>
          )}
          {content.original_title !== content.title && (
            <span className="italic">{content.original_title}</span>
          )}
        </p>
        {content.synopsis && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">{content.synopsis}</p>
        )}
        <p className="text-xs text-gray-400 mt-2">Belgique · Français</p>
      </div>
    </div>
  );
}
