import React, { useEffect, useState } from 'react';
import { fetchJikanEpisodes } from '../services/jikanService';
import { JikanEpisode } from '../types';
import { JikanEpisodeCard } from '../components/JikanEpisodeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const JikanEpisodes: React.FC = () => {
  const [episodes, setEpisodes] = useState<JikanEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
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

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mt-12 mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white mb-4 text-glow">
            Episode List
          </h1>
        </div>
        
        {error ? (
          <div className="text-center py-20 border border-rose-900/30 rounded-lg bg-rose-950/10">
            <p className="text-rose-500 text-xl font-cinzel">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
              {episodes.length > 0 ? (
                episodes
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((episode) => (
                    <JikanEpisodeCard key={episode.mal_id} episode={episode} />
                  ))
              ) : (
                <div className="col-span-full text-center py-12 border border-zinc-800 rounded-lg bg-zinc-900/30">
                  <p className="text-zinc-400">No episodes found.</p>
                </div>
              )}
            </div>

            {episodes.length > itemsPerPage && (
              <div className="flex justify-center items-center mt-12 gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-cinzel text-sm"
                >
                  Previous
                </button>
                
                <span className="text-zinc-400 font-cinzel">
                  Page {currentPage} of {Math.ceil(episodes.length / itemsPerPage)}
                </span>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(episodes.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(episodes.length / itemsPerPage)}
                  className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-cinzel text-sm"
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
