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
import { posthog } from "@lib/posthog";

import SettingsItems from "../../components/SettingsItems";
import config from "../../config";
import {
  DEVO_LIST_SCREEN,
  SETTINGS_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "../../routes";
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
        <Feather
          name="book"
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
      title: "Devotional",
      screen: DEVO_LIST_SCREEN,
    },
    {
      id: 3,
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
      id: 4,
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
      id: 5,
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
  ];

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <View className="flex-row justify-between items-center mb-4">
        <HeaderTitle
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter font-bold text-light-primary dark:text-dark-primary"
        >
          More
        </HeaderTitle>
      </View>

      <ScrollView
        contentContainerStyle={{ gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className=" bg-light-secondary mb-5 gap-2 dark:bg-dark-secondary p-5 rounded-lg justify-between first-line:mb-3"
        >
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-bold text-xl text-light-primary dark:text-dark-primary"
          >
            Donate
          </Text>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter leading-6 text-lg text-light-primary dark:text-dark-primary"
          >
            Prayse is and will always be free. By donating, you support us to
            keep working on this app, and to further our mission in spreading
            the importance of prayer in today's world.
          </Text>
          <TouchableOpacity
            onPress={() => {
              posthog.capture("Donate");
              Linking.openURL("https://buymeacoffee.com/prayse");
            }}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="bg-light-primary items-center mt-2 justify-center dark:bg-dark-accent p-4 rounded-lg"
          >
            <Text
              style={getPrimaryTextColorStyle(actualTheme)}
              className="font-inter font-bold text-lg text-light-background dark:text-dark-background"
            >
              Donate
            </Text>
          </TouchableOpacity>
        </View>
        <SettingsItems
          actualTheme={actualTheme}
          options={options}
          theme={colorScheme}
        />

        <View className="flex-row justify-around mt-5 items-center">
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("mailto:prayse.app@gmail.com");
            }}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary dark:bg-dark-secondary p-4  justify-center items-center rounded-lg"
          >
            <MaterialCommunityIcons
              name="email-edit-outline"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("https://instagram.com/prayse.app");
            }}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary dark:bg-dark-secondary p-4  justify-center items-center rounded-lg"
          >
            <AntDesign
              name="instagram"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (Platform.OS === "ios") {
                giveFeedback("ios");
              } else if (Platform.OS === "android") {
                giveFeedback("android");
              }
            }}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary dark:bg-dark-secondary p-4  justify-center items-center rounded-lg"
          >
            <MaterialIcons
              name="feedback"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
        </View>
        <View className="justify-center  items-center my-4">
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-medium text-lg mb-1 text-light-primary dark:text-dark-primary"
          >
            Made with 🙏 by Sahag
          </Text>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter text-sm text-light-primary dark:text-dark-primary"
          >
            "Be careful for nothing; but in every thing by prayer and
            supplication with thanksgiving let your requests be made known unto
            God. And the peace of God, which passeth all understanding, shall
            keep your hearts and minds through Christ Jesus."
          </Text>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter self-end font-medium text-sm text-light-primary dark:text-dark-primary"
          >
            - Philippians 4:6-7
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};

export default MoreScreen;
