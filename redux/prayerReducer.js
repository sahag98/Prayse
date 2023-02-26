import { createSlice } from "@reduxjs/toolkit";
import { createGlobalStyle } from "styled-components";

export const prayerSlice = createSlice({
  name: 'prayer',
  initialState: {
    prayer: [],
  },
  reducers: {
    addPrayer: (state, action) => {
      const Prayers = [action.payload, ...state.prayer]
      state.prayer = Prayers
    },
    deletePrayer: (state, action) => {
      state.prayer = state.prayer.filter((prayer) => prayer.id !== action.payload)
      console.log(state.prayer)
    },
    editPrayer: (state, action) => {
      const newPrayers = [...state.prayer]
      const prayerIndex = state.prayer.findIndex((prayer) => prayer.id === action.payload.id)
      newPrayers.splice(prayerIndex, 1, action.payload)
      state.prayer = newPrayers
    }
  }
},
)

export const { addPrayer, deletePrayer, editPrayer } = prayerSlice.actions

export default prayerSlice.reducer