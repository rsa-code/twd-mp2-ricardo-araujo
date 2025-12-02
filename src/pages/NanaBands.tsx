import React, { useState } from "react";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { CharacterNode } from "../types";
import {
  useGetBandMembersQuery,
  useGetDeezerAlbumQuery,
} from "../store/slices/apiSlice";
import { CharacterCard } from "../components/CharacterCard";
import { CharacterModal } from "../components/CharacterModal";
import { AlbumCard } from "../components/AlbumCard";

const BANDS_INFO = [
  {
    id: "blast",
    name: "Black Stones",
    alias: "BLAST",
    description:
      "A punk band formed by Ren Honjo and Yasushi Takagi, later joined by Nana Osaki, Nobuo Terashima, and Shinichi Okazaki.",
  },
  {
    id: "trapnest",
    name: "Trapnest",
    description:
      "A popular rock band that Ren Honjo joined, leaving Blast behind.",
  },
];

export const NanaBands: React.FC = () => {
  const {
    data: bandMembers,
    isLoading: membersLoading,
    isError: membersError,
  } = useGetBandMembersQuery();
  const { data: album, isLoading: albumLoading } =
    useGetDeezerAlbumQuery("464399305");
  const [selectedCharacter, setSelectedCharacter] = useState<{
    node: CharacterNode;
    role: string;
  } | null>(null);

  const isLoading = membersLoading || albumLoading;

  if (isLoading) return <LoadingSpinner />;

  if (membersError || !bandMembers)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-rose-600">
        <p className="mt-4 font-cinzel text-xl">Failed to load band members.</p>
      </div>
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

      <div className="max-w-7xl mx-auto space-y-24">
        <div className="max-w-6xl mx-auto">
          <div className="mt-12 mb-12 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white mb-4 text-glow">
              Bands
            </h1>
          </div>
        </div>

        {BANDS_INFO.map((band) => {
          const members =
            band.id === "blast" ? bandMembers.blast : bandMembers.trapnest;

          return (
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
                {members.map((member) => (
                  <CharacterCard
                    key={member.character.id}
                    character={member.character}
                    role={member.role}
                    variant="default"
                    onClick={() =>
                      setSelectedCharacter({
                        node: member.character,
                        role: member.role,
                      })
                    }
                  />
                ))}
              </div>

              {band.id === "blast" && album && (
                <div className="border-t border-zinc-800 pt-4">
                  <AlbumCard album={album} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
