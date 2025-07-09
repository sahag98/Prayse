import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";

import {
  FOLDER_SCREEN,
  MORE_SCREEN,
  REMINDER_SCREEN,
  WELCOME_SCREEN,
  EXPLORE_SCREEN,
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
          (actualTheme.Bg === "#0D0E32" ||
            actualTheme.Bg === "#1A1F2A" ||
            actualTheme.Bg === "#0C192F")
            ? "light"
            : actualTheme && actualTheme.Bg === "white"
              ? "dark"
              : colorScheme === "dark"
                ? "light"
                : "dark"
        }
      />

      <Tabs
        initialRouteName={FOLDER_SCREEN}
        screenOptions={{
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
            // title: "Today",
            tabBarShowLabel: false,
            tabBarLabelStyle: {
              fontSize: 11,
              fontFamily: "Inter-Medium",
            },
            tabBarStyle: {
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#212121"
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
          name={REMINDER_SCREEN}
          options={{
            // title: "Reminders",
            tabBarShowLabel: false,
            tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
            tabBarStyle: {
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#212121"
                    : "white",
            },

            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "time-outline" : "time-outline"}
                color={color}
                size={30}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={FOLDER_SCREEN}
          options={{
            // title: "Prayer",
            tabBarShowLabel: false,
            tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
            tabBarStyle: {
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#212121"
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
          name={EXPLORE_SCREEN}
          options={{
            // title: "Explore",
            tabBarShowLabel: false,
            tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
            tabBarStyle: {
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#212121"
                    : "white",
            },
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "compass" : "compass-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name={MORE_SCREEN}
          options={{
            // title: "More",
            tabBarShowLabel: false,
            tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
            tabBarStyle: {
              backgroundColor:
                actualTheme && actualTheme.Bg
                  ? actualTheme.Bg
                  : colorScheme === "dark"
                    ? "#212121"
                    : "white",
            },

            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "menu" : "menu-outline"}
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
