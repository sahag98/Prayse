// @ts-nocheck
import React from "react";
import { useColorScheme } from "nativewind";
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import SettingsItems from "../../components/SettingsItems";
import config from "../../config";
import { SETTINGS_SCREEN, VERSE_OF_THE_DAY_SCREEN } from "../../routes";
import { Container, HeaderTitle } from "../../styles/appStyles";

const MoreScreen = () => {
  const theme = useSelector((state: any) => state.user.theme);
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  function giveFeedback(market: string) {
    if (market == "android") {
      Linking.openURL(
        `market://details?id=${config.androidPackageName}&showAllReviews=true`,
      );
    }
    if (market == "ios") {
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${config.iosItemId}?action=write-review`,
      );
    }
  }

  const options = [
    {
      id: 1,
      icon: (
        <Ionicons
          name="book-outline"
          className="mr-3"
          size={24}
          color={
            actualTheme && actualTheme.SecondaryTxt
              ? actualTheme.SecondaryTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      ),
      title: "Verse of the Day",
      screen: VERSE_OF_THE_DAY_SCREEN,
    },
    {
      id: 2,
      icon: (
        <AntDesign
          name="setting"
          className="mr-3"
          size={24}
          color={
            actualTheme && actualTheme.SecondaryTxt
              ? actualTheme.SecondaryTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      ),
      title: "Settings",
      screen: SETTINGS_SCREEN,
    },
    {
      id: 3,
      icon: (
        <AntDesign
          name="infocirlceo"
          className="mr-3"
          size={24}
          color={
            actualTheme && actualTheme.SecondaryTxt
              ? actualTheme.SecondaryTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      ),
      title: "About",
      link: "https://www.prayse.app/",
    },
    {
      id: 4,
      icon: (
        <Feather
          name="shield"
          className="mr-3"
          size={24}
          color={
            actualTheme && actualTheme.SecondaryTxt
              ? actualTheme.SecondaryTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      ),
      title: "Privacy Policy",
      link: "https://www.prayse.app/privacy",
    },
    {
      id: 5,
      icon: (
        <MaterialCommunityIcons
          name="email-edit-outline"
          className="mr-3"
          size={24}
          color={
            actualTheme && actualTheme.SecondaryTxt
              ? actualTheme.SecondaryTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      ),
      title: "Contact Developer",
      link: "mailto:arzsahag@gmail.com",
    },
    {
      id: 6,
      icon: (
        <AntDesign
          name="instagram"
          className="mr-3"
          size={24}
          color={
            actualTheme && actualTheme.SecondaryTxt
              ? actualTheme.SecondaryTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
      ),
      title: "Follow us on Instagram",
      link: "https://instagram.com/prayse.app",
    },
  ];

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <View className="flex-row justify-between items-center mb-3">
        <HeaderTitle
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter font-bold text-light-primary dark:text-dark-primary"
        >
          More
        </HeaderTitle>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://www.buymeacoffee.com/prayse")}
          style={getPrimaryBackgroundColorStyle(actualTheme)}
          className="flex-row items-center justify-center gap-3 p-2 rounded-lg bg-light-primary dark:bg-dark-accent"
        >
          <AntDesign name="hearto" size={24} color="#DE3163" />
          <Text
            style={getPrimaryTextColorStyle(actualTheme)}
            className="font-inter font-bold text-light-background dark:text-dark-background"
          >
            Give
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="pt-3" showsVerticalScrollIndicator={false}>
        <SettingsItems
          actualTheme={actualTheme}
          options={options}
          theme={colorScheme}
        />

        <TouchableOpacity
          onPress={() => {
            if (Platform.OS === "ios") {
              giveFeedback("ios");
            } else if (Platform.OS === "android") {
              giveFeedback("android");
            }
          }}
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="w-full flex-row items-center bg-light-secondary dark:bg-dark-secondary p-5 rounded-lg justify-between mb-3"
        >
          <View className="flex-row items-center">
            <MaterialIcons
              name="feedback"
              size={24}
              className="mr-3"
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
              className="font-inter text-lg font-medium text-light-primary dark:text-dark-primary"
            >
              Feedback
            </Text>
          </View>
          <AntDesign
            name="right"
            size={14}
            color={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
};

export default MoreScreen;
