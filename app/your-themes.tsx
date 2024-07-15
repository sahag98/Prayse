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
import { deleteTheme } from "@redux/themeReducer";
import { CREATE_THEME_SCREEN } from "@routes";
import { Container, HeaderView } from "@styles/appStyles";

const YourThemesScreen = () => {
  const { colorScheme } = useColorScheme();
  const dispatch = useDispatch();
  const width = Dimensions.get("window").width - 40;

  const customThemeArray = useSelector((state) => state.theme.customThemeArray);

  return (
    <Container
      style={
        colorScheme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <HeaderView>
        <Link href="/pro">
          <View className="flex-row items-center justify-between gap-2">
            <AntDesign
              name="left"
              size={24}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
            <Text className="font-bold font-inter dark:text-white text-light-primary text-center text-3xl">
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
            <View
              style={{ width: width / 2 }}
              className="bg-light-secondary mb-3 p-3 gap-3 rounded-lg"
            >
              <View className="flex-row items-center justify-between gap-3">
                <Text className="font-inter  font-semibold">Background </Text>
                <View
                  className="w-7 h-7 border dark:border-white rounded-md"
                  style={{ backgroundColor: item.Bg }}
                />
              </View>
              <View className="flex-row items-center justify-between gap-3">
                <Text className="font-inter  font-semibold">Primary</Text>
                <View
                  className="w-7 h-7 border dark:border-white rounded-md"
                  style={{ backgroundColor: item.Primary }}
                />
              </View>
              <View className="flex-row items-center justify-between gap-3">
                <Text className="font-inter  font-semibold">Secondary </Text>
                <View
                  className="w-7 h-7 border dark:border-white rounded-md"
                  style={{ backgroundColor: item.Secondary }}
                />
              </View>
              <View className="flex-row items-center justify-between gap-3">
                <Text className="font-inter  font-semibold">Primary Text </Text>
                <View
                  className="w-7 h-7 border dark:border-white rounded-md"
                  style={{ backgroundColor: item.PrimaryTxt }}
                />
              </View>
              <View className="flex-row items-center justify-between gap-3">
                <Text className="font-inter  font-semibold">
                  Secondary Text{" "}
                </Text>
                <View
                  className="w-7 h-7 border dark:border-white rounded-md"
                  style={{ backgroundColor: item.SecondaryTxt }}
                />
              </View>
              <TouchableOpacity
                onPress={() => dispatch(deleteTheme(item.id))}
                className="w-full items-center mt-3 justify-center p-3 rounded-md bg-light-primary dark:bg-dark-accent"
              >
                <Text className="font-inter font-bold text-light-background dark:text-dark-primary">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </Container>
  );
};

export default YourThemesScreen;

const styles = StyleSheet.create({});
