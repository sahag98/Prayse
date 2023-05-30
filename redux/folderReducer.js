import { createSlice } from "@reduxjs/toolkit";
import { createGlobalStyle } from "styled-components";

export const folderSlice = createSlice({
  name: 'folder',
  initialState: {
    folders: [],
  },
  reducers: {
    addFolder: (state, action) => {
      const Folders = [action.payload, ...state.folders]
      state.folders = Folders
      // state.folders.push(action.payload);
    },
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter((folder) => folder.id !== action.payload)
    },
    deleteAllFolders: (state) => {
      state.folders = []
    }
  }
},
)

export const { addFolder, deleteFolder, deleteAllFolders } = folderSlice.actions

export default folderSlice.reducer