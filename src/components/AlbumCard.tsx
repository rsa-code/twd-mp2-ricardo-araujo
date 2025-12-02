import React from 'react';
import { DeezerAlbum } from '../services/deezerService';
import { Play, } from 'lucide-react';

interface AlbumCardProps {
  album: DeezerAlbum;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({ album }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col md:flex-row gap-6 p-6 hover:border-rose-600/50 transition-colors mt-8">
      <div className="w-full md:w-64 shrink-0 relative group flex items-center justify-center">
        <div className="relative w-56 h-56">
          <div className="absolute inset-0 rounded-full bg-zinc-800 shadow-xl"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-950"></div>
          <div className="absolute inset-[45%] rounded-full bg-rose-600/20"></div>
          
          <img 
            src={album.cover_xl} 
            alt={album.title} 
            className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-cover rounded-full shadow-lg animate-spin-slow"
          />
        </div>
        <a 
          href={album.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <div className="bg-black/60 rounded-full p-4">
            <Play size={48} className="text-rose-600 fill-rose-600" />
          </div>
        </a>
      </div>
      
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-2xl font-black font-cinzel text-white">{album.title}</h3>
          <p className="text-rose-500 font-cinzel italic text-lg">{album.artist.name}</p>
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
      </div>
    </div>
  );
};
