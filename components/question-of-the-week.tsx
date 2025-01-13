// @ts-nocheck
import React from "react";
import { useNavigation } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { posthog } from "@lib/posthog";
import { COMMUNITY_SCREEN, LOGIN_SCREEN, QUESTION_SCREEN } from "@routes";

import { useSupabase } from "../context/useSupabase";
import { ActualTheme } from "@types/reduxTypes";

export const QuestionOfTheWeek = ({
  actualTheme,
  theme,
}: {
  actualTheme: ActualTheme;
  theme: string;
}) => {
  const navigation = useNavigation();
  const { latestQuestion, currentUser } = useSupabase();

  return (
    <View
      style={
        actualTheme && actualTheme.PrimaryTxt && { borderTopColor: "gainsboro" }
      }
      className="border-t pt-3 border-t-gray-300 dark:border-t-[#707070]"
    >
      <View className="flex-row items-center mb-4 gap-3">
        <Feather
          name="compass"
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
          className="font-inter-semibold text-xl text-light-primary dark:text-dark-primary"
        >
          Explore Your Faith
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          posthog.capture("Checking QOW");
          if (currentUser) {
            navigation.navigate(QUESTION_SCREEN, {
              title: latestQuestion?.title,
              question_id: latestQuestion?.id,
            });
          } else {
            navigation.navigate(LOGIN_SCREEN);
          }
        }}
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="bg-white dark:bg-dark-secondary mb-3 w-full p-4 rounded-lg gap-3"
      >
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-medium text-light-primary dark:text-[#d2d2d2]"
        >
          Question of the Week
        </Text>

        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-bold text-xl leading-6 text-light-primary dark:text-white"
        >
          {latestQuestion?.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
