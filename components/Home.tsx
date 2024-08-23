//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "nativewind";
import { Animated, Platform } from "react-native";
import { useSelector } from "react-redux";

import PrayerBottomModal from "@modals/PrayerBottomModal";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { getMainBackgroundColorStyle } from "@lib/customStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

import InputModal from "../modals/InputModal";
import { PrayerContainer } from "../styles/appStyles";

import Header from "./Header";
import ListItems from "./ListItems";

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
  const theme = useSelector((state) => state.user.theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [prayerValue, setPrayerValue] = useState("");
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
    setModalVisible(true);
    setPrayerValue(item.prayer);
  };

  return (
    <PrayerContainer
      style={getMainBackgroundColorStyle(actualTheme)}
      className="relative bg-light-background dark:bg-dark-background"
    >
      <Animated.View
        pointerEvents={isBoxVisible ? "none" : "auto"}
        style={
          isBoxVisible
            ? { paddingHorizontal: 15, opacity }
            : { flex: 1, paddingHorizontal: 15, opacity, height: "100%" }
        }
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
          opacity={opacity}
          theme={theme}
          selectedEdit={selectedEdit}
          setSelectedEdit={setSelectedEdit}
          setIsBoxVisible={setIsBoxVisible}
        />
        {!prayer && (
          <InputModal
            actualTheme={actualTheme}
            colorScheme={colorScheme}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setTaskName={setTaskName}
            taskName={taskName}
            folderName={folderName}
            folderId={folderId}
            xwxx
            animatedValue={velocity}
            extended={extended}
            isIOS={isIOS}
            // isExtended={isExtended}
            theme={theme}
            prayerValue={prayerValue}
            setPrayerValue={setPrayerValue}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            oldPrayers={oldPrayers}
            handleAddOldPrayers={handleAddOldPrayers}
            prayertoBeEdited={prayertoBeEdited}
            setPrayertoBeEdited={setPrayertoBeEdited}
          />
        )}
      </Animated.View>
      {/* {isBoxVisible && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            bottom: 0,
            zIndex: 99,
            width: "100%",
            height: "40%",
          }}
        >
          <BottomBox
            slideUpValue={slideUpValue}
            isBoxVisible={isBoxVisible}
            opacity={opacity}
            answeredAlready={answeredAlready}
            handleTriggerEdit={handleTriggerEdit}
            setAnsweredAlready={setAnsweredAlready}
            setLoading={setLoading}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            theme={theme}
            selectedEdit={selectedEdit}
            setSelectedEdit={setSelectedEdit}
            setIsBoxVisible={setIsBoxVisible}
          />
        </View>
      )} */}
    </PrayerContainer>
  );
};

export default Home;
