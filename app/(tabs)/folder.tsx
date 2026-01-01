import React, { useEffect, useState } from "react";
import { Redirect, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";

import Folder from "../../components/Folder";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import config from "@config";
import { Platform } from "react-native";
import { UpdateModal } from "@modals/update-modal";
import { useSelector } from "react-redux";
import { ActualTheme } from "../../types/reduxTypes";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldSetBadge: false,
    };
  },
});

async function sendToken(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Original Title",
    body: "And here is the body!",
    data: { someData: "goes here" },
  };
  await fetch(config.notificationApi, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log(
        "To recieve notifications in the future, enable Notifications from the App Settings."
      );
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: config.projectId,
      })
    ).data;
    console.log(token);
  } else {
    console.log("Must use physical device for Push Notifications");
  }
  return token;
}

export default function MainScreen() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const [isFirst, setIsFirst] = useState(false);
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme
  );

  const loadIsFirstTime = async () => {
    try {
      const hasIsFirstTime = await AsyncStorage.getItem("isFirstTime2");
      const hasNewUpdate = await AsyncStorage.getItem("newUpdate2");

      if (hasIsFirstTime) {
        setIsFirst(false);
        if (hasNewUpdate) {
          console.log("hasNewUpdate is not null");
        } else {
          // await AsyncStorage.setItem("newUpdate2", "true");
          // router.push("new-update");
        }
      } else {
        setIsFirst(true);
        await AsyncStorage.setItem("isFirstTime2", "true");
      }
    } catch (error) {
      console.log("isTime", error);
    }
  };

  useEffect(() => {
    loadIsFirstTime();
    registerForPushNotificationsAsync().then((token) => sendToken(token!));
  }, []);

  if (isFirst) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
      }}
    >
      {/* <Text>Hey</Text> */}
      <UpdateModal theme={colorScheme!} actualTheme={actualTheme} />
      <Folder colorScheme={colorScheme!} navigation={navigation} />
    </SafeAreaView>
  );
}
