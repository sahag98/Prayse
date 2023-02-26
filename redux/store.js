import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import folderReducer from "./folderReducer";
import prayerReducer from "./prayerReducer";

const reducers = combineReducers({
    user: userReducer,
    folder: folderReducer,
    prayer: prayerReducer
})

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['user', 'folder', 'prayer']
}

const persReducer = persistReducer(persistConfig, reducers)



export const store = configureStore({
    reducer: persReducer,
    middleware: [thunk]
})