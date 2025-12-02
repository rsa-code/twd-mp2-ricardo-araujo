import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CharacterNode } from '../types';
import { CharacterCard } from '../components/CharacterCard';
import { CharacterModal } from '../components/CharacterModal';
import { useGetNanaCharactersQuery } from '../store/slices/apiSlice';
import { toggleHighlight, resetHighlights } from '../store/slices/highlightsSlice';
import { RootState } from '../store';
import { Star, RotateCcw } from 'lucide-react';

export const NanaCharacters: React.FC = () => {
  const dispatch = useDispatch();
  const highlightedIds = useSelector((state: RootState) => state.highlights.highlightedIds);
  const { data: characters, isLoading, error } = useGetNanaCharactersQuery();
  const [selectedCharacter, setSelectedCharacter] = useState<{node: CharacterNode, role: string} | null>(null);

  if (isLoading) return <LoadingSpinner />;

  if (error || !characters) return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-rose-600">
      <p className="mt-4 font-cinzel text-xl">Failed to load characters.</p>
    </div>
  );

  const highlighted = characters.edges.filter(edge => 
    highlightedIds.includes(edge.node.id)
  );
  
  const others = characters.edges.filter(edge => 
    !highlightedIds.includes(edge.node.id)
  );

  const handleToggleHighlight = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleHighlight(id));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-24 pb-12 px-4 md:px-8">
      {selectedCharacter && (
        <CharacterModal 
          character={selectedCharacter.node} 
          role={selectedCharacter.role} 
          onClose={() => setSelectedCharacter(null)} 
        />
      )}
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
        <div className="mt-12 mb-12 text-center md:text-left flex flex-col md:flex-row justify-between items-end gap-6">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white text-glow">
            Characters
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400 flex items-center gap-2">
              Click star to highlight
            </span>
            <button
              onClick={() => dispatch(resetHighlights())}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors rounded text-sm font-cinzel"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>
        </div>
        </div>

        {highlighted.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {highlighted.map(({ node, role }) => (
              <div key={node.id} className="relative">
                <button
                  onClick={(e) => handleToggleHighlight(node.id, e)}
                  className="absolute top-4 right-4 z-10 p-2 bg-zinc-950/80 border border-rose-600 rounded-full hover:bg-rose-600 transition-colors"
                  title="Remove from highlights"
                >
                  <Star size={16} className="text-rose-600 hover:text-white fill-rose-600" />
                </button>
                <CharacterCard 
                  character={node} 
                  role={role} 
                  variant="highlighted" 
                  onClick={() => setSelectedCharacter({ node, role })}
                />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {others.map(({ node, role }) => (
            <div key={node.id} className="relative group/card">
              <button
                onClick={(e) => handleToggleHighlight(node.id, e)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-zinc-950/80 border border-zinc-700 rounded-full opacity-0 group-hover/card:opacity-100 hover:bg-rose-600 hover:border-rose-600 transition-all"
                title="Add to highlights"
              >
                <Star size={12} className="text-zinc-400 hover:text-white" />
              </button>
              <CharacterCard 
                character={node} 
                role={role} 
                variant="default" 
                onClick={() => setSelectedCharacter({ node, role })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
