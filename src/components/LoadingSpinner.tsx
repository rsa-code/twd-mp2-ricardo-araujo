import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-zinc-950 text-rose-600">
      <Loader2 className="w-16 h-16 animate-spin mb-4" />
      <h2 className="text-2xl font-cinzel tracking-widest uppercase">Loading The Stage...</h2>
    </div>
  );
};