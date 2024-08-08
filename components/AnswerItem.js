import React from "react";
import Moment from "moment";
import { Image, StyleSheet, Text, View } from "react-native";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const AnswerItem = ({ item, actualTheme, theme }) => {
  return (
    <View
      style={getSecondaryBackgroundColorStyle(actualTheme)}
      className="bg-light-secondary p-3 rounded-lg gap-3 justify-between mb-2 dark:bg-dark-secondary"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-1">
          <Image
            style={styles.profileImg}
            source={{
              uri: item.profiles.avatar_url
                ? item.profiles.avatar_url
                : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
            }}
          />
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter font-bold text-lg text-light-primary dark:text-dark-primary"
          >
            {item.profiles.full_name}
          </Text>
        </View>

        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter font-normal text-light-primary dark:text-gray-400 text-sm"
        >
          {Moment(item.created_at).fromNow()}
        </Text>
      </View>
      <Text
        style={getSecondaryTextColorStyle(actualTheme)}
        className="ml-1 font-inter text-light-primary dark:text-dark-primary font-normal leading-5"
      >
        {item.answer}
      </Text>
    </View>
  );
};

export default AnswerItem;

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentContainer: {
    padding: 10,
    borderRadius: 10,
    gap: 10,
    justifyContent: "space-between",
    flexDirection: "column",
    marginBottom: 5,
  },
  profileImg: {
    width: 50,
    height: 50,
    borderColor: "#A5C9FF",
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 50,
  },
});
