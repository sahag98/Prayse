// @ts-nocheck

import uuid from "react-native-uuid";

import { createSlice } from "@reduxjs/toolkit";
interface UserState {
  customTheme: object;
  customThemeArray: [];
  customBg: string;
  customPrimary: string;
  customSecondary: string;
  customPrimaryTxt: string;
  customSecondaryTxt: string;
  Bg: string;
  Primary: string;
  Secondary: string;
  PrimaryTxt: string;
  SecondaryTxt: string;
}

const initialState: UserState = {
  customTheme: {},
  customThemeArray: [],
  customBg: "",
  customPrimary: "",
  customSecondary: "",
  customPrimaryTxt: "",
  customSecondaryTxt: "",
  Bg: "",
  Primary: "",
  Secondary: "",
  PrimaryTxt: "",
  SecondaryTxt: "",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.Bg = state.customBg;
      state.Primary = state.customPrimary;
      state.Secondary = state.customSecondary;
      state.PrimaryTxt = state.customPrimaryTxt;
      state.SecondaryTxt = state.customSecondaryTxt;

      state.customTheme = {
        id: uuid.v4(),
        Bg: state.Bg,
        Primary: state.Primary,
        Secondary: state.Secondary,
        PrimaryTxt: state.PrimaryTxt,
        SecondaryTxt: state.SecondaryTxt,
      };

      state.customThemeArray = [...state.customThemeArray, state.customTheme];
    },
    deleteTheme: (state, action) => {
      state.customThemeArray = state.customThemeArray.filter(
        (theme) => theme.id !== action.payload,
      );
    },
    setCustomBg: (state, action) => {
      //   console.log("bg color: ", action.payload);
      state.customBg = action.payload;
    },
    setCustomPrimary: (state, action) => {
      //   console.log("bg color: ", action.payload);
      state.customPrimary = action.payload;
    },
    setCustomSecondary: (state, action) => {
      //   console.log("bg color: ", action.payload);
      state.customSecondary = action.payload;
    },
    setCustomPrimaryTxt: (state, action) => {
      state.customPrimaryTxt = action.payload;
    },
    setCustomSecondaryTxt: (state, action) => {
      state.customSecondaryTxt = action.payload;
    },
    resetTheme: (state) => {
      state.customBg = null;
      state.customPrimary = null;
      state.customSecondary = null;
      state.customPrimaryTxt = null;
      state.customSecondaryTxt = null;
      state.Bg = null;
      state.Primary = null;
      state.Secondary = null;
      state.PrimaryTxt = null;
      state.Secondarytxt = null;
    },
  },
});

export const {
  setCustomBg,
  setCustomPrimary,
  setCustomSecondary,
  setCustomPrimaryTxt,
  setCustomSecondaryTxt,
  deleteTheme,
  resetTheme,
  setTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
