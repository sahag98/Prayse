import React, { useState, } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
    ListView,
    TodoText,
    TodoDate,
    TodoCategory,
} from '../styles/appStyles';
import { useFonts } from 'expo-font'
import { Feather } from '@expo/vector-icons'
import AppLoading from 'expo-app-loading';
import { Motion } from "@legendapp/motion"
import CategoryTabs from './CategoryTabs';
import SearchBar from './SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { deletePrayer } from '../redux/prayerReducer';

const ListItems = ({ prayerList, onScroll, folderId, handleTriggerEdit }) => {
    const theme = useSelector(state => state.user.theme)
    const dispatch = useDispatch()
    let [fontsLoaded] = useFonts({
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    })

    const prayers = prayerList.filter((item) => item.folderId === folderId)
    const [search, setSearch] = useState('')
    const size = useSelector(state => state.user.fontSize)


    let value = 0

    const handleDelete = (prayer) => {
        dispatch(deletePrayer(prayer))
    }

    const All = "All";
    const General = "General";
    const People = "People";
    const Personal = "Personal";
    const Praise = "Praise";
    const Other = "Other";

    const selected = [All, General, People, Personal, Praise, Other]
    const [status, setStatus] = useState(selected[0])

    const filteredList = prayers.filter(item => item.category === status)
        .filter((item) => search !== "" ?
            (item.prayer).includes(search) : true
        )


    const list = prayers.filter((item) => search !== "" ? (item.prayer).includes(search) : true)

    const renderItem = ({ item, index }) => {
        const RowText = TodoText;
        const categoryItem = item.category;
        return (
            <>

                <Motion.View initial={{ y: -50 }}
                    animate={{ x: value * 100, y: 0 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ y: 20 }}
                    transition={{ type: "spring" }}>
                    <ListView
                        style={theme == 'dark' ? [styles.elevationDark, { backgroundColor: '#212121' }] : [styles.elevation, { backgroundColor: '#93D8F8' }]}
                        underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'}
                        onPress={() => { handleTriggerEdit(item) }}
                    >
                        <>

                            <View
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <RowText
                                    style={theme == 'dark' ? { paddingRight: 12, fontFamily: 'Inter-Regular', color: 'white', fontSize: size } : { fontFamily: 'Inter-Regular', color: '#2F2D51', fontSize: size }}>
                                    {item.prayer}
                                </RowText>
                                {search.length == 0 && <TouchableOpacity style={{ paddingBottom: 10 }} onPress={() => handleDelete(item.id)} >
                                    <Feather name='x' size={28} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                </TouchableOpacity>}

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
            </>
        )
    }

    if (!fontsLoaded) {
        return <AppLoading />
    }


    return (
        <>
            {prayers.length == 0 && <TodoText style={theme == 'dark' ? styles.pressDark : styles.press}>Add a prayer to start off your prayer list!</TodoText>}
            <CategoryTabs
                theme={theme}
                prayerList={prayers}
                selected={selected}
                status={status} setStatus={setStatus}
            />

            {prayers.length != 0 &&
                <>
                    <SearchBar theme={theme} search={search} setSearch={setSearch} />
                    <FlatList
                        data={status == 'All' ? list : filteredList}
                        keyExtractor={(e, i) => i.toString()}
                        onEndReachedThreshold={0}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        onScroll={onScroll}
                        renderItem={renderItem}
                    />
                </>
            }
        </>
    );
}


export default ListItems;

const styles = StyleSheet.create({


    TodoCategory: {
        backgroundColor: '#121212',
        marginTop: 10,
        borderRadius: 50,
        padding: 5,
        fontSize: 9,
        color: 'white',
        textAlign: 'left',
    },
    elevationDark: {
        shadowColor: '#040404',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 7,
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
        fontFamily: 'Inter-Regular',
        color: '#2F2D51'
    },
    pressDark: {
        fontFamily: 'Inter-Regular',
        color: 'white'
    }
})

