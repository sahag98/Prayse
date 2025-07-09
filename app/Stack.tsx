import React from "react";
import { Stack } from "expo-router";

import {
  ANON_SCREEN,
  FAVORITES_SCREEN,
  GOSPEL_SCREEN,
  NEW_UPDATE_SCREEN,
  OLD_PRAYER_SCREEN,
  ONBOARDING_SCREEN,
  OUR_PRESENTATION_SCREEN,
  PRAISE_SCREEN,
  PRAYER_GROUP_SCREEN,
  PRAYER_ROOM_SCREEN,
  PRAYER_SCREEN,
  PRO_SCREEN,
  QUESTION_LIST_SCREEN,
  QUESTION_SCREEN,
  SETTINGS_SCREEN,
  SINGLE_REMINDER_SCREEN,
  TEST_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
  WALLPAPERS_SCREEN,
  YOUR_THEMES_SCREEN,
  JOURNAL_SCREEN,
} from "@routes";
import { useNotificationObserver } from "@components/NotificationObserver";

const StackContainer = () => {
  useNotificationObserver();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
        <Stack.Screen
          name="(tabs)"
          options={{
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen name={PRAYER_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen name={ANON_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen name={JOURNAL_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen
          name={NEW_UPDATE_SCREEN}
          options={{ headerShown: false, animation: "fade" }}
        />
        <Stack.Screen name={PRAISE_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen
          name={SINGLE_REMINDER_SCREEN}
          options={{
            presentation: "modal",
            sheetAllowedDetents: [0.2, 1],
            sheetGrabberVisible: true,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={OLD_PRAYER_SCREEN}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ONBOARDING_SCREEN}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name={REMINDER_SCREEN} options={{ headerShown: false }} /> */}
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
        {/* <Stack.Screen name="prayer" options={{ headerShown: false }} /> */}
        <Stack.Screen name={TEST_SCREEN} options={{ headerShown: false }} />

        <Stack.Screen
          name={PRAYER_ROOM_SCREEN}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name={PRAYER_GROUP_SCREEN}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
};

export default StackContainer;
