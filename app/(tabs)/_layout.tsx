import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";

import {
  COMMUNITY_SCREEN,
  DEVOTIONAL_SCREEN,
  FOLDER_SCREEN,
  MORE_SCREEN,
  WELCOME_SCREEN,
} from "@routes";

import { ActualTheme } from "../../types/reduxTypes";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );

  return (
    <>
      <StatusBar
        style={
          actualTheme &&
          (actualTheme.Bg === "#0D0E32" || actualTheme.Bg === "#1A1F2A")
            ? "light"
            : colorScheme === "dark"
              ? "light"
              : "dark"
        }
      />
      <Tabs
        sceneContainerStyle={{
          backgroundColor: colorScheme === "dark" ? "#121212" : "#F2F7FF",
        }}
        screenOptions={{
          headerBackgroundContainerStyle: {
            backgroundColor: colorScheme === "dark" ? "#121212" : "white",
          },
          headerShown: false,
          tabBarActiveTintColor:
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name={WELCOME_SCREEN}
          options={{
            title: "Home",
            tabBarLabelStyle: {
              fontSize: 11,

              fontFamily: "Inter-Medium",
            },
            tabBarStyle: {
              height: 58,
              paddingBottom: 5,
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#121212"
                    : "white",
            },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={FOLDER_SCREEN}
          options={{
            title: "Prayer",
            tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
            tabBarStyle: {
              height: 58,
              paddingBottom: 5,
              paddingTop: 2,
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#121212"
                    : "white",
            },
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialIcons
                name={focused ? "hands-pray" : "hands-pray"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={DEVOTIONAL_SCREEN}
          options={{
            title: "Devotional",
            tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
            tabBarStyle: {
              height: 58,
              paddingBottom: 5,
              paddingTop: 2,
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#121212"
                    : "white",
            },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "bookmarks" : "bookmarks-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={COMMUNITY_SCREEN}
          options={{
            title: "Community",
            tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
            tabBarStyle: {
              height: 58,
              paddingBottom: 5,
              paddingTop: 2,
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#121212"
                    : "white",
            },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "globe" : "globe-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={MORE_SCREEN}
          options={{
            title: "More",
            tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
            tabBarStyle: {
              height: 58,
              paddingBottom: 5,
              paddingTop: 2,
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#121212"
                    : "white",
            },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "list" : "list-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
