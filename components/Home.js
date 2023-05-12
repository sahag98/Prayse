import React, { useRef, useState, useEffect } from "react";
import { Animated, Platform, View } from 'react-native'
import Header from "./Header";
import ListItems from "./ListItems";
import InputModal from './InputModal'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from "react-redux";
import { Container, PrayerContainer } from "../styles/appStyles";
import LottieView from "lottie-react-native";
import { StyleSheet } from "react-native";
import BottomBox from "./BottomBox";

const Home = ({ navigation, prayerList, folderName, oldPrayers, setoldPrayer, folderId }) => {
    const theme = useSelector(state => state.user.theme)
    const fadeAnim = useRef(new Animated.Value(0)).current
    const [modalVisible, setModalVisible] = useState(false)
    const [clearModalVisible, setClearModalVisible] = useState(false)
    const [prayerValue, setPrayerValue] = useState("")
    const [opacity, setOpacity] = useState(new Animated.Value(1));
    const [categoryValue, setCategoryValue] = useState('')
    const [extended, setExtended] = useState(true);
    const [selectedEdit, setSelectedEdit] = useState('')
    const [isBoxVisible, setIsBoxVisible] = useState(false);
    const slideUpValue = useRef(new Animated.Value(0)).current;
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
        setSelectedEdit('')
        setPrayertoBeEdited(item)
        setModalVisible(true)
        setPrayerValue(item.prayer);
        setCategoryValue(item.category);
    }

    return (
        <PrayerContainer onStartShouldSetResponder={() => setSelectedEdit('')} style={theme == 'dark' ? { position: 'relative', backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
            <Animated.View style={{ flex: 1, paddingHorizontal: 15, opacity, height: '100%' }}>
                <Header
                    folderName={folderName}
                    theme={theme}
                    navigation={navigation}
                />
                <ListItems
                    navigation={navigation}
                    prayerList={prayerList}
                    isBoxVisible={isBoxVisible}
                    opacity={opacity}
                    setOpacity={setOpacity}
                    slideUpValue={slideUpValue}
                    setIsBoxVisible={setIsBoxVisible}
                    selectedEdit={selectedEdit}
                    setSelectedEdit={setSelectedEdit}
                    folderName={folderName}
                    folderId={folderId}
                    onScroll={onScroll}
                    handleTriggerEdit={handleTriggerEdit}
                />

                {!isBoxVisible &&
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
                }
            </Animated.View>
            {isBoxVisible &&
                <BottomBox
                    slideUpValue={slideUpValue}
                    isBoxVisible={isBoxVisible}
                    opacity={opacity}
                    theme={theme}
                    selectedEdit={selectedEdit}
                    setSelectedEdit={setSelectedEdit}
                    setIsBoxVisible={setIsBoxVisible}
                />
            }


        </PrayerContainer>
    )
}

export default Home

const styles = StyleSheet.create({
    animation: {
        width: 300,
        height: 300,
        alignSelf: 'center',
    },
})