import React, { useState, useContext, useEffect } from 'react';
import { Text, Modal, Dimensions, View, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import {
    HeaderView, HeaderTitle, HeaderButton, colors, ModalButton,
    ModalButton2,
    ModalContainer,
    ModalView, StyledInput,
    ModalAction,
    ModalActionGroup,
    ModalIcon,
    ListView
} from '../styles/appStyles';
import { useFonts } from 'expo-font'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import AppLoading from 'expo-app-loading';
import Svg, { Path } from 'react-native-svg';
import { FlashList } from '@shopify/flash-list';
import RadioButtonRN from 'radio-buttons-react-native';
import SelectList from 'react-native-dropdown-select-list'

const Header = ({ categoryValue, setCategoryValue, filter, setFilter, todos, theme, handleClearTodos, clearModalVisible, setClearModalVisible, filterModalVisible, setFilterModalVisible }) => {

    const handleCloseModal = () => {
        setClearModalVisible(false)
        setFilterModalVisible(false)
    }

    const handleSubmit = () => {
        setClearModalVisible(false)
        handleClearTodos()
    }

    const [selected, setSelected] = useState("")

    let [fontsLoaded] = useFonts({
        'Inter-Black': require('../assets/fonts/Inter-Black.ttf'),
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    })


    const data = [
        {
            value: 'General'
        },
        {
            value: 'Friends & Family'
        },
        {
            value: 'Personal'
        }
        ,
        {
            value: 'Praise'
        },
        {
            value: 'Other'
        }
    ]

    const handleFilter = () => {
        setFilter(categoryValue)
        handleCloseModal()
    }
    // console.log(filter)

    if (!fontsLoaded) {
        return <AppLoading />
    }

    return (
        <>

            <HeaderView>
                <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Medium', color: 'white' } : { fontFamily: 'Inter-Medium', color: '#2F2D51' }}>Prayer List</HeaderTitle>
                {todos.length == 0 && ''}
                {todos.length != 0 &&
                    <>
                        {/* <TouchableOpacity onPress={() => setFilterModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'white', paddingRight: 10 }}>Filter</Text>
                            <FontAwesome name="filter" size={25} color="white" />
                        </TouchableOpacity> */}
                        <HeaderButton
                            onPress={() => { setClearModalVisible(true) }}
                        >

                            <AntDesign name='closecircle' size={48} color={theme == 'dark' ? '#7272FF' : '#2F2D51'} />
                        </HeaderButton>
                    </>}
            </HeaderView>
            <Modal

                animationType='fade'
                transparent={true}
                visible={clearModalVisible}
                onRequestClose={handleCloseModal}
            >
                <ModalContainer style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
                    <ModalView style={theme == 'dark' ? { backgroundColor: '#7272FF' } : { backgroundColor: '#93D8F8' }}>
                        <ModalIcon>
                            <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: '#080808', fontSize: 18 } : { fontFamily: 'Inter-Bold', fontSize: 18 }}>Are you sure you want to delete all the prayers?</HeaderTitle>
                        </ModalIcon>
                        <ModalActionGroup>
                            <ModalAction color={'white'} onPress={handleCloseModal}>
                                <AntDesign name='close' size={30} color={'#2F2D51'} />
                            </ModalAction>
                            <ModalAction color={theme == 'dark' ? '#121212' : '#2F2D51'} onPress={handleSubmit}>
                                <AntDesign name='check' size={30} color={'white'} />
                            </ModalAction>
                        </ModalActionGroup>
                    </ModalView>
                </ModalContainer>
            </Modal>

            <Modal
                animationType='fade'
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={handleCloseModal}
            >
                <ModalContainer style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
                    <ModalView style={theme == 'dark' ? { width: '100%', backgroundColor: '#212121' } : { width: '100%', backgroundColor: '#93D8F8' }}>
                        <Text>Filter</Text>
                        <SelectList
                            placeholder="selectcategory"
                            setSelected={setCategoryValue}
                            data={data}
                            search={false}
                            // onSelect={() => console.log(categoryValue)}
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
                            <ModalAction color={theme == 'dark' ? '#121212' : '#2F2D51'} onPress={handleFilter}>
                                <AntDesign name='check' size={28} color={'white'} />
                            </ModalAction>
                        </ModalActionGroup>
                    </ModalView>
                </ModalContainer>
            </Modal>
        </>
    );
}


export default Header;

const styles = StyleSheet.create({

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
    list: {
        backgroundColor: '#93D8F8',
        minHeight: 60,
        width: '100%',
        padding: 15,
        justifyContent: 'space-around',
        marginBottom: 20,
        borderRadius: 10
    },
    listDark: {
        backgroundColor: '#212121',
        minHeight: 60,
        width: '100%',
        padding: 15,
        justifyContent: 'space-around',
        marginBottom: 20,
        borderRadius: 10
    },
    inputDark: {
        // textAlignVertical: "top",
        fontFamily: 'Inter-Regular', backgroundColor: '#121212'
    },
    input: {
        // textAlignVertical: "top",
        fontFamily: 'Inter-Regular', backgroundColor: '#2F2D51'
    }
})


