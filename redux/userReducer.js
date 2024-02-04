import { createSlice } from "@reduxjs/toolkit";
import { View, Appearance, StyleSheet } from "react-native";
const initialState = {
  userImg: "",
  tooltip: true,
  checkmarkVisible: false,
  theme: Appearance.getColorScheme(),
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
    openCheckmark: (state, action) => {
      state.checkmarkVisible = action.payload;
    },
    select: (state, action) => {
      state.selectedId = action.payload;
    },
    darkMode: (state, action) => {
      state.theme = action.payload;
    },
    systemTheme: (state) => {
      console.log(Appearance.getColorScheme());
      state.theme = Appearance.getColorScheme();
    },
  },
});

export const {
  addUser,
  setToken,
  closeTool,
  addFolder,
  regular,
  small,
  large,
  removeUser,
  openCheckmark,
  select,
  darkMode,
  systemTheme,
} = userSlice.actions;

export default userSlice.reducer;
