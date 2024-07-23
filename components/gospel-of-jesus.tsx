import React from "react";
import { Link } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import { GOSPEL_SCREEN } from "../routes";

export const GospelOfJesus = ({ actualTheme }: { actualTheme: any }) => {
  return (
    <Link asChild href={`/${GOSPEL_SCREEN}`}>
      <TouchableOpacity
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="bg-white dark:bg-dark-secondary mb-[15px] w-full p-[15px] rounded-lg gap-[15px]"
      >
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="text-light-primary dark:text-[#d2d2d2] font-inter text-lg font-medium"
        >
          Gospel of Jesus
        </Text>
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="leading-6 font-inter font-bold text-light-primary dark:text-white text-xl"
        >
          How can someone receive Jesus and get saved?
        </Text>
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="leading-6 underline font-inter font-normal text-base text-light-primary dark:text-dark-accent"
        >
          Click here to learn more
        </Text>
      </TouchableOpacity>
    </Link>
  );
};
