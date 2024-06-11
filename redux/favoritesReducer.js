import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriteVerses: [],
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const Favorites = [action.payload, ...state.favoriteVerses];
      state.favoriteVerses = Favorites;
    },
    deleteFavorites: (state) => {
      state.favoriteVerses = [];
    },
    deleteFavoriteVerse: (state, action) => {
      state.favoriteVerses = state.favoriteVerses.filter(
        (verse) => verse.id !== action.payload,
      );
    },
  },
});

export const { addToFavorites, deleteFavorites, deleteFavoriteVerse } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
