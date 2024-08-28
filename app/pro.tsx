// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { useSupabase } from "@context/useSupabase";
import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import {
  checkPrayerQuestions,
  checkPrayerVerse,
  togglePrayerQuestions,
  togglePrayerVerses,
} from "@redux/proReducer";
import { YOUR_THEMES_SCREEN } from "@routes";
import { Container, HeaderView } from "@styles/appStyles";
const ProScreen = () => {
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector((state) => state.theme.actualTheme);
  const versesEnabled = useSelector((state) => state.pro.prayer_verses);
  const questionsEnabled = useSelector((state) => state.pro.prayer_questions);

  const { supabase, currentUser } = useSupabase();

  const dispatch = useDispatch();

  const [isVersesEnabled, setIsVersesEnabled] = useState(false);
  const [isQuestionsEnabled, setIsQuestionsEnabled] = useState(
    questionsEnabled ? questionsEnabled : true,
  );

  useEffect(() => {
    if (currentUser) {
      setIsVersesEnabled(currentUser?.VersesEnabled);
      dispatch(checkPrayerVerse(currentUser?.VersesEnabled));
      setIsQuestionsEnabled(currentUser?.QuestionsEnabled);
      dispatch(checkPrayerQuestions(currentUser?.QuestionsEnabled));
    }
  }, [currentUser]);
  // console.log(currentUser);

  console.log("enabled", isVersesEnabled);

  async function handleVersesEnabled() {
    console.log("verses switch");
    dispatch(togglePrayerVerses());
    setIsVersesEnabled(!isVersesEnabled);

    if (currentUser) {
      await supabase
        .from("profiles")
        .update({
          VersesEnabled: !isVersesEnabled,
        })
        .eq("id", currentUser?.id)
        .select();
    }
  }
  async function handleQuestionsEnabled() {
    dispatch(togglePrayerQuestions());
    setIsQuestionsEnabled(!isQuestionsEnabled);

    if (currentUser) {
      await supabase
        .from("profiles")
        .update({
          QuestionsEnabled: !isQuestionsEnabled,
        })
        .eq("id", currentUser?.id)
        .select();
    }
  }
  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <HeaderView>
        <Link href="/">
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
              className="font-bold font-inter dark:text-white text-light-primary text-center text-3xl"
            >
              Pro Features
            </Text>
          </View>
        </Link>
      </HeaderView>
      <View className="flex-row items-center gap-3">
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter text-primary dark:text-white font-semibold text-xl"
        >
          Theme Customization
        </Text>
        <FontAwesome6
          name="brush"
          size={20}
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
                colorScheme === "dark"
                  ? actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "white"
                  : actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter font-medium text-lg text-light-primaryprimary dark:text-dark-primary"
            >
              Themes Available
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="mt-3 font-inter text-primary dark:text-white font-semibold text-xl"
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
          thumbColor={isVersesEnabled ? "white" : "white"}
          ios_backgroundColor="#bbbbbb"
          onValueChange={handleVersesEnabled}
          value={isVersesEnabled}
          className="ml-auto"
        />
      </View>
      <Text
        style={getSecondaryTextColorStyle(actualTheme)}
        className=" mt-2 font-inter  text-light-primary dark:text-dark-primary"
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
          className="font-semibold font-inter text-lg text-light-primary dark:text-dark-primary"
        >
          Post Questions
        </Text>

        <Switch
          trackColor={{ false: "grey", true: "green" }}
          thumbColor={isQuestionsEnabled ? "white" : "white"}
          ios_backgroundColor="#bbbbbb"
          onValueChange={setIsQuestionsEnabled}
          value={isQuestionsEnabled}
          className="ml-auto"
        />
      </TouchableOpacity>
      <Text
        style={getSecondaryTextColorStyle(actualTheme)}
        className=" mt-2 font-inter  text-light-primary dark:text-dark-primary"
      >
        If enabled, you have the ability to post approved questions to the
        community.
      </Text>
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
    </Container>
  );
};

export default ProScreen;

const styles = StyleSheet.create({});
