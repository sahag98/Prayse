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
import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { useRouter } from "expo-router";

const DailyReflection = ({
  completedItems,
  actualTheme,
  theme,
  devoStreak,
  appStreak,
}) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isShowingStreak, setIsShowingStreak] = useState(false);
  const router = useRouter();
  const hasEnteredGiveaway = useSelector(
    (state) => state.user.alreadyEnteredGiveaway
  );
  const dispatch = useDispatch();
  const today = new Date().toLocaleDateString().split("T")[0];

  // console.log("today:", today);
  useEffect(() => {
    console.log("clear previous day");
    clearPreviousDayCompletion();
  }, [today]);

  function handleComplete(selected) {
    const currentDate = new Date().toLocaleDateString().split("T")[0];

    console.log("today: ", currentDate);
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
    console.log("yesterday: ", yesterdayDateString);

    dispatch(deletePreviousDayItems({ yesterday: yesterdayDateString }));
  }

  return (
    <View className="flex-1 justify-start items-start w-full mb-4 gap-3">
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
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="text-light-primary font-inter font-bold tracking-wide text-2xl dark:text-white"
      >
        Daily Devotions
      </Text>
      <View className="gap-3 relative w-full">
        <TouchableOpacity
          onPress={() => handleComplete(PRAYER_ROOM_SCREEN)}
          className="flex-row items-center justify-between"
        >
          <View
            className="absolute w-[5px] h-3/4 top-1/2 left-[10px]"
            style={
              actualTheme
                ? {
                    backgroundColor:
                      completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === PRAYER_ROOM_SCREEN
                        )
                      ) &&
                      actualTheme &&
                      actualTheme.Primary
                        ? actualTheme.Primary
                        : actualTheme.Secondary,
                  }
                : theme === "dark"
                  ? {
                      backgroundColor: completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === PRAYER_ROOM_SCREEN
                        )
                      )
                        ? "#a5c9ff"
                        : "#212121",
                    }
                  : {
                      backgroundColor: completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === PRAYER_ROOM_SCREEN
                        )
                      )
                        ? "#2f2d51"
                        : "white",
                    }
            }
          />
          <View
            className="w-[25px] border-4 border-light-secondary dark:border-[#474747] h-[25px] rounded-full"
            style={{
              borderWidth: 4,
              borderColor:
                actualTheme && actualTheme.Secondary
                  ? actualTheme.Secondary
                  : theme === "dark"
                    ? "#212121"
                    : "#b7d3ff",
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === PRAYER_ROOM_SCREEN)
              )
                ? actualTheme && actualTheme.Primary
                  ? actualTheme.Primary
                  : theme === "dark"
                    ? "#a5c9ff"
                    : "#2f2d51"
                : theme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete(PRAYER_ROOM_SCREEN)}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-white dark:bg-dark-secondary p-[15px] ml-[15px] w-full flex-1 rounded-lg gap-[10px]"
          >
            <View className="flex-row items-center gap-[10px]">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-[#d2d2d2] text-lg font-inter font-light"
              >
                Pray
              </Text>
              <MaterialCommunityIcons
                name="hands-pray"
                size={20}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : theme === "dark"
                      ? "#d2d2d2"
                      : "#2f2d51"
                }
              />
            </View>
            <View className="gap-1">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-white font-bold font-inter text-2xl"
              >
                Take a moment to pray.
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-[#d2d2d2] font-regular font-inter text-sm"
              >
                "And all things, whatsoever ye shall ask in prayer, believing,
                ye shall receive."
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary self-end dark:text-[#d2d2d2] font-medium font-inter text-sm"
              >
                - Matthew 21:22
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleComplete(VERSE_OF_THE_DAY_SCREEN)}
          className="flex-row items-center justify-between"
        >
          <View
            className="absolute w-[5px] h-1/2 bottom-1/2 left-[10px]"
            style={
              actualTheme
                ? {
                    backgroundColor:
                      completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === VERSE_OF_THE_DAY_SCREEN
                        )
                      ) &&
                      actualTheme &&
                      actualTheme.Primary
                        ? actualTheme.Primary
                        : actualTheme.Secondary,
                  }
                : theme === "dark"
                  ? {
                      backgroundColor: completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === VERSE_OF_THE_DAY_SCREEN
                        )
                      )
                        ? "#a5c9ff"
                        : "#212121",
                    }
                  : {
                      backgroundColor: completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === VERSE_OF_THE_DAY_SCREEN
                        )
                      )
                        ? "#2f2d51"
                        : "white",
                    }
            }
          />
          <View
            className="absolute w-[5px] h-3/4 top-1/2 left-[10px]"
            style={
              actualTheme
                ? {
                    backgroundColor:
                      completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === VERSE_OF_THE_DAY_SCREEN
                        )
                      ) &&
                      actualTheme &&
                      actualTheme.Primary
                        ? actualTheme.Primary
                        : actualTheme.Secondary,
                  }
                : theme === "dark"
                  ? {
                      backgroundColor: completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === VERSE_OF_THE_DAY_SCREEN
                        )
                      )
                        ? "#a5c9ff"
                        : "#212121",
                    }
                  : {
                      backgroundColor: completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === VERSE_OF_THE_DAY_SCREEN
                        )
                      )
                        ? "#2f2d51"
                        : "white",
                    }
            }
          />
          <View
            className="w-[25px] border-4 border-light-secondary dark:border-[#474747] h-[25px] rounded-full"
            style={{
              borderWidth: 4,
              borderColor:
                actualTheme && actualTheme.Secondary
                  ? actualTheme.Secondary
                  : theme === "dark"
                    ? "#212121"
                    : "#b7d3ff",
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find(
                  (item) => item === VERSE_OF_THE_DAY_SCREEN
                )
              )
                ? actualTheme && actualTheme.Primary
                  ? actualTheme.Primary
                  : theme === "dark"
                    ? "#a5c9ff"
                    : "#2f2d51"
                : theme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            onPress={() => handleComplete(VERSE_OF_THE_DAY_SCREEN)}
            className="bg-white dark:bg-dark-secondary p-[15px] ml-[15px] flex-1 rounded-lg gap-[10px]"
          >
            <View className="flex-row items-center gap-2">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-[#d2d2d2] font-inter font-light text-[14px]"
              >
                Verse of the Day
              </Text>
              <Feather
                name="book-open"
                size={20}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : theme === "dark"
                      ? "#d2d2d2"
                      : "#2f2d51"
                }
              />
            </View>
            <View className="gap-1">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-white font-inter font-bold text-2xl"
              >
                Read the daily verse.
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-[#d2d2d2] font-regular font-inter text-sm"
              >
                "Thy word is a lamp unto my feet, and a light unto my path."
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary self-end dark:text-[#d2d2d2] font-medium font-inter text-sm"
              >
                - Psalm 119:105
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleComplete(DEVO_LIST_SCREEN)}
          className="flex-row items-center justify-between"
        >
          <View
            className="absolute w-[5px] h-1/2 bottom-1/2 left-[10px]"
            style={
              actualTheme
                ? {
                    backgroundColor:
                      completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === DEVO_LIST_SCREEN
                        )
                      ) &&
                      actualTheme &&
                      actualTheme.Primary
                        ? actualTheme.Primary
                        : actualTheme.Secondary,
                  }
                : theme === "dark"
                  ? {
                      backgroundColor: completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === DEVO_LIST_SCREEN
                        )
                      )
                        ? "#a5c9ff"
                        : "#212121",
                    }
                  : {
                      backgroundColor: completedItems.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === DEVO_LIST_SCREEN
                        )
                      )
                        ? "#2f2d51"
                        : "white",
                    }
            }
          />
          <View
            className="w-[25px] border-4 border-light-secondary dark:border-[#474747] h-[25px] rounded-full"
            style={{
              borderWidth: 4,
              borderColor:
                actualTheme && actualTheme.Secondary
                  ? actualTheme.Secondary
                  : theme === "dark"
                    ? "#212121"
                    : "#b7d3ff",
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === DEVO_LIST_SCREEN)
              )
                ? actualTheme && actualTheme.Primary
                  ? actualTheme.Primary
                  : theme === "dark"
                    ? "#a5c9ff"
                    : "#2f2d51"
                : theme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete(DEVO_LIST_SCREEN)}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-white dark:bg-dark-secondary p-[15px] ml-[15px] flex-1 rounded-lg gap-[10px]"
          >
            <View className="flex-row items-center gap-2">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-[#d2d2d2] font-inter font-light text-[14px]"
              >
                Devotional
              </Text>
              <Feather
                name="book"
                size={20}
                color={theme === "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <View className="gap-1">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-white font-inter font-bold text-2xl"
              >
                Explore today's devotional.
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-[#d2d2d2] font-regular font-inter text-sm"
              >
                "Study to show thyself approved unto God, a workman that needeth
                not to be ashamed, rightly dividing the word of truth."
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary self-end dark:text-[#d2d2d2] font-medium font-inter text-sm"
              >
                - 2 Timothy 2:15
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DailyReflection;
