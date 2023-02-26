import React, { useRef, useState, useEffect } from "react";
import { Animated, View } from 'react-native'
import Header from "./Header";
import ListItems from "./ListItems";
import InputModal from "./InputModal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { Container } from "../styles/appStyles";

const Home = ({ navigation, prayerList, folder }) => {
    const theme = useSelector(state => state.user.theme)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const [modalVisible, setModalVisible] = useState(false)
    const [clearModalVisible, setClearModalVisible] = useState(false)
    const [prayerValue, setPrayerValue] = useState("")
    const [categoryValue, setCategoryValue] = useState('')
    const dispatch = useDispatch()
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

    // const handleClearTodos = () => {
    //     AsyncStorage.setItem("storedTodos", JSON.stringify([])).then(() => {
    //         setTodos([])
    //     }).catch(error => console.log(error))
    // }


    // const handleAddTodo = (todo) => {
    //     const newTodos = [todo, ...todos]
    //     AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos)).then(() => {
    //         setTodos(newTodos)
    //         setModalVisible(false)
    //     }).catch(error => console.log(error))
    // }

    const [prayertoBeEdited, setPrayertoBeEdited] = useState(null)

    const handleTriggerEdit = (item) => {
        setPrayertoBeEdited(item)
        setModalVisible(true)
        setPrayerValue(item.prayer);
        setCategoryValue(item.category);
    }

    // const handleEditPrayer = (editedPrayer) => {
    //     dispatch(editedPrayer)
    //     // const newPr = [...todos]
    //     // const todoIndex = todos.findIndex((todo) => todo.key === editedTodo.key)
    //     // newTodos.splice(todoIndex, 1, editedTodo)
    //     // AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos)).then(() => {
    //     //     setTodos(newTodos)
    //     //     setModalVisible(false)
    //     //     setTodoToBeEdited(null)
    //     // }).catch(error => console.log(error))
    // }

    return (
        <Container style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
            <Header
                folderName={folder}
                // todos={todos}
                theme={theme}
                // handleClearTodos={handleClearTodos}
                // clearModalVisible={clearModalVisible}
                // setClearModalVisible={setClearModalVisible}
                navigation={navigation}
            />
            <ListItems
                // theme={theme}
                prayerList={prayerList}
                folder={folder}
                // todos={todos}
                // setTodos={setTodos}
                handleTriggerEdit={handleTriggerEdit}
            />
            <InputModal
                folderName={folder}
                theme={theme}
                prayerValue={prayerValue}
                setPrayerValue={setPrayerValue}
                categoryValue={categoryValue}
                setCategoryValue={setCategoryValue}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                // handleAddTodo={handleAddTodo}
                // // todos={todos}
                prayertoBeEdited={prayertoBeEdited}
                setPrayertoBeEdited={setPrayertoBeEdited}

            />
        </Container>
    )
}

export default Home