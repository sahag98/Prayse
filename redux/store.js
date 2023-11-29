import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import folderReducer from "./folderReducer";
import prayerReducer from "./prayerReducer";
import answeredReducer from "./answeredReducer";
import favoritesReducer from "./favoritesReducer";
import notiReducer from "./notiReducer";
import remindersReducer from "./remindersReducer";

const reducers = combineReducers({
  user: userReducer,
  folder: folderReducer,
  prayer: prayerReducer,
  answered: answeredReducer,
  favorites: favoritesReducer,
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
    "prayer",
    "answered",
    "favorites",
    "reminder",
  ],
};

const persReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persReducer,
  middleware: [thunk],
});
