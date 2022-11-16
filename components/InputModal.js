import React, { useState } from 'react';
import {
    Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Text, View, Modal, StyleSheet, SafeAreaView
}
    from 'react-native';
import {
    ModalButton,
    ModalButton2,
    ModalButton3,
    ModalContainer,
    ModalView,
    StyledInput,
    StyledInput2,
    ModalAction,
    ModalActionGroup,
    ModalIcon,
    HeaderTitle,
} from '../styles/appStyles'
import SelectList from 'react-native-dropdown-select-list'
import { AntDesign, Entypo, Fontisto } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading';
import { useNavigation } from '@react-navigation/native'

const InputModal = ({ categoryValue, setCategoryValue, theme, modalVisible, setModalVisible, todoInputValue, setTodoInputValue, handleAddTodo, todos, todoToBeEdited, setTodoToBeEdited, handleEditTodo }) => {
    const handleCloseModal = () => {
        setModalVisible(false)
        setTodoInputValue("")
        setCategoryValue("")
        setTodoToBeEdited(null)
    }
    let [fontsLoaded] = useFonts({
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    })

    const navigation = useNavigation()

    const data = [
        {
            value: 'General'
        },
        {
            value: 'People'
        },
        {
            value: 'Personal'
        },
        {
            value: 'Praise'
        },
        {
            value: 'Other'
        }
    ]

    const [selected, setSelected] = useState("")

    const handleSubmit = () => {

        if (todoInputValue.length == 0) {
            alert("Type in a prayer and try again.")
            return
        }
        if (!todoToBeEdited) {
            handleAddTodo({
                title: todoInputValue,
                category: categoryValue,
                date: new Date().toLocaleString(),
                key: `${(todos[todos.length - 1] && parseInt(todos[todos.length - 1].key) + 1) || 1}`
            })
        } else {
            handleEditTodo({
                title: todoInputValue,
                category: categoryValue,
                date: new Date().toLocaleString(),
                key: todoToBeEdited.key
            })
        }
        setTodoInputValue("")
        setCategoryValue("")
    }

    if (!fontsLoaded) {
        return <AppLoading />
    }
    return (
        <>
            <ModalButton3 style={theme == 'dark' ? { backgroundColor: '#A5C9FF' } : { backgroundColor: '#4E31FF' }} onPress={() => navigation.navigate('Gospel')}>
                <Entypo name='open-book' size={40} color={theme == 'dark' ? 'black' : 'white'} />
            </ModalButton3>

            <ModalButton style={theme == 'dark' ? { borderRadius: 50, backgroundColor: '#7272FF' } : { backgroundColor: '#2F2D51' }} onPress={() => { setModalVisible(true) }}>
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
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ModalContainer style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
                        <ModalView style={theme == 'dark' ? { backgroundColor: '#212121' } : { backgroundColor: '#93D8F8' }}>
                            <ModalIcon>
                                <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' } : { fontFamily: 'Inter-Bold' }}>Prayer</HeaderTitle>
                                <AntDesign style={{ marginTop: 10 }} name='edit' size={32} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                            </ModalIcon>
                            <StyledInput
                                style={theme == 'dark' ? styles.inputDark : styles.input}
                                placeholder="Add a prayer"
                                placeholderTextColor={'white'}
                                selectionColor={'white'}
                                autoFocus={true}
                                onChangeText={(text) => setTodoInputValue(text)}
                                value={todoInputValue}
                                onSubmitEditing={(e) => { e.key === 'Enter' && e.preventDefault() }}
                                multiline={true}
                            />
                            <Text style={theme == 'dark' ? styles.selectDark : styles.select}>
                                Select a Category (optional):
                            </Text>
                            <SelectList
                                placeholder="selectcategory"
                                setSelected={setCategoryValue}
                                data={data}
                                search={false}
                                defaultOption={{ key: 'None', value: 'None' }}
                                boxStyles={theme == 'dark' ? styles.categoryDark : styles.category}
                                dropdownStyles={theme == 'dark' ? styles.dropdownDark : styles.dropdown}
                                dropdownTextStyles={styles.dropdownTextDark}
                                inputStyles={styles.inputText}
                                arrowicon={<AntDesign name="down" size={15} color="white" />}
                                maxHeight="250"
                            />
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
                </KeyboardAvoidingView>
            </Modal>
        </>
    );
}




export default InputModal;

const styles = StyleSheet.create({

    inputText: {
        color: 'white'
    },
    select: {
        fontSize: 12,
        paddingTop: 10,
        color: 'black'
    },
    selectDark: {
        fontSize: 12,
        paddingTop: 10,
        color: 'white'
    },

    category: {
        backgroundColor: '#2F2D51',
        color: 'black',
        marginTop: 10,
        height: 50,
        alignItems: 'center',
    },
    categoryDark: {
        backgroundColor: '#121212',
        color: 'white',
        marginTop: 10,
        height: 50,
        alignItems: 'center',
    },

    dropdown: {
        backgroundColor: '#2F2D51',
        height: 800
    },
    dropdownDark: {
        backgroundColor: '#121212',
        height: 800
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

    elevation: {
        elevation: 6,
        shadowColor: '#13588c',
    },

    inputDark: {
        alignItems: 'center',
        alignSelf: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-Regular', backgroundColor: '#121212'
    },
    input: {
        textAlignVertical: "center",
        fontFamily: 'Inter-Regular', backgroundColor: '#2F2D51'
    }
})
