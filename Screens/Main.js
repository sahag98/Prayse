import { StatusBar } from 'expo-status-bar';
import { Container } from '../styles/appStyles';
import Home from '../components/Home';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import Constants from "expo-constants";

import { Appearance } from 'react-native';

export default function Main() {
    const [theme, setTheme] = useState(Appearance.getColorScheme());

    Appearance.addChangeListener((scheme) => {
        setTheme(scheme.colorScheme)
    })

    const [ready, setReady] = useState(false)

    const [todos, setTodos] = useState([])

    const loadTodos = () => {
        AsyncStorage.getItem("storedTodos").then(data => {
            if (data !== null) {
                setTodos(JSON.parse(data))
            }
        }).catch((error) => console.log(error))
    }

    if (!ready) {
        return (
            <AppLoading
                startAsync={loadTodos}
                onFinish={() => setReady(true)}
                onError={console.warn}
            />
        )
    }

    return (
        <Container style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
            <Home
                theme={theme}
                todos={todos}
                setTodos={setTodos}
            />
        </Container>
    );
}


