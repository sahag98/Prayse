// @ts-nocheck
import React, { useEffect, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Redirect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { Platform, View } from "react-native";
import { useSelector } from "react-redux";

import DailyReflection from "@components/DailyReflection";
import { GospelOfJesus } from "@components/gospel-of-jesus";
// import HowtoUsePrayse from "@components/HowtoUsePrayse";
import { MerchComponent } from "@components/MerchComponent";
import { ProBanner } from "@components/pro-banner";
import { QuestionOfTheWeek } from "@components/question-of-the-week";
import { Greeting } from "@components/welcome/greeting";
import { StreakAction } from "@components/welcome/streak-action";

import { UpdateModal } from "@modals/update-modal";
import WriteFeedbackModal from "@modals/WriteFeedbackModal";

import FeedbackModal from "@/modals/FeedbackModal";
import config from "@config";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getMainBackgroundColorStyle } from "@lib/customStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { WelcomeContainer } from "@styles/appStyles";
import { ActualTheme } from "@types/reduxTypes";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    };
  },
});

async function sendToken(expoPushToken) {
  console.log("expo token: ", expoPushToken);
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

async function registerForPushNotificationsAsync() {
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
        "To recieve notifications in the future, enable Notifications from the App Settings.",
      );
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: config.projectId,
      })
    ).data;
  } else {
    console.log("Must use physical device for Push Notifications");
  }
  return token;
}

const WelcomeScreen = () => {
  // const [_, setNotification] = useState(false);
  const [isFirst, setIsFirst] = useState(false);

  const [feedbackVisible, setFeedbackVisible] = useState(false);

  // const notificationListener = useRef();
  // const responseListener = useRef();

  const streak = useSelector((state) => state.user.devostreak);
  const completedItems = useSelector((state) => state.user.completedItems);
  const appstreak = useSelector((state) => state.user.appstreakNum);

  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();
  // const posthog = usePostHog();
  // useEffect(() => {
  //   console.log("hereee");
  //   posthog.capture("Welcome Screen");
  // }, [posthog]);

  const loadIsFirstTime = async () => {
    try {
      const hasIsFirstTime = await AsyncStorage.getItem("isFirstTime");

      if (hasIsFirstTime) {
        setIsFirst(false);
      } else {
        setIsFirst(true);
        await AsyncStorage.setItem("isFirstTime", "true");
      }
    } catch (error) {
      console.log("isTime", error);
    }
  };

  useEffect(() => {
    loadIsFirstTime();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => sendToken(token))
      .catch((err) => console.log("push notification", err));

    // notificationListener.current =
    //   Notifications.addNotificationReceivedListener((notification) => {
    //     if (!notification.request.content.data.group) {
    //       const content = notification.request.content;
    //       let url = content.data.url || content.data.screen;

    //       if (url === "VerseOfTheDay") {
    //         url = VERSE_OF_THE_DAY_SCREEN;
    //       } else if (url === "PrayerGroup") {
    //         url = PRAYER_GROUP_SCREEN;
    //       } else if (url === "Reflection") {
    //         url = REFLECTION_SCREEN;
    //       } else if (url === "Question") {
    //         url = QUESTION_SCREEN;
    //       }
    //     }

    //     setNotification(notification);
    //   });

    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     console.log("response: ", response);
    //   });

    // return () => {
    //   notificationListener.current &&
    //     Notifications.removeNotificationSubscription(
    //       notificationListener.current,
    //     );
    //   responseListener.current &&
    //     Notifications.removeNotificationSubscription(responseListener.current);
    // };
  }, []);

  // Handle notification response

  if (isFirst === true) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <WelcomeContainer
      showsVerticalScrollIndicator={false}
      style={getMainBackgroundColorStyle(actualTheme)}
      className="flex relative flex-1 dark:bg-dark-background bg-light-background"
    >
      <UpdateModal theme={colorScheme} actualTheme={actualTheme} />
      <View className="items-center mb-3 flex-row justify-between w-full">
        <Greeting actualTheme={actualTheme} theme={colorScheme} />
        <View className="relative flex-row gap-2 items-center">
          <Ionicons
            onPress={() => setFeedbackVisible(true)}
            name="chatbubble-ellipses-outline"
            size={24}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
          <WriteFeedbackModal
            feedbackVisible={feedbackVisible}
            setFeedbackVisible={setFeedbackVisible}
            theme={colorScheme}
            actualTheme={actualTheme}
          />
          <View className="flex items-center flex-row">
            <StreakAction actualTheme={actualTheme} theme={colorScheme} />
          </View>
        </View>
      </View>
      <DailyReflection
        actualTheme={actualTheme}
        completedItems={completedItems}
        devoStreak={streak}
        appStreak={appstreak}
        theme={colorScheme}
      />
      <FeedbackModal actualTheme={actualTheme} theme={colorScheme} />
      <ProBanner actualTheme={actualTheme} theme={colorScheme} />
      {/* <NoticationsCard actualTheme={actualTheme} theme={colorScheme} /> */}

      <QuestionOfTheWeek actualTheme={actualTheme} theme={colorScheme} />
      <GospelOfJesus actualTheme={actualTheme} theme={colorScheme} />
      {/* <HowtoUsePrayse actualTheme={actualTheme} theme={colorScheme} /> */}
      <MerchComponent actualTheme={actualTheme} theme={colorScheme} />

      {/* <QuickLinks actualTheme={actualTheme} theme={colorScheme} /> */}
    </WelcomeContainer>
  );
};

export default WelcomeScreen;
