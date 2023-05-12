import React, { useState, useEffect } from 'react';
import { Text, Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
    HeaderView, HeaderTitle,
    ModalContainer,
    ModalView, StyledInput2,
    ModalAction,
    ModalActionGroup,
    ModalIcon,
} from '../styles/appStyles';
import { useFonts } from 'expo-font'
import SelectList from 'react-native-dropdown-select-list'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import AppLoading from 'expo-app-loading';
import { useSelector } from 'react-redux';
import { addUser, closeTool, removeUser } from '../redux/userReducer';
import { useDispatch } from 'react-redux';
import { changeFolderName } from '../redux/folderReducer';

const Header = ({ navigation, folderName, theme }) => {
    let [fontsLoaded] = useFonts({
        'Inter-Black': require('../assets/fonts/Inter-Black.ttf'),
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    })

    if (!fontsLoaded) {
        return <AppLoading />
    }

    return (
        <>

            <HeaderView>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={{ marginRight: 10 }} onPress={() => navigation.navigate('Folders')}>
                            <Ionicons name="chevron-back" size={30} color={theme == "light" ? "#2f2d51" : "white"} />
                        </TouchableOpacity>
                        <HeaderTitle
                            style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' }
                                : { fontFamily: 'Inter-Bold', color: '#2F2D51' }}>
                            {folderName}
                        </HeaderTitle>
                    </View>
                </View>
            </HeaderView>
        </>
    );
}


export default Header;

const styles = StyleSheet.create({

    userbutton: {
        width: 45,
        height: 45,
        borderRadius: 50,
        marginHorizontal: 5,
        backgroundColor: '#2F2D51',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownText: {
        color: 'black',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black'
    },
    dropdownTextDark: {
        color: 'white',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    inputText: {
        color: 'white'
    },
    userbuttonDark: {
        width: 45,
        height: 45,
        borderRadius: 50,
        marginHorizontal: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },

    corner: {

    },
    cornerDark: {

    },

    tooltipLight: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 6,
        backgroundColor: '#FFBF65'
    },
    tooltipDark: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 6,
        backgroundColor: '#FFDAA5'
    },

    input: {
        height: 45,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#2F2D51',
        fontSize: 13,
        alignItems: 'center'
    },
    inputDark: {
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#212121',
        fontSize: 13,
        alignItems: 'center'
    },

})


