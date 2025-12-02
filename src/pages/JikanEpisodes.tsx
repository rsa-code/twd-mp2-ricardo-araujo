import React, { useEffect, useState, useMemo } from 'react';
import { fetchJikanEpisodes } from '../services/jikanService';
import { JikanEpisode } from '../types';
import { JikanEpisodeCard } from '../components/JikanEpisodeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Filter, ArrowUpDown } from 'lucide-react';

export const JikanEpisodes: React.FC = () => {
  const [episodes, setEpisodes] = useState<JikanEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'date-asc' | 'date-desc' | 'rating-desc' | 'rating-asc'>('date-asc');
  const [minRating, setMinRating] = useState(0);
  const itemsPerPage = 7;

  useEffect(() => {
    const init = async () => {
      try {
        const result = await fetchJikanEpisodes();
        setEpisodes(result);
      } catch (err) {
        setError('Failed to load episodes from Jikan API');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, minRating]);

  const processedEpisodes = useMemo(() => {
    return episodes
      .filter(ep => (ep.score || 0) >= minRating)
      .sort((a, b) => {
        if (sortBy === 'rating-desc') return (b.score || 0) - (a.score || 0);
        if (sortBy === 'rating-asc') return (a.score || 0) - (b.score || 0);
        
        const dateA = a.aired ? new Date(a.aired).getTime() : 0;
        const dateB = b.aired ? new Date(b.aired).getTime() : 0;
        
        if (sortBy === 'date-desc') return dateB - dateA;
        return dateA - dateB;
      });
  }, [episodes, sortBy, minRating]);

  const totalPages = Math.ceil(processedEpisodes.length / itemsPerPage);
  const currentEpisodes = processedEpisodes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <LoadingSpinner />;

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
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-900 border-none focus:ring-0 text-white text-sm cursor-pointer outline-none"
              >
                <option value="date-asc" className="bg-zinc-900 text-white">Oldest First</option>
                <option value="date-desc" className="bg-zinc-900 text-white">Newest First</option>
                <option value="rating-desc" className="bg-zinc-900 text-white">Highest Rated</option>
                <option value="rating-asc" className="bg-zinc-900 text-white">Lowest Rated</option>
              </select>
            </div>

            <button 
              onClick={() => { setMinRating(0); setSortBy('date-asc'); }}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors rounded text-sm font-cinzel"
            >
              Reset
            </button>
          </div>
        </div>
        
        {error ? (
          <div className="text-center py-20 border border-rose-900/30 bg-rose-950/10 flex flex-col items-center gap-4">
            <p className="text-rose-500 text-xl font-cinzel">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-rose-900/20 border border-rose-800 text-rose-200 hover:bg-rose-900/40 transition-colors rounded font-cinzel"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
              {currentEpisodes.length > 0 ? (
                currentEpisodes.map((episode) => (
                    <JikanEpisodeCard key={episode.mal_id} episode={episode} />
                  ))
              ) : (
                <div className="col-span-full text-center py-12 border border-zinc-800 bg-zinc-900/30">
                  <p className="text-zinc-400">
                    {episodes.length === 0 ? 'No episodes loaded from API.' : 'No episodes found matching criteria.'}
                  </p>
                </div>
              )}
            </div>

            {processedEpisodes.length > itemsPerPage && (
              <div className="flex justify-center items-center mt-12 gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-cinzel text-sm"
                >
                  Previous
                </button>
                
                <span className="text-zinc-400 font-cinzel">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
