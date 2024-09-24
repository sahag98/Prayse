import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useSupabase } from "../context/useSupabase";
import { QUESTION_SCREEN } from "../routes";
import {
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const QuestionInfo = ({ item, actualTheme, theme }) => {
  const navigation = useNavigation();

  const { answers } = useSupabase();

  const existingAnswers = answers.filter(
    (answer) => answer.question_id === item.id
  );

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(QUESTION_SCREEN, {
          title: item.title,
          question_id: item.id,
        })
      }
      style={getSecondaryBackgroundColorStyle(actualTheme)}
      className="bg-light-secondary dark:bg-dark-secondary rounded-lg p-3 gap-4"
    >
      <Text
        style={getSecondaryTextColorStyle(actualTheme)}
        className="font-inter font-medium text-lg text-light-primary dark:text-dark-primary"
      >
        {item.title}
      </Text>
      <View className="flex-row items-center gap-2 justify-between">
        <View className="flex-row items-center gap-3">
          <View
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="bg-light-primary dark:bg-dark-accent rounded-xl px-2 py-1"
          >
            <Text
              style={getPrimaryTextColorStyle(actualTheme)}
              className="font-inter text-xs font-semibold text-light-background dark:text-dark-background"
            >
              Posted by: Prayse
            </Text>
          </View>

          {item.isNew ? (
            <View className="bg-red-500 rounded-xl px-2 py-1">
              <Text className="font-inter text-sm font-medium text-light-background dark:text-dark-primary">
                new
              </Text>
            </View>
          ) : (
            <View />
          )}
        </View>
        <View className="flex-row items-center gap-2">
          <FontAwesome5
            name="check-circle"
            size={20}
            color={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : theme === "dark"
                  ? "#A5C9FF"
                  : "#2f2d51"
            }
          />
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter text-sm text-light-primary dark:text-dark-primary"
          >
            {existingAnswers.length}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default QuestionInfo;
