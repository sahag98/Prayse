import { StatusBar } from 'expo-status-bar';
import { Container } from '../styles/appStyles';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import Folder from '../components/Folder';
import useIsReady from '../hooks/useIsReady';
import { ActivityIndicator, View } from 'react-native';

export default function Main({ navigation }) {
    const theme = useSelector(state => state.user.theme)
    const isReady = useIsReady()
    const [todos, setTodos] = useState([])

    const BusyIndicator = () => {

        return (
            <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    };

    const loadTodos = () => {
        AsyncStorage.getItem("storedTodos").then(data => {
            if (data !== null) {
                setTodos(JSON.parse(data))
            }
        }).catch((error) => console.log(error))
    }

    if (!isReady) {
        loadTodos()
        return <BusyIndicator />;
    }

    return (
        <>
            <StatusBar style={theme == 'dark' ? 'light' : 'dark'} />
            <Container style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
                <Folder todos={todos} setTodos={setTodos} navigation={navigation} />
            </Container>
        </>
    );
}


