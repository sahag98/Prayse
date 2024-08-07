// @ts-nocheck

import React from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import { deleteTheme, selectTheme } from "@redux/themeReducer";
import { CREATE_THEME_SCREEN } from "@routes";
import { Container, HeaderView } from "@styles/appStyles";

const YourThemesScreen = () => {
  const { colorScheme } = useColorScheme();
  const dispatch = useDispatch();
  const width = Dimensions.get("window").width - 40;

  const customThemeArray = useSelector((state) => state.theme.customThemeArray);
  const actualTheme = useSelector((state) => state.theme.actualTheme);

  console.log("actual theme: ", actualTheme);
  return (
    <Container
      style={
        colorScheme == "dark"
          ? { backgroundColor: actualTheme.Bg ? actualTheme.Bg : "#121212" }
          : { backgroundColor: actualTheme.Bg ? actualTheme.Bg : "#F2F7FF" }
      }
    >
      <HeaderView>
        <Link href="/pro">
          <View className="flex-row items-center justify-between gap-2">
            <AntDesign
              name="left"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : "white"
                  : actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={
                actualTheme.MainTxt && {
                  color: actualTheme?.MainTxt ?? null,
                }
              }
              className="font-bold font-inter dark:text-white text-light-primary text-center text-3xl"
            >
              Your Themes
            </Text>
          </View>
        </Link>
      </HeaderView>

      {customThemeArray.length === 0 ? (
        <View className="flex-1 items-center gap-3 justify-center">
          <Text className="font-inter font-medium text-lg text-light-primary dark:text-white">
            No themes yet.
          </Text>
          <Link asChild href={`/${CREATE_THEME_SCREEN}`}>
            <TouchableOpacity className="w-fit p-4 items-center rounded-md bg-light-primary dark:bg-dark-accent">
              <Text className="font-inter font-bold text-white dark:text-dark-background">
                Create Theme
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <FlatList
          className="flex-1 w-full"
          numColumns={2}
          columnWrapperClassName="gap-3"
          keyExtractor={(item) => item.id}
          data={customThemeArray}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => dispatch(selectTheme(item))}
              style={
                item.Secondary
                  ? {
                      width: width / 2,
                      backgroundColor: item.Secondary ?? null,
                    }
                  : {
                      width: width / 2,
                    }
              }
              className="bg-light-secondary mb-3 p-3 gap-3 rounded-lg"
            >
              <View className="flex-row items-center justify-between gap-3">
                <Text
                  style={{ color: item.PrimaryTxt ?? null }}
                  className="font-inter  font-semibold"
                >
                  Background{" "}
                </Text>
                <View
                  className="w-7 h-7 border dark:border-white rounded-md"
                  style={{ backgroundColor: item.Bg }}
                />
              </View>
              <View className="flex-row items-center justify-between gap-3">
                <Text
                  style={{ color: item.PrimaryTxt ?? null }}
                  className="font-inter  font-semibold"
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
                  style={{ color: item.PrimaryTxt ?? null }}
                  className="font-inter  font-semibold"
                >
                  Secondary{" "}
                </Text>
                <View
                  className="w-7 h-7 border dark:border-white rounded-md"
                  style={{ backgroundColor: item.Secondary }}
                />
              </View>
              <View className="flex-row items-center justify-between gap-3">
                <Text
                  style={{ color: item.MainTxt ?? null }}
                  className="font-inter  font-semibold"
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
                  style={{ color: item.PrimaryTxt ?? null }}
                  className="font-inter  font-semibold"
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
                  style={{ color: item.PrimaryTxt ?? null }}
                  className="font-inter  font-semibold"
                >
                  Secondary Text
                </Text>
                <View
                  className="w-7 h-7 border dark:border-white rounded-md"
                  style={{ backgroundColor: item.SecondaryTxt }}
                />
              </View>

              <TouchableOpacity
                style={
                  item.Primary && {
                    backgroundColor: item.Primary ?? null,
                  }
                }
                onPress={() => dispatch(deleteTheme(item.id))}
                className="w-full items-center mt-3 justify-center p-3 rounded-md bg-light-primary dark:bg-dark-accent"
              >
                <Text
                  style={
                    item.PrimaryTxt && {
                      color: actualTheme.PrimaryTxt ?? null,
                    }
                  }
                  className="font-inter font-bold text-light-background dark:text-dark-primary"
                >
                  Delete
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </Container>
  );
};

export default YourThemesScreen;

const styles = StyleSheet.create({});
