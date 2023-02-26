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
import { selected } from '../redux/folderReducer';

const Header = ({ navigation, folderName, theme, handleClearTodos, clearModalVisible, setClearModalVisible }) => {
    const [currentUser, setCurrentUser] = useState('')
    const user = useSelector(state => state.user.user)
    const tooltip = useSelector(state => state.user.tooltip)
    const folder = useSelector(state => state.folder.folders)
    const [openInput, setopenInput] = useState(false)
    const dispatch = useDispatch()
    let title = 'Prayer List'

    const handleCloseModal = () => {
        setClearModalVisible(false)
    }

    const add = () => {
        dispatch(addUser(currentUser))
        setopenInput(false)
    }

    const handleSubmit = () => {
        setClearModalVisible(false)
        handleClearTodos()
    }

    const change = () => {
        setopenInput(true)
        dispatch(closeTool())
        setCurrentUser('')
    }
    const close = () => {
        dispatch(removeUser())
        setopenInput(false)
    }

    const closeToolTip = () => {
        dispatch(closeTool())
    }

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
                {tooltip == true &&
                    <View style={{ position: 'absolute', right: '15%', top: 20, width: '40%' }}>
                        <TouchableOpacity onPress={closeToolTip} style={theme == 'dark' ? styles.tooltipDark : styles.tooltipLight}>
                            <View style={theme == 'dark' ? { position: 'absolute', transform: [{ rotateZ: '80deg' }], width: 10, height: 10, backgroundColor: '#FFDAA5', left: 1, top: 2 } : { position: 'absolute', transform: [{ rotateZ: '80deg' }], width: 10, height: 10, backgroundColor: '#FFBF65', left: 1, top: 2 }}></View>
                            <Text style={{ color: 'black', fontSize: 10 }}>edit title by pressing on it!</Text>
                            <AntDesign style={{ paddingLeft: 2, paddingBottom: 4 }} name="close" size={10} color={'black'} />
                        </TouchableOpacity>
                    </View>

                }
                <TouchableOpacity onPress={change}>
                    {openInput == false &&
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <HeaderTitle
                                style={theme == 'dark' ? { fontFamily: 'Inter-Medium', color: 'white' }
                                    : { fontFamily: 'Inter-Medium', color: '#2F2D51' }}>
                                {/* {user ? user + '\'s prayer list' : title} */}
                                {folderName}
                            </HeaderTitle>
                            <AntDesign style={{ paddingLeft: 5 }} name="edit" size={24} color={theme == 'dark' ? 'white' : 'black'} />
                        </View>
                    }
                    {openInput == true &&
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <StyledInput2
                                    style={theme == 'dark' ? styles.inputDark : styles.input}
                                    onChangeText={(heading) => setCurrentUser(heading)}
                                    value={currentUser}
                                    placeholder="Enter your name"
                                    placeholderTextColor={'white'}
                                    selectionColor={'white'}
                                    autoFocus={true}
                                    maxLength={10}
                                    onSubmitEditing={(e) => { e.key === 'Enter' && e.preventDefault() }}
                                />
                                <TouchableOpacity style={theme == 'dark' ? styles.userbuttonDark : styles.userbutton} onPress={add}>
                                    <AntDesign name="check" size={24} color={theme == 'dark' ? 'black' : 'white'} />
                                </TouchableOpacity>
                                <TouchableOpacity style={theme == 'dark' ? styles.userbuttonDark : styles.userbutton} onPress={close}>
                                    <AntDesign name="close" size={24} color={theme == 'dark' ? 'black' : 'white'} />
                                </TouchableOpacity>
                            </View>
                        </>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="settings" size={30} color={theme == 'dark' ? 'white' : "#2f2d51"} />
                </TouchableOpacity>

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


