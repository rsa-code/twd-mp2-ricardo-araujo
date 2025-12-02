import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EpisodeStatus {
  isFavorite: boolean;
  isWatched: boolean;
  rating: number | null; // 1-5 stars
}

interface FavoritesState {
  episodes: Record<number, EpisodeStatus>;
}

const loadFromLocalStorage = (): FavoritesState => {
  try {
    const saved = localStorage.getItem("nana-favorites");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading favorites from localStorage:", error);
  }
  return { episodes: {} };
};

const saveToLocalStorage = (state: FavoritesState) => {
  try {
    localStorage.setItem("nana-favorites", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

const initialState: FavoritesState = loadFromLocalStorage();

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const episodeId = action.payload;
      if (!state.episodes[episodeId]) {
        state.episodes[episodeId] = {
          isFavorite: true,
          isWatched: false,
          rating: null,
        };
      } else {
        state.episodes[episodeId].isFavorite =
          !state.episodes[episodeId].isFavorite;
      }
      saveToLocalStorage(state);
    },

    toggleWatched: (state, action: PayloadAction<number>) => {
      const episodeId = action.payload;
      if (!state.episodes[episodeId]) {
        state.episodes[episodeId] = {
          isFavorite: false,
          isWatched: true,
          rating: null,
        };
      } else {
        state.episodes[episodeId].isWatched =
          !state.episodes[episodeId].isWatched;
      }
      saveToLocalStorage(state);
    },

    setRating: (
      state,
      action: PayloadAction<{ episodeId: number; rating: number | null }>,
    ) => {
      const { episodeId, rating } = action.payload;
      if (!state.episodes[episodeId]) {
        state.episodes[episodeId] = {
          isFavorite: false,
          isWatched: false,
          rating,
        };
      } else {
        state.episodes[episodeId].rating = rating;
      }
      saveToLocalStorage(state);
    },

    clearAllFavorites: (state) => {
      state.episodes = {};
      saveToLocalStorage(state);
    },
  },
});

export const { toggleFavorite, toggleWatched, setRating, clearAllFavorites } =
  favoritesSlice.actions;

export const selectEpisodeStatus = (
  state: { favorites: FavoritesState },
  episodeId: number,
): EpisodeStatus => {
  return (
    state.favorites.episodes[episodeId] || {
      isFavorite: false,
      isWatched: false,
      rating: null,
    }
  );
};

export const selectFavoriteCount = (state: {
  favorites: FavoritesState;
}): number => {
  return Object.values(state.favorites.episodes).filter((ep) => ep.isFavorite)
    .length;
};

export const selectWatchedCount = (state: {
  favorites: FavoritesState;
}): number => {
  return Object.values(state.favorites.episodes).filter((ep) => ep.isWatched)
    .length;
};

export default favoritesSlice.reducer;
