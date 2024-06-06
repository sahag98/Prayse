import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CompletedModal from "./CompletedModal";
import { useDispatch } from "react-redux";
import {
  addtoCompletedItems,
  deleteAppStreakCounter,
  deleteCompletedItems,
  deletePreviousDayItems,
  deleteStreakCounter,
  increaseStreakCounter,
} from "../redux/userReducer";
import StreakSlider from "./StreakSlider";
import GiveawayModal from "./GiveawayModal";

const DailyReflection = ({ completedItems, theme, streak, appStreak }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isCompleteArray, setIsCompleteArray] = useState([]);
  const [isShowingStreak, setIsShowingStreak] = useState(false);
  const [isShowingGiveaway, setIsShowingGiveaway] = useState(false);
  const [todaysItems, setTodaysItems] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    // getTodaysItems();
    console.log("completed Items:  ", completedItems);
    // // clearTodaysCompletion();
    clearPreviousDayCompletion();
  }, [isFocused]);

  function handleComplete(selected) {
    const currentDate = new Date().toLocaleDateString().split("T")[0];
    // dispatch(deleteCompletedItems());
    // dispatch(deleteStreakCounter());
    dispatch(
      addtoCompletedItems({
        item: selected,
        date: currentDate,
      })
    );

    navigation.navigate(selected, {
      previousScreen: "Home",
    });
  }

  async function clearPreviousDayCompletion() {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1); // Get yesterday's date

    // const currentDate = new Date().toISOString().split("T")[0];
    // console.log(currentDate);
    const yesterdayDateString = yesterday.toLocaleDateString().split("T")[0]; // Format yesterday's date

    // const yesterdayDateString = yesterday
    //   .toLocaleDateString("en-CA")
    //   .split("T")[0];

    dispatch(deletePreviousDayItems({ yesterday: yesterdayDateString }));

    if (appStreak === 3) {
      console.log("You are entering the giveaway!!");
    }
  }

  async function getCompletionStatusForToday() {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date
    const keys = await AsyncStorage.getAllKeys();

    const completionStatusForToday = [];

    // Filter keys to get only completion status for the current date
    const todayKeys = keys.filter((key) =>
      key.startsWith(`completion_${currentDate}_`)
    );

    // Get completion status for each reflection item
    for (const key of todayKeys) {
      const completionStatus = await AsyncStorage.getItem(key);
      const reflectionItem = key.split("_")[2]; // Extract the reflection item name
      completionStatusForToday.push({
        reflectionItem,
        status: completionStatus,
      });
    }

    console.log("completion status for today: ", completionStatusForToday);

    return completionStatusForToday;
  }

  async function getTodaysItems() {
    const items = await getCompletionStatusForToday();
    setTodaysItems(items);

    const completedItems = items.filter((item) => item.status === "completed");

    const currentDate = new Date().toISOString().split("T")[0];
    const modalShownKey = `modal_shown_${currentDate}`;
    const progressDoneKey = `modal_shown_${currentDate}`;
    const modalShown = await AsyncStorage.getItem(modalShownKey);
    // await AsyncStorage.removeItem(modalShownKey);
    // dispatch(deleteStreakCounter());
    if (appStreak === 30 && !progressDoneKey) {
      console.log("progress done!");
      setIsShowingGiveaway(true);
      setIsShowingStreak(false);
      AsyncStorage.setItem(progressDoneKey, "true").catch((error) => {
        console.error("Error saving modal shown status:", error);
      });
    }

    if (completedItems.length === 3 && !modalShown) {
      setIsShowingStreak(true);
      console.log("should increase streak counter");
      dispatch(increaseStreakCounter());
      // Update AsyncStorage to indicate that the modal has been shown for today
      AsyncStorage.setItem(modalShownKey, "true").catch((error) => {
        console.error("Error saving modal shown status:", error);
      });
    }
  }

  async function clearTodaysCompletion() {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date
    const keys = await AsyncStorage.getAllKeys();

    // Filter keys to get only completion status for the current date
    const todayKeys = keys.filter((key) =>
      key.startsWith(`completion_${currentDate}_`)
    );

    // Remove completion status for each reflection item for today
    for (const key of todayKeys) {
      await AsyncStorage.removeItem(key);
    }

    // Clear todaysItems
    setTodaysItems([]);
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
        isShowingGiveaway={isShowingGiveaway}
        setIsShowingGiveaway={setIsShowingGiveaway}
        theme={theme}
        appstreak={appStreak}
        streak={streak}
      />
      <StreakSlider
        appstreak={appStreak}
        streak={streak}
        theme={theme}
        setIsShowingStreak={setIsShowingStreak}
        isShowingStreak={isShowingStreak}
      />
      <Text
        style={{
          color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
          fontFamily: "Inter-Bold",
          fontSize: 15,
        }}
      >
        Daily Devotions
      </Text>
      <View style={{ gap: 12, width: "100%" }}>
        <TouchableOpacity
          onPress={() => handleComplete("PrayerRoom")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 5,
              height: "75%",
              top: "50%",
              left: 11,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "PrayerRoom")
              )
                ? theme == "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme == "dark"
                ? "#212121"
                : "white",
            }}
          />
          <View
            style={{
              width: 25,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "PrayerRoom")
              )
                ? theme == "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme == "dark"
                ? "#212121"
                : "white",
              borderWidth: 4,
              borderColor: theme == "dark" ? "#474747" : "#b7d3ff",
              height: 25,
              borderRadius: 50,
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete("PrayerRoom")}
            style={{
              backgroundColor: theme == "dark" ? "#212121" : "white",
              padding: 15,
              marginLeft: 15,
              width: "100%",
              flex: 1,
              borderRadius: 10,
              gap: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                style={{
                  color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Light",
                  fontSize: 14,
                }}
              >
                Pray
              </Text>
              <MaterialCommunityIcons
                name="hands-pray"
                size={20}
                color={theme == "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontFamily: "Inter-Bold",
                fontSize: 17,
              }}
            >
              Take a moment to pray.
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleComplete("VerseOfTheDay")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 5,
              height: "50%",
              bottom: "50%",
              left: 11,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "VerseOfTheDay")
              )
                ? theme == "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme == "dark"
                ? "#212121"
                : "white",
            }}
          />
          <View
            style={{
              position: "absolute",
              width: 5,
              height: "75%",
              top: "50%",
              left: 11,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "VerseOfTheDay")
              )
                ? theme == "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme == "dark"
                ? "#212121"
                : "white",
            }}
          />
          <View
            style={{
              width: 25,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "VerseOfTheDay")
              )
                ? theme == "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme == "dark"
                ? "#212121"
                : "white",
              borderWidth: 4,
              borderColor: theme == "dark" ? "#474747" : "#b7d3ff",
              height: 25,
              borderRadius: 50,
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete("VerseOfTheDay")}
            style={{
              backgroundColor: theme == "dark" ? "#212121" : "white",
              padding: 15,
              marginLeft: 15,
              flex: 1,
              borderRadius: 10,
              gap: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                style={{
                  color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Light",
                  fontSize: 14,
                }}
              >
                Verse of the Day
              </Text>
              <Feather
                name="book-open"
                size={20}
                color={theme == "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontFamily: "Inter-Bold",
                fontSize: 17,
              }}
            >
              Read the daily verse.
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleComplete("DevoList")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              position: "absolute",
              width: 5,
              height: "50%",
              bottom: "50%",
              left: 11,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "DevoList")
              )
                ? theme == "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme == "dark"
                ? "#212121"
                : "white",
            }}
          />
          <View
            style={{
              width: 25,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "DevoList")
              )
                ? theme == "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme == "dark"
                ? "#212121"
                : "white",
              borderWidth: 4,
              borderColor: theme == "dark" ? "#474747" : "#b7d3ff",
              height: 25,
              borderRadius: 50,
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete("DevoList")}
            style={{
              backgroundColor: theme == "dark" ? "#212121" : "white",
              padding: 15,
              flex: 1,
              marginLeft: 15,
              borderRadius: 10,
              gap: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                style={{
                  color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Light",
                  fontSize: 14,
                }}
              >
                Devotional
              </Text>
              <Feather
                name="book"
                size={20}
                color={theme == "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontFamily: "Inter-Bold",
                fontSize: 17,
              }}
            >
              Dive into today's devotional.
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        {/* Repeat similar structure for other TouchableOpacity components */}
      </View>
    </View>
  );
};

export default DailyReflection;

const styles = StyleSheet.create({});
