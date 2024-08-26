// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

interface AnsweredState {
  answeredPrayers: any[];
}

const initialState: AnsweredState = {
  prayer_verses: false,
  prayer_questions: true,
};

export const proSlice = createSlice({
  name: "pro",
  initialState,
  reducers: {
    // turnOnPrayerVerses: (state) => {
    //   state.prayer_verses = true;
    // },
    togglePrayerVerses: (state) => {
      state.prayer_verses = !state.prayer_verses;
    },
    togglePrayerQuestions: (state) => {
      state.prayer_questions = !state.prayer_questions;
    },
    checkPrayerVerse: (state, action) => {
      state.prayer_verses = action.payload;
    },
    checkPrayerQuestions: (state, action) => {
      state.prayer_questions = action.payload;
    },
  },
});

export const {
  togglePrayerVerses,
  checkPrayerVerse,
  checkPrayerQuestions,
  togglePrayerQuestions,
} = proSlice.actions;

export default proSlice.reducer;