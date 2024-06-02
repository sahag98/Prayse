import { createSlice } from "@reduxjs/toolkit";
import { View, Appearance, StyleSheet } from "react-native";

const initialState = {
  userImg: "",
  tooltip: true,
  checkmarkVisible: false,
  userGroups: [],
  theme: Appearance.getColorScheme(),
  completedItems: [],
  devostreak: 0,
  appstreak: [],
  appstreakNum: 0,
  expoToken: "",
  alreadyIncreasedStreak: false,
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
    increaseAppStreakCounter: (state, action) => {
      // console.log(state.appstreakNum);
      if (state.appstreak.some((item) => item.today === action.payload.today)) {
        console.log("exists");
      } else {
        state.appstreak = [...state.appstreak, action.payload];
      }
      // state.appstreakNum = 1;
      const lastItem = state.appstreak[state.appstreak.length - 1];
      const oneBeforeLastItem = state.appstreak[state.appstreak.length - 2];

      if (lastItem && oneBeforeLastItem) {
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
            "The oneBeforeLastItemDate is the correct date before the lastItemDate."
          );
          // Perform your function here
        } else {
          console.log(
            "The oneBeforeLastItemDate is not the correct date before the lastItemDate."
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
      if (
        state.completedItems.some(
          (item) => item.item === action.payload.item
        ) &&
        state.completedItems.length === 3
      ) {
        return;
      } else {
        state.completedItems = [...state.completedItems, action.payload];
      }
    },
    deletePreviousDayItems: (state, action) => {
      state.completedItems = state.completedItems.filter(
        (item) => item.date !== action.payload.yesterday
      );
    },
    deleteCompletedItems: (state) => {
      state.completedItems = [];
    },
    increaseStreakCounter: (state) => {
      if (
        state.completedItems.length === 3 &&
        state.alreadyIncreasedStreak == false
      ) {
        console.log("will increase devo streak");
        state.devostreak = state.devostreak + 1;
        state.alreadyIncreasedStreak = true;
      }
    },
    deleteStreakCounter: (state) => {
      state.devostreak = 0;
    },

    deleteAppStreakCounter: (state) => {
      state.appstreak = [];
      state.appstreakNum = 0;
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
