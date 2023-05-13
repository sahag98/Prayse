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
    // changeFolderName: (state, action) => {
    //   const newFolders = [...state.folders]
    //   const folderIndex = state.folders.findIndex((folder) => folder.name === action.payload)
    //   newFolders.splice(folderIndex, 1, action.payload)
    //   state.folders = newFolders
    // },
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter((folder) => folder.id !== action.payload)
    },
    deleteAllFolders: (state) => {
      state.folders = []
    }
  }
},
)

export const { addFolder, deleteFolder, changeFolderName, deleteAllFolders } = folderSlice.actions

export default folderSlice.reducer