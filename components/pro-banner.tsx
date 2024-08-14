import React from "react";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { AntDesign } from "@expo/vector-icons";
import {
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
} from "@lib/customStyles";
import { PRO_SCREEN } from "@routes";

interface ProBannerProps {
  theme: string;
  actualTheme: {
    Accent: string;
    AccentTxt: string;
    Bg: string;
    MainTxt: string;
    Primary: string;
    PrimaryTxt: string;
    Secondary: string;
    SecondaryTxt: string;
    id: string;
  };
}
export const ProBanner: React.FC<ProBannerProps> = ({ theme, actualTheme }) => {
  return (
    <Link
      href={`/${PRO_SCREEN}`}
      style={getPrimaryBackgroundColorStyle(actualTheme)}
      className="w-full flex-row items-center justify-between p-5 mb-3 rounded-lg bg-light-primary dark:bg-dark-secondary"
      asChild
    >
      <TouchableOpacity className="w-full flex-row items-center justify-between p-5 rounded-lg bg-light-primary dark:bg-dark-secondary">
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={24}
            color={
              actualTheme && actualTheme.PrimaryTxt
                ? actualTheme.PrimaryTxt
                : theme === "dark"
                  ? "yellow"
                  : "yellow"
            }
          />
          <Text
            style={getPrimaryTextColorStyle(actualTheme)}
            className="font-inter font-bold text-lg dark:text-yellow text-yellow-200"
          >
            Pro Features
          </Text>
        </View>
        <AntDesign
          name="right"
          size={24}
          color={
            actualTheme && actualTheme.PrimaryTxt
              ? actualTheme.PrimaryTxt
              : "yellow"
          }
        />
      </TouchableOpacity>
    </Link>
  );
};
