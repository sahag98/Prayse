import { Appearance } from "react-native";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userImg: "",
  tooltip: true,
  checkmarkVisible: false,
  userGroups: [],
  theme: Appearance.getColorScheme(),
  completedItems: [],
  devostreak: 0,
  isAppReady: false,
  appstreak: [],
  appstreakNum: 0,
  expoToken: "",
  alreadyEnteredGiveaway: false,
  isShowingGiveawayModal: false,
  hasIncreasedDevoStreak: false,
  prayers: [],
  fontSize: 15,
  selectedId: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    closeTool: (state) => {
      state.tooltip = false;
    },
    setToken: (state, action) => {
      state.expoToken = action.payload;
    },
    large: (state) => {
      state.fontSize = 20;
    },
    regular: (state) => {
      state.fontSize = 16;
    },
    small: (state) => {
      state.fontSize = 12;
    },
    didEnterGiveaway: (state) => {
      state.alreadyEnteredGiveaway = true;
      state.isShowingGiveawayModal = true;
    },
    resetGiveaway: (state) => {
      state.alreadyEnteredGiveaway = false;
      // state.isShowingGiveawayModal = false;
    },
    increaseAppStreakCounter: (state, action) => {
      // state.isAppReady = false;
      // state.alreadyEnteredGiveaway = false;
      // state.isShowingGiveawayModal = false;
      if (
        state.appstreak.length > 0 &&
        state.appstreak[state.appstreak.length - 1]?.today ===
          action.payload.today
      ) {
        console.log("exists");
        return;
      } else {
        state.appstreak = [...state.appstreak, action.payload];
      }

      const lastItem = state.appstreak[state.appstreak.length - 1];
      const oneBeforeLastItem = state.appstreak[state.appstreak.length - 2];

      // console.log("last item: ", lastItem.today);
      // console.log("one before last item: ", oneBeforeLastItem.today);

      if (lastItem && oneBeforeLastItem) {
        console.log("will be adding streak");
        const lastItemDate = new Date(lastItem.today);
        const oneBeforeLastItemDate = new Date(oneBeforeLastItem.today);

        // Normalize both dates to the start of their respective days
        lastItemDate.setHours(0, 0, 0, 0);
        oneBeforeLastItemDate.setHours(0, 0, 0, 0);

        // Calculate the difference in days
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // One day in milliseconds
        const differenceInDays =
          (lastItemDate - oneBeforeLastItemDate) / oneDayInMilliseconds;

        // Check if the difference is exactly one day
        if (differenceInDays === 1) {
          state.appstreakNum = state.appstreakNum + 1;
          console.log(
            "App streak oneBeforeLastItemDate is the correct date before the lastItemDate."
          );
          // Perform your function here
        } else {
          state.appstreakNum = 0;
          console.log(
            "App streak oneBeforeLastItemDate is not the correct date before the lastItemDate."
          );
        }
      }

      // Parse the dates

      // state.appstreak = {
      //   appStreakNum: state.appstreak.appStreakNum + 1,
      //   date: new Date().toISOString().split("T")[0],
      // };
    },
    addtoCompletedItems: (state, action) => {
      console.log("trying to add");
      const { date, item } = action.payload;

      // Find the index of the entry with the same date
      const dateIndex = state.completedItems.findIndex(
        (entry) => entry.date === date
      );

      if (dateIndex >= 0) {
        // If date exists, add the item to the items array of that date

        if (state.completedItems[dateIndex].items.length === 3) {
          return;
        }
        state.completedItems[dateIndex].items.push(item);
      } else {
        // If date does not exist, create a new entry
        state.completedItems.push({ date, items: [item] });
      }
    },
    deletePreviousDayItems: (state, action) => {
      console.log("payload: ", action.payload);
      const { yesterday } = action.payload;
      const currentDate = new Date().toLocaleDateString().split("T")[0];
      const dateIndex = state.completedItems.findIndex(
        (entry) => entry?.date === yesterday
      );

      console.log("current date: ", currentDate);
      console.log("yesterday date: ", yesterday);

      const currentDateIndex = state.completedItems.findIndex(
        (entry) => entry?.date === currentDate
      );

      if (dateIndex >= 0) {
        console.log("length: ", state.completedItems[dateIndex].items.length);
        state.completedItems[dateIndex].items.length = 0;
      }

      const lastItemData =
        state.completedItems[state.completedItems.length - 1];

      const lastItem =
        state.completedItems[state.completedItems.length - 1]?.date;
      const oneBeforeLastItem =
        state.completedItems[state.completedItems.length - 2]?.date;

      if (lastItem !== currentDate) {
        state.hasIncreasedDevoStreak = false;
      }

      function parseLocaleDateString(dateString, locale = "en-US") {
        const [month, day, year] = dateString.split(/[\/\-]/).map(Number);
        // Note: Adjust parsing logic based on known locale format if needed
        return new Date(year, month - 1, day);
      }

      if (lastItem && oneBeforeLastItem) {
        const lastItemDate = parseLocaleDateString(lastItem);
        const oneBeforeLastItemDate = parseLocaleDateString(oneBeforeLastItem);

        console.log("date: ", lastItemDate);

        // Normalize both dates to the start of their respective days
        lastItemDate.setHours(0, 0, 0, 0);
        oneBeforeLastItemDate.setHours(0, 0, 0, 0);

        // Calculate the difference in days
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // One day in milliseconds
        const differenceInDays =
          (lastItemDate - oneBeforeLastItemDate) / oneDayInMilliseconds;

        console.log("difference: ", differenceInDays);

        // Check if the difference is exactly one day
        if (differenceInDays === 1) {
          console.log("check");
          console.log("has increased already: ", state.hasIncreasedDevoStreak);
          if (
            currentDate === lastItem &&
            lastItemData.items.length === 3 &&
            state.hasIncreasedDevoStreak === false
          ) {
            console.log("should increase devo");
            state.devostreak += 1;
            state.hasIncreasedDevoStreak = true;
          }

          // state.devostreak = state.devostreak + 1;
          // state.hasIncreasedDevoStreak == true;
          console.log(
            "Devo: The oneBeforeLastItemDate is the correct date before the lastItemDate."
          );
          // Perform your function here
        } else {
          state.devostreak = 0;
          console.log(
            "The oneBeforeLastItemDate is not the correct date before the lastItemDate."
          );
        }
      }
    },
    deleteCompletedItems: (state) => {
      console.log("deleting ITEMS>>>");
      state.completedItems = [];
      // state.completedItems.length = 0;
    },
    increaseStreakCounter: (state) => {
      if (
        state.completedItems.length === 3 &&
        state.alreadyIncreasedStreak === false
      ) {
        console.log("will increase devo streak");
        state.devostreak = state.devostreak + 1;
        state.alreadyIncreasedStreak = true;
      }
    },
    deleteStreakCounter: (state) => {
      state.devostreak = 0;
      state.hasIncreasedDevoStreak = false;
    },

    deleteAppStreakCounter: (state) => {
      state.appstreak = [];
      state.appstreakNum = 0;
      state.alreadyEnteredGiveaway = false;
      state.isShowingGiveawayModal = false;
    },
    openCheckmark: (state, action) => {
      state.checkmarkVisible = action.payload;
    },
    select: (state, action) => {
      state.selectedId = action.payload;
    },
    darkMode: (state, action) => {
      state.theme = action.payload;
    },
    checkUserGroups: (state, action) => {
      const UserGroups = [action.payload, ...state.userGroups];
      state.userGroups = UserGroups;
    },

    systemTheme: (state) => {
      state.theme = Appearance.getColorScheme();
    },
  },
});

export const {
  addUser,
  setToken,
  checkUserGroups,
  closeTool,
  addFolder,
  regular,
  small,
  resetGiveaway,
  didEnterGiveaway,
  addtoCompletedItems,
  increaseStreakCounter,
  increaseAppStreakCounter,
  deleteAppStreakCounter,
  deleteCompletedItems,
  deleteStreakCounter,
  deletePreviousDayItems,
  large,
  removeUser,
  openCheckmark,
  select,
  darkMode,
  systemTheme,
} = userSlice.actions;

export default userSlice.reducer;
