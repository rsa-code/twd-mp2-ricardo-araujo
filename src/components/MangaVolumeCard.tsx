import React from 'react';
import { JikanImage } from '../types';

interface MangaVolumeCardProps {
  image: JikanImage;
  index: number;
}

export const MangaVolumeCard: React.FC<MangaVolumeCardProps> = ({ image, index }) => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 overflow-hidden hover:border-rose-600/50 transition-all duration-300 group">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={image.webp.large_image_url || image.jpg.large_image_url} 
          alt={`Nana Volume ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-500"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-lg font-bold text-zinc-200 group-hover:text-rose-500 transition-colors font-cinzel">
          Volume {index + 1}
        </h3>
      </div>
    </div>
  );
};
