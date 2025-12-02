import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type EpisodeSortBy =
  | "date-asc"
  | "date-desc"
  | "rating-asc"
  | "rating-desc";

export type EpisodeFilterMode = "all" | "favorites" | "watched" | "unwatched";

interface EpisodesFiltersState {
  sortBy: EpisodeSortBy;
  minRating: number;
  currentPage: number;
  itemsPerPage: number;
  filterMode: EpisodeFilterMode;
}

interface FiltersState {
  episodes: EpisodesFiltersState;
}

const loadFiltersFromStorage = (): FiltersState => {
  try {
    const stored = localStorage.getItem("nanaFilters");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load filters from localStorage", e);
  }
  return {
    episodes: {
      sortBy: "date-asc",
      minRating: 0,
      currentPage: 1,
      itemsPerPage: 7,
      filterMode: "all",
    },
  };
};

const saveFiltersToStorage = (state: FiltersState) => {
  try {
    localStorage.setItem("nanaFilters", JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save filters to localStorage", e);
  }
};

const initialState: FiltersState = loadFiltersFromStorage();

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setEpisodeSortBy: (state, action: PayloadAction<EpisodeSortBy>) => {
      state.episodes.sortBy = action.payload;
      state.episodes.currentPage = 1;
      saveFiltersToStorage(state);
    },
    setEpisodeMinRating: (state, action: PayloadAction<number>) => {
      state.episodes.minRating = action.payload;
      state.episodes.currentPage = 1;
      saveFiltersToStorage(state);
    },
    setEpisodeFilterMode: (state, action: PayloadAction<EpisodeFilterMode>) => {
      state.episodes.filterMode = action.payload;
      state.episodes.currentPage = 1;
      saveFiltersToStorage(state);
    },
    setEpisodePage: (state, action: PayloadAction<number>) => {
      state.episodes.currentPage = action.payload;
      saveFiltersToStorage(state);
    },
    nextEpisodePage: (state, action: PayloadAction<number>) => {
      const totalPages = action.payload;
      if (state.episodes.currentPage < totalPages) {
        state.episodes.currentPage += 1;
        saveFiltersToStorage(state);
      }
    },
    prevEpisodePage: (state) => {
      if (state.episodes.currentPage > 1) {
        state.episodes.currentPage -= 1;
        saveFiltersToStorage(state);
      }
    },
    resetEpisodeFilters: (state) => {
      state.episodes = {
        sortBy: "date-asc",
        minRating: 0,
        currentPage: 1,
        itemsPerPage: 7,
        filterMode: "all",
      };
      saveFiltersToStorage(state);
    },
  },
});

export const {
  setEpisodeSortBy,
  setEpisodeMinRating,
  setEpisodeFilterMode,
  setEpisodePage,
  nextEpisodePage,
  prevEpisodePage,
  resetEpisodeFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
