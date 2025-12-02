import React from 'react';
import { DeezerAlbum } from '../services/deezerService';
import { Play, } from 'lucide-react';

interface AlbumCardProps {
  album: DeezerAlbum;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden flex flex-col md:flex-row gap-6 p-6 hover:border-rose-600/50 transition-colors mt-8">
      <div className="w-full md:w-64 shrink-0 relative group">
        <img 
          src={album.cover_xl} 
          alt={album.title} 
          className="w-full aspect-square object-cover rounded shadow-lg"
        />
        <a 
          href={album.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play size={48} className="text-rose-600 fill-rose-600" />
        </a>
      </div>
      
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-2xl font-black font-cinzel text-white">{album.title}</h3>
          <p className="text-rose-500 font-cinzel italic text-lg">{album.artist.name}</p>
          <p className="text-zinc-500 text-sm mt-1">{album.release_date} • {album.label}</p>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
          {album.tracks && album.tracks.data ? (
            album.tracks.data.map((track, index) => (
              <a 
                key={track.id}
                href={track.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded hover:bg-zinc-800 group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600 font-mono text-sm w-6">{index + 1}</span>
                  <span className="text-zinc-300 group-hover:text-white transition-colors">{track.title}</span>
                </div>
                <span className="text-zinc-600 text-xs font-mono">
                  {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                </span>
              </a>
            ))
          ) : (
            <p className="text-zinc-500 italic">No tracks available</p>
          )}
        </div>
        
        <div className="pt-4">
             <a 
              href={album.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-400 hover:text-rose-600 transition-colors"
            >
              Listen on Deezer
            </a>
        </div>
      </div>
    </div>
  );
};
