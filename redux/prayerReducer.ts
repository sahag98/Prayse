// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

interface PrayerState {
  prayer: any[];
}

const initialState: PrayerState = {
  prayer: [],
};

export const prayerSlice = createSlice({
  name: "prayer",
  initialState,
  reducers: {
    clearPrayerData: (state) => {
      state.prayer = [];
    },
    deleteFavorites: (state) => {
      state.favoriteVerses = [];
    },
    deleteFavoriteVerse: (state, action) => {
      state.favoriteVerses = state.favoriteVerses.filter(
        (verse) => verse.id !== action.payload,
      );
    },
    addPrayer: (state, action) => {
      const Prayers = [action.payload, ...state.prayer];
      state.prayer = Prayers;
    },
    addNoteToPrayer: (state, action) => {
      state.answeredPrayers = state.answeredPrayers.map((obj) =>
        obj.id === action.payload.id
          ? { ...obj, answerNoted: action.payload.answerNote }
          : obj,
      );
    },
    addVerseToPrayer: (state, action) => {
      state.prayer = state.prayer.map((prayer) =>
        prayer.id === action.payload.id
          ? { ...prayer, verse: action.payload.verse }
          : prayer,
      );
    },
    deletePrayer: (state, action) => {
      state.prayer = state.prayer.filter(
        (prayer) => prayer.id !== action.payload,
      );
    },
    deletePrayerByFolderId: (state, action) => {
      state.prayer = state.prayer.filter(
        (prayer) => prayer.folderId !== action.payload,
      );
    },
    archivePrayer: (state, action) => {
      state.prayer = state.prayer.map((prayer) =>
        prayer.id === action.payload.id
          ? {
              ...prayer,
              status:
                prayer.status === "Active" ||
                prayer.status === undefined ||
                prayer.status === "Answered"
                  ? "Archived"
                  : "Active",
            }
          : prayer,
      );
    },
    switchPrayerStatus: (state, action) => {
      console.log("action: ", JSON.stringify(action.payload, null, 2));
      const currentDate = new Date().toLocaleDateString().split("T")[0];

      state.prayer = state.prayer.map((prayer) =>
        prayer.id === action.payload.prayer.id
          ? {
              ...prayer,
              status: (prayer.status = action.payload.newStatus),
            }
          : prayer,
      );
    },
    editPrayer: (state, action) => {
      const newPrayers = [...state.prayer];
      const prayerIndex = state.prayer.findIndex(
        (prayer) => prayer.id === action.payload.id,
      );
      newPrayers.splice(prayerIndex, 1, action.payload);
      state.prayer = newPrayers;
    },
  },
});

export const {
  addPrayer,
  deletePrayer,
  addVerseToPrayer,
  switchPrayerStatus,
  archivePrayer,
  deletePrayerByFolderId,
  editPrayer,
  addAnswer,
  setVerse,
  addNoteToPrayer,
  addToFavorites,
  deleteFavorites,
  clearPrayerData,
  deleteFavoriteVerse,
} = prayerSlice.actions;

export default prayerSlice.reducer;
