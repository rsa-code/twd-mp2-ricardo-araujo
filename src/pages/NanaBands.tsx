import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { CharacterConnection, CharacterNode } from "../types";
import { fetchNanaCharacters } from "../services/anilistService";
import { fetchDeezerAlbum, DeezerAlbum } from "../services/deezerService";
import { CharacterCard } from "../components/CharacterCard";
import { CharacterModal } from "../components/CharacterModal";
import { AlbumCard } from "../components/AlbumCard";

const BANDS = [
  {
    id: "blast",
    name: "Black Stones",
    alias: "BLAST",
    description:
      "A punk band formed by Ren Honjo and Yasushi Takagi, later joined by Nana Osaki, Nobuo Terashima, and Shinichi Okazaki.",
    members: [
      { id: 702, role: "Vocals" }, // Nana Osaki
      { id: 2449, role: "Guitar" }, // Nobuo Terashima
      { id: 1424, role: "Bass" }, // Shinichi Okazaki
      { id: 2450, role: "Drums" }, // Yasushi Takagi
    ],
  },
  {
    id: "trapnest",
    name: "Trapnest",
    description:
      "A popular rock band that Ren Honjo joined, leaving Blast behind.",
    members: [
      { id: 2089, role: "Vocals" }, // Reira (Layla) Serizawa
      { id: 1425, role: "Guitar" }, // Ren Honjou
      { id: 2451, role: "Bass" }, // Takumi Ichinose
      { id: 5341, role: "Drums" }, // Naoki Fujieda
    ],
  },
];

export const NanaBands: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterConnection | null>(
    null,
  );
  const [album, setAlbum] = useState<DeezerAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<{
    node: CharacterNode;
    role: string;
  } | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const [chars, alb] = await Promise.all([
          fetchNanaCharacters(),
          fetchDeezerAlbum("464399305"),
        ]);
        setCharacters(chars);
        setAlbum(alb);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!characters)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-rose-600">
        <p className="mt-4 font-cinzel text-xl">Failed to load band members.</p>
      </div>
    );

  const getCharacterById = (id: number) => {
    return characters.edges.find((edge) => edge.node.id === id)?.node;
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

      <div className="max-w-7xl mx-auto space-y-24">
        <div className="max-w-6xl mx-auto">
          <div className="mt-12 mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white mb-4 text-glow">
              Bands
            </h1>
          </div>
        </div>

        {BANDS.map((band) => (
          <div key={band.id} className="space-y-12">
            <h2 className="text-4xl md:text-5xl font-black font-cinzel text-white uppercase tracking-tight">
              {band.name}
              {band.alias && (
                <span className="text-zinc-600 ml-4 text-2xl md:text-3xl">
                  {band.alias}
                </span>
              )}
            </h2>
            <p className="text-zinc-400 text-lg max-w-2xl">
              {band.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {band.members.map((member) => {
                const character = getCharacterById(member.id);
                if (!character) return null;

                return (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    role={member.role}
                    variant="default"
                    onClick={() =>
                      setSelectedCharacter({
                        node: character,
                        role: member.role,
                      })
                    }
                  />
                );
              })}
            </div>

            {band.id === "blast" && album && (
              <div className="border-t border-zinc-800 pt-4">
                <AlbumCard album={album} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
