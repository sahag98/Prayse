// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

interface MessageState {
  messages: any[];
}

const initialState: MessageState = {
  messages: [],
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    // deleteFavorites: (state, action) => {
    //   state.favoriteVerses = []
    // },
    // deleteFavoriteVerse: (state, action) => {
    //   state.favoriteVerses = state.favoriteVerses.filter((verse) => verse.id !== action.payload)
    // },
    addMessage: (state, action) => {
      const Messages = [action.payload, ...state.messages];
      state.messages = Messages;
    },
    // addNoteToPrayer: (state, action) => {
    //   state.answeredPrayers = state.answeredPrayers.map(obj => obj.id === action.payload.id ? { ...obj, answerNoted: action.payload.answerNote } : obj)
    // },
    // deletePrayer: (state, action) => {
    //   state.prayer = state.prayer.filter((prayer) => prayer.id !== action.payload)
    // },
    // editPrayer: (state, action) => {
    //   const newPrayers = [...state.prayer]
    //   const prayerIndex = state.prayer.findIndex((prayer) => prayer.id === action.payload.id)
    //   newPrayers.splice(prayerIndex, 1, action.payload)
    //   state.prayer = newPrayers
    // },
  },
});

export const { addMessage, clearMessages } = messageSlice.actions;

export default messageSlice.reducer;
