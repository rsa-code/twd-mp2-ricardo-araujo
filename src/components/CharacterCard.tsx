import React from "react";
import { CharacterNode } from "../types";

interface CharacterCardProps {
  character: CharacterNode;
  role: string;
  variant?: "default" | "highlighted";
  onClick?: () => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  role,
  variant = "default",
  onClick,
}) => {
  if (variant === "highlighted") {
    return (
      <div className="group relative cursor-pointer" onClick={onClick}>
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-rose-900 blur opacity-25 transition duration-1000"></div>
        <div className="relative flex flex-col md:flex-row bg-zinc-900 overflow-hidden border border-zinc-800 hover:border-rose-600/50 transition-colors">
          <div className="w-full md:w-1/2 aspect-[3/4] overflow-hidden">
            <img
              src={character.image.large}
              alt={character.name.full}
              className="w-full h-full object-cover transition-transform duration-500"
            />
          </div>
          <div className="p-6 md:w-1/2 flex flex-col justify-center space-y-4">
            <div>
              <h2 className="text-3xl font-black font-cinzel text-white mb-1">
                {character.name.full}
              </h2>
              <p className="text-rose-500 font-cinzel italic">
                {character.name.native}
              </p>
            </div>
            <span className="inline-block px-3 py-1 bg-zinc-800 text-zinc-400 text-xs uppercase tracking-widest w-fit">
              {role}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-zinc-900/50 overflow-hidden border border-zinc-800 hover:border-rose-600/50 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[3/4] overflow-hidden relative">
        <img
          src={character.image.large}
          alt={character.name.full}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-lg font-bold text-white leading-tight mb-1">
            {character.name.full}
          </h3>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">
            {role}
          </p>
        </div>
      </div>
    </div>
  );
};
