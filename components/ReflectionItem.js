import React from "react";
import Moment from "moment";
import { Image, StyleSheet, Text, View } from "react-native";
import { getMainTextColorStyle } from "@lib/customStyles";
const ReflectionItem = ({ actualTheme, item, theme }) => {
  return (
    <View className="gap-3 py-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2" x>
          <Image
            className="w-10 h-10 rounded-full"
            source={{
              uri: item.profiles.avatar_url
                ? item.profiles.avatar_url
                : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
            }}
          />
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter text-lg font-medium text-light-primary dark:text-dark-primary"
          >
            {item.profiles.full_name}
          </Text>
        </View>
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter text-sm text-light-primary dark:text-dark-primary"
        >
          {Moment(item.created_at).fromNow()}
        </Text>
      </View>
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter text-light-primary dark:text-dark-primary"
      >
        {item.reflection}
      </Text>
    </View>
  );
};

export default ReflectionItem;
