// @ts-nocheck
import React from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Linking,
  Platform,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  AntDesign,
  FontAwesome6,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { togglePrayerQuestions, togglePrayerVerses } from "@redux/proReducer";
import { WALLPAPERS_SCREEN, YOUR_THEMES_SCREEN } from "@routes";

const ProScreen = () => {
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector((state) => state.theme.actualTheme);
  const versesEnabled = useSelector((state) => state.pro.prayer_verses);
  const questionsEnabled = useSelector((state) => state.pro.prayer_questions);

  const dispatch = useDispatch();

  async function handleVersesEnabled() {
    dispatch(togglePrayerVerses());
  }

  async function handleQuestionsEnabled() {
    await dispatch(togglePrayerQuestions());
  }

  function cancelSubscription() {
    if (Platform.OS === "ios") {
      Linking.openURL("https://apps.apple.com/account/subscriptions");
    } else {
      Linking.openURL("https://play.google.com/store/account/subscriptions");
    }
  }

  return (
    <View
      showsVerticalScrollIndicator={false}
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <View>
        <Link href="/welcome">
          <View className="flex-row items-center justify-between gap-2">
            <AntDesign
              name="left"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : "white"
                  : actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className=" font-inter-bold dark:text-white text-light-primary text-center text-3xl"
            >
              Pro Features
            </Text>
          </View>
        </Link>
      </View>
      <View className="flex-row items-center gap-3">
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-semibold text-primary dark:text-white text-xl"
        >
          Theme Customization
        </Text>
        <FontAwesome6
          name="brush"
          size={20}
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      </View>
      <View className="flex-row justify-between mt-2 w-full gap-3">
        <Link asChild href={`/${YOUR_THEMES_SCREEN}`}>
          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary dark:bg-dark-secondary"
          >
            <MaterialCommunityIcons
              name="brush-variant"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-medium text-lg text-light-primaryprimary dark:text-dark-primary"
            >
              Themes Available
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View className="flex-row mt-2 items-center gap-3">
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-semibold text-primary dark:text-white text-xl"
        >
          Prayer Wallpapers
        </Text>
        <AntDesign
          name="picture"
          size={20}
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      </View>
      <View className="flex-row justify-between mt-2 w-full gap-3">
        <Link asChild href={`/${WALLPAPERS_SCREEN}`}>
          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary dark:bg-dark-secondary"
          >
            <AntDesign
              name="picture"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-medium text-lg text-light-primaryprimary dark:text-dark-primary"
            >
              Wallpapers
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="mt-3 font-inter-semibold text-primary dark:text-white text-xl"
      >
        Additional Features
      </Text>
      <View
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="rounded-lg flex-row w-full  items-center p-3 mt-2 bg-light-secondary gap-1 dark:bg-dark-secondary"
      >
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-semibold font-inter text-lg text-light-primary dark:text-dark-primary"
        >
          Prayer Verses
        </Text>

        <Switch
          trackColor={{ false: "grey", true: "green" }}
          thumbColor={versesEnabled ? "white" : "white"}
          ios_backgroundColor="#bbbbbb"
          onValueChange={handleVersesEnabled}
          value={versesEnabled}
          className="ml-auto"
        />
      </View>
      <Text
        style={getSecondaryTextColorStyle(actualTheme)}
        className=" mt-2 font-inter-regular  text-light-primary dark:text-dark-primary"
      >
        Once enabled,click the bible icon on a prayer and get a related bible
        verse.
      </Text>
      <TouchableOpacity
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="rounded-lg flex-row w-full  items-center p-3 mt-3 bg-light-secondary gap-1 dark:bg-dark-secondary"
      >
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
        >
          Post Questions
        </Text>

        <Switch
          trackColor={{ false: "grey", true: "green" }}
          thumbColor={questionsEnabled ? "white" : "white"}
          ios_backgroundColor="#bbbbbb"
          onValueChange={handleQuestionsEnabled}
          value={questionsEnabled}
          className="ml-auto"
        />
      </TouchableOpacity>
      <Text
        style={getSecondaryTextColorStyle(actualTheme)}
        className=" mt-2 font-inter-regular  text-light-primary dark:text-dark-primary"
      >
        If enabled, you have the ability to post approved questions in the
        community questions section.
      </Text>
      <TouchableOpacity
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        onPress={() =>
          Linking.openURL(
            "https://www.canva.com/design/DAGRcSB6DCs/QN5T89e5Jops_-PQ_B1f4g/view?utm_content=DAGRcSB6DCs&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview",
          )
        }
        className="rounded-lg flex-row w-full justify-between  items-center p-3 mt-3 bg-light-secondary gap-1 dark:bg-dark-secondary"
      >
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
        >
          Prayer Journaling Resource
        </Text>
        <Feather
          name="external-link"
          size={20}
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "dark"
                ? "#d2d2d2"
                : "#2f2d51"
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={cancelSubscription}
        style={
          actualTheme &&
          actualTheme.MainTxt && { borderColor: actualTheme.MainTxt }
        }
        className="border p-3 mt-6 border-light-primary dark:border-[#d2d2d2] rounded-lg"
      >
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-regular text-sm text-light-primary dark:text-dark-primary"
        >
          Click here to cancel your Subscription.
        </Text>
      </TouchableOpacity>
      {/* <View className="flex-row items-center mt-3 gap-3">
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter text-primary dark:text-white font-semibold text-lg"
        >
          Font Customization
        </Text>
        <FontAwesome6
          name="font"
          size={20}
          color={
            colorScheme === "dark"
              ? actualTheme.MainTxt
                ? actualTheme.MainTxt
                : "white"
              : actualTheme.MainTxt
                ? actualTheme.MainTxt
                : "#2f2d51"
          }
        />
      </View>
      <View className="flex-row justify-between mt-2 w-full gap-3">
        <Link asChild href={`/${CREATE_THEME_SCREEN}`}>
          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary"
          >
            <AntDesign
              name="pluscircleo"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "white"
                  : actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter font-medium text-lg text-light-primary dark:text-dark-primary"
            >
              Create Theme
            </Text>
          </TouchableOpacity>
        </Link>
        <Link asChild href={`/${YOUR_THEMES_SCREEN}`}>
          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary"
          >
            <MaterialCommunityIcons
              name="brush-variant"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "white"
                  : actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter font-medium text-lg text-light-primaryprimary dark:text-dark-primary"
            >
              Your Themes
            </Text>
          </TouchableOpacity>
        </Link>
      </View> */}
    </View>
  );
};

export default ProScreen;
