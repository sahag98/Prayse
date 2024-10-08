// @ts-nocheck

import React from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
// import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

import { getMainBackgroundColorStyle } from "@lib/customStyles";
import {
  DEVO_LIST_SCREEN,
  FAVORITES_SCREEN,
  GOSPEL_SCREEN,
  OLD_PRAYER_SCREEN,
  ONBOARDING_SCREEN,
  OUR_PRESENTATION_SCREEN,
  PRAYER_GROUP_SCREEN,
  PRAYER_ROOM_SCREEN,
  PRAYER_SCREEN,
  PRO_SCREEN,
  PUBLIC_COMMUNITY_SCREEN,
  PUBLIC_GROUPS_SCREEN,
  QUESTION_LIST_SCREEN,
  QUESTION_SCREEN,
  REFLECTION_SCREEN,
  REMINDER_SCREEN,
  ROADMAP_SCREEN,
  SETTINGS_SCREEN,
  TEST_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
  WALLPAPERS_SCREEN,
  YOUR_THEMES_SCREEN,
} from "@routes";

const StackContainer = () => {
  const { colorScheme } = useColorScheme();

  const actualTheme = useSelector((state) => state.theme.actualTheme);
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[
        {
          flex: 1,
          backgroundColor: colorScheme === "dark" ? "#121212" : "white",
        },
        getMainBackgroundColorStyle(actualTheme),
      ]}
    >
      <Stack initialRouteName="(tabs)">
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name={PRAYER_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen
          name={DEVO_LIST_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={ROADMAP_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen
          name={PUBLIC_GROUPS_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={OLD_PRAYER_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ONBOARDING_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={REMINDER_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen
          name={QUESTION_LIST_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={WALLPAPERS_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={QUESTION_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen name={SETTINGS_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen
          name={REFLECTION_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={FAVORITES_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={VERSE_OF_THE_DAY_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={PRO_SCREEN} options={{ headerShown: false }} />

        <Stack.Screen
          name={YOUR_THEMES_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen name={GOSPEL_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen
          name={OUR_PRESENTATION_SCREEN}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
      name="prayer"
      options={{ headerShown: false }}
    /> */}
        <Stack.Screen name={TEST_SCREEN} options={{ headerShown: false }} />

        <Stack.Screen
          name={PRAYER_ROOM_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={PUBLIC_COMMUNITY_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={PRAYER_GROUP_SCREEN}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen
      name={COMMUNITY_SCREEN}
      options={{ headerShown: false }}
    /> */}
        {/* <Stack.Screen
      name={MORE_SCREEN}
      options={{ headerShown: false }}
    /> */}
        <Stack.Screen name="+not-found" />
      </Stack>
    </SafeAreaView>
  );
};

export default StackContainer;
