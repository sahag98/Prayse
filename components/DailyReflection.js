import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import GiveawayModal from "../modals/GiveawayModal";
import {
  addtoCompletedItems,
  deletePreviousDayItems,
} from "../redux/userReducer";

import StreakSlider from "./StreakSlider";

const DailyReflection = ({ completedItems, theme, streak, appStreak }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isShowingStreak, setIsShowingStreak] = useState(false);
  const hasEnteredGiveaway = useSelector(
    (state) => state.user.alreadyEnteredGiveaway,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("completed Items:  ", completedItems);

    clearPreviousDayCompletion();
  }, [isFocused]);

  function handleComplete(selected) {
    const currentDate = new Date().toLocaleDateString().split("T")[0];

    console.log("curr: ", currentDate);
    // dispatch(deleteCompletedItems());
    // dispatch(deleteStreakCounter());
    dispatch(
      addtoCompletedItems({
        item: selected,
        date: currentDate,
      }),
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
    console.log("string: ", yesterdayDateString);
    // const yesterdayDateString = yesterday
    //   .toLocaleDateString("en-CA")
    //   .split("T")[0];

    dispatch(deletePreviousDayItems({ yesterday: yesterdayDateString }));

    if (appStreak === 3) {
      console.log("You are entering the giveaway!!");
    }
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
          color: theme === "dark" ? "white" : "#2f2d51",
          fontFamily: "Inter-Bold",
          fontSize: 18,
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
              left: 10,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "PrayerRoom"),
              )
                ? theme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <View
            style={{
              width: 25,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "PrayerRoom"),
              )
                ? theme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme === "dark"
                  ? "#212121"
                  : "white",
              borderWidth: 4,
              borderColor: theme === "dark" ? "#474747" : "#b7d3ff",
              height: 25,
              borderRadius: 50,
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete("prayer-room")}
            style={{
              backgroundColor: theme === "dark" ? "#212121" : "white",
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
                  color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Light",
                  fontSize: 14,
                }}
              >
                Pray
              </Text>
              <MaterialCommunityIcons
                name="hands-pray"
                size={20}
                color={theme === "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <Text
              style={{
                color: theme === "dark" ? "white" : "#2f2d51",
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
              left: 10,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "VerseOfTheDay"),
              )
                ? theme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme === "dark"
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
              left: 10,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "VerseOfTheDay"),
              )
                ? theme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <View
            style={{
              width: 25,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "VerseOfTheDay"),
              )
                ? theme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme === "dark"
                  ? "#212121"
                  : "white",
              borderWidth: 4,
              borderColor: theme === "dark" ? "#474747" : "#b7d3ff",
              height: 25,
              borderRadius: 50,
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete("VerseOfTheDay")}
            style={{
              backgroundColor: theme === "dark" ? "#212121" : "white",
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
                  color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Light",
                  fontSize: 14,
                }}
              >
                Verse of the Day
              </Text>
              <Feather
                name="book-open"
                size={20}
                color={theme === "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <Text
              style={{
                color: theme === "dark" ? "white" : "#2f2d51",
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
              left: 10,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "DevoList"),
              )
                ? theme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme === "dark"
                  ? "#212121"
                  : "white",
            }}
          />
          <View
            style={{
              width: 25,
              backgroundColor: completedItems.some((completedItem) =>
                completedItem.items.find((item) => item === "DevoList"),
              )
                ? theme === "dark"
                  ? "#a5c9ff"
                  : "#2f2d51"
                : theme === "dark"
                  ? "#212121"
                  : "white",
              borderWidth: 4,
              borderColor: theme === "dark" ? "#474747" : "#b7d3ff",
              height: 25,
              borderRadius: 50,
            }}
          />
          <TouchableOpacity
            onPress={() => handleComplete("DevoList")}
            style={{
              backgroundColor: theme === "dark" ? "#212121" : "white",
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
                  color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
                  fontFamily: "Inter-Light",
                  fontSize: 14,
                }}
              >
                Devotional
              </Text>
              <Feather
                name="book"
                size={20}
                color={theme === "dark" ? "#d2d2d2" : "#2f2d51"}
              />
            </View>
            <Text
              style={{
                color: theme === "dark" ? "white" : "#2f2d51",
                fontFamily: "Inter-Bold",
                fontSize: 17,
              }}
            >
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
