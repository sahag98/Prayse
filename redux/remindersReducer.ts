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
      state.hasShownReview = true;

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + 14);
      state.nextReviewDate = nextReviewDate.toISOString();
    },
    clearReminders: (state) => {
      state.reminders = [];
    },
    addNewReminder: (state, action) => {
      console.log("payload: ", action.payload);
      // state.reminders = "hello";
      // Convert Date objects to ISO strings for serialization
      const payload = { ...action.payload };
      if (payload.reminder && payload.reminder.time instanceof Date) {
        payload.reminder = {
          ...payload.reminder,
          time: payload.reminder.time.toISOString(),
        };
      } else {
        console.log("cant add")
      }
      const Reminders = [payload, ...state.reminders];
      state.reminders = Reminders;
    },
    deleteReminder: (state, action) => {
      state.reminders = state.reminders.filter(
        (reminder) => reminder.reminder.id !== action.payload,
      );
    },
    deleteAllReminders: (state) => {
      state.reminders = [];
    },

    handleReminderAmen: (state, action) => {
      console.log("payload: ", action.payload);

      const foundReminder = state.reminders.find(
        (reminder) => reminder.reminder.id === action.payload,
      );
      console.log("found: ", foundReminder);

      if (foundReminder) {
        console.log("found: ", foundReminder);

        // Add the new field
        foundReminder.prayer_times =
          Number(foundReminder.prayer_times || 0) + 1;

        console.log("updated reminder: ", foundReminder);
      }
    },

    editReminder: (state, action) => {
      const newReminders = [...state.reminders];
      const reminderIndex = state.reminders.findIndex(
        (reminder) => reminder.reminder.id === action.payload.reminder.id,
      );
      // Convert Date objects to ISO strings for serialization
      const payload = { ...action.payload };
      if (payload.reminder && payload.reminder.time instanceof Date) {
        payload.reminder = {
          ...payload.reminder,
          time: payload.reminder.time.toISOString(),
        };
      }
      if (reminderIndex !== -1) {
        newReminders.splice(reminderIndex, 1, payload);
        state.reminders = newReminders;
      }
    },
  },
});

export const {
  clearReminders,
  handleReviewShowing,
  deleteAllReminders,
  incrementReviewCounter,
  addNewReminder,
  deleteReminder,
  editReminder,
  handleReminderAmen,
} = reminderSlice.actions;

export default reminderSlice.reducer;
