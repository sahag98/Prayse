// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

interface ReminderState {
  reminders: any[];
  reviewCounter: number;
  hasShownReview: boolean;
  nextReviewDate: null;
}

const initialState: ReminderState = {
  reminders: [],
  reviewCounter: 0,
  hasShownReview: false,
  nextReviewDate: null,
};

export const reminderSlice = createSlice({
  name: "reminder",
  initialState,
  reducers: {
    incrementReviewCounter: (state) => {
      // state.reviewCounter = 0
      // state.hasShownReview = false
      state.reviewCounter = state.reviewCounter + 1;
    },
    handleReviewShowing: (state) => {
      state.hasShownReview = false;
      const currentDate = new Date().toLocaleDateString();
      state.hasShownReview = true;

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + 14);
      state.nextReviewDate = nextReviewDate;
    },
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

export const {
  clearReminders,
  handleReviewShowing,
  incrementReviewCounter,
  addNewReminder,
  deleteReminder,
  editReminder,
} = reminderSlice.actions;

export default reminderSlice.reducer;
