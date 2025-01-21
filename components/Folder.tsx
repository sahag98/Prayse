import React, { useState, useEffect, useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { posthog } from "@lib/posthog";

import { addFolder } from "../redux/folderReducer";
import { PRAYER_ROOM_SCREEN } from "../routes";

import FolderItem from "./FolderItem";
import { ActualTheme } from "../types/reduxTypes";
import AddListModal from "@modals/AddListModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

const Folder = ({
  colorScheme,
  navigation,
}: {
  colorScheme: string;
  navigation: any;
}) => {
  const folders = useSelector((state: any) => state.folder.folders);
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [open, setOpen] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [idToDelete, setIdToDelete] = useState(null);
  const [showNewBadge, setShowNewBadge] = useState(false);

  const dispatch = useDispatch();
  const handleCloseModal = () => {
    setAddVisible(false);
    setOpen(false);
    setFolderName("");
  };

  useEffect(() => {
    const checkBadgeStatus = async () => {
      const badgeStatus = await AsyncStorage.getItem("showNewFeatureBadge");
      if (badgeStatus === null) {
        setShowNewBadge(true);
        await AsyncStorage.setItem("showNewFeatureBadge", "true");
      }
    };
    checkBadgeStatus();
  }, []);

  function addNewFolder() {
    dispatch(
      addFolder({
        id: uuid.v4(),
        name: folderName,
        prayers: [],
      }),
    );

    setFolderName("");
    bottomSheetModalRef.current?.close();
    // setAddVisible(false);
    // setFolderName("");
  }

  const handleGuidedPrayerPress = async () => {
    if (showNewBadge) {
      setShowNewBadge(false);
      await AsyncStorage.removeItem("showNewFeatureBadge");
    }
    posthog.capture("Prayer room");
    navigation.navigate(PRAYER_ROOM_SCREEN);
  };

  const renderItem = ({ item }: any) => {
    return (
      <FolderItem
        actualTheme={actualTheme}
        item={item}
        navigation={navigation}
      />
    );
  };

  return (
    <>
      <View className="px-4  h-full">
        <View className="my-4 flex-row justify-between items-center">
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="py-3 font-inter-bold text-3xl text-light-primary dark:text-dark-primary"
          >
            Prayer Lists
          </Text>
        </View>

        <FlatList
          data={folders}
          keyExtractor={(item) => item.id}
          onEndReachedThreshold={0}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          contentContainerStyle={{ flex: folders?.length === 0 ? 1 : 0 }}
          windowSize={8}
          renderItem={renderItem}
          numColumns={2}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <Ionicons
                name="list-outline"
                size={70}
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
                className="font-inter-medium text-light-primary dark:text-white text-lg"
              >
                Start by creating a prayer list.
              </Text>
            </View>
          )}
          ListFooterComponent={() => <View className="h-32" />}
          columnWrapperStyle={{
            justifyContent: "space-between",
            columnGap: 8,
          }}
        />

        <View className="absolute w-full flex-row justify-between self-center items-center bottom-5 h-16">
          <TouchableOpacity
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            onPress={() => {
              bottomSheetModalRef.current?.present();
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
              className="font-inter-bold text-lg text-light-background dark:text-dark-background"
            >
              List
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            onPress={handleGuidedPrayerPress}
            className="dark:bg-dark-secondary relative flex-row items-center justify-center gap-2 bg-light-secondary p-4 rounded-xl  shadow-gray-300 dark:shadow-none"
          >
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-bold text-lg text-light-primary dark:text-dark-primary"
            >
              Pray
            </Text>

            <MaterialCommunityIcons
              name="hands-pray"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <AddListModal
        actualTheme={actualTheme}
        addNewFolder={addNewFolder}
        colorScheme={colorScheme}
        folderName={folderName}
        setFolderName={setFolderName}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
};

export default Folder;
