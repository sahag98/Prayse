import { Linking, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import { Link } from "expo-router";
import { cn } from "@lib/utils";

const DailysItems = ({ options, actualTheme, theme }) => {
  return (
    <View className="gap-2">
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter-semibold text-light-primary dark:text-white text-xl"
      >
        More
      </Text>
      <View className=" rounded-lg overflow-hidden">
        {options.map((option) => (
          <React.Fragment key={option.id}>
            {option.link ? (
              <TouchableOpacity
                key={option.id}
                onPress={() => Linking.openURL(option.link)}
                className={cn(
                  "w-full flex-row items-center bg-light-secondary dark:bg-dark-secondary p-5 justify-between",
                  option.id === 1 &&
                    "border-b border-b-light-primary/50 dark:border-b-[#585858]"
                )}
              >
                <View className="flex-row items-center">
                  {option.icon}
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
                  >
                    {option.title}
                  </Text>
                </View>
                <AntDesign
                  name="right"
                  size={14}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : theme === "dark"
                        ? "white"
                        : "#2f2d51"
                  }
                />
              </TouchableOpacity>
            ) : (
              <Link
                asChild
                href={`/${option.screen}`}
                style={[
                  getSecondaryBackgroundColorStyle(actualTheme),
                  actualTheme &&
                    actualTheme.MainTxt && { borderBottomColor: "lightgray" },
                ]}
                key={option.id}
              >
                <TouchableOpacity
                  className={cn(
                    "w-full flex-row items-center bg-light-secondary dark:bg-dark-secondary p-5 justify-between",
                    option.id === 1 &&
                      "border-b border-b-light-primary/50 dark:border-b-[#585858]"
                  )}
                >
                  <View className="flex-row items-center">
                    {option.icon}
                    <Text
                      style={getSecondaryTextColorStyle(actualTheme)}
                      className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
                    >
                      {option.title}
                    </Text>
                  </View>
                  <AntDesign
                    name="right"
                    size={14}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : theme === "dark"
                          ? "white"
                          : "#2f2d51"
                    }
                  />
                </TouchableOpacity>
              </Link>
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default DailysItems;
