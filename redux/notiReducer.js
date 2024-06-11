import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

export const notiSlice = createSlice({
  name: "noti",
  initialState,
  reducers: {
    addNoti: (state, action) => {
      const Notifications = [action.payload, ...state.notifications];
      state.notifications = Notifications;
    },
    deleteAll: (state) => {
      state.notifications = [];
    },
    deleteNoti: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.noti_id !== action.payload,
      );
    },
  },
});

export const { addNoti, deleteAll, deleteNoti } = notiSlice.actions;

export default notiSlice.reducer;
