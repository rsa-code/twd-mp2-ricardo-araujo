import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Star, Heart, Eye } from "lucide-react";
import { JikanEpisode } from "../types";
import { RootState } from "../store";
import {
  toggleFavorite,
  toggleWatched,
  setRating,
  selectEpisodeStatus,
} from "../store/slices/favoritesSlice";

interface JikanEpisodeCardProps {
  episode: JikanEpisode;
}

export const JikanEpisodeCard: React.FC<JikanEpisodeCardProps> = ({
  episode,
}) => {
  const dispatch = useDispatch();
  const episodeStatus = useSelector((state: RootState) =>
    selectEpisodeStatus(state, episode.mal_id),
  );

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

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(episode.mal_id));
  };

  const handleToggleWatched = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWatched(episode.mal_id));
  };

  const handleSetRating = (rating: number) => {
    const newRating = episodeStatus.rating === rating ? null : rating;
    dispatch(setRating({ episodeId: episode.mal_id, rating: newRating }));
  };

  return (
    <div
      className={`bg-zinc-900/50 border p-6 transition-all duration-300 group relative overflow-hidden ${
        episodeStatus.isWatched
          ? "border-emerald-600/50 bg-emerald-950/10"
          : "border-zinc-800 hover:border-rose-600/50"
      }`}
    >
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

        {/* User Actions */}
        <div className="flex items-center gap-3 border-t border-zinc-800/50 pt-4">
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all ${
              episodeStatus.isFavorite
                ? "bg-rose-900/50 border-rose-700 text-rose-200"
                : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-rose-600 hover:text-rose-400"
            }`}
            title={
              episodeStatus.isFavorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <Heart
              size={14}
              fill={episodeStatus.isFavorite ? "currentColor" : "none"}
            />
            <span>Fav</span>
          </button>

          <button
            onClick={handleToggleWatched}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs border transition-all ${
              episodeStatus.isWatched
                ? "bg-emerald-900/50 border-emerald-700 text-emerald-200"
                : "bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-emerald-600 hover:text-emerald-400"
            }`}
            title={
              episodeStatus.isWatched ? "Mark as unwatched" : "Mark as watched"
            }
          >
            <Eye
              size={14}
              fill={episodeStatus.isWatched ? "currentColor" : "none"}
            />
            <span>Watched</span>
          </button>

          {/* User Rating */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-xs text-zinc-500 mr-1">My Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleSetRating(star)}
                className="p-0.5 transition-transform hover:scale-110"
                title={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  size={16}
                  className={
                    episodeStatus.rating && episodeStatus.rating >= star
                      ? "text-yellow-500"
                      : "text-zinc-600 hover:text-yellow-400"
                  }
                  fill={
                    episodeStatus.rating && episodeStatus.rating >= star
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
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
