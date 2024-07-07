import React, { useEffect, useRef, useState } from "react";
import { useFonts } from "expo-font";
import {
  Animated,
  FlatList,
  Platform,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AnimatedFAB } from "react-native-paper";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AddFolderModal from "../modals/AddFolderModal";
import { addFolder } from "../redux/folderReducer";
import { OLD_PRAYER_SCREEN, PRAYER_ROOM_SCREEN } from "../routes";
import { HeaderTitle, ListView2, TodoText } from "../styles/appStyles";

import AnsweredPrayer from "./AnsweredPrayer";
import FolderItem from "./FolderItem";

const Folder = ({ colorScheme, navigation, todos }) => {
  const theme = useSelector((state) => state.user.theme);
  const folders = useSelector((state) => state.folder.folders);
  const answeredPrayers = useSelector(
    (state) => state.answered.answeredPrayers
  );
  const [open, setOpen] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderClicked, setFolderClicked] = useState(true);
  const [isExtended, setIsExtended] = useState(true);
  const [idToDelete, setIdToDelete] = useState(null);
  const [extended, setExtended] = useState(true);
  const isIOS = Platform.OS === "ios";
  const [fabvisible, setFabvisible] = useState(true);
  const { current: velocity } = useRef(new Animated.Value(0));
  const sections = [];

  const [showNewBadge, setShowNewBadge] = useState(false);

  useEffect(() => {
    const checkFirstTime = async () => {
      // await AsyncStorage.removeItem("hasPressedPrayerTab");
      try {
        const value = await AsyncStorage.getItem("hasPressedChecklist");
        if (value === null) {
          // First time pressing the "Prayer" tab
          setShowNewBadge(true);
          AsyncStorage.setItem("hasPressedChecklist", "true");
        }
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
      }
    };

    checkFirstTime();
  }, []);

  useEffect(() => {
    if (!isIOS) {
      velocity.addListener(({ value }) => {
        setIsExtended(value <= 0);
      });
    } else setIsExtended(extended);
  }, [velocity, extended, isIOS]);

  answeredPrayers?.forEach((prayer) => {
    const date = prayer.answeredDate;
    const sectionIndex = sections.findIndex(
      (section) => section.title === date
    );
    if (sectionIndex === -1) {
      sections.push({
        title: date,
        data: [prayer],
      });
    } else {
      sections[sectionIndex].data.push(prayer);
    }
  });

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    if (!isIOS) {
      return velocity.setValue(currentScrollPosition);
    }
    setExtended(currentScrollPosition <= 0);
  };
  const [fontsLoaded] = useFonts({
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
  });

  const dispatch = useDispatch();
  const handleCloseModal = () => {
    setAddVisible(false);
    setOpen(false);
    setFolderName("");
  };

  function goToOrignalPrayer() {
    navigation.navigate(OLD_PRAYER_SCREEN);
  }

  function addNewFolder() {
    dispatch(
      addFolder({
        id: uuid.v4(),
        name: folderName,
        prayers: [],
      })
    );
    setTimeout(() => {
      setAddVisible(false);
      setFolderName("");
    }, 0);
    // setAddVisible(false);
    // setFolderName("");
  }

  const renderSectionHeader = ({ section }) => {
    return (
      <View>
        <Text className="font-inter font-medium text-lg mb-2 dark:text-[#bebebe] text-[#36345e]">
          {section.title}
        </Text>
      </View>
    );
  };

  const renderAnsweredPrayers = ({ item }) => {
    return <AnsweredPrayer item={item} theme={theme} />;
  };

  const renderItem = ({ item }) => {
    return (
      <FolderItem
        colorScheme={colorScheme}
        item={item}
        theme={theme}
        navigation={navigation}
        open={open}
        setOpen={setOpen}
        idToDelete={idToDelete}
        setIdToDelete={setIdToDelete}
      />
    );
  };

  return (
    <View className="relative flex-1">
      <View className="my-4 flex-row justify-between items-center">
        {folderClicked ? (
          <TouchableOpacity
            className="w-1/2 dark:bg-[#3b3b3b] bg-[#d1e3ff] justify-center items-center rounded-xl py-3"
            onPress={() => setFolderClicked(true)}
          >
            <HeaderTitle
              style={
                colorScheme === "dark"
                  ? { fontFamily: "Inter-Bold", fontSize: 18, color: "white" }
                  : { fontFamily: "Inter-Bold", fontSize: 18, color: "#2F2D51" }
              }
            >
              Prayer Folders
            </HeaderTitle>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="w-1/2 rounded-xl py-3 items-center justify-center"
            onPress={() => setFolderClicked(true)}
          >
            <HeaderTitle
              style={
                colorScheme === "dark"
                  ? { fontFamily: "Inter-Bold", fontSize: 18, color: "#979797" }
                  : { fontFamily: "Inter-Bold", fontSize: 18, color: "#2F2D51" }
              }
            >
              Prayer Folders
            </HeaderTitle>
          </TouchableOpacity>
        )}
        {folderClicked ? (
          <TouchableOpacity
            className="w-1/2 items-center"
            onPress={() => setFolderClicked(false)}
          >
            <HeaderTitle
              style={
                colorScheme === "dark"
                  ? { fontFamily: "Inter-Bold", fontSize: 18, color: "#979797" }
                  : { fontFamily: "Inter-Bold", fontSize: 18, color: "#2F2D51" }
              }
            >
              Answered
            </HeaderTitle>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="w-1/2 dark:bg-[#3b3b3b] bg-[#d1e3ff] justify-center items-center rounded-xl py-3"
            onPress={() => setFolderClicked(false)}
          >
            <HeaderTitle
              style={
                colorScheme === "dark"
                  ? {
                      fontFamily: "Inter-Bold",
                      fontSize: 18,
                      color: "white",
                    }
                  : { fontFamily: "Inter-Bold", fontSize: 18, color: "#2F2D51" }
              }
            >
              Answered
            </HeaderTitle>
          </TouchableOpacity>
        )}
      </View>
      {todos.length !== 0 && folderClicked && (
        <ListView2
          style={
            theme === "dark"
              ? [styles.elevationDark, { backgroundColor: "#212121" }]
              : theme === "BlackWhite"
                ? [styles.elevationDark, { backgroundColor: "black" }]
                : [styles.elevation, { backgroundColor: "#2f2d51" }]
          }
          underlayColor={theme === "dark" ? "#121212" : "#F2F7FF"}
          onPress={goToOrignalPrayer}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{ color: "white", fontFamily: "Inter-Bold", fontSize: 15 }}
            >
              Original Prayers
            </Text>
            <AntDesign name="right" size={24} color="white" />
          </View>
        </ListView2>
      )}
      {folders.length === 0 && folderClicked && (
        <View className="flex-1 justify-center items-center mt-28">
          <AntDesign
            name="folder1"
            size={60}
            color={colorScheme === "dark" ? "#e8bb4e" : "#2f2d51"}
          />
          <TodoText
            style={colorScheme === "dark" ? styles.pressDark : styles.press}
          >
            Create a prayer folder.
          </TodoText>
          <Text className="font-inter dark:text-[#d2d2d2] text-[#2f2d51]">
            (These folders are only visible to you.)
          </Text>
        </View>
      )}
      {folderClicked && (
        <>
          <FlatList
            data={folders}
            keyExtractor={(item) => item.id}
            onEndReachedThreshold={0}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            windowSize={8}
            onScroll={onScroll}
            renderItem={renderItem}
            numColumns={2}
            ListFooterComponent={() => <View className="h-20" />}
            columnWrapperStyle={{
              justifyContent: "space-between",
              columnGap: 8,
            }}
          />

          <View className="absolute w-full flex-row justify-between items-center bottom-5 h-16">
            <AnimatedFAB
              icon="plus"
              label="Create Folder"
              extended={isExtended}
              onPress={() => {
                setAddVisible(true);
              }}
              visible={fabvisible}
              animateFrom="left"
              iconMode="dynamic"
              color={colorScheme === "dark" ? "#121212" : "white"}
              style={
                colorScheme === "dark" ? styles.fabStyleDark : styles.fabStyle
              }
            />
            <View>
              <AnimatedFAB
                icon="hands-pray"
                label="Prayer Room"
                extended={isExtended}
                onPress={() => {
                  navigation.navigate(PRAYER_ROOM_SCREEN);
                }}
                visible={fabvisible}
                animateFrom="right"
                iconMode="dynamic"
                color={colorScheme === "dark" ? "white" : "#2f2d51"}
                style={
                  colorScheme === "dark"
                    ? [styles.fabStyleDark, { backgroundColor: "#212121" }]
                    : [styles.fabStyle, { backgroundColor: "#b7d3ff" }]
                }
              />
            </View>
          </View>
        </>
      )}
      {!folderClicked && answeredPrayers.length !== 0 && (
        <SectionList
          sections={sections}
          // keyExtractor={[(item, index) => item.id.toString()]}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderAnsweredPrayers}
        />
      )}
      {!folderClicked && answeredPrayers.length == 0 && (
        <View className="items-center justify-center gap-2 flex-1">
          <FontAwesome name="check-circle-o" size={70} color="#00b400" />
          <Text className="font-inter font-medium text-lg dark:text-white text-[#2f2d51]">
            Nothing on the list just yet.
          </Text>
        </View>
      )}

      <AddFolderModal
        addVisible={addVisible}
        addNewFolder={addNewFolder}
        colorScheme={colorScheme}
        theme={theme}
        folderName={folderName}
        setAddVisible={setAddVisible}
        handleCloseModal={handleCloseModal}
        setFolderName={setFolderName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  fabStyleDark: {
    position: "relative",
    alignSelf: "center",
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#A5C9FF",
  },
  fabStyleBlack: {
    position: "relative",
    alignSelf: "center",
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "black",
  },
  fabStyle: {
    position: "relative",
    alignSelf: "center",
    elevation: 0,
    shadowColor: "#f2f7ff",
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#36345e",
  },

  press: {
    fontFamily: "Inter-Bold",
    padding: 10,
    alignSelf: "center",
    textAlign: "center",
    color: "#2F2D51",
    fontSize: 18,
  },
  pressDark: {
    fontFamily: "Inter-Bold",
    padding: 10,
    textAlign: "center",
    alignSelf: "center",
    color: "white",
    fontSize: 18,
  },
  actionButtons: {
    position: "absolute",
    bottom: 10,
    height: 70,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fabStyle3: {
    bottom: 10,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#2F2D51",
  },
  fabStyle3Dark: {
    bottom: 10,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "#A5C9FF",
  },
  inputDark: {
    width: 250,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    backgroundColor: "#121212",
  },
  input: {
    width: 250,
    fontSize: 14,
    color: "white",
    // height: 40,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontFamily: "Inter-Regular",
    backgroundColor: "#2F2D51",
  },
});

export default Folder;
