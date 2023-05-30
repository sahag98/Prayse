import { createSlice } from "@reduxjs/toolkit";
import { createGlobalStyle } from "styled-components";

const initialState = {
  prayer: [],
}

export const prayerSlice = createSlice({
  name: 'prayer',
  initialState,
  reducers: {
    clearPrayerData: (state) => {
      state.prayer = []
    },
    deleteFavorites: (state, action) => {
      state.favoriteVerses = []
    },
    deleteFavoriteVerse: (state, action) => {
      state.favoriteVerses = state.favoriteVerses.filter((verse) => verse.id !== action.payload)
    },
    addPrayer: (state, action) => {
      const Prayers = [action.payload, ...state.prayer]
      state.prayer = Prayers
    },
    addNoteToPrayer: (state, action) => {
      state.answeredPrayers = state.answeredPrayers.map(obj => obj.id === action.payload.id ? { ...obj, answerNoted: action.payload.answerNote } : obj)
    },
    deletePrayer: (state, action) => {
      console.log(action.payload)
      state.prayer = state.prayer.filter((prayer) => prayer.id !== action.payload)
    },
    editPrayer: (state, action) => {
      const newPrayers = [...state.prayer]
      const prayerIndex = state.prayer.findIndex((prayer) => prayer.id === action.payload.id)
      newPrayers.splice(prayerIndex, 1, action.payload)
      state.prayer = newPrayers
    },
    // addAnswer: (state) => {
    //   console.log(state)
    //   state.answeredPrayers = [{
    //     answeredDate: new Date().toDateString(),
    //     prayer: { id: 1, prayer: 'test' },
    //     id: 1
    //   }]
    // },
  }
},

)

export const {
  addPrayer,
  deletePrayer,
  editPrayer,
  addAnswer,
  setVerse,
  addNoteToPrayer,
  addToFavorites,
  deleteFavorites,
  clearPrayerData,
  deleteFavoriteVerse
} = prayerSlice.actions

export default prayerSlice.reducer