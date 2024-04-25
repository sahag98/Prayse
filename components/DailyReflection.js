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

const DailyReflection = ({ theme }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isCompleteArray, setIsCompleteArray] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [todaysItems, setTodaysItems] = useState([]);

  useEffect(() => {
    getTodaysItems();
    clearPreviousDayCompletion();
  }, [isFocused]);

  function handleComplete(selected) {
    // Save completion status with current date
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format
    AsyncStorage.setItem(`completion_${currentDate}_${selected}`, "completed")
      .then(() => {
        // Update todaysItems state to reflect the change immediately
        getTodaysItems();
      })
      .catch((error) => {
        console.error("Error saving completion status:", error);
      });

    navigation.navigate(selected);
  }

  async function clearPreviousDayCompletion() {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1); // Get yesterday's date

    const yesterdayDateString = yesterday.toISOString().split("T")[0]; // Format yesterday's date

    // Loop through isCompleteArray and remove completion status for yesterday's reflections
    for (const item of isCompleteArray) {
      await AsyncStorage.removeItem(
        `completion_${yesterdayDateString}_${item}`
      );
    }

    // Clear isCompleteArray
    setIsCompleteArray([]);
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

    return completionStatusForToday;
  }

  async function getTodaysItems() {
    const items = await getCompletionStatusForToday();
    setTodaysItems(items);

    const completedItems = items.filter((item) => item.status === "completed");
    console.log(completedItems);

    const currentDate = new Date().toISOString().split("T")[0];
    const modalShownKey = `modal_shown_${currentDate}`;
    const modalShown = await AsyncStorage.getItem(modalShownKey);

    if (completedItems.length === 3 && !modalShown) {
      console.log("should show modal now!");
      setShowModal(true);

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
        marginBottom: 20,
        gap: 10,
      }}
    >
      <CompletedModal
        theme={theme}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: 19,
            color: theme == "dark" ? "white" : "#2f2d51",
          }}
        >
          Start Here
        </Text>
      </View>
      <View style={{ gap: 15, width: "100%" }}>
        <Pressable onPress={clearTodaysCompletion}>
          <Text style={{ color: "red" }}>Reset</Text>
        </Pressable>
        <TouchableOpacity
          onPress={() => handleComplete("PrayerRoom")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <View
            style={{
              width: 25,
              backgroundColor: todaysItems.find(
                (item) => item.reflectionItem === "PrayerRoom"
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
              backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
              padding: 15,
              flex: 1,
              borderRadius: 10,
              gap: 5,
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
                lineHeight: 22,
              }}
            >
              Go through and pray for all your prayers.
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleComplete("VerseOfTheDay")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <View
            style={{
              width: 25,
              backgroundColor: todaysItems.find(
                (item) => item.reflectionItem === "VerseOfTheDay"
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
              backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
              padding: 15,
              flex: 1,
              borderRadius: 10,
              gap: 5,
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
                lineHeight: 22,
              }}
            >
              Reflect on today's scripture and apply it to your day.
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleComplete("DevoList")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <View
            style={{
              width: 25,
              backgroundColor: todaysItems.find(
                (item) => item.reflectionItem === "DevoList"
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
              backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
              padding: 15,
              flex: 1,
              borderRadius: 10,
              gap: 5,
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
                lineHeight: 22,
              }}
            >
              Dive into today's devotional reading and reflect on it.
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
