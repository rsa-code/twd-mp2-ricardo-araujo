import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetJikanEpisodesQuery } from "../store/slices/apiSlice";
import {
  setEpisodeSortBy,
  setEpisodeFilterMode,
  resetEpisodeFilters,
  nextEpisodePage,
  prevEpisodePage,
  EpisodeSortBy,
  EpisodeFilterMode,
} from "../store/slices/filtersSlice";
import {
  selectFavoriteCount,
  selectWatchedCount,
} from "../store/slices/favoritesSlice";
import { RootState } from "../store";
import { JikanEpisodeCard } from "../components/JikanEpisodeCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ArrowUpDown, Heart, Eye, Filter } from "lucide-react";

export const JikanEpisodes: React.FC = () => {
  const dispatch = useDispatch();

  const { sortBy, minRating, currentPage, itemsPerPage, filterMode } =
    useSelector((state: RootState) => state.filters.episodes);

  const favoriteCount = useSelector(selectFavoriteCount);
  const watchedCount = useSelector(selectWatchedCount);
  const favoriteEpisodes = useSelector(
    (state: RootState) => state.favorites.episodes,
  );

  const {
    data: episodes = [],
    isLoading,
    isError,
    refetch,
  } = useGetJikanEpisodesQuery();

  const processedEpisodes = useMemo(() => {
    return [...episodes]
      .filter((ep) => (ep.score || 0) >= minRating)
      .filter((ep) => {
        const status = favoriteEpisodes[ep.mal_id];
        if (filterMode === "favorites") return status?.isFavorite === true;
        if (filterMode === "watched") return status?.isWatched === true;
        if (filterMode === "unwatched") return !status?.isWatched;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "rating-desc") return (b.score || 0) - (a.score || 0);
        if (sortBy === "rating-asc") return (a.score || 0) - (b.score || 0);

        const dateA = a.aired ? new Date(a.aired).getTime() : 0;
        const dateB = b.aired ? new Date(b.aired).getTime() : 0;

        if (sortBy === "date-desc") return dateB - dateA;
        return dateA - dateB;
      });
  }, [episodes, sortBy, minRating, filterMode, favoriteEpisodes]);

  const totalPages = Math.ceil(processedEpisodes.length / itemsPerPage);
  const currentEpisodes = processedEpisodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSortChange = (newSort: EpisodeSortBy) => {
    dispatch(setEpisodeSortBy(newSort));
  };

  const handleFilterModeChange = (mode: EpisodeFilterMode) => {
    dispatch(setEpisodeFilterMode(mode));
  };

  const handleReset = () => {
    dispatch(resetEpisodeFilters());
  };

  const handleNextPage = () => {
    dispatch(nextEpisodePage(totalPages));
  };

  const handlePrevPage = () => {
    dispatch(prevEpisodePage());
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mt-12 mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white text-glow">
            Episode List
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded">
              <ArrowUpDown size={16} className="text-rose-600" />
              <select
                value={sortBy}
                onChange={(e) =>
                  handleSortChange(e.target.value as EpisodeSortBy)
                }
                className="bg-zinc-900 border-none focus:ring-0 text-white text-sm cursor-pointer outline-none"
              >
                <option value="date-asc" className="bg-zinc-900 text-white">
                  Oldest First
                </option>
                <option value="date-desc" className="bg-zinc-900 text-white">
                  Newest First
                </option>
                <option value="rating-desc" className="bg-zinc-900 text-white">
                  Highest Rated
                </option>
                <option value="rating-asc" className="bg-zinc-900 text-white">
                  Lowest Rated
                </option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded">
              <Filter size={16} className="text-rose-600" />
              <select
                value={filterMode}
                onChange={(e) =>
                  handleFilterModeChange(e.target.value as EpisodeFilterMode)
                }
                className="bg-zinc-900 border-none focus:ring-0 text-white text-sm cursor-pointer outline-none"
              >
                <option value="all" className="bg-zinc-900 text-white">
                  All Episodes
                </option>
                <option value="favorites" className="bg-zinc-900 text-white">
                  Favorites Only
                </option>
                <option value="watched" className="bg-zinc-900 text-white">
                  Watched Only
                </option>
                <option value="unwatched" className="bg-zinc-900 text-white">
                  Unwatched Only
                </option>
              </select>
            </div>

            <button
              onClick={handleReset}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors rounded text-sm font-cinzel"
            >
              Reset
            </button>
          </div>
        </div>

        {isError ? (
          <div className="text-center py-20 border border-rose-900/30 bg-rose-950/10 flex flex-col items-center gap-4">
            <p className="text-rose-500 text-xl font-cinzel">
              Failed to load episodes from Jikan API
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-rose-900/20 border border-rose-800 text-rose-200 hover:bg-rose-900/40 transition-colors rounded font-cinzel"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <p className="text-zinc-500 text-sm">
                Showing {currentEpisodes.length} of {processedEpisodes.length}{" "}
                episodes
                {minRating > 0 && ` (filtered by rating ≥ ${minRating})`}
              </p>

              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-400">
                    <span className="text-rose-400 font-bold">
                      {favoriteCount}
                    </span>{" "}
                    favorites
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-zinc-400">
                    <span className="text-emerald-400 font-bold">
                      {watchedCount}
                    </span>{" "}
                    watched
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
              {currentEpisodes.length > 0 ? (
                currentEpisodes.map((episode) => (
                  <JikanEpisodeCard key={episode.mal_id} episode={episode} />
                ))
              ) : (
                <div className="col-span-full text-center py-12 border border-zinc-800 bg-zinc-900/30">
                  <p className="text-zinc-400">
                    {episodes.length === 0
                      ? "No episodes loaded from API."
                      : "No episodes found matching criteria."}
                  </p>
                </div>
              )}
            </div>

            {processedEpisodes.length > itemsPerPage && (
              <div className="flex justify-center items-center mt-12 gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-6 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-cinzel text-sm"
                >
                  Previous
                </button>

                <span className="text-zinc-400 font-cinzel">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-cinzel text-sm"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
