import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type MediaTab = "anime" | "manga";

interface PreferencesState {
  homeActiveTab: MediaTab;
  itemsPerPage: number;
}

const loadFromLocalStorage = (): PreferencesState => {
  try {
    const saved = localStorage.getItem("nana-preferences");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading preferences from localStorage:", error);
  }
  return {
    homeActiveTab: "anime",
    itemsPerPage: 7,
  };
};

const saveToLocalStorage = (state: PreferencesState) => {
  try {
    localStorage.setItem("nana-preferences", JSON.stringify(state));
  } catch (error) {
    console.error("Error saving preferences to localStorage:", error);
  }
};

const initialState: PreferencesState = loadFromLocalStorage();

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setHomeActiveTab: (state, action: PayloadAction<MediaTab>) => {
      state.homeActiveTab = action.payload;
      saveToLocalStorage(state);
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      saveToLocalStorage(state);
    },
  },
});

export const { setHomeActiveTab, setItemsPerPage } = preferencesSlice.actions;

export default preferencesSlice.reducer;
