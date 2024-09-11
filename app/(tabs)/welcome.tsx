// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { Linking, Platform, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import DailyReflection from "@components/DailyReflection";
import { GospelOfJesus } from "@components/gospel-of-jesus";
import { MerchComponent } from "@components/MerchComponent";
import { ProBanner } from "@components/pro-banner";
import { QuestionOfTheWeek } from "@components/question-of-the-week";
import { QuickLinks } from "@components/quick-links";
import { Greeting } from "@components/welcome/greeting";
import { NoticationAction } from "@components/welcome/notification-action";
import { StreakAction } from "@components/welcome/streak-action";

import { UpdateModal } from "@modals/update-modal";

import FeedbackModal from "@/modals/FeedbackModal";
import config from "@config";
import { getMainBackgroundColorStyle } from "@lib/customStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { addNoti } from "@redux/notiReducer";
import {
  ONBOARDING_SCREEN,
  PRAYER_GROUP_SCREEN,
  QUESTION_SCREEN,
  REFLECTION_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "@routes";
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
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const welcomeFadeIn = useSharedValue(0);

  const [openings, setOpenings] = useState(0);
  const [notification, setNotification] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const [donationModal, setDonationModal] = useState(false);

  const notificationListener = useRef();
  const responseListener = useRef();

  const theme = useSelector((state) => state.user.theme);
  const streak = useSelector((state) => state.user.devostreak);
  const completedItems = useSelector((state) => state.user.completedItems);
  const appstreak = useSelector((state) => state.user.appstreakNum);

  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const { colorScheme, setColorScheme } = useColorScheme();
  // const posthog = usePostHog();
  // useEffect(() => {
  //   console.log("hereee");
  //   posthog.capture("Welcome Screen");
  // }, [posthog]);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();

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

  const loadAndAddOpenings = async () => {
    try {
      const storedOpenings = await AsyncStorage.getItem("appOpenings");
      const parsedOpenings = parseInt(storedOpenings, 20) || 0;
      const number = parsedOpenings + 1;
      await AsyncStorage.setItem("appOpenings", number.toString());
      setOpenings(number);
    } catch (error) {
      console.error("Error loading app openings ", error);
    }
  };

  useEffect(() => {
    loadIsFirstTime();
  }, []);

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => sendToken(token))
      .catch((err) => console.log("push notification", err));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        const date = Date();
        const formattedDate = date.toLocaleString("en-US", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });

        if (!notification.request.content.data.group) {
          const content = notification.request.content;
          let url = context.data.url || content.data.screen;

          if (url === "VerseOfTheDay") {
            url = VERSE_OF_THE_DAY_SCREEN;
          } else if (url === "PrayerGroup") {
            url = PRAYER_GROUP_SCREEN;
          } else if (url === "Reflection") {
            url = REFLECTION_SCREEN;
          } else if (url === "Question") {
            url = QUESTION_SCREEN;
          }

          dispatch(
            addNoti({
              noti_id: uuid.v4(),
              date: formattedDate,
              notification: content.body,
              url,
              title: content.data?.title,
              question_id: content.data?.question_id,
              prayerId: content.data?.prayerId,
              identifier: notification.request.identifier,
            }),
          );
        }

        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("response: ", response);
        const body = response.notification.request.content.body;
        const res = response.notification.request.content.data;
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Handle notification response
  useEffect(() => {
    if (!lastNotificationResponse?.notification?.request?.content) {
      return;
    }

    const { data, body } =
      lastNotificationResponse.notification.request.content;

    if (data?.updateLink) {
      if (Platform.OS === "ios") {
        Linking.openURL(
          "https://apps.apple.com/us/app/prayerlist-app/id6443480347",
        );
      } else if (Platform.OS === "android") {
        Linking.openURL(
          "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp",
        );
      }
    }

    if (data?.anyLink) {
      Linking.openURL(data.anyLink);
    }

    const url = data?.url || data?.screen;

    if (url) {
      //navigate to the screen specified in the data object
      if (["VerseOfTheDay", VERSE_OF_THE_DAY_SCREEN].includes(url)) {
        navigation.navigate(VERSE_OF_THE_DAY_SCREEN, {
          verse: body,
          title: data.verseTitle,
        });
      } else if (
        ["PrayerGroup", PRAYER_GROUP_SCREEN].includes(url) &&
        data.group &&
        data.allGroups
      ) {
        navigation.navigate(PRAYER_GROUP_SCREEN, {
          group: data.group,
          allGroups: data.allGroups,
        });
      } else if (
        ["Reflection", REFLECTION_SCREEN].includes(url) &&
        data.devoTitle
      ) {
        navigation.navigate(REFLECTION_SCREEN, {
          devoTitle: data.devoTitle,
        });
      } else if (
        ["Question", QUESTION_SCREEN].includes(url) &&
        data.title &&
        data.question_id
      ) {
        navigation.navigate(QUESTION_SCREEN, {
          title: data.title,
          question_id: data.question_id,
        });
      } else {
        navigation.navigate(url);
      }
    }
  }, [lastNotificationResponse]);

  if (isFirst === true) {
    navigation.navigate(ONBOARDING_SCREEN);
  }

  return (
    <WelcomeContainer
      showsVerticalScrollIndicator={false}
      style={getMainBackgroundColorStyle(actualTheme)}
      // contentContainerStyle={{ alignItems: "flex-start" }}
      className="flex relative flex-1 dark:bg-dark-background bg-light-background"
    >
      {/* <TouchableOpacity onPress={() => posthog.capture("Streaks click!!")}>
        <Text>Post Hog Click</Text>
      </TouchableOpacity> */}
      <UpdateModal theme={colorScheme} />
      <View className="items-center mb-0 flex-row justify-between w-full">
        <Greeting actualTheme={actualTheme} theme={colorScheme} />
        <View className="relative flex-row items-center">
          <View className="flex items-center flex-row">
            <StreakAction actualTheme={actualTheme} theme={colorScheme} />
            <NoticationAction actualTheme={actualTheme} theme={colorScheme} />
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
      <QuestionOfTheWeek actualTheme={actualTheme} />
      <GospelOfJesus actualTheme={actualTheme} />
      <MerchComponent actualTheme={actualTheme} theme={colorScheme} />
      <QuickLinks actualTheme={actualTheme} theme={colorScheme} />
    </WelcomeContainer>
  );
};

export default WelcomeScreen;
