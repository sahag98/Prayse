import React, { useState, useRef, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import {
    ListView,
    TodoText,
    TodoDate,
    SwipedTodoText,
    TodoCategory,
    ListContainer
} from '../styles/appStyles';
import { useFonts } from 'expo-font'
import { Feather } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';
import { LinearGradient } from 'expo-linear-gradient';
import { Motion } from "@legendapp/motion"


const ListItems = ({ filteredData, setFilteredData, filter, setFilter, theme, todos, setTodos, handleTriggerEdit }) => {

    let [fontsLoaded] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    })
    const [search, setSearch] = useState('')

    const filters = [
        {
            value: 'All'
        },
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

    let value = 0



    const searchFilter = (text) => {
        if (text) {
            const newData = todos.filter((item) => {
                const itemData = item.title ? item.title.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })
            setFilteredData(newData)
            setSearch(text)
        } else {
            setFilteredData(todos)
            setSearch(text)
        }
    }

    const clearInput = () => {
        setSearch('')
    }

    const [status, setStatus] = useState('All')

    const setStatusFilter = (status) => {
        if (status !== 'All') {
            setFilter(status)
        }
        else {
            setFilter('None')
        }

        setStatus(status)
    }


    const handleDeleteTodo = (rowMap, rowKey) => {
        if (search.length != 0) {
            const newfilter = [...filteredData]
            const newTodos = [...todos]
            const todoIndex = todos.findIndex((todo) => todo.key === rowKey)
            newTodos.splice(todoIndex, 1)
            const filterIndex = filteredData.findIndex((todo) => todo.key === rowKey)
            newfilter.splice(filterIndex, 1)

            AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos)).then(() => {
                setTodos(newTodos)
                setFilteredData(newfilter)
            }).catch(error => console.log(error))
        }
        else {
            const newTodos = [...todos]
            const todoIndex = todos.findIndex((todo) => todo.key === rowKey)
            newTodos.splice(todoIndex, 1)

            AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos)).then(() => {
                setTodos(newTodos)
            }).catch(error => console.log(error))
        }

    }

    const renderItem = ({ item, index }) => {
        const RowText = TodoText;
        const categoryItem = item.category;
        return (
            <>

                {filter == 'General' && item.category == 'General' && search == 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                            onPress={() => { handleTriggerEdit(item) }}
                        >
                            <>

                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "General" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { borderRadius: 20, backgroundColor: '#FFDAA5' } : { borderRadius: 20, backgroundColor: '#FFBF65' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'General' && item.category == 'General' && search != 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}

                        >
                            <>

                                <View
                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "General" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { borderRadius: 20, backgroundColor: '#FFDAA5' } : { borderRadius: 20, backgroundColor: '#FFBF65' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'People' && item.category == 'People' && search == 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                            onPress={() => { handleTriggerEdit(item) }}
                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "People" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#A5C9FF', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#6B7EFF', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }}>
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'People' && item.category == 'People' && search != 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}

                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "People" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#A5C9FF', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#6B7EFF', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }}>
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'Other' && item.category == 'Other' && search == 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                            onPress={() => { handleTriggerEdit(item) }}
                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "Other" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: 'white', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: 'white', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }

                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'Other' && item.category == 'Other' && search != 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                        // onPress={() => { handleTriggerEdit(item) }}
                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "Other" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: 'white', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: 'white', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }

                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'Personal' && item.category == 'Personal' && search == 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                            onPress={() => { handleTriggerEdit(item) }}
                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "Personal" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#FFB2B2', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#FF5858', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'Personal' && item.category == 'Personal' && search != 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}

                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "Personal" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#FFB2B2', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#FF5858', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'Praise' && item.category == 'Praise' && search == 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                            onPress={() => { handleTriggerEdit(item) }}
                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "Praise" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#A5FFC9', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#65FFA2', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: '#2F2D51' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'Praise' && item.category == 'Praise' && search != 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}

                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    {categoryItem == "Praise" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#A5FFC9', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#65FFA2', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: '#2F2D51' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'None' && search == 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                            onPress={() => { handleTriggerEdit(item) }}
                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {categoryItem == "General" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { borderRadius: 20, backgroundColor: '#FFDAA5' } : { borderRadius: 20, backgroundColor: '#FFBF65' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "People" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#A5C9FF', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#6B7EFF', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }}>
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "Praise" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#A5FFC9', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#65FFA2', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: '#2F2D51' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "Personal" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#FFB2B2', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#FF5858', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "Other" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: 'white', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: 'white', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "None" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { borderRadius: 20, backgroundColor: '#8C8C8C', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#2F2D51', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
                {filter == 'None' && search.length != 0 &&
                    <Motion.View initial={{ y: -50 }}
                        animate={{ x: value * 100, y: 0 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ y: 20 }}
                        transition={{ type: "spring" }}>
                        <ListView
                            style={theme == 'dark' ? { backgroundColor: '#212121' } : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                            underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                        // onPress={() => { handleTriggerEdit(item) }}
                        >
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <RowText
                                        style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: 15 } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: 15 }}>
                                        {item.title}
                                    </RowText>
                                    <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDeleteTodo(RowText, item.key)}>
                                        <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {categoryItem == "General" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { borderRadius: 20, backgroundColor: '#FFDAA5' } : { borderRadius: 20, backgroundColor: '#FFBF65' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "People" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#A5C9FF', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#6B7EFF', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }}>
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "Praise" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#A5FFC9', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#65FFA2', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: '#2F2D51' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "Personal" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: '#FFB2B2', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#FF5858', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "Other" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { backgroundColor: 'white', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: 'white', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    {categoryItem == "None" &&
                                        <TodoCategory
                                            style={theme == 'dark' ? { borderRadius: 20, backgroundColor: '#8C8C8C', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#2F2D51', fontFamily: 'Inter-Regular', color: 'white' }} >
                                            <Text style={theme == 'dark' ? { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'white' }} >
                                                {item.category}
                                            </Text>
                                        </TodoCategory>
                                    }
                                    <TodoDate
                                        style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Light' } : { color: '#4e4a8a', fontFamily: 'Inter-Light' }}>
                                        {item.date}
                                    </TodoDate>
                                </View>
                            </>
                        </ListView>
                    </Motion.View>
                }
            </>
        )
    }

    if (!fontsLoaded) {
        return <AppLoading />
    }

    return (
        <>
            {todos.length == 0 && <TodoText style={theme == 'dark' ? styles.pressDark : styles.press}> Press the + button to add a prayer.</TodoText>}
            {todos.length != 0 &&
                <View>
                    <ScrollView horizontal={true} contentContainerStyle={styles.tab}>
                        {filters.map(e => (
                            <TouchableOpacity
                                onPress={() => setStatusFilter(e.value)}
                                style={theme == 'dark' ? [styles.btnTabDark, status === e.value && styles.btnActiveDark] : [styles.btnTab, status === e.value && styles.btnActive]}
                            >
                                <Text
                                    style={theme == 'dark' ? [styles.textTabDark, status === e.value && styles.textTabActiveDark] : [styles.textTab, status === e.value && styles.textTabActive]}>
                                    {e.value}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

            }

            {todos.length != 0 &&
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TextInput
                            style={styles.textInputStyle}
                            value={search}
                            placeholder='Search prayers...'
                            placeholderTextColor={theme == 'light' && '#2f2d51'}
                            onChangeText={(text) => searchFilter(text)}
                        />
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Text style={theme == 'dark' ? { fontFamily: 'Inter-Medium', paddingRight: 10, color: 'white' } : { fontFamily: 'Inter-Medium', paddingRight: 10, color: '#2f2d51' }}>Clear</Text>
                        </TouchableOpacity>
                    </View>
                    <SwipeListView
                        data={search.length == 0 ? todos : filteredData}
                        keyExtractor={(e, i) => i.toString()}
                        renderItem={renderItem}

                    />
                </>
            }
        </>
    );
}


export default ListItems;

const styles = StyleSheet.create({

    textInputStyle: {
        width: '80%',
        height: 40,
        fontSize: 12,
        borderWidth: 1,
        paddingLeft: 10,
        marginTop: 5,
        marginBottom: 10,
        borderColor: 'white',
        backgroundColor: 'white',
        borderRadius: 5,
    },

    tab: {
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    btnTab: {
        backgroundColor: 'white',
        padding: 5,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginHorizontal: 5
    },

    btnTabDark: {
        backgroundColor: '#212121',
        padding: 5,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginHorizontal: 5
    },

    textTab: {
        color: 'black',
        fontSize: 13
    },

    textTabDark: {
        color: 'white',
        fontSize: 13
    },

    btnActive: {
        backgroundColor: '#2F2D51'
    },

    btnActiveDark: {
        backgroundColor: 'white'
    },

    TodoCategory: {
        backgroundColor: '#121212',
        marginTop: 10,
        borderRadius: 50,
        padding: 5,
        fontSize: 9,
        color: 'white',
        textAlign: 'left',
    },

    textTabActive: {
        color: 'white'
    },

    textTabActiveDark: {
        color: 'black'
    },
    elevation: {
        shadowColor: '#13588c',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
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

