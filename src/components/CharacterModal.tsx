import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { CharacterNode } from '../types';

interface CharacterModalProps {
  character: CharacterNode;
  role: string;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({ character, role, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const cleanDescription = (desc?: string) => {
    if (!desc) return '<p>No description available for this character.</p>';
    
    let cleaned = desc;

    while (true) {
      const prev = cleaned;
      cleaned = cleaned.replace(/^(__.*?__|<(strong|b)>.*?<\/(strong|b)>).*?(?=(__|<(strong|b)>|<br|\n|$))/i, '');
      cleaned = cleaned.replace(/^(<br\s*\/?>|\s)+/i, '');
      if (cleaned === prev) break;
    }

    return cleaned;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-rose-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="w-full md:w-2/5 h-64 md:h-auto relative shrink-0">
           <img 
            src={character.image.large} 
            alt={character.name.full} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-zinc-950"></div>
        </div>

        <div className="w-full md:w-3/5 p-8 overflow-y-auto">
          <div className="mb-8 border-b border-zinc-800 pb-6">
            <h2 className="text-4xl md:text-5xl font-black font-cinzel text-white mb-2 tracking-tight">{character.name.full}</h2>
            <p className="text-xl text-rose-600 font-cinzel italic mb-4">{character.name.native}</p>
            <span className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs uppercase tracking-widest">
              {role}
            </span>
          </div>

          <div className="prose prose-invert prose-rose max-w-none">
             <div 
              className="text-zinc-300 leading-relaxed text-lg space-y-4 font-light"
              dangerouslySetInnerHTML={{ __html: cleanDescription(character.description) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
