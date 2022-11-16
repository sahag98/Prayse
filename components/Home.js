import React, { useRef, useState, useEffect } from "react";
import { Animated, View } from 'react-native'
import Header from "./Header";
import ListItems from "./ListItems";
import InputModal from "./InputModal";
import FolderModal from "./FolderModal"

import AsyncStorage from '@react-native-async-storage/async-storage';
import ListFolders from "./ListFolders";


const Home = ({ theme, todos, setTodos }) => {

    const fadeAnim = useRef(new Animated.Value(0)).current
    const [modalVisible, setModalVisible] = useState(false)
    const [clearModalVisible, setClearModalVisible] = useState(false)
    const [filterModalVisible, setFilterModalVisible] = useState(false)
    const [todoInputValue, setTodoInputValue] = useState('')
    const [categoryValue, setCategoryValue] = useState('')
    const [folderName, setFolderName] = useState('')
    const [filter, setFilter] = useState('None')

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

    const handleClearTodos = () => {
        AsyncStorage.setItem("storedTodos", JSON.stringify([])).then(() => {
            setTodos([])
        }).catch(error => console.log(error))
    }

    const handleAddTodo = (todo) => {
        const newTodos = [...todos, todo]
        AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos)).then(() => {
            setTodos(newTodos)
            setModalVisible(false)
        }).catch(error => console.log(error))
    }

    const [todoToBeEdited, setTodoToBeEdited] = useState(null)

    const handleTriggerEdit = (item) => {
        setTodoToBeEdited(item)
        setModalVisible(true)
        setTodoInputValue(item.title);
        setCategoryValue(item.category);
    }

    const handleEditTodo = (editedTodo) => {
        const newTodos = [...todos]
        const todoIndex = todos.findIndex((todo) => todo.key === editedTodo.key)
        newTodos.splice(todoIndex, 1, editedTodo)
        AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos)).then(() => {
            setTodos(newTodos)
            setModalVisible(false)
            setTodoToBeEdited(null)
        }).catch(error => console.log(error))
    }

    return (
        <>
            <Header
                todos={todos}
                theme={theme}
                handleClearTodos={handleClearTodos}
                clearModalVisible={clearModalVisible}
                setClearModalVisible={setClearModalVisible}
                filterModalVisible={filterModalVisible}
                setFilterModalVisible={setFilterModalVisible}
                filter={filter}
                setFilter={setFilter}
                categoryValue={categoryValue}
                setCategoryValue={setCategoryValue}
            />
            <ListItems
                theme={theme}
                todos={todos}
                setTodos={setTodos}
                handleTriggerEdit={handleTriggerEdit}
                filter={filter}
                setFilter={setFilter}
            />
            <InputModal
                theme={theme}
                todoInputValue={todoInputValue}
                setTodoInputValue={setTodoInputValue}
                categoryValue={categoryValue}
                setCategoryValue={setCategoryValue}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleAddTodo={handleAddTodo}
                todos={todos}
                todoToBeEdited={todoToBeEdited}
                setTodoToBeEdited={setTodoToBeEdited}
                handleEditTodo={handleEditTodo}
            />
        </>
    )
}

export default Home