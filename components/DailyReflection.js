import React, { useCallback, useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
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
  resetDevotions,
  resetGiveaway,
} from "../redux/userReducer";

import StreakSlider from "./StreakSlider";
import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { useRouter, useNavigation, useFocusEffect } from "expo-router";
import { posthog } from "@lib/posthog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStore from "@hooks/store";

const DailyReflection = ({
  completedItems,
  actualTheme,
  theme,
  devoStreak,
  appStreak,
}) => {
  const navigation = useNavigation();
  const { addPrayerTracking, addVODTracking } = useStore();
  const [isShowingStreak, setIsShowingStreak] = useState(false);
  const router = useRouter();
  const hasEnteredGiveaway = useSelector(
    (state) => state.user.alreadyEnteredGiveaway
  );

  const dispatch = useDispatch();
  const today = new Date().toLocaleDateString().split("T")[0];

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      clearPreviousDayCompletion();
      // Return function is invoked whenever the route gets out of focus.
    }, [today])
  );

  async function handleComplete(selected) {
    // addPrayer();
    // dispatch(deleteCompletedItems())
    if (selected === PRAYER_ROOM_SCREEN) {
      addPrayerTracking();
    }

    if (selected === VERSE_OF_THE_DAY_SCREEN) {
      addVODTracking();
    }
    if (
      completedItems.find((completedItem) =>
        completedItem.items.find((item) => item === selected)
      )
    ) {
      navigation.navigate(selected, {
        previousScreen: HOME_SCREEN,
      });
      return;
    }
    const currentDate = new Date().toLocaleDateString().split("T")[0];

    posthog.capture("Doing Devotions");
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

    dispatch(deletePreviousDayItems({ yesterday: yesterdayDateString }));
  }

  return (
    <View className="flex-1 justify-start items-start w-full my-3 gap-2">
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
      <View className="flex-row items-center gap-3">
        <Feather
          name="check-circle"
          size={20}
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : theme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-semibold mb-1 text-xl text-light-primary dark:text-dark-primary"
        >
          Daily Devotions
        </Text>
      </View>

      <View className="gap-3 relative w-full">
        <TouchableOpacity className="flex-row items-center justify-between">
          <View
            className="absolute w-[5px] h-3/4 top-1/2 left-[10px]"
            style={
              actualTheme && actualTheme.Primary
                ? {
                    backgroundColor:
                      completedItems?.some((completedItem) =>
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
                      backgroundColor: completedItems?.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === PRAYER_ROOM_SCREEN
                        )
                      )
                        ? "#a5c9ff"
                        : "#212121",
                    }
                  : {
                      backgroundColor: completedItems?.some((completedItem) =>
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
              backgroundColor: completedItems?.some((completedItem) =>
                completedItem.items.find((item) => item === PRAYER_ROOM_SCREEN)
              )
                ? actualTheme && actualTheme.Primary
                  ? actualTheme.Primary
                  : theme === "dark"
                    ? "#a5c9ff"
                    : "#2f2d51"
                : theme === "dark"
                  ? "#121212"
                  : "white",
            }}
          />

          <TouchableOpacity
            onPress={() => handleComplete(PRAYER_ROOM_SCREEN)}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-white dark:bg-dark-secondary p-5 ml-[15px] w-full flex-1 rounded-lg gap-2"
          >
            <View className="flex-row items-center gap-2">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-[#d2d2d2] text-sm font-inter-regular"
              >
                Pray
              </Text>
            </View>
            <View className="gap-1">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-white font-inter-bold text-2xl"
              >
                Take a moment and pray
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary mb-2 dark:text-[#d2d2d2] font-inter-regular text-sm"
              >
                "And all things, whatsoever ye shall ask in prayer, believing,
                ye shall receive." - Matthew 21:22
              </Text>

              <View className="flex-row items-center gap-2">
                <Ionicons
                  name={"time-outline"}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : theme === "dark"
                        ? "#d2d2d2"
                        : "#2f2d51"
                  }
                  size={20}
                />
                <Text className="font-inter-medium text-sm text-light-primary dark:text-[#d2d2d2]">
                  5 mins
                </Text>
              </View>
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
              actualTheme && actualTheme.Primary
                ? {
                    backgroundColor:
                      completedItems?.some((completedItem) =>
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
                      backgroundColor: completedItems?.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === VERSE_OF_THE_DAY_SCREEN
                        )
                      )
                        ? "#a5c9ff"
                        : "#212121",
                    }
                  : {
                      backgroundColor: completedItems?.some((completedItem) =>
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
              actualTheme && actualTheme.Primary
                ? {
                    backgroundColor:
                      completedItems?.some((completedItem) =>
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
                      backgroundColor: completedItems?.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === VERSE_OF_THE_DAY_SCREEN
                        )
                      )
                        ? "#a5c9ff"
                        : "#212121",
                    }
                  : {
                      backgroundColor: completedItems?.some((completedItem) =>
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
              backgroundColor: completedItems?.some((completedItem) =>
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
                  ? "#121212"
                  : "white",
            }}
          />
          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            onPress={() => handleComplete(VERSE_OF_THE_DAY_SCREEN)}
            className="bg-white dark:bg-dark-secondary p-5 ml-[15px] flex-1 rounded-lg gap-2"
          >
            <View className="flex-row items-center gap-2">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-[#d2d2d2] font-inter-regular text-sm"
              >
                Verse of the Day
              </Text>

              {/* <Feather
                name="book-open"
                size={20}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : theme === "dark"
                      ? "#d2d2d2"
                      : "#2f2d51"
                }
              /> */}
            </View>
            <View className="gap-1">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-white font-inter-bold text-2xl"
              >
                Read the daily verse
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary mb-2 dark:text-[#d2d2d2] font-inter-regular text-sm"
              >
                "Thy word is a lamp unto my feet, and a light unto my path." -
                Psalm 119:105
              </Text>

              <View className="flex-row items-center gap-2">
                <Feather
                  name="calendar"
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : theme === "dark"
                        ? "#d2d2d2"
                        : "#2f2d51"
                  }
                  size={20}
                />

                <Text className="font-inter-medium text-sm text-light-primary dark:text-[#d2d2d2]">
                  Today's Reading
                </Text>
              </View>
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
              actualTheme && actualTheme.Primary
                ? {
                    backgroundColor:
                      completedItems?.some((completedItem) =>
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
                      backgroundColor: completedItems?.some((completedItem) =>
                        completedItem.items.find(
                          (item) => item === DEVO_LIST_SCREEN
                        )
                      )
                        ? "#a5c9ff"
                        : "#212121",
                    }
                  : {
                      backgroundColor: completedItems?.some((completedItem) =>
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
              backgroundColor: completedItems?.some((completedItem) =>
                completedItem.items.find((item) => item === DEVO_LIST_SCREEN)
              )
                ? actualTheme && actualTheme.Primary
                  ? actualTheme.Primary
                  : theme === "dark"
                    ? "#a5c9ff"
                    : "#2f2d51"
                : theme === "dark"
                  ? "#121212"
                  : "white",
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete(DEVO_LIST_SCREEN)}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-white dark:bg-dark-secondary p-5 ml-[15px] flex-1 rounded-lg gap-2"
          >
            <View className="flex-row items-center gap-2 justify-between">
              <View className="flex-row items-center gap-2">
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="text-light-primary dark:text-[#d2d2d2] font-inter-regular text-sm"
                >
                  Praise
                </Text>
              </View>
            </View>
            <View className="gap-1">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary dark:text-white font-inter-bold text-2xl"
              >
                Share a praise
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary mb-2 dark:text-[#d2d2d2] font-inter-regular text-sm"
              >
                Celebrate God's daily blessings with us today.
              </Text>

              <View className="flex-row items-center gap-2">
                <Ionicons
                  name={"time-outline"}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : theme === "dark"
                        ? "#d2d2d2"
                        : "#2f2d51"
                  }
                  size={20}
                />
                <Text className="font-inter-medium text-sm text-light-primary dark:text-[#d2d2d2]">
                  5 mins
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DailyReflection;
