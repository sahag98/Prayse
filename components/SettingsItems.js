import { Linking, Text, TouchableOpacity, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import { Link } from "expo-router";

const SettingsItems = ({ options, actualTheme, theme }) => {
  return (
    <>
      {options.map((option) =>
        option.link ? (
          <TouchableOpacity
            key={option.id}
            onPress={() => Linking.openURL(option.link)}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="w-full flex-row items-center bg-light-secondary dark:bg-dark-secondary p-5 rounded-lg justify-between mb-3"
          >
            <View className="flex-row items-center">
              {option.icon}

              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter text-lg font-medium text-light-primary dark:text-dark-primary"
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
          <Link href={`/${option.screen}`} key={option.id}>
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-full flex-row items-center bg-light-secondary dark:bg-dark-secondary p-5 rounded-lg justify-between mb-3"
            >
              <View className="flex-row items-center">
                {option.icon}
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter text-lg font-medium text-light-primary dark:text-dark-primary"
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
            </View>
          </Link>
        )
      )}
    </>
  );
};

export default SettingsItems;
