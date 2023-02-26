import { createSlice } from "@reduxjs/toolkit";
import { createGlobalStyle } from "styled-components";

export const folderSlice = createSlice({
  name: 'folder',
  initialState: {
    folders: [],
  },
  reducers: {
    addFolder: (state, action) => {
      state.folders.push(action.payload);
    },
    addPrayer: (state, action) => {
      state.folders.prayers?.push(action.payload)
    },
    removeAllFolders: (state) => {
      state.folders = []
    },
  }
},
)

export const { addFolder, selected, addPrayer, removeAllFolders } = folderSlice.actions

export default folderSlice.reducer