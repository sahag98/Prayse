// @ts-nocheck
import React from "react";
import { useColorScheme } from "nativewind";
import {
  Linking,
  Platform,
  ScrollView,
  Share,
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

import DailysItems from "../../components/DailysItems";
import SettingsItems from "../../components/SettingsItems";
import config from "../../config";
import {
  DEVO_LIST_SCREEN,
  SETTINGS_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "../../routes";
import { Container, HeaderTitle } from "../../styles/appStyles";

const MoreScreen = () => {
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  async function shareApp(market: string) {
    if (market === "android") {
      await Share.share({
        title: "Download Prayse",
        message: `Get started on creating organized prayer lists, setup reminders to pray, and more! \n market://details?id=${config.androidPackageName}`,
      });
      // Linking.openURL(`market://details?id=${config.androidPackageName}`);
    }
    if (market === "ios") {
      // Linking.openURL(`itms-apps://itunes.apple.com/app/id${config.iosItemId}`);
      await Share.share({
        message: `Download Prayse Now and get started on creating organized prayer lists, setup reminders to pray, and more! \n itms-apps://itunes.apple.com/app/id${config.iosItemId}`,
      });
    }
  }

  const dailys = [
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
  ];

  const options = [
    {
      id: 1,
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
      id: 2,
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
      id: 3,
      icon: (
        <Ionicons
          name="chatbubble-ellipses-outline"
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
      title: "Feedback Board",
      link: "https://prayse.canny.io/feature-requests",
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
  ];

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <View className="flex-row justify-between items-center mb-4">
        <HeaderTitle
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-bold text-light-primary dark:text-dark-primary"
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
          className=" bg-light-secondary mb-2 gap-2 dark:bg-dark-secondary p-5 rounded-lg justify-between first-line:mb-3"
        >
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-bold text-xl text-light-primary dark:text-dark-primary"
          >
            Donate
          </Text>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter-regular leading-6 text-lg text-light-primary dark:text-dark-primary"
          >
            By donating, you help us further our mission in spreading the
            importance of prayer and praise in today's world through all our
            platforms.
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
              className="font-inter-bold text-lg text-light-background dark:text-dark-background"
            >
              Donate
            </Text>
          </TouchableOpacity>
        </View>
        <DailysItems
          actualTheme={actualTheme}
          options={dailys}
          theme={colorScheme}
        />
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
                shareApp("ios");
              } else if (Platform.OS === "android") {
                shareApp("android");
              }
            }}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary dark:bg-dark-secondary p-4  justify-center items-center rounded-lg"
          >
            <Feather
              name="share"
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
            className="font-inter-medium text-lg mb-1 text-light-primary dark:text-dark-primary"
          >
            Made with 🙏 by Sahag
          </Text>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-regular text-sm text-light-primary dark:text-dark-primary"
          >
            "Be careful for nothing; but in every thing by prayer and
            supplication with thanksgiving let your requests be made known unto
            God. And the peace of God, which passeth all understanding, shall
            keep your hearts and minds through Christ Jesus."
          </Text>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-medium self-end text-sm text-light-primary dark:text-dark-primary"
          >
            - Philippians 4:6-7
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};

export default MoreScreen;
