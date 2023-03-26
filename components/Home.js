import React, { useRef, useState, useEffect } from "react";
import { Animated, Platform, View } from 'react-native'
import Header from "./Header";
import ListItems from "./ListItems";
import InputModal from "./InputModal";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { Container } from "../styles/appStyles";

const Home = ({ navigation, prayerList, folderName, oldPrayers, setoldPrayer, folderId }) => {
    const theme = useSelector(state => state.user.theme)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const [modalVisible, setModalVisible] = useState(false)
    const [clearModalVisible, setClearModalVisible] = useState(false)
    const [prayerValue, setPrayerValue] = useState("")
    const [categoryValue, setCategoryValue] = useState('')
    const [extended, setExtended] = useState(true);
    const dispatch = useDispatch()
    const isIOS = Platform.OS === 'ios'
    const [visible, setVisible] = useState(true)

    const { current: velocity } = useRef(new Animated.Value(0))

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0
        if (!isIOS) {
            return velocity.setValue(currentScrollPosition)
        }
        setExtended(currentScrollPosition <= 0);
    };

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

    const handleAddOldPrayers = (todo) => {
        const newTodos = [todo, ...oldPrayers]
        AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos)).then(() => {
            setoldPrayer(newTodos)
            setModalVisible(false)
        }).catch(error => console.log(error))
    }

    const [prayertoBeEdited, setPrayertoBeEdited] = useState(null)

    const handleTriggerEdit = (item) => {
        setPrayertoBeEdited(item)
        setModalVisible(true)
        setPrayerValue(item.prayer);
        setCategoryValue(item.category);
    }

    return (
        <Container style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
            <Header
                folderName={folderName}
                theme={theme}
                navigation={navigation}
            />
            <ListItems
                navigation={navigation}
                prayerList={prayerList}
                folderName={folderName}
                folderId={folderId}
                onScroll={onScroll}
                handleTriggerEdit={handleTriggerEdit}
            />
            <InputModal
                folderName={folderName}
                folderId={folderId}
                visible={visible}
                animatedValue={velocity}
                extended={extended}
                isIOS={isIOS}
                // isExtended={isExtended}
                theme={theme}
                prayerValue={prayerValue}
                setPrayerValue={setPrayerValue}
                categoryValue={categoryValue}
                setCategoryValue={setCategoryValue}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                oldPrayers={oldPrayers}
                handleAddOldPrayers={handleAddOldPrayers}
                prayertoBeEdited={prayertoBeEdited}
                setPrayertoBeEdited={setPrayertoBeEdited}
            />
        </Container>
    )
}

export default Home