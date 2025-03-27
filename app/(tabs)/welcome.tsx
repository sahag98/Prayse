import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Redirect, router, useFocusEffect } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as StoreReview from "expo-store-review";
import DailyReflection from "@components/DailyReflection";
import { GospelOfJesus } from "@components/gospel-of-jesus";
// import HowtoUsePrayse from "@components/HowtoUsePrayse";
import { MerchComponent } from "@components/MerchComponent";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ProBanner } from "@components/pro-banner";
import { QuestionOfTheWeek } from "@components/question-of-the-week";
import { Greeting } from "@components/welcome/greeting";

import { UpdateModal } from "@modals/update-modal";
import WriteFeedbackModal from "@modals/WriteFeedbackModal";

import FeedbackModal from "@/modals/FeedbackModal";
import config from "@config";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getMainBackgroundColorStyle } from "@lib/customStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { WelcomeContainer } from "@styles/appStyles";
import { ActualTheme } from "../../types/reduxTypes";

import { CheckReview } from "@hooks/useShowReview";
import { handleReviewShowing } from "@redux/remindersReducer";

import useStore from "@hooks/store";
// import { setProModalVisible } from "@redux/userReducer";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
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
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const dispatch = useDispatch();
  const [featureVisible, setFeatureVisible] = useState(false);
  const [proModalVisible, setProModalVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const reviewCounter = useSelector(
    (state: any) => state.reminder.reviewCounter,
  );
  const hasShownReview = useSelector(
    (state: any) => state.reminder.hasShownReview,
  );
  // const notificationListener = useRef();
  // const responseListener = useRef();

  const streak = useSelector((state: any) => state.user.devostreak);
  const completedItems = useSelector((state: any) => state.user.completedItems);
  const appstreak = useSelector((state: any) => state.user.appstreakNum);
  const hasShownProModal = useSelector(
    (state: any) => state.user.hasShownProModal,
  );
  const { deletePrayerTracking, addPrayerTracking, isShowingNewUpdate } =
    useStore();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();

  console.log(isShowingNewUpdate);

  const loadIsFirstTime = async () => {
    try {
      const hasIsFirstTime = await AsyncStorage.getItem("isFirstTime");
      const hasNewUpdate = await AsyncStorage.getItem("newUpdate");

      if (hasIsFirstTime) {
        setIsFirst(false);

        if (hasNewUpdate) {
          setHasNewUpdate(false);
        } else {
          setHasNewUpdate(true);
          await AsyncStorage.setItem("newUpdate", "true");
          router.push("new-update");
        }
      } else {
        setIsFirst(true);
        await AsyncStorage.setItem("isFirstTime", "true");
      }
    } catch (error) {
      console.log("isTime", error);
    }
  };

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      console.log("focused: ", reviewCounter);
      console.log("has shown review: ", hasShownReview);
      // Invoked whenever the route is focused.
      if (!hasShownReview) {
        if (
          reviewCounter === 3 ||
          (reviewCounter % 14 === 0 && reviewCounter > 0)
        ) {
          Alert.alert(
            "Thank You for using our app!",
            "Would you take a moment to leave a review and share your experience?",
            [
              {
                text: "Not Now",
                onPress: () => dispatch(handleReviewShowing()),
                style: "cancel",
              },
              {
                text: "Leave a Review 🙌",
                onPress: () => {
                  dispatch(handleReviewShowing());
                  CheckReview();
                },
              },
            ],
          );
        }
      }
      // Return function is invoked whenever the route gets out of focus.
    }, [reviewCounter]),
  );

  useEffect(() => {
    loadIsFirstTime();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => sendToken(token!))
      .catch((err) => console.log("push notification", err));
  }, []);

  if (isFirst === true) {
    return <Redirect href="/onboarding" />;
  }

  // if (isFirst === false && isShowingNewUpdate) {
  //   return <Redirect href="/new-update" />;
  // }

  return (
    <WelcomeContainer
      showsVerticalScrollIndicator={false}
      style={getMainBackgroundColorStyle(actualTheme)}
      //@ts-ignore
      className="flex relative flex-1 dark:bg-dark-background bg-light-background"
    >
      <UpdateModal theme={colorScheme!} actualTheme={actualTheme} />
      <View className="items-center mb-3 flex-row justify-between w-full">
        <Greeting actualTheme={actualTheme} theme={colorScheme!} />

        <View className="relative flex-row gap-2 items-center">
          <Pressable
            onPress={() => setFeedbackVisible(true)}
            className="flex-row items-center gap-3 border p-2 rounded-xl border-light-primary dark:border-dark-primary"
          >
            <Text className="font-inter-semibold text-light-primary dark:text-dark-primary">
              Feedback
            </Text>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={25}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </Pressable>
          <WriteFeedbackModal
            feedbackVisible={feedbackVisible}
            setFeedbackVisible={setFeedbackVisible}
            theme={colorScheme}
            actualTheme={actualTheme}
          />
          <Pressable
            onPress={() => router.push("tracking")}
            className="flex items-center ml-3 flex-row"
          >
            <MaterialCommunityIcons
              style={{ zIndex: 10 }}
              name="hands-pray"
              size={25}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </Pressable>
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
      {/* <ProBanner actualTheme={actualTheme} theme={colorScheme!} /> */}

      <QuestionOfTheWeek actualTheme={actualTheme} theme={colorScheme!} />
      <GospelOfJesus actualTheme={actualTheme} />

      <MerchComponent theme={colorScheme!} actualTheme={actualTheme} />
    </WelcomeContainer>
  );
};

export default WelcomeScreen;
