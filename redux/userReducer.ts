// @ts-nocheck
import { Appearance } from "react-native";

import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  userImg: string;
  tooltip: boolean;
  checkmarkVisible: boolean;
  userGroups: string[];
  customBg: string;
  theme: string;
  completedItems: {
    date: string;
    items: string[];
  }[];
  devostreak: number;
  hasShownProModal: boolean;
  isAppReady: boolean;
  appstreak: any[];
  appstreakNum: number;
  expoToken: string;
  alreadyEnteredGiveaway: boolean;
  isShowingGiveawayModal: boolean;
  isShowingDonationModal: boolean;
  isShowingCongratsModal: boolean;
  hasIncreasedDevoStreak: boolean;
  prayers: any[];
  fontSize: number;
  selectedId: string | null;

  hasSubmittedReview: boolean;
}

const initialState: UserState = {
  userImg: "",
  tooltip: true,
  checkmarkVisible: false,
  userGroups: [],
  theme: Appearance.getColorScheme(),
  completedItems: [],
  devostreak: 0,
  hasShownProModal: false,
  isAppReady: false,
  appstreak: [],
  customBg: "",
  appstreakNum: 0,
  expoToken: "",
  alreadyEnteredGiveaway: false,
  isShowingGiveawayModal: false,
  isShowingDonationModal: false,
  isShowingCongratsModal: false,
  hasIncreasedDevoStreak: false,
  prayers: [],
  fontSize: 16,
  selectedId: null,

  hasSubmittedReview: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    showProModal: (state) => {
      state.hasShownProModal = true;
    },
    isSubmittingReview: (state) => {
      state.hasSubmittedReview = true;
    },
    setNeededValues: (state) => {
      state.PercentValue = 25;
      state.isShowingCongratsModal = false;
      state.hasIncreasedDevoStreak = false;
      state.isShowingDonationModal = false;
      state.isShowingGiveawayModal = false;
      state.alreadyEnteredGiveaway = false;
    },
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
    changetoNull: (state) => {
      state.PercentValue = 0;
    },
    changeto25: (state) => {
      state.PercentValue = 25;
    },
    changeto50: (state) => {
      state.PercentValue = 50;
    },
    changeto75: (state) => {
      state.PercentValue = 75;
    },
    didEnterCongrats: (state) => {
      state.isShowingCongratsModal = true;
    },
    resetCongrats: (state) => {
      state.isShowingCongratsModal = false;
    },
    didShowDonationModal: (state) => {
      state.isShowingDonationModal = true;
    },
    resetDonationModal: (state) => {
      state.isShowingDonationModal = false;
    },
    didEnterGiveaway: (state) => {
      state.alreadyEnteredGiveaway = true;
      state.isShowingGiveawayModal = true;
    },
    resetGiveaway: (state) => {
      console.log("reseting giveaway");
      state.alreadyEnteredGiveaway = false;
      // state.isShowingGiveawayModal = false;
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
            "App streak oneBeforeLastItemDate is the correct date before the lastItemDate.",
          );
          // Perform your function here
        } else {
          state.appstreakNum = 0;
          console.log(
            "App streak oneBeforeLastItemDate is not the correct date before the lastItemDate.",
          );
        }
      }
    },
    addtoCompletedItems: (state, action) => {
      const { date, item } = action.payload;

      // Find the index of the entry with the same date
      const dateIndex = state.completedItems.findIndex(
        (entry) => entry.date === date,
      );

      if (dateIndex >= 0) {
        // If date exists, add the item to the items array of that date
        // if (state.completedItems[0].items.length )
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
      const { yesterday } = action.payload;
      const currentDate = new Date().toLocaleDateString().split("T")[0];

      console.log("current: ", currentDate);
      const dateIndex = state.completedItems.findIndex(
        (entry) => entry?.date === yesterday,
      );

      const currentDateIndex = state.completedItems.findIndex(
        (entry) => entry?.date === currentDate,
      );
      // const currentDateIndex = state.completedItems.findIndex(
      //   (entry) => entry?.date === currentDate,
      // );

      if (dateIndex >= 0) {
        state.completedItems[dateIndex].items.length = 0;
      }

      if (
        dateIndex === -1 &&
        state.completedItems.length > 0 &&
        currentDateIndex === -1
      ) {
        console.log("no yesterday date but there are completed items.");
        state.completedItems = [];
        state.hasIncreasedDevoStreak = false;
        state.devostreak = 0;
        return;
      }

      const lastItemData =
        state.completedItems[state.completedItems.length - 1];

      const lastItem =
        state.completedItems[state.completedItems.length - 1]?.date;
      const oneBeforeLastItem =
        state.completedItems[state.completedItems.length - 2]?.date;

      // console.log("last: ", lastItem);
      // console.log("before last: ", oneBeforeLastItem);

      if (dateIndex === -1 && oneBeforeLastItem) {
        console.log("should erase array.");
        state.completedItems = [];
        state.hasIncreasedDevoStreak = false;
        state.devostreak = 0;
        return;
      }

      if (lastItem !== currentDate) {
        state.hasIncreasedDevoStreak = false;
      }

      function parseLocaleDateString(dateString, locale = "en-US") {
        //eslint-disable-next-line
        const [month, day, year] = dateString.split(/[\/\-]/).map(Number);
        // Note: Adjust parsing logic based on known locale format if needed
        return new Date(year, month - 1, day);
      }

      if (lastItem && oneBeforeLastItem) {
        const lastItemDate = parseLocaleDateString(lastItem);
        const oneBeforeLastItemDate = parseLocaleDateString(oneBeforeLastItem);

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

          // Perform your function here
        } else {
          state.devostreak = 0;
          console.log(
            "The oneBeforeLastItemDate is not the correct date before the lastItemDate.",
          );
        }
      }
    },
    deleteCompletedItems: (state) => {
      console.log("<<deleting ITEMS>>");
      state.completedItems = [];
      // state.completedItems.length = 0;
    },
    increaseStreakCounter: (state) => {
      if (
        state.completedItems.length === 2 &&
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
      // state.alreadyEnteredGiveaway = false;
      // state.isShowingGiveawayModal = false;
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
  isSubmittingReview,
  checkUserGroups,
  closeTool,
  addFolder,
  regular,
  small,
  setNeededValues,
  changetoNull,
  changeto25,
  changeto50,
  changeto75,
  didEnterCongrats,
  resetCongrats,
  didShowDonationModal,
  resetDonationModal,
  resetGiveaway,
  didEnterGiveaway,
  addtoCompletedItems,
  increaseStreakCounter,
  showProModal,
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
