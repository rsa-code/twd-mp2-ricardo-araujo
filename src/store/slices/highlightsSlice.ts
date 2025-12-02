import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Load from localStorage
const loadHighlightedIds = (): number[] => {
  try {
    const stored = localStorage.getItem("highlightedCharacters");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error(
      "Failed to load highlighted characters from localStorage:",
      e,
    );
  }
  // Default: the two Nanas
  return [701, 702];
};

// Save to localStorage
const saveHighlightedIds = (ids: number[]) => {
  try {
    localStorage.setItem("highlightedCharacters", JSON.stringify(ids));
  } catch (e) {
    console.error("Failed to save highlighted characters to localStorage:", e);
  }
};

interface HighlightsState {
  highlightedIds: number[];
}

const initialState: HighlightsState = {
  highlightedIds: loadHighlightedIds(),
};

const highlightsSlice = createSlice({
  name: "highlights",
  initialState,
  reducers: {
    toggleHighlight: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.highlightedIds.indexOf(id);
      if (index === -1) {
        state.highlightedIds.push(id);
      } else {
        state.highlightedIds.splice(index, 1);
      }
      saveHighlightedIds(state.highlightedIds);
    },
    resetHighlights: (state) => {
      state.highlightedIds = [701, 702];
      saveHighlightedIds(state.highlightedIds);
    },
  },
});

export const { toggleHighlight, resetHighlights } = highlightsSlice.actions;
export default highlightsSlice.reducer;
