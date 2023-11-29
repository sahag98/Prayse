import { createSlice } from "@reduxjs/toolkit";
import { createGlobalStyle } from "styled-components";

const initialState = {
  reminders: [],
};

export const reminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    clearReminders: (state) => {
      state.reminders = [];
    },
    addNewReminder: (state, action) => {
      // state.reminders = "hello";
      const Reminders = [action.payload, ...state.reminders];
      state.reminders = Reminders;
    },
    deleteReminder: (state, action) => {
      state.reminders = state.reminders.filter(
        (reminder) => reminder.id !== action.payload
      );
    },
    editReminder: (state, action) => {
      const newReminders = [...state.reminders];
      const reminderIndex = state.reminders.findIndex(
        (reminder) => reminder.id === action.payload.id
      );
      newReminders.splice(reminderIndex, 1, action.payload);
      state.reminders = newReminders;
    },
  },
});

export const { clearReminders, addNewReminder, deleteReminder, editReminder } =
  reminderSlice.actions;

export default reminderSlice.reducer;
