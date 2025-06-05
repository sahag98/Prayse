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
  FontAwesome,
} from "@expo/vector-icons";
import {
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { posthog } from "@lib/posthog";

import DailysItems from "../../components/DailysItems";
import SettingsItems from "../../components/SettingsItems";
import FeedbackItems from "../../components/FeedbackItems";
import config from "../../config";
import {
  PRAISE_SCREEN,
  SETTINGS_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "../../routes";

import { SafeAreaView } from "react-native-safe-area-context";
import { ActualTheme } from "../../types/reduxTypes";

const MoreScreen = () => {
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
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
        <MaterialCommunityIcons
          className="mr-3"
          name="hours-24"
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
      title: "Daily Praises",
      screen: PRAISE_SCREEN,
    },

    // {
    //   id: 4,
    //   icon: (
    //     <FontAwesome5
    //       className="mr-3"
    //       name="bible"
    //       size={24}
    //       color={
    //         actualTheme && actualTheme.SecondaryTxt
    //           ? actualTheme.SecondaryTxt
    //           : colorScheme === "dark"
    //             ? "white"
    //             : "#2f2d51"
    //       }
    //     />
    //   ),
    //   title: "New Bible Study app!",
    //   link:
    //     Platform.OS == "ios"
    //       ? "https://apps.apple.com/us/app/bible-study-prayse/id6739017076"
    //       : "https://play.google.com/store/apps/details?id=com.sahag98.praysetogether",
    // },
  ];

  const feedback = [
    {
      id: 1,
      icon: (
        <Feather
          name="thumbs-up"
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
      title: "Write a Review",
      link: "review",
    },
    {
      id: 2,
      icon: (
        <FontAwesome
          name="pencil-square-o"
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
      ),
      title: "Contact us",
      link: "https://www.prayse.app/contact",
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
    <SafeAreaView
      edges={["top"]}
      style={{
        backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
      }}
      // style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background px-4 flex-1 dark:bg-dark-background"
    >
      {/* <View className="flex-row justify-between items-center mb-4">
        <HeaderTitle
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-bold text-light-primary dark:text-dark-primary"
        >
          More
        </HeaderTitle>
      </View> */}

      <ScrollView
        contentContainerStyle={{ gap: 10 }}
        className="bg-light-background mt-10 dark:bg-dark-background px-4"
        showsVerticalScrollIndicator={false}
      >
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="  mb-2 gap-2  rounded-lg justify-between first-line:mb-3"
        >
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-bold text-3xl text-light-primary dark:text-dark-primary"
          >
            Prayse
          </Text>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter-regular leading-6 text-lg text-light-primary dark:text-dark-primary"
          >
            Prayse will always be free, and your support helps us continue
            working on the app and furthering the importance of prayer and
            praise in today's world.
          </Text>
          <TouchableOpacity
            onPress={() => {
              posthog.capture("Donate");
              Linking.openURL("https://www.prayse.app/support");
            }}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="bg-light-primary items-center mt-2 justify-center dark:bg-dark-accent p-4 rounded-lg"
          >
            <Text
              style={getPrimaryTextColorStyle(actualTheme)}
              className="font-inter-bold text-lg text-light-background dark:text-dark-background"
            >
              Be a Blessing
            </Text>
          </TouchableOpacity>
        </View>
        <SettingsItems
          actualTheme={actualTheme}
          options={options}
          theme={colorScheme}
        />
        <FeedbackItems
          actualTheme={actualTheme}
          options={feedback}
          theme={colorScheme}
        />
        <DailysItems
          actualTheme={actualTheme}
          options={dailys}
          theme={colorScheme}
        />

        <View className="flex-row justify-center gap-10 mt-5 items-center">
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
    </SafeAreaView>
  );
};

export default MoreScreen;
