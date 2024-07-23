// @ts-nocheck
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { useNavigation } from "@react-navigation/native";
import { QUESTION_SCREEN } from "@routes";

import { useSupabase } from "../context/useSupabase";

export const QuestionOfTheWeek: React.FC = ({ actualTheme }) => {
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
          <ActivityIndicator />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(QUESTION_SCREEN, {
              title: latestQuestion?.title,
              question_id: latestQuestion?.id,
            })
          }
          className="w-full rounded-lg gap-[15px]"
        >
          <View className="flex-row items-center justify-between">
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter text-base font-medium text-light-primary dark:text-[#d2d2d2]"
            >
              Question of the Week
            </Text>
            <Text className="text-red-500  text-base font-inter font-medium">
              New
            </Text>
          </View>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter font-semibold text-xl leading-6 text-light-primary dark:text-white"
          >
            {latestQuestion?.title}
          </Text>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="text-base font-inter font-normal text-light-primary dark:text-dark-accent leading-6 underline"
          >
            Click here to answer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
