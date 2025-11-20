import React from 'react';
import { Media } from '../types';
import { Star, BookOpen, Tv, Heart } from 'lucide-react';

interface MediaCardProps {
  media: Media;
  align?: 'left' | 'right';
}

export const MediaCard: React.FC<MediaCardProps> = ({ media, align = 'left' }) => {
  const isLeft = align === 'left';

  return (
    <div className={`flex flex-col lg:flex-row gap-8 items-start py-12 ${isLeft ? '' : 'lg:flex-row-reverse'}`}>
      <div className="w-full lg:w-1/3 relative group">
        <div className="absolute -inset-2 bg-rose-600/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img 
          src={media.coverImage.extraLarge} 
          alt={media.title.english || media.title.romaji} 
          className="relative w-full rounded-sm shadow-2xl object-cover aspect-[2/3]"
        />
        {media.averageScore && (
          <div className="absolute -bottom-4 -right-4 bg-rose-600 text-white px-4 py-2 font-bold text-xl z-20 font-cinzel">
            {media.averageScore}%
          </div>
        )}
      </div>

      <div className="w-full lg:w-2/3 space-y-6">
        <div className={`flex flex-col ${isLeft ? 'items-start' : 'lg:items-end lg:text-right'}`}>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-2">
            {media.type}
          </h2>
          <h3 className="text-xl text-rose-500 font-cinzel italic">{media.title.native}</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {media.genres.map((genre) => (
            <span key={genre} className="px-3 py-1 border border-zinc-700 text-xs uppercase tracking-wider text-zinc-400 hover:border-rose-600 hover:text-rose-500 transition-colors">
              {genre}
            </span>
          ))}
        </div>

        <div 
          className="text-zinc-300 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: media.description || 'No description available.' }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-zinc-800">
          <div className="flex flex-col">
            <span className="text-zinc-500 text-xs uppercase tracking-widest">Format</span>
            <span className="font-bold flex items-center gap-2">
              {media.type === 'ANIME' ? <Tv size={16} /> : <BookOpen size={16} />}
              {media.format}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-500 text-xs uppercase tracking-widest">Status</span>
            <span className={`font-bold uppercase ${media.status === 'FINISHED' ? 'text-green-500' : 'text-yellow-500'}`}>
              {media.status}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-500 text-xs uppercase tracking-widest">
              {media.type === 'ANIME' ? 'Episodes' : 'Chapters'}
            </span>
            <span className="font-bold">
              {media.type === 'ANIME' ? media.episodes : media.chapters || 'Hiatus'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-500 text-xs uppercase tracking-widest">Rating</span>
            <span className="font-bold flex items-center gap-2 text-yellow-500">
              <Star size={16} fill="currentColor" />
              {media.averageScore ? media.averageScore / 10 : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};