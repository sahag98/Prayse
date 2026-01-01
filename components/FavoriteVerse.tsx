import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign } from "@expo/vector-icons";

import { deleteFavoriteVerse } from "../redux/favoritesReducer";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const FavoriteVerses = ({ item, theme, actualTheme }: any) => {
  const dispatch = useDispatch();

  const dateObject = new Date(item?._updatedAt);
  return (
    <View
      style={getSecondaryBackgroundColorStyle(actualTheme)}
      className="bg-light-secondary dark:bg-dark-secondary p-3 rounded-lg flex-row items-center"
      key={item.id}
    >
      <View className="w-full">
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-bold text-light-primary dark:text-dark-primary text-lg"
        >
          {dateObject?.toDateString()}
        </Text>
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-regular text-light-primary dark:text-dark-primary leading-6 mt-1"
        >
          {item.verse}
        </Text>
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="self-end mt-2 text-light-primary dark:text-dark-primary font-inter-medium"
        >
          - {item.chapter}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => dispatch(deleteFavoriteVerse(item.id))}
        className="absolute top-2 right-2"
      >
        <AntDesign
          name="close"
          size={24}
          color={theme === "dark" ? "#ff6262" : "#ff4e4e"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FavoriteVerses;
