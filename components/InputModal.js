import React, { useRef, useState } from 'react';
import {
    KeyboardAvoidingView, View, Text, Modal, StyleSheet
}
    from 'react-native';
import {
    ModalButton,
    ModalButton2,
    ModalButton3,
    ModalContainer,
    ModalView,
    StyledInput,
    ModalAction,
    ModalActionGroup,
    ModalIcon,
    HeaderTitle,
} from '../styles/appStyles'
import SelectList from 'react-native-dropdown-select-list'
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons'
import { useFonts } from 'expo-font'
import AppLoading from 'expo-app-loading';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import uuid from 'react-native-uuid';
import { FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { addPrayer, editPrayer } from '../redux/prayerReducer';
import { useCallback } from 'react';


const InputModal = ({ categoryValue, setCategoryValue, modalVisible, folderName, folderId, setModalVisible, prayerValue, setPrayerValue, prayertoBeEdited, setPrayertoBeEdited, handleEditPrayer }) => {
    const theme = useSelector(state => state.user.theme)
    const inputRef = useRef(null)

    useFocusEffect(
        useCallback(() => {
            // When the screen is focused
            const focus = () => {
                setTimeout(() => {
                    inputRef?.current?.focus();
                }, 1);
            };
            focus();
            return focus; // cleanup
        }, []),
    );
    const handleCloseModal = () => {
        setModalVisible(false)
        setPrayerValue("")
        setCategoryValue("")
        // setTodoToBeEdited(null)
    }
    const dispatch = useDispatch()
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

        if (prayerValue.length == 0) {
            alert("Type in a prayer and try again.")
            return
        }
        if (!prayertoBeEdited) {
            dispatch(addPrayer({
                prayer: prayerValue,
                folder: folderName,
                folderId: folderId,
                category: categoryValue,
                date: new Date().toLocaleString(),
                id: uuid.v4(),
            }))
        } else {
            dispatch(editPrayer({
                prayer: prayerValue,
                folder: folderName,
                folderId: folderId,
                category: categoryValue,
                date: prayertoBeEdited.date,
                id: prayertoBeEdited.id,
            }))
            setPrayertoBeEdited(null)
        }
        setModalVisible(false)
        setPrayerValue("")
        setCategoryValue("")
    }

    if (!fontsLoaded) {
        return <AppLoading />
    }
    return (
        <View style={{ position: 'relative', flex: 1 }}>
            <View style={styles.actionButtons}>
                <FAB
                    icon="plus"
                    style={styles.fabStyle}
                    onPress={() => { setModalVisible(true) }}
                    color="#2F2D51"
                    customSize={60}
                />
            </View>

            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            // onShow={() => inputRef.current?.focus()}
            >
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <ModalContainer style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
                        <ModalView style={theme == 'dark' ? { backgroundColor: '#212121' } : { backgroundColor: '#93D8F8' }}>
                            <ModalIcon>
                                <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' } : { fontFamily: 'Inter-Bold' }}>Prayer</HeaderTitle>
                                <AntDesign style={{ marginTop: 10 }} name='edit' size={32} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                            </ModalIcon>
                            <StyledInput
                                ref={inputRef}
                                style={theme == 'dark' ? styles.inputDark : styles.input}
                                placeholder="Add a prayer"
                                placeholderTextColor={'white'}
                                selectionColor={'white'}
                                autoFocus={true}
                                onChangeText={(text) => setPrayerValue(text)}
                                value={prayerValue}
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
        </View>
    );
}




export default InputModal;

const styles = StyleSheet.create({

    inputText: {
        color: 'white'
    },
    fabStyle: {
        position: 'relative',
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    actionButtons: {
        position: 'absolute',
        bottom: 10,
        height: 70,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    fabStyle2: {
        bottom: 10,
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: '#2F2D51',
    },
    fabStyle3: {
        bottom: 10,
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: '#2F2D51',
    },
    fabStyle3Dark: {
        bottom: 10,
        borderRadius: 20,
        justifyContent: 'center',
        backgroundColor: '#A5C9FF',
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
