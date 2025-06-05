import React, { useEffect } from "react";
import { Tabs, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";

import {
  COMMUNITY_SCREEN,
  FOLDER_SCREEN,
  MORE_SCREEN,
  PRAYER_GROUP_SCREEN,
  QUESTION_SCREEN,
  REMINDER_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
  WELCOME_SCREEN,
  EXPLORE_SCREEN,
} from "@routes";
import * as Notifications from "expo-notifications";
import { ActualTheme } from "../../types/reduxTypes";

function useNotificationObserver() {
  const navigation = useNavigation();

  const router = useRouter();
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const data = notification.request.content.data;

      const url = data?.url || data?.screen;

      if (url) {
        console.log("url exists!!", url);

        // const navigateWithDelay = (screen: string, params?: any) => {
        //   setTimeout(() => {
        //     //@ts-ignore
        //     navigation.navigate(screen, params);
        //   }, 0); // 2 seconds delay
        // };

        if (
          ["PrayerGroup", PRAYER_GROUP_SCREEN].includes(url) &&
          data.group_id
        ) {
          //@ts-ignore
          navigation.navigate(PRAYER_GROUP_SCREEN, {
            group_id: data.group_id,
          });
          Notifications.dismissNotificationAsync(
            notification.request.identifier,
          );
        } else if (["VerseOfTheDay", VERSE_OF_THE_DAY_SCREEN].includes(url)) {
          //@ts-ignore
          navigation.navigate(VERSE_OF_THE_DAY_SCREEN);
          Notifications.dismissNotificationAsync(
            notification.request.identifier,
          );
        } else if (
          ["Question", QUESTION_SCREEN].includes(url) &&
          data.title &&
          data.question_id
        ) {
          //@ts-ignore
          navigation.navigate(QUESTION_SCREEN, {
            title: data.title as string,
            question_id: data.question_id as string,
          });
          Notifications.dismissNotificationAsync(
            notification.request.identifier,
          );
        } else {
          //@ts-ignore
          navigation.navigate(url);
          Notifications.dismissNotificationAsync(
            notification.request.identifier,
          );
        }
      }
    }

    // Notifications.getLastNotificationResponseAsync().then((response) => {
    //   if (!isMounted || !response?.notification) {
    //     return;
    //   }

    //   console.log("getting last noti: ", response.notification);
    //   redirect(response?.notification);
    // });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

export default function TabLayout() {
  // useNotificationObserver();
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
