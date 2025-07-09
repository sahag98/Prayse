import React, { useCallback, useEffect, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {
  Redirect,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import DailyDevotion from "@components/DailyDevotion";
import { GospelOfJesus } from "@components/gospel-of-jesus";
// import HowtoUsePrayse from "@components/HowtoUsePrayse";
import { MerchComponent } from "@components/MerchComponent";

import { QuestionOfTheWeek } from "@components/question-of-the-week";
import { Greeting } from "@components/welcome/greeting";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { UpdateModal } from "@modals/update-modal";

import FeedbackModal from "@/modals/FeedbackModal";
import config from "@config";
import { getMainBackgroundColorStyle } from "@lib/customStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { WelcomeContainer } from "@styles/appStyles";
import { ActualTheme } from "../../types/reduxTypes";

import { CheckReview } from "@hooks/useShowReview";
import { handleReviewShowing } from "@redux/remindersReducer";

import PrayerGroupsComponent from "@components/prayer-groups";
import { ANON_SCREEN, JOURNAL_SCREEN } from "@routes";

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
  const { active } = useLocalSearchParams();
  const [isFirst, setIsFirst] = useState(false);
  const dispatch = useDispatch();

  const reviewCounter = useSelector(
    (state: any) => state.reminder.reviewCounter,
  );
  const hasShownReview = useSelector(
    (state: any) => state.reminder.hasShownReview,
  );

  const streak = useSelector((state: any) => state.user.devostreak);
  const completedItems = useSelector((state: any) => state.user.completedItems);
  const appstreak = useSelector((state: any) => state.user.appstreakNum);
  // const hasShownProModal = useSelector(
  //   (state: any) => state.user.hasShownProModal
  // );
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();
  const [currentTab, setCurrentTab] = useState(active ? "community" : "today");
  const activeTab = useSharedValue(active ? 0 : 1);

  // Animation values for staggered animations
  const greetingOpacity = useSharedValue(0);
  const dailyReflectionOpacity = useSharedValue(0);
  const questionOpacity = useSharedValue(0);
  const gospelOpacity = useSharedValue(0);
  const merchOpacity = useSharedValue(0);

  const loadIsFirstTime = async () => {
    try {
      const hasIsFirstTime = await AsyncStorage.getItem("isFirstTime1");
      const hasNewUpdate = await AsyncStorage.getItem("newUpdate1");

      if (hasIsFirstTime) {
        setIsFirst(false);

        if (hasNewUpdate) {
          console.log("hasNewUpdate is not null");
        } else {
          await AsyncStorage.setItem("newUpdate1", "true");
          router.push("new-update");
        }
      } else {
        setIsFirst(true);
        await AsyncStorage.setItem("isFirstTime1", "true");
      }
    } catch (error) {
      console.log("isTime", error);
    }
  };

  console.log(activeTab.value);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      console.log("focused: ", reviewCounter);
      console.log("has shown review: ", hasShownReview);
      // Invoked whenever the route is focused.
      const showReviewPrompt = async () => {
        if (!hasShownReview) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Delay to avoid transition issues
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
      };
      showReviewPrompt();

      // Return function is invoked whenever the route gets out of focus.
    }, [reviewCounter]),
  );
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const todayTabStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth: 2,
      borderBottomColor:
        activeTab.value === 1
          ? colorScheme === "dark"
            ? "white"
            : "#2f2d51"
          : colorScheme === "dark"
            ? "#121212"
            : "#f2f7ff",
      transform: [{ scale: activeTab.value === 1 ? 1.1 : 1 }],
    };
  });

  const communityTabStyle = useAnimatedStyle(() => {
    return {
      borderBottomWidth: 2,
      borderBottomColor:
        activeTab.value === 2
          ? colorScheme === "dark"
            ? "white"
            : "#2f2d51"
          : colorScheme === "dark"
            ? "#121212"
            : "#f2f7ff",
      transform: [{ scale: activeTab.value === 0 ? 1.1 : 1 }],
    };
  });

  const todayTextStyle = useAnimatedStyle(() => {
    return {
      fontSize: withTiming(activeTab.value === 1 ? 18 : 16, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      }),
      opacity: withTiming(activeTab.value === 1 ? 1 : 0.7, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      }),
    };
  });

  const communityTextStyle = useAnimatedStyle(() => {
    return {
      fontSize: withTiming(activeTab.value === 0 ? 18 : 16, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      }),
      opacity: withTiming(activeTab.value === 0 ? 1 : 0.7, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      }),
    };
  });

  useEffect(() => {
    loadIsFirstTime();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => sendToken(token!));
  }, []);

  useEffect(() => {
    // Stagger the animations
    greetingOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });

    dailyReflectionOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });

    questionOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });

    gospelOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });

    merchOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
  }, []);

  const greetingStyle = useAnimatedStyle(() => ({
    opacity: greetingOpacity.value,
  }));

  const dailyReflectionStyle = useAnimatedStyle(() => ({
    opacity: dailyReflectionOpacity.value,
  }));

  const questionStyle = useAnimatedStyle(() => ({
    opacity: questionOpacity.value,
  }));

  const gospelStyle = useAnimatedStyle(() => ({
    opacity: gospelOpacity.value,
  }));

  const merchStyle = useAnimatedStyle(() => ({
    opacity: merchOpacity.value,
  }));

  if (isFirst) {
    return <Redirect href="/onboarding" />;
  }

  // if (isFirst === false && isShowingNewUpdate) {
  //   return <Redirect href="/new-update" />;
  // }

  return (
    <WelcomeContainer
      style={getMainBackgroundColorStyle(actualTheme)}
      //@ts-ignore
      className="flex relative flex-1 dark:bg-dark-background bg-light-background"
    >
      <LinearGradient
        colors={
          colorScheme === "dark"
            ? ["#121212", "#1f1f1f"]
            : ["#f2f7ff", "#e0ecff"]
        } // Adjust for desired softness
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <UpdateModal theme={colorScheme!} actualTheme={actualTheme} />
        <View className="items-center px-4 mb-3 flex-row justify-between w-full">
          <View className="flex-row items-center gap-3">
            <AnimatedPressable
              style={todayTabStyle}
              onPress={() => {
                activeTab.value = withTiming(1, {
                  duration: 300,
                  easing: Easing.out(Easing.exp),
                });
                setCurrentTab("today");
              }}
              className="p-2 dark:border-b-dark-primary"
            >
              <Animated.Text
                style={todayTextStyle}
                className="font-inter-semibold text-light-primary dark:text-dark-primary"
              >
                Today
              </Animated.Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={communityTabStyle}
              onPress={() => {
                activeTab.value = withTiming(0, {
                  duration: 300,
                  easing: Easing.out(Easing.exp),
                });
                setCurrentTab("community");
              }}
              className="p-2"
            >
              <Animated.Text
                style={communityTextStyle}
                className="font-inter-semibold text-light-primary dark:text-dark-primary"
              >
                Community
              </Animated.Text>
            </AnimatedPressable>
          </View>

          <View className="flex-row items-center gap-1">
            <Text className="font-inter-semibold text-light-primary dark:text-dark-primary text-lg">
              {streak}
            </Text>
            <Pressable
              onPress={() => router.push("tracking")}
              className="flex items-center flex-row"
            >
              <Image
                source={require("@assets/prayse-transparent.png")}
                style={{
                  tintColor: colorScheme === "dark" ? "white" : "#2f2d51",
                  width: 30,
                  height: 30,
                }}
              />
            </Pressable>
          </View>
        </View>

        {currentTab === "today" ? (
          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            <Animated.View style={greetingStyle} className="mb-1">
              <Greeting actualTheme={actualTheme} theme={colorScheme!} />
            </Animated.View>
            <View className="px-4 my-2">
              <Animated.View style={dailyReflectionStyle}>
                <Pressable
                  onPress={() => router.push(JOURNAL_SCREEN)}
                  className="bg-white dark:bg-dark-secondary border p-4 gap-2 rounded-lg border-light-primary dark:border-[#a6a6a6]"
                >
                  <Text className="absolute top-4 right-4 text-red-400 font-inter-bold">
                    NEW
                  </Text>
                  <Text className="font-inter-semibold text-light-primary dark:text-dark-primary text-lg">
                    Prayer Journals
                  </Text>
                  <Text className="font-inter-regular text-light-primary dark:text-dark-primary">
                    Journal prayers in a video format and remember all the ways
                    the Lord answers those prayers.
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
            <Animated.View style={dailyReflectionStyle}>
              <DailyDevotion
                actualTheme={actualTheme}
                completedItems={completedItems}
                devoStreak={streak}
                appStreak={appstreak}
                theme={colorScheme}
              />
            </Animated.View>

            <View className="px-4 my-2">
              <Animated.View style={dailyReflectionStyle}>
                <Pressable
                  onPress={() => router.push(ANON_SCREEN)}
                  className="bg-white dark:bg-dark-secondary border p-4 gap-2 rounded-lg border-light-primary dark:border-[#a6a6a6]"
                >
                  <Text className="font-inter-semibold text-light-primary dark:text-dark-primary text-lg">
                    Share Anonymous Prayers
                  </Text>
                  <Text className="font-inter-regular text-light-primary dark:text-dark-primary">
                    A place to share prayers anonymously, and pray for others.
                  </Text>
                </Pressable>
              </Animated.View>
            </View>

            <Animated.View style={dailyReflectionStyle}>
              <FeedbackModal actualTheme={actualTheme} theme={colorScheme} />
            </Animated.View>

            <View className="px-4 my-4">
              <Animated.View style={questionStyle}>
                <QuestionOfTheWeek
                  actualTheme={actualTheme}
                  theme={colorScheme!}
                />
              </Animated.View>

              <Animated.View style={gospelStyle}>
                <GospelOfJesus actualTheme={actualTheme} />
              </Animated.View>
            </View>

            <View className="px-4">
              <Animated.View style={merchStyle}>
                <MerchComponent
                  theme={colorScheme!}
                  actualTheme={actualTheme}
                />
              </Animated.View>
            </View>
          </ScrollView>
        ) : (
          <PrayerGroupsComponent />
        )}
      </LinearGradient>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;
