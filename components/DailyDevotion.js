import React, { useCallback, useState, useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import {
  PRAISE_SCREEN,
  HOME_SCREEN,
  PRAYER_ROOM_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "@routes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
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
import useStore from "@hooks/store";

const DailyDevotion = ({
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
  console.log(completedItems);

  const dispatch = useDispatch();
  const today = new Date().toLocaleDateString().split("T")[0];

  // Animation values
  const slideIn = useSharedValue(-100);
  const fadeIn = useSharedValue(0);

  useEffect(() => {
    slideIn.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
    fadeIn.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideIn.value }],
      opacity: fadeIn.value,
    };
  });

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
    <Animated.View
      style={animatedStyle}
      className="flex-1 justify-start pr-4 items-start w-full my-3 gap-2"
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
      <View className="bg-blue-200 dark:bg-dark-secondary w-full p-3 rounded-tr-xl rounded-br-xl">
        <View className="flex-row mb-4 items-center gap-3">
          <Image
            source={require("@assets/prayse-transparent.png")}
            style={{
              tintColor: theme === "dark" ? "white" : "#2f2d51",
              width: 30,
              height: 30,
            }}
          />
          {/* <Feather
            name="check-circle"
            size={20}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : theme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          /> */}

          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-semibold text-xl text-light-primary dark:text-dark-primary"
          >
            Daily Devotions
          </Text>
        </View>

        <View className="gap-3 relative w-full">
          <TouchableOpacity className="flex-row items-center justify-between">
            <View
              className="absolute w-1 h-3/4 top-1/2 left-3"
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
                          : "#121212",
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
              className="border-4 border-light-secondary dark:border-[#474747] w-7 h-7 items-center justify-center rounded-full"
              style={{
                borderWidth: 3,
                borderColor:
                  actualTheme && actualTheme.Secondary
                    ? actualTheme.Secondary
                    : theme === "dark"
                      ? "#141414"
                      : "white",
                backgroundColor: completedItems?.some((completedItem) =>
                  completedItem.items.find(
                    (item) => item === PRAYER_ROOM_SCREEN
                  )
                )
                  ? actualTheme && actualTheme.Primary
                    ? actualTheme.Primary
                    : theme === "dark"
                      ? "#a5c9ff"
                      : "#2f2d51"
                  : theme === "dark"
                    ? "#121212"
                    : "#DEEBFF",
              }}
            />

            <TouchableOpacity
              onPress={() => handleComplete(PRAYER_ROOM_SCREEN)}
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-white dark:bg-[#141414] p-5 ml-[15px] w-full flex-1 rounded-lg gap-2"
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

                <View className="flex-row items-center gap-1">
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
              className="absolute w-1 h-1/2 bottom-1/2 left-3"
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
                          : "#121212",
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
              className="absolute w-1 h-3/4 top-1/2 left-3"
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
                          : "#121212",
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
              className="w-7 h-7 items-center justify-center border-4 border-light-secondary dark:border-[#474747] rounded-full"
              style={{
                borderWidth: 3,
                borderColor:
                  actualTheme && actualTheme.Secondary
                    ? actualTheme.Secondary
                    : theme === "dark"
                      ? "#141414"
                      : "white",
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
                    : "#DEEBFF",
              }}
            />

            <TouchableOpacity
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              onPress={() => handleComplete(VERSE_OF_THE_DAY_SCREEN)}
              className="bg-white dark:bg-[#141414] p-5 ml-[15px] flex-1 rounded-lg gap-2"
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

                <View className="flex-row items-center gap-1">
                  <Ionicons
                    name="reader-outline"
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
            onPress={() => handleComplete(PRAISE_SCREEN)}
            className="flex-row items-center justify-between"
          >
            <View
              className="absolute w-1 h-1/2 bottom-1/2 left-3"
              style={
                actualTheme && actualTheme.Primary
                  ? {
                      backgroundColor:
                        completedItems?.some((completedItem) =>
                          completedItem.items.find(
                            (item) => item === PRAISE_SCREEN
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
                            (item) => item === PRAISE_SCREEN
                          )
                        )
                          ? "#a5c9ff"
                          : "#121212",
                      }
                    : {
                        backgroundColor: completedItems?.some((completedItem) =>
                          completedItem.items.find(
                            (item) => item === PRAISE_SCREEN
                          )
                        )
                          ? "#2f2d51"
                          : "white",
                      }
              }
            />
            <View
              className="w-7 h-7 items-center justify-center border-4 border-light-secondary dark:border-[#474747] rounded-full"
              style={{
                borderWidth: 3,
                borderColor:
                  actualTheme && actualTheme.Secondary
                    ? actualTheme.Secondary
                    : theme === "dark"
                      ? "#141414"
                      : "white",
                backgroundColor: completedItems?.some((completedItem) =>
                  completedItem.items.find((item) => item === PRAISE_SCREEN)
                )
                  ? actualTheme && actualTheme.Primary
                    ? actualTheme.Primary
                    : theme === "dark"
                      ? "#a5c9ff"
                      : "#2f2d51"
                  : theme === "dark"
                    ? "#121212"
                    : "#DEEBFF",
              }}
            />

            <TouchableOpacity
              onPress={() => handleComplete(PRAISE_SCREEN)}
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-white dark:bg-[#141414] p-5 ml-[15px] flex-1 rounded-lg gap-2"
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

                <View className="flex-row items-center gap-1">
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
                    2 mins
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default DailyDevotion;
