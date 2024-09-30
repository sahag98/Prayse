import React, { useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import { StyleSheet, Text, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
const HowtoUsePrayse = ({ actualTheme, theme }: any) => {
  const video = useRef(null);
  return (
    <View className="border-t border-t-gray-300 pt-3 pb-4">
      <View className="flex-row items-center mb-3 gap-2">
        <Ionicons
          name="information-circle-outline"
          size={24}
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
          className="font-inter-semibold mb-1 text-xl text-light-primary dark:text-dark-primary"
        >
          Introudction to our app
        </Text>
      </View>
      <View
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="dark:bg-dark-secondary gap-3 bg-light-secondary p-4 rounded-lg"
      >
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-medium text-light-primary dark:text-dark-primary"
        >
          Watch this short video to learn all about the app features.
        </Text>
        <Video
          ref={video}
          style={{ width: "100%", aspectRatio: 1 / 1 }}
          source={{
            uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onPlaybackStatusUpdate={(status) => setStatus(status)}
        />
      </View>
    </View>
  );
};

export default HowtoUsePrayse;
