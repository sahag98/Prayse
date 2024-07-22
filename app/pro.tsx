// @ts-nocheck
import React from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { CREATE_THEME_SCREEN, YOUR_THEMES_SCREEN } from "@routes";
import { Container, HeaderView } from "@styles/appStyles";
const ProScreen = () => {
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector((state) => state.theme.actualTheme);
  return (
    <Container
      style={
        colorScheme == "dark"
          ? { backgroundColor: actualTheme.Bg ? actualTheme.Bg : "#121212" }
          : { backgroundColor: actualTheme.Bg ? actualTheme.Bg : "#F2F7FF" }
      }
    >
      <HeaderView>
        <Link href="/">
          <View className="flex-row items-center justify-between gap-2">
            <AntDesign
              name="left"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme.Primary
                    ? actualTheme.Primary
                    : "white"
                  : actualTheme.Primary
                    ? actualTheme.Primary
                    : "#2f2d51"
              }
            />
            <Text
              style={
                actualTheme.Primary && {
                  color: actualTheme?.Primary ?? null,
                }
              }
              className="font-bold font-inter dark:text-white text-light-primary text-center text-3xl"
            >
              Pro Features
            </Text>
          </View>
        </Link>
      </HeaderView>
      <View className="flex-row items-center gap-3">
        <Text
          style={
            actualTheme.Primary && {
              color: actualTheme?.Primary ?? null,
            }
          }
          className="font-inter text-primary dark:text-white font-medium text-lg"
        >
          Theme Customization
        </Text>
        <FontAwesome6
          name="brush"
          size={20}
          color={
            colorScheme === "dark"
              ? actualTheme.Primary
                ? actualTheme.Primary
                : "white"
              : actualTheme.Primary
                ? actualTheme.Primary
                : "#2f2d51"
          }
        />
      </View>
      <View className="flex-row justify-between mt-2 w-full gap-3">
        <Link asChild href={`/${CREATE_THEME_SCREEN}`}>
          <TouchableOpacity
            style={
              actualTheme.Secondary && {
                backgroundColor: actualTheme.Secondary ?? null,
              }
            }
            className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary"
          >
            <AntDesign
              name="pluscircleo"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "white"
                  : actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={
                actualTheme.SecondaryTxt && {
                  color: actualTheme.SecondaryTxt ?? null,
                }
              }
              className="font-inter font-medium text-lg text-light-primary dark:text-dark-primary"
            >
              Create Theme
            </Text>
          </TouchableOpacity>
        </Link>
        <Link asChild href={`/${YOUR_THEMES_SCREEN}`}>
          <TouchableOpacity
            style={
              actualTheme.Secondary && {
                backgroundColor: actualTheme.Secondary ?? null,
              }
            }
            className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary"
          >
            <MaterialCommunityIcons
              name="brush-variant"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "white"
                  : actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={
                actualTheme.SecondaryTxt && {
                  color: actualTheme.SecondaryTxt ?? null,
                }
              }
              className="font-inter font-medium text-lg text-light-primaryprimary dark:text-dark-primary"
            >
              Your Themes
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View className="flex-row items-center mt-3 gap-3">
        <Text
          style={
            actualTheme.Primary && {
              color: actualTheme?.Primary ?? null,
            }
          }
          className="font-inter text-primary dark:text-white font-medium text-lg"
        >
          Font Customization
        </Text>
        <FontAwesome6
          name="font"
          size={20}
          color={
            colorScheme === "dark"
              ? actualTheme.Primary
                ? actualTheme.Primary
                : "white"
              : actualTheme.Primary
                ? actualTheme.Primary
                : "#2f2d51"
          }
        />
      </View>
      <View className="flex-row justify-between mt-2 w-full gap-3">
        <Link asChild href={`/${CREATE_THEME_SCREEN}`}>
          <TouchableOpacity
            style={
              actualTheme.Secondary && {
                backgroundColor: actualTheme.Secondary ?? null,
              }
            }
            className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary"
          >
            <AntDesign
              name="pluscircleo"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "white"
                  : actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={
                actualTheme.SecondaryTxt && {
                  color: actualTheme.SecondaryTxt ?? null,
                }
              }
              className="font-inter font-medium text-lg text-light-primary dark:text-dark-primary"
            >
              Create Theme
            </Text>
          </TouchableOpacity>
        </Link>
        <Link asChild href={`/${YOUR_THEMES_SCREEN}`}>
          <TouchableOpacity
            style={
              actualTheme.Secondary && {
                backgroundColor: actualTheme.Secondary ?? null,
              }
            }
            className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary"
          >
            <MaterialCommunityIcons
              name="brush-variant"
              size={24}
              color={
                colorScheme === "dark"
                  ? actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "white"
                  : actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : "#2f2d51"
              }
            />
            <Text
              style={
                actualTheme.SecondaryTxt && {
                  color: actualTheme.SecondaryTxt ?? null,
                }
              }
              className="font-inter font-medium text-lg text-light-primaryprimary dark:text-dark-primary"
            >
              Your Themes
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </Container>
  );
};

export default ProScreen;

const styles = StyleSheet.create({});
