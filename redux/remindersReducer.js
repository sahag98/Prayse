import { createSlice } from "@reduxjs/toolkit";

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
        (reminder) => reminder.reminder.id !== action.payload,
      );
    },
    editReminder: (state, action) => {
      const newReminders = [...state.reminders];
      const reminderIndex = state.reminders.findIndex(
        (reminder) => reminder.id === action.payload.reminder.id,
      );
      newReminders.splice(reminderIndex, 1, action.payload.re);
      state.reminders = newReminders;
    },
  },
});

export const { clearReminders, addNewReminder, deleteReminder, editReminder } =
  reminderSlice.actions;

export default reminderSlice.reducer;
