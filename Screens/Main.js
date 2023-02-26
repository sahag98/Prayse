import { StatusBar } from 'expo-status-bar';
import { Container } from '../styles/appStyles';
import Home from '../components/Home';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { useSelector } from 'react-redux';
import Folder from '../components/Folder';
import useIsReady from '../hooks/useIsReady';
import { ActivityIndicator, View } from 'react-native';

export default function Main({ navigation }) {
    const theme = useSelector(state => state.user.theme)
    console.log(theme)
    const isReady = useIsReady()
    const [ready, setReady] = useState(false)
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
        return <BusyIndicator />;
    }
    // if (!ready) {
    //     return (
    //         <AppLoading
    //             startAsync={loadTodos}
    //             onFinish={() => setReady(true)}
    //             onError={console.warn}
    //         />
    //     )
    // }



    return (
        <>
            <StatusBar style={theme == 'dark' ? 'light' : 'dark'} />
            <Container style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
                <Folder navigation={navigation} />
                {/* <Home
                    theme={theme}
                    todos={todos}
                    setTodos={setTodos}
                    navigation={navigation}
                /> */}
            </Container>
        </>
    );
}


