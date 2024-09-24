// @ts-nocheck
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { posthog } from "@lib/posthog";
import { useNavigation } from "@react-navigation/native";
import { QUESTION_SCREEN } from "@routes";

import { useSupabase } from "../context/useSupabase";

export const QuestionOfTheWeek: React.FC = ({ actualTheme, theme }) => {
  const navigation = useNavigation();
  const { latestQuestion } = useSupabase();

  return (
    <View
      style={getSecondaryBackgroundColorStyle(actualTheme)}
      className="bg-white dark:bg-dark-secondary mb-[15px] w-full p-[15px] rounded-lg gap-[15px]"
    >
      {!latestQuestion ? (
        <View className="gap-[15px]">
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter font-medium text-light-primary dark:text-[#d2d2d2]"
          >
            Question of the Week
          </Text>
          <ActivityIndicator
            color={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : theme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => {
            posthog.capture("Checking QOW");
            navigation.navigate(QUESTION_SCREEN, {
              title: latestQuestion?.title,
              question_id: latestQuestion?.id,
            });
          }}
          className="w-full flex-row items-center justify-between rounded-lg gap-[15px]"
        >
          <View className="gap-3 flex-1">
            <View className="flex-row items-center justify-between">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter text-base font-medium text-light-primary dark:text-[#d2d2d2]"
              >
                Question of the Week
              </Text>
            </View>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter font-bold text-xl leading-6 text-light-primary dark:text-white"
            >
              {latestQuestion?.title}
            </Text>
          </View>
          <AntDesign
            name="right"
            size={24}
            color={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : theme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
