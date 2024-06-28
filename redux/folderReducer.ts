// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";

interface FolderState {
  folders: any[];
  quickFolderExists: boolean;
}

const initialState: FolderState = {
  folders: [],
  quickFolderExists: false,
};

export const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    addFolder: (state, action) => {
      const Folders = [action.payload, ...state.folders];
      state.folders = Folders;
      // state.folders.push(action.payload);
    },
    addQuickFolder: (state, action) => {
      const Folders = [action.payload, ...state.folders];
      state.folders = Folders;
      state.quickFolderExists = true;
      // state.folders.push(action.payload);
    },
    editFolderName: (state, action) => {
      const newFolders = [...state.folders];
      const folderIndex = state.folders.findIndex(
        (folder) => folder.id === action.payload.id,
      );
      newFolders.splice(folderIndex, 1, action.payload);
      state.folders = newFolders;
    },
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter(
        (folder) => folder.id !== action.payload,
      );
    },
    deleteQuickFolder: (state, action) => {
      state.folders = state.folders.filter(
        (folder) => folder.id !== action.payload,
      );
      state.quickFolderExists = false;
    },
    deleteAllFolders: (state) => {
      state.folders = [];
      state.folders.length = 0;
    },
  },
});

export const {
  addFolder,
  addQuickFolder,
  editFolderName,
  deleteFolder,
  deleteQuickFolder,
  deleteAllFolders,
} = folderSlice.actions;

export default folderSlice.reducer;
