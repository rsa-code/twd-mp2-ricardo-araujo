import React from "react";
import { Quote } from "lucide-react";

interface NanaQuote {
  text: string;
  character: string;
}

const QUOTES: NanaQuote[] = [
  {
    text: "I always thought that life was about standing your ground, no matter how strong the current was. But going with the flow isn't so bad after all. As long as it takes you forward.",
    character: "Nana Osaki",
  },
  {
    text: "I am pissed off at your insensitive inability to understand why I'm pissed off in the first place.",
    character: "Nana Komatsu",
  },
  {
    text: "Even when Nana doesn't act how I want her to... even if she ends up with some other guy... I want to be a sensitive person who will always care about her.",
    character: "Ren Honjo",
  },
  {
    text: "Well, if I did throw it away, I wouldn't miss it. As long as I play guitar, I'll be happy... with you singing. Don't turn me into a broken record...",
    character: "Nobuo Terashima",
  },
  {
    text: "Instead of trampling in other people's gardens, why don't you make your own flowers grow?",
    character: "Yasushi Takagi",
  },
  {
    text: "Everyone tells me how to act... like, don't do or say things that would ruin my image. But there's no image to ruin! I'm just me. It's hard to be human.",
    character: "Reira Serizawa",
  },
  {
    text: "Love can come later. People always love themselves the most so they tend to love the person who best accommodates their desires.",
    character: "Takumi Ichinose",
  },
  {
    text: "I have the courage to keep the first promise I made to you, Nana. [...] I'll work really hard this time and play better than Ren, I promise.",
    character: "Shinichi Okazaki",
  },
];

export const NanaQuotes: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mt-12 mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black font-cinzel text-white mb-4 text-glow">
            Quotes
          </h1>
        </div>

        <div className="space-y-6">
          {QUOTES.map((quote, index) => (
            <div
              key={index}
              className="group relative bg-zinc-900/50 border border-zinc-800 hover:border-rose-600/50 transition-all p-6 md:p-8"
            >
              <div className="pl-8 space-y-4">
                <p className="text-lg md:text-xl text-zinc-200 italic leading-relaxed">
                  "{quote.text}"
                </p>
                <p className="text-rose-500 font-cinzel font-bold">
                  — {quote.character}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
