import { createSlice } from "@reduxjs/toolkit";
import { createGlobalStyle } from "styled-components";

const initialState = {
  answeredPrayers: [],
}

export const answeredSlice = createSlice({
  name: 'answered',
  initialState,
  reducers: {
    addNoteToPrayer: (state, action) => {
      state.answeredPrayers = state.answeredPrayers.map(obj => obj.id === action.payload.id ? { ...obj, answerNoted: action.payload.answerNote } : obj)
    },
    addToAnsweredPrayer: (state, action) => {
      // state.answeredPrayers.push(action.payload)
      const AnsweredPrayers = [action.payload, ...state.answeredPrayers]
      state.answeredPrayers = AnsweredPrayers

    },
    removeAnsweredPrayer: (state, action) => {
      state.answeredPrayers = state.answeredPrayers.filter((prayer) => prayer.prayer.id !== action.payload)
    },
    deleteAnsweredPrayers: (state, action) => {
      state.answeredPrayers = []
    }
  }
},

)

export const {
  addToAnsweredPrayer,
  deleteAnsweredPrayers,
  removeAnsweredPrayer,
  addNoteToPrayer,
} = answeredSlice.actions

export default answeredSlice.reducer