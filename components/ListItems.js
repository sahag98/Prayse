import React, { useState, } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import {
    ListView,
    TodoText,
    TodoDate,
    TodoCategory,
} from '../styles/appStyles';
import { useFonts } from 'expo-font'
import { Feather, Entypo } from '@expo/vector-icons'
import AppLoading from 'expo-app-loading';
import { Motion } from "@legendapp/motion"
import CategoryTabs from './CategoryTabs';
import SearchBar from './SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { deletePrayer, addToAnsweredPrayer, deleteAnsweredPrayers, removeAnsweredPrayer } from '../redux/prayerReducer';
import { Divider } from 'react-native-paper';

const ListItems = ({ prayerList, onScroll, folderId, handleTriggerEdit }) => {
    const theme = useSelector(state => state.user.theme)
    const answered = useSelector(state => state.prayer.answeredPrayers)
    const [answeredAlready, setAnsweredAlready] = useState('')
    console.log(answered)
    const [openMore, setOpenMore] = useState(false)
    const [selectedEdit, setSelectedEdit] = useState('')
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
        setSelectedEdit('')
    }

    const handleAddToAnsweredPrayer = (prayer) => {
        dispatch(addToAnsweredPrayer(prayer))
        setAnsweredAlready(prayer.id)
        setSelectedEdit('')
    }

    // const handleRemoveAnsweredPrayer = (prayer) => {
    //     dispatch(removeAnsweredPrayer(prayer))
    //     setAnsweredAlready(prayer.id)
    // }

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
                        style={theme == 'dark' ? [styles.elevationDark, { backgroundColor: '#212121', position: 'relative' }] : [styles.elevation, { backgroundColor: '#93D8F8' }]}
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
                            </View>
                            {search.length == 0 &&
                                <TouchableOpacity onPress={() => setSelectedEdit(item.id)} style={{ position: 'absolute', top: 9, right: 3 }}>
                                    <Entypo name="dots-three-vertical" size={20} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                </TouchableOpacity>
                                // <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5 }}
                                //     onPress={() => handleDelete(item.id)} >
                                //     <Feather name='x' size={26} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                // </TouchableOpacity>
                            }
                            {selectedEdit == item.id &&
                                <View style={styles.editContainer}>
                                    <View style={{ position: 'relative', padding: 10, justifyContent: 'space-evenly', height: '100%' }}>
                                        <TouchableOpacity style={{ alignSelf: 'flex-end', position: 'absolute', top: 9, padding: 2, zIndex: 99, right: 3 }} onPress={() => setSelectedEdit('')}>
                                            <Entypo name="dots-three-vertical" size={20} color={theme == 'dark' ? 'white' : '#2F2D51'} />
                                        </TouchableOpacity>
                                        <TouchableHighlight underlayColor={'#212121'} style={{ width: '100%', height: '50%', padding: 5, justifyContent: 'center', borderRadius: 5 }} onPress={() => handleDelete(item.id)}>
                                            <Text style={{ color: '#ff6666', fontFamily: 'Inter-Medium' }}>Delete prayer</Text>
                                        </TouchableHighlight>
                                        <Divider style={{ marginVertical: 5, backgroundColor: '#f0f0f0' }} />
                                        {answeredAlready != item.id &&
                                            <TouchableHighlight underlayColor={'#212121'} style={{ width: '100%', height: '50%', padding: 5, borderRadius: 5, justifyContent: 'center' }} onPress={() => handleAddToAnsweredPrayer(item)}>
                                                <Text style={{ color: '#66b266', fontFamily: 'Inter-Medium' }}>Mark as answered</Text>
                                            </TouchableHighlight>
                                        }
                                        {answeredAlready == item.id &&
                                            <TouchableHighlight disabled={true} underlayColor={'#212121'} style={{ width: '100%', height: '50%', padding: 5, borderRadius: 5, justifyContent: 'center' }} onPress={() => handleAddToAnsweredPrayer(item)}>
                                                <Text style={{ color: '#66b266', fontFamily: 'Inter-Medium' }}>Already marked</Text>
                                            </TouchableHighlight>
                                        }
                                    </View>
                                </View>
                            }
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                {categoryItem == "General" &&
                                    <TodoCategory
                                        style={theme == 'dark' ? { borderRadius: 20, backgroundColor: '#FFDAA5' } : { borderRadius: 20, backgroundColor: '#FFBF65' }} >
                                        <Text style={theme == 'dark' ? { fontSize: 11, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 10, fontFamily: 'Inter-Medium', color: 'black' }} >
                                            {item.category}
                                        </Text>
                                    </TodoCategory>
                                }
                                {categoryItem == "People" &&
                                    <TodoCategory
                                        style={theme == 'dark' ? { backgroundColor: '#A5C9FF', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#6B7EFF', fontFamily: 'Inter-Regular', color: 'white' }} >
                                        <Text style={theme == 'dark' ? { fontSize: 11, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 11, fontFamily: 'Inter-Medium', color: 'white' }}>
                                            {item.category}
                                        </Text>
                                    </TodoCategory>
                                }
                                {categoryItem == "Praise" &&
                                    <TodoCategory
                                        style={theme == 'dark' ? { backgroundColor: '#A5FFC9', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#65FFA2', fontFamily: 'Inter-Regular', color: 'white' }} >
                                        <Text style={theme == 'dark' ? { fontSize: 11, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 11, fontFamily: 'Inter-Medium', color: '#2F2D51' }} >
                                            {item.category}
                                        </Text>
                                    </TodoCategory>
                                }
                                {categoryItem == "Personal" &&
                                    <TodoCategory
                                        style={theme == 'dark' ? { backgroundColor: '#FFB2B2', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#FF5858', fontFamily: 'Inter-Regular', color: 'white' }} >
                                        <Text style={theme == 'dark' ? { fontSize: 11, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 11, fontFamily: 'Inter-Medium', color: 'white' }} >
                                            {item.category}
                                        </Text>
                                    </TodoCategory>
                                }
                                {categoryItem == "Other" &&
                                    <TodoCategory
                                        style={theme == 'dark' ? { backgroundColor: 'white', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: 'white', fontFamily: 'Inter-Regular', color: 'white' }} >
                                        <Text style={theme == 'dark' ? { fontSize: 11, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 11, fontFamily: 'Inter-Medium', color: 'black' }} >
                                            {item.category}
                                        </Text>
                                    </TodoCategory>
                                }
                                {categoryItem == "None" &&
                                    <TodoCategory
                                        style={theme == 'dark' ? { borderRadius: 20, backgroundColor: '#8C8C8C', fontFamily: 'Inter-Medium', color: 'black' } : { backgroundColor: '#2F2D51', fontFamily: 'Inter-Regular', color: 'white' }} >
                                        <Text style={theme == 'dark' ? { fontSize: 11, fontFamily: 'Inter-Medium', color: 'black' } : { fontSize: 11, fontFamily: 'Inter-Medium', color: 'white' }} >
                                            {item.category}
                                        </Text>
                                    </TodoCategory>
                                }
                                <TodoDate
                                    style={theme == 'dark' ? { color: '#8C8C8C', fontFamily: 'Inter-Regular' } : { color: '#4e4a8a', fontFamily: 'Inter-Regular' }}>
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

    editContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#3b3b3b',
        zIndex: 99,
        width: '60%',
        height: '150%',
        borderRadius: 5
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
    elevationDark: {
        shadowColor: '#040404',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    elevation: {
        shadowColor: '#13588c',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
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

