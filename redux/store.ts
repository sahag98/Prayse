// @ts-nocheck
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import favoritesReducer from "./favoritesReducer";
import folderReducer from "./folderReducer";
import prayerReducer from "./prayerReducer";
import proReducer from "./proReducer";
import remindersReducer from "./remindersReducer";
import themeReducer from "./themeReducer";
import userReducer from "./userReducer";

const reducers = combineReducers({
  user: userReducer,
  folder: folderReducer,
  prayer: prayerReducer,
  pro: proReducer,
  favorites: favoritesReducer,
  theme: themeReducer,
  reminder: remindersReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "user",
    "folder",
    "prayer",
    "pro",
    "favorites",
    "reminder",
    "theme",
  ],
};

const persReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persReducer,
  middleware: [thunk],
});
