// @ts-nocheck
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { QUESTION_SCREEN } from "@routes";

import { useSupabase } from "../context/useSupabase";

export const QuestionOfTheWeek: React.FC = () => {
  const navigation = useNavigation();
  const { latestQuestion } = useSupabase();

  return (
    <View className="bg-white dark:bg-[#212121] mb-[15px] w-full p-[15px] rounded-lg gap-[15px]">
      {!latestQuestion ? (
        <View className="gap-[15px]">
          <Text className="font-inter font-medium text-[#2f2d51] dark:text-[#d2d2d2]">
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
            <Text className="font-inter text-base font-medium text-[#2f2d51] dark:text-[#d2d2d2]">
              Question of the Week
            </Text>
            <Text className="text-red-500 dark:text-[#ff3333] text-base font-inter font-medium">
              New
            </Text>
          </View>
          <Text className="font-inter font-semibold text-xl leading-6 text-[#2f2d51] dark:text-white">
            {latestQuestion?.title}
          </Text>
          <Text className="text-base font-inter font-normal text-[#2f2d51] dark:text-[#a5c9ff] leading-6 underline">
            Click here to answer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
