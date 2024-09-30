import { Linking, Text, TouchableOpacity, View } from "react-native";

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
        Dailys
      </Text>
      <View
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="bg-light-secondary dark:border-[#5a5a5a] border-light-primary border-[0.5px] dark:bg-dark-secondary rounded-lg overflow-hidden"
      >
        {options.map((option) =>
          option.link ? (
            <TouchableOpacity
              key={option.id}
              onPress={() => Linking.openURL(option.link)}
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-full flex-row items-center bg-light-secondary dark:bg-dark-secondary p-5 justify-between "
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
                style={{ marginLeft: 10 }}
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
            <Link asChild href={`/${option.screen}`} key={option.id}>
              <TouchableOpacity
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                className={cn(
                  "w-full flex-row items-center bg-light-secondary dark:bg-dark-secondary p-5 justify-between",
                  option.id === 1 &&
                    "border-b-[0.5px] border-b-light-primary dark:border-b-[#d2d2d2]"
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
                  style={{ marginLeft: 10 }}
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
          )
        )}
      </View>
    </View>
  );
};

export default DailysItems;
