import React from "react";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import { Divider } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

import { NewFeaturesModal } from "@modals/new-features-modal";

import { AntDesign, Feather } from "@expo/vector-icons";
import {
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
} from "@lib/customStyles";

const VersionLink: React.FC<QuickLinksProps> = ({ theme, actualTheme }) => {
  const [featureVisible, setFeatureVisible] = React.useState(false);

  return (
    <TouchableOpacity
      onPress={() => setFeatureVisible(true)}
      style={getPrimaryBackgroundColorStyle(actualTheme)}
      className="w-full dark:bg-[#212121] mb-[5px] rounded-lg bg-white px-[6px] py-3 justify-between items-center flex-row"
    >
      <NewFeaturesModal
        theme={theme}
        setFeatureVisible={setFeatureVisible}
        featureVisible={featureVisible}
      />
      <View className="flex-row items-center">
        <Feather
          name="info"
          size={24}
          color={
            actualTheme.PrimaryTxt
              ? actualTheme.PrimaryTxt
              : theme === "dark"
                ? "#f1d592"
                : theme === "BlackWhite"
                  ? "black"
                  : "#bb8b18"
          }
        />
        <Text
          style={getPrimaryTextColorStyle(actualTheme)}
          className="dark:text-[#f1d592] text-[#bb8b18] ml-[10px] font-inter font-medium"
        >
          What's New in v9.5!
        </Text>
      </View>
      <AntDesign
        name="right"
        size={18}
        color={
          actualTheme.PrimaryTxt
            ? actualTheme.PrimaryTxt
            : theme === "dark"
              ? "#f1d592"
              : "#bb8b18"
        }
      />
    </TouchableOpacity>
  );
};

interface QuickLinksProps {
  theme: string;
  actualTheme: {
    Accent: string;
    AccentTxt: string;
    Bg: string;
    MainTxt: string;
    Primary: string;
    PrimaryTxt: string;
    Secondary: string;
    SecondaryTxt: string;
    id: string;
  };
}
export const QuickLinks: React.FC<QuickLinksProps> = ({
  theme,
  actualTheme,
}) => {
  return (
    <View className="w-full mt-auto mb-5">
      <View className="mb-10 w-full gap-[2px]">
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="dark:text-white text-light-primary font-inter font-bold text-lg"
        >
          Quick links
        </Text>
        <Divider className="mb-3 mt-1" />
        <VersionLink actualTheme={actualTheme} theme={theme} />
        {Platform.OS === "android" && (
          <TouchableOpacity
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="w-full dark:bg-dark-secondary mb-[10px] rounded-lg bg-white px-[6px] py-3 justify-between items-center flex-row"
            onPress={() =>
              Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp",
              )
            }
          >
            <View className="flex-row items-center">
              <Ionicons
                name="logo-google-playstore"
                size={24}
                color={
                  actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : theme === "dark"
                      ? "#d6d6d6"
                      : "#606060"
                }
              />
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter dark:text-[#f0f0f0] text-[#606060] font-medium ml-[10px]"
              >
                Check for Updates
              </Text>
            </View>
            <AntDesign
              name="right"
              size={18}
              color={
                actualTheme.PrimaryTxt
                  ? actualTheme.PrimaryTxt
                  : theme === "dark"
                    ? "#d6d6d6"
                    : "#606060"
              }
            />
          </TouchableOpacity>
        )}
        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="w-full dark:bg-dark-secondary mb-[10px] rounded-lg bg-white px-[6px] py-3 justify-between items-center flex-row"
            onPress={() =>
              Linking.openURL(
                "https://apps.apple.com/us/app/prayerlist-app/id6443480347",
              )
            }
          >
            <View className="flex-row items-center">
              <AntDesign
                name="apple1"
                size={24}
                color={
                  actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : theme === "dark"
                      ? "#d6d6d6"
                      : "#606060"
                }
              />
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="ml-[10px] font-inter font-medium dark:text-[#f0f0f0] text-[#606060]"
              >
                Check for Updates
              </Text>
            </View>
            <AntDesign
              name="right"
              size={18}
              color={
                actualTheme.PrimaryTxt
                  ? actualTheme.PrimaryTxt
                  : theme === "dark"
                    ? "#d6d6d6"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
