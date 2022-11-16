import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
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


const ListItems = ({ filter, setFilter, theme, todos, setTodos, handleTriggerEdit }) => {

    let [fontsLoaded] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    })

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

    const [status, setStatus] = useState('All')
    const [swipedRow, setSwipedRow] = useState(null)
    const [datalist, setDatalist] = useState(todos)

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
        const newTodos = [...todos]
        const todoIndex = todos.findIndex((todo) => todo.key === rowKey)
        newTodos.splice(todoIndex, 1)

        AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos)).then(() => {
            setTodos(newTodos)
        }).catch(error => console.log(error))
    }

    const renderItem = ({ item, index }) => {
        const RowText = item.key == swipedRow ? SwipedTodoText : TodoText;
        const categoryItem = item.category;
        return (
            <>
                {filter == 'General' && item.category == 'General' &&
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
                {filter == 'People' && item.category == 'People' &&
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
                {filter == 'Other' && item.category == 'Other' &&
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
                {filter == 'Personal' && item.category == 'Personal' &&
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
                {filter == 'Praise' && item.category == 'Praise' &&
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
                {filter == 'None' &&
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
                <SwipeListView
                    data={todos}
                    keyExtractor={(e, i) => i.toString()}
                    renderItem={renderItem}

                />
            }
        </>
    );
}


export default ListItems;

const styles = StyleSheet.create({

    tab: {
        height: 40,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
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

