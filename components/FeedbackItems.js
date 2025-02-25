import { Linking, Text, TouchableOpacity, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import { Link } from "expo-router";
import { cn } from "@lib/utils";
import { CheckReview } from "@hooks/useShowReview";

const FeedbackItems = ({ options, actualTheme, theme }) => {
  return (
    <View className="gap-2">
      <Text
        style={getMainTextColorStyle(actualTheme)}
        className="font-inter-semibold text-light-primary dark:text-white text-xl"
      >
        Feedback
      </Text>
      <View className=" rounded-lg overflow-hidden">
        {options.map((option) =>
          option.link ? (
            <TouchableOpacity
              key={option.id}
              onPress={() => {
                if (option.link === "review") {
                  CheckReview();
                  return;
                }
                Linking.openURL(option.link);
              }}
              style={[
                getSecondaryBackgroundColorStyle(actualTheme),
                actualTheme &&
                  actualTheme.MainTxt && {
                    borderBottomColor: "lightgray",
                  },
              ]}
              className={cn(
                `w-full flex-row items-center ${option.id !== 2 && "border-b"}  border-b-light-primary/50 dark:border-b-[#585858] bg-light-secondary dark:bg-dark-secondary p-5 justify-between`
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
          ) : (
            <Link
              asChild
              href={`/${option.screen}`}
              className={cn(
                "w-full flex-row items-center border-b border-b-light-primary/50 dark:border-b-[#585858] bg-light-secondary dark:bg-dark-secondary p-5 justify-between"
              )}
              style={[
                getSecondaryBackgroundColorStyle(actualTheme),
                actualTheme &&
                  actualTheme.MainTxt && {
                    borderBottomColor: "lightgray",
                  },
              ]}
              key={option.id}
            >
              <TouchableOpacity>
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
          )
        )}
      </View>
    </View>
  );
};

export default FeedbackItems;
