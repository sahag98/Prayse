import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
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

export default function TabLayout() {
  const theme = useSelector((state: any) => state?.user?.theme);

  return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Tabs
        sceneContainerStyle={{
          backgroundColor: theme == "dark" ? "#121212" : "#F2F7FF",
        }}
        screenOptions={{
          headerBackgroundContainerStyle: {
            backgroundColor: theme == "dark" ? "#121212" : "white",
          },
          headerShown: false,
          tabBarActiveTintColor:
            theme == "dark"
              ? "white"
              : theme == "BlackWhite"
                ? "black"
                : "#2f2d51",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name={WELCOME_SCREEN}
          options={{
            title: "Home",
            tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
            tabBarStyle: {
              height: 58,
              paddingBottom: 5,
              paddingTop: 2,
              backgroundColor: theme == "dark" ? "#121212" : "white",
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
              backgroundColor: theme == "dark" ? "#121212" : "white",
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
              backgroundColor: theme == "dark" ? "#121212" : "white",
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
              backgroundColor: theme == "dark" ? "#121212" : "white",
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
              backgroundColor: theme == "dark" ? "#121212" : "white",
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
