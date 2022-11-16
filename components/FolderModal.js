import React, { useState } from 'react';
import { Text, View, Modal, StyleSheet, Pressable } from 'react-native';
import {
    ModalButton,
    ModalButton2,
    ModalContainer,
    ModalView,
    StyledInput,
    ModalAction,
    ModalActionGroup,
    ModalIcon,
    HeaderTitle,
} from '../styles/appStyles'
import { AntDesign, Fontisto } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading';
import { useNavigation } from '@react-navigation/native'

const FolderModal = ({ folderName, setFolderName, theme, modalVisible, setModalVisible, handleAddFolder, folders }) => {

    const handleCloseModal = () => {
        setModalVisible(false)
        setTodoInputValue("")
        setTodoToBeEdited(null)
    }
    let [fontsLoaded] = useFonts({
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    })

    const navigation = useNavigation()

    const handleSubmit = () => {

        if (folderName.length == 0) {
            alert("Type in a prayer and try again.")
            return
        }
        handleAddFolder({
            title: folderName,
            key: `${(folders[folders.length - 1] && parseInt(folders[folders.length - 1].key) + 1) || 1}`
        })

        setFolderName("")
    }

    if (!fontsLoaded) {
        return <AppLoading />
    }
    return (
        <>
            <ModalButton style={theme == 'dark' ? { backgroundColor: '#7272FF' } : { backgroundColor: '#2F2D51' }} onPress={() => { setModalVisible(true) }}>
                <AntDesign name='plus' size={40} color={theme == 'dark' ? 'black' : 'white'} />
            </ModalButton>

            <ModalButton2 style={theme == 'dark' ? { backgroundColor: 'white' } : { backgroundColor: '#2F2D51' }} onPress={() => navigation.navigate('Community')}>
                <Fontisto name='world-o' size={40} color={theme == 'dark' ? 'black' : 'white'} />
            </ModalButton2>
            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <ModalContainer style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
                    <ModalView style={theme == 'dark' ? { backgroundColor: '#212121' } : { backgroundColor: '#93D8F8' }}>
                        <ModalIcon>
                            <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' } : { fontFamily: 'Inter-Bold' }}>Prayer Folder</HeaderTitle>
                            <AntDesign style={{ marginTop: 10 }} name='edit' size={32} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                        </ModalIcon>

                        <StyledInput
                            style={theme == 'dark' ? { fontFamily: 'Inter-Regular', backgroundColor: '#121212' } : { fontFamily: 'Inter-Regular', backgroundColor: '#2F2D51' }}
                            placeholder="Enter name of folder"
                            placeholderTextColor={'white'}
                            selectionColor={'white'}
                            autoFocus={true}
                            onChangeText={(text) => setFolderName(text)}
                            value={folderName}
                            onSubmitEditing={(e) => { e.key === 'Enter' && e.preventDefault() }}
                            multiline={true}
                        />
                        {/* {error == true && <Text>Type in a prayer and try again.</Text>} */}
                        <ModalActionGroup>
                            <ModalAction color={'white'} onPress={handleCloseModal}>
                                <AntDesign name='close' size={28} color={'#2F2D51'} />
                            </ModalAction>
                            <ModalAction color={theme == 'dark' ? '#121212' : '#2F2D51'} onPress={handleSubmit}>
                                <AntDesign name='check' size={28} color={'white'} />
                            </ModalAction>
                        </ModalActionGroup>
                    </ModalView>
                </ModalContainer>
            </Modal>
        </>
    );
}




export default FolderModal;

const styles = StyleSheet.create({
    elevation: {
        elevation: 6,
        shadowColor: '#13588c',
    },
})
