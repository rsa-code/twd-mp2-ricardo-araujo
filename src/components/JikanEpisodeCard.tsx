import React from "react";
import { Calendar, Star } from "lucide-react";
import { JikanEpisode } from "../types";

interface JikanEpisodeCardProps {
  episode: JikanEpisode;
}

export const JikanEpisodeCard: React.FC<JikanEpisodeCardProps> = ({
  episode,
}) => {
  if (!episode) return null;

  let date = "Unknown Date";
  try {
    if (episode.aired) {
      const d = new Date(episode.aired);
      if (!isNaN(d.getTime())) {
        date = d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    }
  } catch (e) {
    console.error("Error parsing date:", episode.aired);
  }

  const episodeNumber = episode.mal_id
    ? episode.mal_id.toString().padStart(2, "0")
    : "??";

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 hover:border-rose-600/50 transition-all duration-300 group relative overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline gap-4">
          <span className="text-5xl font-black text-zinc-800 group-hover:text-rose-900/30 transition-colors font-cinzel">
            {episodeNumber}
          </span>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-zinc-200 group-hover:text-rose-500 transition-colors line-clamp-1">
              {episode.title || "Untitled"}
            </h3>
            <p className="text-sm text-zinc-500 font-serif italic">
              {episode.title_japanese || ""}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 border-t border-zinc-800/50 pt-4">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Calendar size={14} />
            <span>{date}</span>
          </div>

          {episode.score && (
            <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded text-xs border border-zinc-800">
              <Star size={12} className="text-yellow-500" fill="currentColor" />
              <span className="font-mono text-zinc-300">{episode.score}</span>
            </div>
          )}
        </div>

        {episode.filler && (
          <div className="absolute top-4 right-4">
            <span className="bg-rose-900/50 text-rose-200 text-xs px-2 py-1 rounded border border-rose-800">
              Filler
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
