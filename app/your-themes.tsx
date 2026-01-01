import React from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { resetTheme, selectTheme } from "@redux/themeReducer";
import { CREATE_THEME_SCREEN } from "@routes";
import { ActualTheme } from "../types/reduxTypes";

interface AvailableTheme {
  id: number;
  Bg: string;
  MainTxt: string;
  Primary: string;
  Secondary: string;
  PrimaryTxt: string;
  SecondaryTxt: string;
  Accent: string;
  AccentTxt: string;
}

interface RootState {
  theme: {
    actualTheme: ActualTheme;
  };
}

const YourThemesScreen = () => {
  const { colorScheme } = useColorScheme();

  const availableThemes: AvailableTheme[] = [
    {
      id: 1,
      Bg: "white",
      MainTxt: "#212121",
      Primary: "#212121",
      Secondary: "#efefef",
      PrimaryTxt: "white",
      SecondaryTxt: "#212121",
      Accent: "#b4b4b4",
      AccentTxt: "#212121",
    },
    {
      id: 2,
      Bg: "#0D0E32",
      MainTxt: "white",
      Primary: "#6455CB",
      Secondary: "#303354",
      PrimaryTxt: "white",
      SecondaryTxt: "white",
      Accent: "#b4b4b4",
      AccentTxt: "black",
    },
    {
      id: 3,
      Bg: "white",
      MainTxt: "#333333",
      Primary: "#FF7F50",
      Secondary: "#ffd7c7",
      PrimaryTxt: "white",
      SecondaryTxt: "#333333",
      Accent: "#b4b4b4",
      AccentTxt: "black",
    },
    {
      id: 4,
      Bg: "#1A1F2A",
      MainTxt: "white",
      Primary: "#31CC98",
      Secondary: "#2E3347",
      PrimaryTxt: "#1A1F2A",
      SecondaryTxt: "white",
      Accent: "#b4b4b4",
      AccentTxt: "black",
    },
    {
      id: 5,
      Bg: "white",
      MainTxt: "#333333",
      Primary: "#0156F2",
      Secondary: "#e0ebff",
      PrimaryTxt: "white",
      SecondaryTxt: "#333333",
      Accent: "#b4b4b4",
      AccentTxt: "black",
    },
    {
      id: 6,
      Bg: "#0C192F",
      MainTxt: "white",
      Primary: "#0156F2",
      Secondary: "#112a4f",
      PrimaryTxt: "white",
      SecondaryTxt: "white",
      Accent: "#b4b4b4",
      AccentTxt: "black",
    },
  ];

  console.log(availableThemes[0].Bg);

  const dispatch = useDispatch();

  const actualTheme = useSelector((state: RootState) => state.theme.actualTheme);

  console.log("actual theme: ", actualTheme);
  return (
    <View
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <View>
        <Link href="/pro">
          <View className="flex-row items-center justify-between gap-2">
            <AntDesign
              name="left"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : "white"
                  : actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className=" font-inter-bold dark:text-white text-light-primary text-center text-3xl"
            >
              Themes
            </Text>
          </View>
        </Link>
      </View>

      {availableThemes.length === 0 ? (
        <View className="flex-1 items-center gap-3 justify-center">
          <Text className="font-inter-medium text-lg text-light-primary dark:text-white">
            No themes yet.
          </Text>
          <Link asChild href={`/${CREATE_THEME_SCREEN}`}>
            <TouchableOpacity className="w-fit p-4 items-center rounded-md bg-light-primary dark:bg-dark-accent">
              <Text className="font-inter-bold text-white dark:text-dark-background">
                Create Theme
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => dispatch(resetTheme())}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="w-full mb-3 justify-center rounded-lg items-center p-4 bg-light-primary dark:bg-dark-accent"
          >
            <Text
              style={getPrimaryTextColorStyle(actualTheme)}
              className="font-inter-bold text-light-background dark:text-dark-background"
            >
              Go back to main theme
            </Text>
          </TouchableOpacity>
          <FlatList
            className="flex-1 w-full"
            numColumns={2}
            columnWrapperClassName=" justify-between"
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            data={availableThemes}
            renderItem={({ item }: { item: AvailableTheme }) => (
              <TouchableOpacity
                onPress={() => dispatch(selectTheme(item))}
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                className="bg-light-secondary dark:bg-dark-secondary w-[48%] mb-3 p-3 gap-3 rounded-lg"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-semibold text-sm text-light-primary dark:text-dark-primary"
                  >
                    Background
                  </Text>
                  <View
                    className="w-7 h-7 border dark:border-white rounded-md"
                    style={{ backgroundColor: item.Bg }}
                  />
                </View>
                <View className="flex-row items-center justify-between gap-3">
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-semibold text-sm text-light-primary dark:text-dark-primary"
                  >
                    Primary
                  </Text>
                  <View
                    className="w-7 h-7 border dark:border-white rounded-md"
                    style={{ backgroundColor: item.Primary }}
                  />
                </View>
                <View className="flex-row items-center justify-between gap-3">
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-semibold text-sm text-light-primary dark:text-dark-primary"
                  >
                    Secondary
                  </Text>
                  <View
                    className="w-7 h-7 border dark:border-white rounded-md"
                    style={{ backgroundColor: item.Secondary }}
                  />
                </View>
                <View className="flex-row items-center justify-between gap-3">
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-semibold text-sm text-light-primary dark:text-dark-primary"
                  >
                    Main Text
                  </Text>
                  <View
                    className="w-7 h-7 border dark:border-white rounded-md"
                    style={{ backgroundColor: item.MainTxt }}
                  />
                </View>
                <View className="flex-row items-center justify-between gap-3">
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-semibold text-sm text-light-primary dark:text-dark-primary"
                  >
                    Primary Text
                  </Text>
                  <View
                    className="w-7 h-7 border dark:border-white rounded-md"
                    style={{ backgroundColor: item.PrimaryTxt }}
                  />
                </View>
                <View className="flex-row items-center justify-between gap-3">
                  <Text
                    style={getSecondaryTextColorStyle(actualTheme)}
                    className="font-inter-semibold text-sm text-light-primary dark:text-dark-primary"
                  >
                    Secondary Text
                  </Text>
                  <View
                    className="w-7 h-7 border dark:border-white rounded-md"
                    style={{ backgroundColor: item.SecondaryTxt }}
                  />
                </View>

                <TouchableOpacity
                  style={getPrimaryBackgroundColorStyle(actualTheme)}
                  onPress={() => dispatch(selectTheme(item))}
                  className="w-full items-center mt-3 justify-center p-3 rounded-md bg-light-primary dark:bg-dark-accent"
                >
                  <Text
                    style={getPrimaryTextColorStyle(actualTheme)}
                    className="font-inter-bold text-light-background dark:text-dark-background"
                  >
                    Select
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </View>
  );
};

export default YourThemesScreen;
