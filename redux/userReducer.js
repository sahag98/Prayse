import { createSlice } from "@reduxjs/toolkit";
import { View, Appearance, StyleSheet } from "react-native";
const initialState = {
  userImg: "",
  tooltip: true,
  checkmarkVisible: false,
  userGroups: [],
  theme: Appearance.getColorScheme(),
  streak: 0,
  appstreak: 0,
  expoToken: "",
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
    increaseStreakCounter: (state) => {
      if (state.streak) {
        state.streak = state.streak + 1;
      } else {
        state.streak = 1;
      }
    },
    increaseAppStreakCounter: (state) => {
      if (state.appstreak) {
        state.appstreak = state.appstreak + 1;
      } else {
        state.appstreak = 1;
      }
    },
    deleteAppStreakCounter: (state) => {
      state.appstreak = 0;
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
  increaseStreakCounter,
  increaseAppStreakCounter,
  deleteAppStreakCounter,
  large,
  removeUser,
  openCheckmark,
  select,
  darkMode,
  systemTheme,
} = userSlice.actions;

export default userSlice.reducer;
