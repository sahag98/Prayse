import React from "react";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { posthog } from "@lib/posthog";

import { GOSPEL_SCREEN } from "../routes";
import { ActualTheme } from "../types/reduxTypes";

export const GospelOfJesus = ({
  actualTheme,
}: {
  actualTheme: ActualTheme;
}) => {
  return (
    <Link asChild href={`/${GOSPEL_SCREEN}`}>
      <TouchableOpacity
        onPress={() => posthog.capture("Checking Gospel")}
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="bg-white dark:bg-dark-secondary mb-4 w-full p-4 rounded-lg gap-3"
      >
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="text-light-primary dark:text-[#d2d2d2] font-inter-medium"
        >
          Gospel of Jesus
        </Text>
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-semibold text-light-primary dark:text-white text-xl"
        >
          What does it mean to receive Jesus and begin a relationship with Him?
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
