// @ts-nocheck

import uuid from "react-native-uuid";

import { createSlice } from "@reduxjs/toolkit";
interface UserState {
  customTheme: object;
  actualTheme: object;
  customThemeArray: [];
  customBg: string;
  customMainTxt: string;
  customPrimary: string;
  customSecondary: string;
  customAccent: string;
  customPrimaryTxt: string;
  customSecondaryTxt: string;
  customAccentTxt: string;
  Bg: string;
  MainTxt: string;
  Primary: string;
  Secondary: string;
  Accent: string;
  PrimaryTxt: string;
  SecondaryTxt: string;
  AccentTxt: string;
}

const initialState: UserState = {
  customTheme: {},
  actualTheme: {},
  customThemeArray: [],
  customBg: "",
  customMainTxt: "",
  customPrimary: "",
  customSecondary: "",
  customAccent: "",
  customPrimaryTxt: "",
  customSecondaryTxt: "",
  customAccentTxt: "",
  Bg: "",
  MainTxt: "",
  Primary: "",
  Secondary: "",
  Accent: "",
  PrimaryTxt: "",
  SecondaryTxt: "",
  AccentTxt: "",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.Bg = state.customBg;
      state.Primary = state.customPrimary;
      state.Secondary = state.customSecondary;
      state.Accent = state.customAccent;
      state.PrimaryTxt = state.customPrimaryTxt;
      state.SecondaryTxt = state.customSecondaryTxt;
      state.AccentTxt = state.customAccentTxt;
      state.MainTxt = state.customMainTxt;
      state.customTheme = {
        id: uuid.v4(),
        Bg: state.Bg,
        Primary: state.Primary,
        Secondary: state.Secondary,
        Accent: state.Accent,
        PrimaryTxt: state.PrimaryTxt,
        SecondaryTxt: state.SecondaryTxt,
        AccentTxt: state.AccentTxt,
        MainTxt: state.MainTxt,
      };

      state.customThemeArray = [...state.customThemeArray, state.customTheme];
    },
    selectTheme: (state, { payload }) => {
      state.actualTheme = {
        id: payload.id,
        Bg: payload.Bg,
        Primary: payload.Primary,
        Secondary: payload.Secondary,
        Accent: payload.Accent,
        PrimaryTxt: payload.PrimaryTxt,
        SecondaryTxt: payload.SecondaryTxt,
        AccentTxt: payload.AccentTxt,
        MainTxt: payload.MainTxt,
      };
    },
    deleteTheme: (state, action) => {
      // state.actualTheme = {};
      if (action.payload === state.actualTheme.id) {
        state.actualTheme = {};
      }
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
    setCustomAccent: (state, action) => {
      //   console.log("bg color: ", action.payload);
      state.customAccent = action.payload;
    },
    setCustomPrimaryTxt: (state, action) => {
      state.customPrimaryTxt = action.payload;
    },
    setCustomSecondaryTxt: (state, action) => {
      state.customSecondaryTxt = action.payload;
    },
    setCustomAccentTxt: (state, action) => {
      state.customAccentTxt = action.payload;
    },
    setCustomMainTxt: (state, action) => {
      state.customMainTxt = action.payload;
    },
    resetTheme: (state) => {
      state.actualTheme = null;
    },
  },
});

export const {
  setCustomBg,
  setCustomPrimary,
  setCustomSecondary,
  setCustomAccent,
  setCustomPrimaryTxt,
  setCustomSecondaryTxt,
  setCustomAccentTxt,
  setCustomMainTxt,
  selectTheme,
  deleteTheme,
  resetTheme,
  setTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
