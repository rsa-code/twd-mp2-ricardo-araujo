import React, { useEffect, useState } from 'react';
import { fetchNanaVolumes } from '../services/jikanService';
import { JikanImage } from '../types';
import { MangaVolumeCard } from '../components/MangaVolumeCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const NanaVolumes: React.FC = () => {
  const [volumes, setVolumes] = useState<JikanImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVolumes = async () => {
      try {
        const result = await fetchNanaVolumes();
        setVolumes(result);
      } catch (err) {
        setError('Failed to load Nana volumes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadVolumes();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mt-12 mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white mb-4 text-glow">
            Nana Manga Volumes
          </h1>
        </div>
        
        {error ? (
          <div className="text-center py-20 border border-rose-900/30 rounded-lg bg-rose-950/10">
            <p className="text-rose-500 text-xl font-cinzel">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {volumes.length > 0 ? (
              volumes.map((image, index) => (
                <MangaVolumeCard key={index} image={image} index={index} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 border border-zinc-800 rounded-lg bg-zinc-900/30">
                <p className="text-zinc-400">No volumes found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
