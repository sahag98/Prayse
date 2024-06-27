import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  DEVO_LIST_SCREEN,
  HOME_SCREEN,
  PRAYER_ROOM_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "@routes";

import GiveawayModal from "../modals/GiveawayModal";
import {
  addtoCompletedItems,
  deleteCompletedItems,
  deletePreviousDayItems,
  deleteStreakCounter,
  resetGiveaway,
} from "../redux/userReducer";

import StreakSlider from "./StreakSlider";
import { useColorScheme } from "nativewind";

const DailyReflection = ({ completedItems, theme, devoStreak, appStreak }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isShowingStreak, setIsShowingStreak] = useState(false);

  const { colorScheme, setColorScheme } = useColorScheme();

  const hasEnteredGiveaway = useSelector(
    (state) => state.user.alreadyEnteredGiveaway
  );
  const dispatch = useDispatch();

  useEffect(() => {
    clearPreviousDayCompletion();
  }, [isFocused]);

  function handleComplete(selected) {
    const currentDate = new Date().toLocaleDateString().split("T")[0];

    console.log("currrr: ", currentDate);
    // dispatch(resetGiveaway());
    // dispatch(deleteCompletedItems());
    // dispatch(deleteStreakCounter());
    dispatch(
      addtoCompletedItems({
        item: selected,
        date: currentDate,
      })
    );

    navigation.navigate(selected, {
      previousScreen: HOME_SCREEN,
    });
  }

  async function clearPreviousDayCompletion() {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1); // Get yesterday's date

    const yesterdayDateString = yesterday.toLocaleDateString().split("T")[0]; // Format yesterday's date
    console.log("string: ", yesterdayDateString);

    dispatch(deletePreviousDayItems({ yesterday: yesterdayDateString }));
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: 10,
        gap: 10,
      }}
    >
      <GiveawayModal
        isShowingGiveaway={hasEnteredGiveaway}
        theme={theme}
        appstreak={appStreak}
        streak={devoStreak}
      />
      <StreakSlider
        appstreak={appStreak}
        streak={devoStreak}
        theme={theme}
        setIsShowingStreak={setIsShowingStreak}
        isShowingStreak={isShowingStreak}
      />
      <Text className="text-[#2f2d51] font-inter font-bold text-xl dark:text-white">
        Daily Devotions
      </Text>
      <View className="gap-3 relative w-full">
        <TouchableOpacity
          onPress={() => handleComplete(PRAYER_ROOM_SCREEN)}
          className="flex-row items-center justify-between"
        >
          <View
            className="absolute w-[5px] h-3/4 top-1/2 left-[10px]"
            style={{
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === PRAYER_ROOM_SCREEN)
              )
                ? colorScheme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : colorScheme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <View
            className="w-[25px] border-4 border-[#b7d3ff] dark:border-[#474747] h-[25px] rounded-full"
            style={{
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === PRAYER_ROOM_SCREEN)
              )
                ? colorScheme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : colorScheme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete(PRAYER_ROOM_SCREEN)}
            className="bg-white dark:bg-[#212121] p-[15px] ml-[15px] w-full flex-1 rounded-lg gap-[10px]"
          >
            <View className="flex-row items-center gap-[10px]">
              <Text className="text-[#2f2d51] dark:text-[#d2d2d2] text-[14px] font-inter font-light">
                Pray
              </Text>
              <MaterialCommunityIcons
                name="hands-pray"
                size={20}
                color={colorScheme === "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <Text className="text-[#2f2d51] dark:text-white font-bold font-inter text-xl">
              Take a moment to pray.
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleComplete(VERSE_OF_THE_DAY_SCREEN)}
          className="flex-row items-center justify-between"
        >
          <View
            className="absolute w-[5px] h-1/2 bottom-1/2 left-[10px]"
            style={{
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find(
                  (item) => item === VERSE_OF_THE_DAY_SCREEN
                )
              )
                ? colorScheme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : colorScheme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <View
            className="absolute w-[5px] h-3/4 top-1/2 left-[10px]"
            style={{
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find(
                  (item) => item === VERSE_OF_THE_DAY_SCREEN
                )
              )
                ? colorScheme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : colorScheme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <View
            className="w-[25px] border-4 border-[#b7d3ff] dark:border-[#474747] h-[25px] rounded-full"
            style={{
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find(
                  (item) => item === VERSE_OF_THE_DAY_SCREEN
                )
              )
                ? colorScheme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : colorScheme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete(VERSE_OF_THE_DAY_SCREEN)}
            className="bg-white dark:bg-[#212121] p-[15px] ml-[15px] flex-1 rounded-lg gap-[10px]"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-[#2f2d51] dark:text-[#d2d2d2] font-inter font-light text-[14px]">
                Verse of the Day
              </Text>
              <Feather
                name="book-open"
                size={20}
                color={colorScheme === "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <Text className="text-[#2f2d51] dark:text-white font-inter font-bold text-xl">
              Read the daily verse.
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleComplete(DEVO_LIST_SCREEN)}
          className="flex-row items-center justify-between"
        >
          <View
            className="absolute w-[5px] h-1/2 bottom-1/2 left-[10px]"
            style={{
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === DEVO_LIST_SCREEN)
              )
                ? colorScheme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : colorScheme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <View
            className="w-[25px] border-4 border-[#b7d3ff] dark:border-[#474747] h-[25px] rounded-full"
            style={{
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === DEVO_LIST_SCREEN)
              )
                ? colorScheme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : colorScheme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete(DEVO_LIST_SCREEN)}
            className="bg-white dark:bg-[#212121] p-[15px] ml-[15px] flex-1 rounded-lg gap-[10px]"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-[#2f2d51] dark:text-[#d2d2d2] font-inter font-light text-[14px]">
                Devotional
              </Text>
              <Feather
                name="book"
                size={20}
                color={colorScheme === "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <Text className="text-[#2f2d51] dark:text-white font-inter font-bold text-xl">
              Dive into today's devotional.
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DailyReflection;

const styles = StyleSheet.create({});
