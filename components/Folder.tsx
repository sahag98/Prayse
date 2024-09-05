//@ts-nocheck
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { posthog } from "@lib/posthog";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AddFolderModal from "../modals/AddFolderModal";
import { addFolder } from "../redux/folderReducer";
import { PRAYER_ROOM_SCREEN } from "../routes";
import { HeaderTitle } from "../styles/appStyles";

import FolderItem from "./FolderItem";

const Folder = ({ colorScheme, navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const folders = useSelector((state) => state.folder.folders);
  const answeredPrayers = useSelector(
    (state) => state.answered.answeredPrayers,
  );
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  const [open, setOpen] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [idToDelete, setIdToDelete] = useState(null);
  const sections = [];

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

  answeredPrayers?.forEach((prayer) => {
    const date = prayer.answeredDate;
    const sectionIndex = sections.findIndex(
      (section) => section.title === date,
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

  const dispatch = useDispatch();
  const handleCloseModal = () => {
    setAddVisible(false);
    setOpen(false);
    setFolderName("");
  };

  function addNewFolder() {
    dispatch(
      addFolder({
        id: uuid.v4(),
        name: folderName,
        prayers: [],
      }),
    );
    setTimeout(() => {
      setAddVisible(false);
      setFolderName("");
    }, 0);
    // setAddVisible(false);
    // setFolderName("");
  }

  const renderItem = ({ item }) => {
    return (
      <FolderItem
        colorScheme={colorScheme}
        actualTheme={actualTheme}
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
        <TouchableOpacity
          // style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="justify-center items-center rounded-xl py-3"
          onPress={() => setFolderClicked(true)}
        >
          <HeaderTitle
            style={getMainTextColorStyle(actualTheme)}
            className="font-bold font-inter text-lg text-light-primary dark:text-dark-primary"
          >
            Prayer Folders
          </HeaderTitle>
        </TouchableOpacity>
      </View>
      {folders.length === 0 && (
        <View className="flex-1 justify-center items-center gap-2 mt-28">
          <AntDesign
            name="folder1"
            size={50}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "#e8bb4e"
                  : "#2f2d51"
            }
          />
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-bold font-inter text-light-primary dark:text-white text-2xl"
          >
            Create a prayer folder.
          </Text>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter dark:text-[#d2d2d2] text-base text-[#2f2d51]"
          >
            (These folders are only visible to you.)
          </Text>
        </View>
      )}

      <FlatList
        data={folders}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        windowSize={8}
        renderItem={renderItem}
        numColumns={2}
        ListFooterComponent={() => <View className="h-20" />}
        columnWrapperStyle={{
          justifyContent: "space-between",
          columnGap: 8,
        }}
      />

      <View className="absolute w-full flex-row justify-between items-center bottom-5 h-16">
        <TouchableOpacity
          style={getPrimaryBackgroundColorStyle(actualTheme)}
          onPress={() => {
            setAddVisible(true);
            posthog.capture("Create folder");
          }}
          className="dark:bg-dark-accent flex-row items-center justify-center gap-2 bg-light-primary p-4 rounded-xl  shadow-gray-300 dark:shadow-none"
        >
          <AntDesign
            name="plus"
            size={24}
            color={
              actualTheme && actualTheme.PrimaryTxt
                ? actualTheme.PrimaryTxt
                : colorScheme === "dark"
                  ? "#121212"
                  : "white"
            }
          />
          <Text
            style={getPrimaryTextColorStyle(actualTheme)}
            className="font-inter font-bold text-lg text-light-background dark:text-dark-background"
          >
            Create Folder
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          onPress={() => {
            posthog.capture("Prayer room");
            navigation.navigate(PRAYER_ROOM_SCREEN);
          }}
          className="dark:bg-dark-accent flex-row items-center justify-center gap-2 bg-light-secondary p-4 rounded-xl  shadow-gray-300 dark:shadow-none"
        >
          <MaterialCommunityIcons
            name="hands-pray"
            size={24}
            color={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                  ? "#121212"
                  : "#2f2d51"
            }
          />

          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter font-bold text-lg text-light-primary dark:text-dark-background"
          >
            Prayer Room
          </Text>
        </TouchableOpacity>
      </View>

      <AddFolderModal
        actualTheme={actualTheme}
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

export default Folder;
