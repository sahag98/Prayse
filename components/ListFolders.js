import React, { useState, useRef, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import {
    ListView,
    TodoText,
    TodoDate,
    colors,
    ListViewHidden,
    HiddenButton,
    SwipedTodoText
} from '../styles/appStyles';
import { useFonts } from 'expo-font'
import { Entypo, AntDesign } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import themeContext from '../styles/themeContext';
import AppLoading from 'expo-app-loading';


const ListFolders = ({ theme, folders, setFolders }) => {

    const fadeAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }
        ).start()
    }, [fadeAnim]);

    let [fontsLoaded] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    })



    const [swipedRow, setSwipedRow] = useState(null)

    const handleDeleteFolder = (rowMap, rowKey) => {
        const newFolders = [...folders]
        const folderIndex = folders.findIndex((folder) => folder.key === rowKey)
        newFolders.splice(todoIndex, 1)

        AsyncStorage.setItem("storedFolders", JSON.stringify(newFolders)).then(() => {
            setFolders(newFolders)
        }).catch(error => console.log(error))
    }

    if (!fontsLoaded) {
        return <AppLoading />
    }

    return (
        <>
            {folders.length == 0 && <TodoText style={theme == 'dark' ? styles.pressDark : styles.press}> Press the + button to add a prayer.</TodoText>}

            {folders.length != 0 && <SwipeListView
                data={folders}
                renderItem={(data) => {
                    const RowText = data.item.key == swipedRow ? SwipedTodoText : TodoText;
                    return (
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                            onPress={() => {
                                console.log("hello")
                            }}
                        >
                            <>
                                <RowText style={theme == 'dark' ? { fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }} >{data.item.title}</RowText>

                            </>
                        </ListView>
                    )
                }}
                renderHiddenItem={(data, rowMap) => {
                    return (
                        <ListViewHidden>
                            <HiddenButton
                                onPress={() => handleDeleteFolder(rowMap, data.item.key)}
                            >
                                <AntDesign name='closecircle' size={35} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                            </HiddenButton>
                        </ListViewHidden>
                    )

                }}
                leftOpenValue={80}
                previewRowKey={"1"}
                previewOpenValue={80}
                previewOpenDelay={3000}
                disableLeftSwipe={true}
                showsHorizontalScrollIndicator={false}
                style={{
                    flex: 1, paddingBottom: 30, marginBottom: 40
                }}
                onRowOpen={(rowKey) => {
                    setSwipedRow(rowKey)
                }}
                onRowClose={() => {
                    setSwipedRow(null)
                }}
            />}
        </>
    );
}


export default ListFolders;

const styles = StyleSheet.create({
    elevation: {
        elevation: 5,
        shadowColor: '#13588c',
    },
    press: {
        fontFamily: 'Inter-Light',
        padding: 10,
        borderRadius: 25,
        color: '#2F2D51'
    },
    pressDark: {
        fontFamily: 'Inter-Light',
        padding: 10,
        borderRadius: 25,
        color: 'white'
    }
})

