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
          className="leading-6 font-inter-bold text-light-primary dark:text-white text-xl"
        >
          How can someone receive Jesus, and get saved?
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
