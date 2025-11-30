import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { CharacterConnection, CharacterNode } from '../types';
import { fetchNanaCharacters } from '../services/anilistService';
import { CharacterCard } from '../components/CharacterCard';
import { CharacterModal } from '../components/CharacterModal';

export const NanaCharacters: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<{node: CharacterNode, role: string} | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const result = await fetchNanaCharacters();
        setCharacters(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!characters) return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-rose-600">
      <p className="mt-4 font-cinzel text-xl">Failed to load characters.</p>
    </div>
  );

  const nanas = characters.edges.filter(edge => 
    edge.node.id === 701 || edge.node.id === 702
  );
  
  const others = characters.edges.filter(edge => 
    edge.node.id !== 701 && edge.node.id !== 702
  );

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
        <div className="mt-12 mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white mb-4 text-glow">
            Characters
          </h1>
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {nanas.map(({ node, role }) => (
            <CharacterCard 
              key={node.id} 
              character={node} 
              role={role} 
              variant="highlighted" 
              onClick={() => setSelectedCharacter({ node, role })}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {others.map(({ node, role }) => (
            <CharacterCard 
              key={node.id} 
              character={node} 
              role={role} 
              variant="default" 
              onClick={() => setSelectedCharacter({ node, role })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
