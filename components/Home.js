import React, { useRef, useState, useEffect } from "react";
import { Animated, Platform, View } from "react-native";
import Header from "./Header";
import ListItems from "./ListItems";
import InputModal from "./InputModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { Container, PrayerContainer } from "../styles/appStyles";
import { StyleSheet } from "react-native";
import BottomBox from "./BottomBox";

const Home = ({
  navigation,
  prayerList,
  folderName,
  oldPrayers,
  setoldPrayer,
  folderId,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [prayerValue, setPrayerValue] = useState("");
  const [opacity, setOpacity] = useState(new Animated.Value(1));
  const [categoryValue, setCategoryValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [extended, setExtended] = useState(true);
  const [taskName, setTaskName] = useState("Add");
  const [selectedEdit, setSelectedEdit] = useState("");
  const [answeredAlready, setAnsweredAlready] = useState("");
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const answeredPrayers = useSelector(
    (state) => state.answered.answeredPrayers
  );
  const slideUpValue = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const isIOS = Platform.OS === "ios";
  const [visible, setVisible] = useState(true);
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

  function pickedPrayer(prayer) {
    Animated.timing(opacity, {
      toValue: 0.5,
      duration: 500, // in milliseconds
      useNativeDriver: true,
    }).start();
    setSelectedEdit(prayer);
    handleButtonClick();
    if (
      answeredPrayers?.some(
        (item) =>
          item.prayer.id === prayer.id && item.prayer.prayer === prayer.prayer
      )
    ) {
      setAnsweredAlready(prayer.id);
    } else {
      setAnsweredAlready("");
    }
  }
  const handleButtonClick = () => {
    setIsBoxVisible(true);
    Animated.timing(slideUpValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

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
  const [categorytoBeEdited, setCategorytoBeEdited] = useState(null);

  const handleTriggerEdit = (item) => {
    setIsEditing(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500, // in milliseconds
      useNativeDriver: true,
    }).start();
    setTaskName("Edit");
    setSelectedEdit("");
    setIsBoxVisible(false);
    setPrayertoBeEdited(item);
    setModalVisible(true);
    setPrayerValue(item.prayer);
    setCategoryValue(item.category);
  };

  return (
    <PrayerContainer
      style={
        theme == "dark"
          ? { position: "relative", backgroundColor: "" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <Animated.View
        pointerEvents={isBoxVisible ? "none" : "auto"}
        style={
          isBoxVisible
            ? { paddingHorizontal: 15, opacity }
            : { flex: 1, paddingHorizontal: 15, opacity, height: "100%" }
        }
      >
        <Header folderName={folderName} theme={theme} navigation={navigation} />
        <ListItems
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

        {!isBoxVisible && (
          <InputModal
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            setTaskName={setTaskName}
            taskName={taskName}
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
            categorytoBeEdited={categorytoBeEdited}
            setCategorytoBeEdited={setCategorytoBeEdited}
          />
        )}
      </Animated.View>
      {isBoxVisible && (
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
      )}
    </PrayerContainer>
  );
};

export default Home;

const styles = StyleSheet.create({
  animation: {
    width: 300,
    height: 300,
    alignSelf: "center",
  },
});
