import React, { useEffect } from "react";
import { Stack, useNavigation, usePathname } from "expo-router";
import { useColorScheme } from "nativewind";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
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
  SINGLE_REMINDER_SCREEN,
  TEST_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
  WALLPAPERS_SCREEN,
  YOUR_THEMES_SCREEN,
} from "@routes";
import { useNotificationObserver } from "@components/NotificationObserver";

// function useNotificationObserver() {
//   const navigation = useNavigation();

//   useEffect(() => {
//     let isMounted = true;

//     function redirect(notification: Notifications.Notification) {
//       const data = notification.request.content.data;

//       const url = data?.url || data?.screen;

//       if (url) {
//         console.log("url exists!!", url);

//         const navigateWithDelay = (screen: string, params?: any) => {
//           setTimeout(() => {
//             //@ts-ignore
//             navigation.navigate(screen, params);
//           }, 0); // 2 seconds delay
//         };

//         if (
//           ["PrayerGroup", PRAYER_GROUP_SCREEN].includes(url) &&
//           data.group_id
//         ) {
//           navigateWithDelay(PRAYER_GROUP_SCREEN, {
//             group_id: data.group_id,
//           });
//         } else if (["VerseOfTheDay", VERSE_OF_THE_DAY_SCREEN].includes(url)) {
//           navigateWithDelay(VERSE_OF_THE_DAY_SCREEN);
//         } else if (
//           ["Question", QUESTION_SCREEN].includes(url) &&
//           data.title &&
//           data.question_id
//         ) {
//           navigateWithDelay(QUESTION_SCREEN, {
//             title: data.title,
//             question_id: data.question_id,
//           });
//         } else {
//           navigateWithDelay(url);
//         }
//       }
//     }

//     Notifications.getLastNotificationResponseAsync().then((response) => {
//       if (!isMounted || !response?.notification) {
//         return;
//       }
//       redirect(response?.notification);
//     });

//     const subscription = Notifications.addNotificationResponseReceivedListener(
//       (response) => {
//         redirect(response.notification);
//       }
//     );

//     return () => {
//       isMounted = false;
//       subscription.remove();
//     };
//   }, []);
// }

const StackContainer = () => {
  useNotificationObserver();
  const { colorScheme } = useColorScheme();

  const pathname = usePathname();

  const actualTheme = useSelector((state: any) => state.theme.actualTheme);
  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[
        {
          flex: 1,
          backgroundColor:
            colorScheme === "dark"
              ? "#212121"
              : pathname === "/prayer-room"
                ? "#b7d3ff"
                : pathname === "/prayer"
                  ? "#f2f7ff"
                  : "white",
        },
        getMainBackgroundColorStyle(actualTheme),
      ]}
    >
      <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
        <Stack.Screen
          name="(tabs)"
          options={{
            animation: "fade",
            headerShown: false,
          }}
        />
        <Stack.Screen name={PRAYER_SCREEN} options={{ headerShown: false }} />
        <Stack.Screen
          name={DEVO_LIST_SCREEN}
          options={{ headerShown: false }}
        />
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
