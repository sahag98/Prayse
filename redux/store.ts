// @ts-nocheck
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

import answeredReducer from "./answeredReducer";
import favoritesReducer from "./favoritesReducer";
import folderReducer from "./folderReducer";
import messageReducer from "./messageReducer";
import notiReducer from "./notiReducer";
import prayerReducer from "./prayerReducer";
import remindersReducer from "./remindersReducer";
import themeReducer from "./themeReducer";
import userReducer from "./userReducer";

const reducers = combineReducers({
  user: userReducer,
  folder: folderReducer,
  prayer: prayerReducer,
  answered: answeredReducer,
  message: messageReducer,
  favorites: favoritesReducer,
  theme: themeReducer,
  noti: notiReducer,
  reminder: remindersReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "user",
    "folder",
    "noti",
    "message",
    "prayer",
    "answered",
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
