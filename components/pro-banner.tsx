import React from "react";
import { Link } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { AntDesign } from "@expo/vector-icons";
import { PRO_SCREEN } from "@routes";

interface ProBannerProps {
  theme: string;
}
export const ProBanner: React.FC<ProBannerProps> = ({ theme }) => {
  return (
    <Link
      href={`/${PRO_SCREEN}`}
      className="w-full flex-row items-center justify-between p-5 mb-3 rounded-lg bg-light-primary dark:bg-dark-secondary"
      asChild
    >
      <TouchableOpacity className="w-full flex-row items-center justify-between p-5 rounded-lg bg-light-primary dark:bg-dark-secondary">
        <View className="flex-row items-center gap-3">
          <MaterialCommunityIcons
            name="lightning-bolt-outline"
            size={24}
            color={theme === "dark" ? "yellow" : "yellow"}
          />
          <Text className="font-inter font-bold text-lg dark:text-yellow text-yellow-200">
            Pro Features
          </Text>
        </View>
        <AntDesign name="right" size={24} color="yellow" />
      </TouchableOpacity>
    </Link>
  );
};
