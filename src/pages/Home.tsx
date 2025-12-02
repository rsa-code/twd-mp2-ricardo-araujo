import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetNanaMediaQuery } from "../store/slices/apiSlice";
import { setHomeActiveTab } from "../store/slices/preferencesSlice";
import { RootState } from "../store";
import { MediaCard } from "../components/MediaCard";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetNanaMediaQuery();
  const activeTab = useSelector(
    (state: RootState) => state.preferences.homeActiveTab,
  );

  if (isLoading) return <LoadingSpinner />;

  if (isError || !data)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-rose-600">
        <p className="mt-4 font-cinzel text-xl">
          Failed to load the broken dreams.
        </p>
      </div>
    );

  const currentMedia = activeTab === "anime" ? data.anime : data.manga;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-rose-900 selection:text-white overflow-x-hidden">
      <header className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img
            src={
              data.anime.bannerImage ||
              "https://s4.anilist.co/file/anilistcdn/media/anime/banner/877-8wX5c8u82h5e.jpg"
            }
            alt="Nana Banner"
            className="w-full h-full object-cover opacity-40 scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-7xl md:text-9xl font-black font-cinzel tracking-tighter text-white mb-4">
            NANA
          </h1>
          <p className="text-xl md:text-2xl tracking-[0.3em] uppercase text-zinc-400 border-y border-zinc-800 py-4 inline-block">
            Hey, Nana... Do you remember the first time we met?
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-24 space-y-32">
        <section>
          <div className="flex justify-center mb-12 space-x-8">
            <button
              onClick={() => dispatch(setHomeActiveTab("anime"))}
              className={`text-2xl font-cinzel font-bold transition-all duration-300 ${activeTab === "anime" ? "text-rose-600 border-b-2 border-rose-600" : "text-zinc-600 hover:text-zinc-300"}`}
            >
              The Anime
            </button>
            <button
              onClick={() => dispatch(setHomeActiveTab("manga"))}
              className={`text-2xl font-cinzel font-bold transition-all duration-300 ${activeTab === "manga" ? "text-rose-600 border-b-2 border-rose-600" : "text-zinc-600 hover:text-zinc-300"}`}
            >
              The Manga
            </button>
          </div>

          <MediaCard
            media={currentMedia}
            align={activeTab === "anime" ? "left" : "right"}
          />
        </section>
      </main>
    </div>
  );
};
