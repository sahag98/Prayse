import React from "react";
import { useColorScheme } from "nativewind";
import {
  Alert,
  Modal,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "../types/reduxTypes";

import { ModalContainer } from "../styles/appStyles";

interface StreakSliderProps {
  isShowingStreak: boolean;
  setIsShowingStreak: React.Dispatch<React.SetStateAction<boolean>>;
  actualTheme: ActualTheme;
  theme: string;
  streak: number;
  appstreak: number;
}
const StreakSlider = ({
  isShowingStreak,
  setIsShowingStreak,
  actualTheme,
  theme,
  streak,
  appstreak,
}: StreakSliderProps) => {
  const { colorScheme } = useColorScheme();

  const onShare = async () => {
    try {
      await Share.share({
        message:
          "Hey! Check out my Prayse streaks: " +
          "\n" +
          "\n" +
          `App Streak: ${appstreak}` +
          "\n" +
          `Daily Devotions Streak: ${streak}` +
          "\n" +
          "\n" +
          "Download now to create prayer lists, setup reminders, and organize your walk with God." +
          "\n" +
          "Prayse on Android, Prayse - Prayer Journal on IOS.",
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent
      visible={isShowingStreak}
      onRequestClose={() => setIsShowingStreak(false)}
      statusBarTranslucent
    >
      <ModalContainer
        style={
          colorScheme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="w-10/12 rounded-3xl p-5 gap-3 bg-light-secondary dark:bg-dark-secondary"
        >
          <AntDesign
            className="self-end"
            onPress={() => setIsShowingStreak(false)}
            name="close"
            size={28}
            color={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="text-center font-inter-bold text-3xl text-[#2f2d51] dark:text-white"
          >
            Streaks
          </Text>
          <View className="w-full mt-[10px] flex-row items-center">
            <View className="w-1/2 items-center">
              <View className="flex-row items-center gap-2">
                <FontAwesome
                  name="calendar-check-o"
                  size={22}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                        ? "white"
                        : "#2f2d51"
                  }
                />

                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-bold text-light-primary dark:text-white text-5xl"
                >
                  {appstreak}
                </Text>
              </View>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-base text-light-primary dark:text-[#d2d2d2]"
              >
                App streak
              </Text>
            </View>
            <View className="w-1/2 items-center">
              <View className="flex-row items-center gap-2">
                <MaterialCommunityIcons
                  name="hands-pray"
                  size={22}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                        ? "white"
                        : "#2f2d51"
                  }
                />
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-bold text-light-primary dark:text-white text-5xl"
                >
                  {streak}
                </Text>
              </View>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter font-bold text-base text-light-primary dark:text-[#d2d2d2]"
              >
                Devotions streak
              </Text>
            </View>
          </View>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className=" dark:text-white text-light-primary text-center font-inter-medium text-base mt-[5px]"
          >
            Thank you for using our app every day.
          </Text>

          <TouchableOpacity
            onPress={onShare}
            className="self-end flex-row items-center gap-[10px]"
          >
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="text-light-primary dark:text-dark-accent text-lg font-inter-semibold"
            >
              Share
            </Text>
            <Feather
              name="share"
              size={20}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "#a5c9ff"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default StreakSlider;
