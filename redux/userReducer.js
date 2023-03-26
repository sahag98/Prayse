import { createSlice } from "@reduxjs/toolkit";
import { View, Appearance, StyleSheet } from 'react-native';
const initialState = {
    user: '',
    tooltip: true,
    checkmarkVisible: false,
    theme: Appearance.getColorScheme(),
    prayers: [],
    fontSize: 15,
    selectedId: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        closeTool: (state) => {
            state.tooltip = false
        },
        large: (state) => {
            state.fontSize = 20
        },
        regular: (state) => {
            state.fontSize = 15
        },
        small: (state) => {
            state.fontSize = 12
        },
        openCheckmark: (state, action) => {
            state.checkmarkVisible = action.payload
        },
        select: (state, action) => {
            state.selectedId = action.payload
        },
        darkMode: (state, action) => {
            state.theme = action.payload
        },
        systemTheme: (state) => {
            state.theme = Appearance.getColorScheme()
        }
    }
},
)

export const { addUser, closeTool, addFolder, regular, small, large, removeUser, openCheckmark, select, darkMode, systemTheme } = userSlice.actions

export default userSlice.reducer