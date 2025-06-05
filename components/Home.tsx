//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "nativewind";
import { Animated, Platform, View } from "react-native";
import { useSelector } from "react-redux";

import PrayerBottomModal from "@modals/PrayerBottomModal";
import AntDesign from "@expo/vector-icons/AntDesign";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getMainBackgroundColorStyle } from "@lib/customStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

import InputModal from "../modals/InputModal";
import { PrayerContainer } from "../styles/appStyles";

import Header from "./Header";
import ListItems from "./ListItems";
import { router } from "expo-router";
import AddPrayerModal from "@modals/add-prayer-modal";

const Home = ({
  navigation,
  prayerList,
  folderName,
  oldPrayers,
  setoldPrayer,
  folderId,
}) => {
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const addPrayerBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const theme = useSelector((state) => state.user.theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [prayerTitle, setPrayerTitle] = useState("");
  const [prayerNote, setPrayerNote] = useState("");
  const [opacity, setOpacity] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [extended, setExtended] = useState(true);
  const [taskName, setTaskName] = useState("Add");
  const [selectedEdit, setSelectedEdit] = useState("");
  const [answeredAlready, setAnsweredAlready] = useState("");
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  // const answeredPrayers = useSelector(
  //   (state) => state.answered.answeredPrayers
  // );

  const [prayer, setPrayer] = useState(null);

  const prayerBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const slideUpValue = useRef(new Animated.Value(0)).current;
  const isIOS = Platform.OS === "ios";

  const { current: velocity } = useRef(new Animated.Value(0));

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    if (!isIOS) {
      return velocity.setValue(currentScrollPosition);
    }
    setExtended(currentScrollPosition <= 0);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleOpenBottomModal = () => {
    prayerBottomSheetModalRef.current?.present();
  };

  const handleCloseBottomModal = () => {
    prayerBottomSheetModalRef.current?.close();
  };

  function pickedPrayer(prayer) {
    handleOpenBottomModal();
    setPrayer(prayer);
  }

  const handleAddOldPrayers = (todo) => {
    const newTodos = [todo, ...oldPrayers];
    AsyncStorage.setItem("storedTodos", JSON.stringify(newTodos))
      .then(() => {
        setoldPrayer(newTodos);
        setModalVisible(false);
      })
      .catch((error) => console.log(error));
  };

  const [prayertoBeEdited, setPrayertoBeEdited] = useState(null);

  const handleTriggerEdit = (item) => {
    console.log("prayer to edit:", item);
    setIsEditing(true);
    handleCloseBottomModal();
    setTaskName("Edit");
    setSelectedEdit("");
    setIsBoxVisible(false);
    setPrayertoBeEdited(item);
    // setModalVisible(true);
    addPrayerBottomSheetModalRef.current?.present();
    setPrayerTitle(item.prayer);
    setPrayerNote(item.notes);
  };

  return (
    <>
      <View
        style={getMainBackgroundColorStyle(actualTheme)}
        className="relative h-full"
      >
        <View
          className="flex-1 px-4"
          // pointerEvents={isBoxVisible ? "none" : "auto"}
          // style={{ flex: 1, paddingHorizontal: 15, height: "100%" }}
        >
          <Header
            actualTheme={actualTheme}
            prayer={prayer}
            folderId={folderId}
            folderName={folderName}
            colorScheme={colorScheme}
            theme={theme}
            navigation={navigation}
          />
          <View className="flex-1">
            <ListItems
              prayer={prayer}
              actualTheme={actualTheme}
              colorScheme={colorScheme}
              navigation={navigation}
              prayerList={prayerList}
              pickedPrayer={pickedPrayer}
              answeredAlready={answeredAlready}
              setAnsweredAlready={setAnsweredAlready}
              loading={loading}
              // opacity={opacity}
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
          </View>

          {!prayer && (
            <>
              <InputModal
                addPrayerBottomSheetModalRef={addPrayerBottomSheetModalRef}
                actualTheme={actualTheme}
                colorScheme={colorScheme}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setTaskName={setTaskName}
                taskName={taskName}
                folderName={folderName}
                folderId={folderId}
                animatedValue={velocity}
                extended={extended}
                isIOS={isIOS}
                // isExtended={isExtended}
                theme={theme}
                prayerTitle={prayerTitle}
                setPrayerTitle={setPrayerTitle}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                oldPrayers={oldPrayers}
                handleAddOldPrayers={handleAddOldPrayers}
                prayertoBeEdited={prayertoBeEdited}
                setPrayertoBeEdited={setPrayertoBeEdited}
              />
            </>
          )}
        </View>
      </View>
      <PrayerBottomModal
        handlePresentModalPress={handleOpenBottomModal}
        handleCloseBottomModal={handleCloseBottomModal}
        colorScheme={colorScheme}
        prayer={prayer}
        setPrayer={setPrayer}
        actualTheme={actualTheme}
        prayerBottomSheetModalRef={prayerBottomSheetModalRef}
        setIsEditing={setIsEditing}
        setLoading={setLoading}
        handleTriggerEdit={handleTriggerEdit}
        answeredAlready={answeredAlready}
        // opacity={opacity}
        theme={theme}
        selectedEdit={selectedEdit}
        setSelectedEdit={setSelectedEdit}
        setIsBoxVisible={setIsBoxVisible}
      />
      <AddPrayerModal
        actualTheme={actualTheme}
        colorScheme={colorScheme}
        prayerTitle={prayerTitle}
        prayerNote={prayerNote}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        setTaskName={setTaskName}
        folderName={folderName}
        folderId={folderId}
        setPrayerTitle={setPrayerTitle}
        setPrayerNote={setPrayerNote}
        prayertoBeEdited={prayertoBeEdited}
        setPrayertoBeEdited={setPrayertoBeEdited}
        addPrayerBottomSheetModalRef={addPrayerBottomSheetModalRef}
      />
    </>
  );
};

export default Home;
