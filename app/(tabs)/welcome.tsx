// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { nativeApplicationVersion } from "expo-application";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge, Divider } from "react-native-paper";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import DailyReflection from "@components/DailyReflection";
import GospelofJesus from "@components/GospelofJesus";
import MerchComponent from "@components/MerchComponent";
import QuestionoftheWeek from "@components/QuestionoftheWeek";
import StreakSlider from "@components/StreakSlider";
import { Greeting } from "@components/welcome/greeting";

import NewFeaturesModal from "@modals/NewFeaturesModal";
import UpdateModal from "@modals/UpdateModal";

import config from "@config";
import { useSupabase } from "@context/useSupabase";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useIsFocused } from "@react-navigation/native";
import { addNoti } from "@redux/notiReducer";
import { deleteReminder } from "@redux/remindersReducer";
import { increaseAppStreakCounter } from "@redux/userReducer";
import {
  NOTIFICATIONS_SCREEN,
  ONBOARDING_SCREEN,
  PRAYER_GROUP_SCREEN,
  QUESTION_SCREEN,
  REFLECTION_SCREEN,
  REMINDER_SCREEN,
  TEST_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "@routes";
import { WelcomeContainer } from "@styles/appStyles";

import noreminder from "../../assets/noreminders.png";

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

const image = { uri: "https://legacy.reactjs.org/logo-og.png" };

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.user.theme);
  const streak = useSelector((state) => state.user.devostreak);
  const completedItems = useSelector((state) => state.user.completedItems);
  const appstreak = useSelector((state) => state.user.appstreakNum);
  const isAppReady = useSelector((state) => state.user.isAppReady);
  // const appstreak = useSelector((state) => state.user.appstreak);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.expoToken);
  const [openings, setOpenings] = useState(0);
  const [donationModal, setDonationModal] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [featureVisible, setFeatureVisible] = useState(false);

  const [icon, setIcon] = useState(null);
  const { supabase } = useSupabase();
  const [expanded, setExpanded] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const reminders = useSelector((state) => state.reminder.reminders);
  const notis = useSelector((state) => state.noti.notifications);

  const quickFolderExists = useSelector(
    (state) => state.folder.quickFolderExists,
  );

  const welcomeFadeIn = useSharedValue(0);
  // const fadeAnim = useRef(new Animated.Value(0)).current;
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const [isReminderOff, setIsReminderOff] = useState(false);
  const [isFirst, setIsFirst] = useState(false);
  const responseListener = useRef();
  const isFocused = useIsFocused();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  const [inputHeight, setInputHeight] = useState(60);
  const [quickprayervalue, setQuickprayervalue] = useState("");
  const [quickcategoryvalue, setQuickcategoryvalue] = useState("");
  const [notiVisible, setNotiVisible] = useState(false);
  const [isShowingStreak, setIsShowingStreak] = useState(false);

  const doFadeInAnimation = () => {
    welcomeFadeIn.value = withTiming(1, {
      duration: 2000,
      easing: Easing.ease,
    });
  };

  const animatedWelcomeFadeInStyle = useAnimatedStyle(() => ({
    opacity: welcomeFadeIn.value * 1,
  }));

  async function fetchUpdate() {
    try {
      const { data: update, error } = await supabase
        .from("update")
        .select("isUpdateAvailable");

      if (update[0].isUpdateAvailable != nativeApplicationVersion.toString()) {
        // setIsUpdateAvailable(true);
      } else {
        setIsUpdateAvailable(false);
      }
    } catch (error) {
      console.log("fetchUpdate", error);
    }
  }

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator
          size="large"
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </View>
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const scaleStreak = useSharedValue(1);
  const animatedStreakStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleStreak.value }],
    };
  });

  useEffect(() => {
    scaleStreak.value = withSequence(
      withSpring(1.2, { damping: 5, stiffness: 40 }),
      withSpring(1, { damping: 5, stiffness: 40 }),
    );
  }, [streak]);

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data
    ) {
      const data = lastNotificationResponse.notification.request.content.data;
      const body = lastNotificationResponse.notification.request.content.body;

      if (data && data.updateLink) {
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

      if (data && data.anyLink) {
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
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    async function appStreak() {
      // dispatch(deleteAppStreakCounter());
      const today = new Date().toLocaleDateString("en-CA");
      console.log("today's date: ", today);

      dispatch(increaseAppStreakCounter({ today }));
    }
    appStreak();

    doFadeInAnimation();
    const loadOpenings = async () => {
      const reminder = await AsyncStorage.getItem("ReminderOn");
      if (reminder === null || reminder !== "false") {
        try {
          const storedOpenings = await AsyncStorage.getItem("appOpenings");
          // console.log("getting openings :", storedOpenings);
          if (storedOpenings !== null) {
            setOpenings(parseInt(storedOpenings, 20));
          }
        } catch (error) {
          console.error("Error loading app openings ", error);
        }
      }
    };
    loadOpenings();

    getHour();
    function getHour() {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Good morning ");
        setIcon(
          <Feather
            name="sun"
            size={25}
            color={theme == "dark" ? "#d8d800" : "#d8d800"}
          />,
        );
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Good afternoon ");
        setIcon(
          <Feather
            name="sun"
            size={25}
            color={theme == "dark" ? "#d8d800" : "#d8d800"}
          />,
        );
      } else {
        setGreeting("Good Evening ");
        setIcon(
          <Feather
            name="moon"
            size={25}
            color={theme == "dark" ? "#a6a6a6" : "#9a9a9a"}
          />,
        );
      }
    }

    const storedData = async () => {
      // await AsyncStorage.removeItem("isFirstTime");
      try {
        const isFirstTime = await AsyncStorage.getItem("isFirstTime");

        if (isFirstTime == null) {
          setIsFirst(true);
          await AsyncStorage.setItem("isFirstTime", "true");
        } else if (isFirstTime != null) {
          setIsFirst(false);
        }
      } catch (error) {
        console.log("isTime", error);
      }
    };
    storedData();

    const saveOpenings = async () => {
      const reminder = await AsyncStorage.getItem("ReminderOn");
      if (reminder === null || reminder !== "false") {
        try {
          await AsyncStorage.setItem("appOpenings", (openings + 1).toString());
        } catch (error) {
          console.error("Error saving app openings", error);
        }
      }
    };

    saveOpenings();

    // Check if it's the 20th opening
    if (openings > 0 && openings % 20 === 0) {
      setDonationModal(true);
    }
  }, [isFocused]);

  const dismissNotification = async (item) => {
    dispatch(deleteReminder(item.reminder.id));
    await Notifications.cancelScheduledNotificationAsync(item.identifier);
  };

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
    fetchUpdate();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const data = [
    {
      key: "General",
      value: "General",
    },
    {
      key: "People",
      value: "People",
    },
    {
      key: "Personal",
      value: "Personal",
    },
    {
      key: "Praise",
      value: "Praise",
    },
    {
      key: "Other",
      value: "Other",
    },
  ];
  const { colorScheme, setColorScheme } = useColorScheme();
  const ITEM_WIDTH = Dimensions.get("window").width / 2;

  // const [fontsLoaded, fontError] = useFonts({
  //   "Inter-Bold": require("../../assets/fonts/Inter-Bold.ttf"),
  //   "Inter-Regular": require("../../assets/fonts/Inter-Regular.ttf"),
  //   "Inter-Medium": require("../../assets/fonts/Inter-Medium.ttf"),
  //   "Inter-Light": require("../../assets/fonts/Inter-Light.ttf"),
  // });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  // if (!fontsLoaded && !fontError) {
  //   return null;
  // }

  if (isFirst == true) {
    navigation.navigate(ONBOARDING_SCREEN);
  }

  return (
    <WelcomeContainer
      // contentContainerStyle={{ alignItems: "flex-start" }}
      className="flex relative flex-1 dark:bg-[#121212] bg-[#f2f7ff]"
    >
      <View className="items-center mb-0 flex-row justify-between w-full">
        <Greeting theme={theme} />

        <View className="relative flex-row items-center">
          <UpdateModal
            theme={theme}
            isUpdateAvailable={isUpdateAvailable}
            setIsUpdateAvailable={setIsUpdateAvailable}
          />

          <View className="flex items-center flex-row">
            <TouchableOpacity
              onPress={() => setIsShowingStreak((prev) => !prev)}
              className="flex-row  p-[8px] items-center"
            >
              <View className="flex-row items-center gap-1">
                <MaterialCommunityIcons
                  style={{ zIndex: 10 }}
                  name="hands-pray"
                  size={20}
                  color={colorScheme == "dark" ? "white" : "#2f2d51"}
                />

                <Text className="text-[#2f2d51] dark:text-white font-inter font-bold">
                  {streak ?? 0}
                </Text>
              </View>
            </TouchableOpacity>
            <View className="p-[8px] relative">
              {/* <Text>Hey</Text> */}
              <Link className=" mt-1 " to={`/${NOTIFICATIONS_SCREEN}`}>
                <View className="p-[8px] rounded-md">
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={colorScheme == "dark" ? "white" : "#2f2d51"}
                  />
                </View>
              </Link>
              <Badge
                size={14}
                style={{
                  position: "absolute",
                  fontFamily: "Inter-Medium",
                  fontSize: 11,
                  top: 10,
                  right: 8,
                }}
              >
                {notis.length}
              </Badge>
            </View>
          </View>

          <StreakSlider
            appstreak={appstreak}
            streak={streak}
            theme={theme}
            setIsShowingStreak={setIsShowingStreak}
            isShowingStreak={isShowingStreak}
          />
        </View>
      </View>
      <DailyReflection
        completedItems={completedItems}
        devoStreak={streak}
        appStreak={appstreak}
        theme={theme}
      />
      <View className="w-full flex-1">
        <View className="bg-[#ffcd8b] dark:bg-[#212121] my-[5px] flex-1 border-[1px] border-[#ffcd8b] dark:border-[#474747] gap-[10px] rounded-lg p-[10px] mb-[15px]">
          <View className="flex-row items-center justify-between">
            <Text className="font-inter font-bold text-xl text-[#2f2d51] dark:text-white">
              Reminders
            </Text>
            <View className="flex-row items-center gap-3">
              <Link to={`/${REMINDER_SCREEN}`}>
                <View className="flex-row items-center gap-[5px]">
                  <Text className="font-inter font-semibold text-lg text-[#444444] dark:text-white">
                    View all
                  </Text>
                </View>
              </Link>
              <Link to={`/${TEST_SCREEN}?type=Add`}>
                <View className="flex-row items-center gap-1">
                  <Text className="font-inter font-semibold text-lg text-[#2f2d51] dark:text-[#a5c9ff]">
                    Add
                  </Text>
                  <Ionicons
                    name="add-circle-outline"
                    size={30}
                    color={colorScheme == "dark" ? "#A5C9FF" : "#2f2d51"}
                  />
                </View>
              </Link>
            </View>
          </View>
          {reminders.length == 0 ? (
            <View className="flex-1 justify-center items-center gap-[10px]">
              <Image
                style={{
                  tintColor: colorScheme == "dark" ? "white" : "#2f2d51",
                  width: 40,
                  height: 40,
                }}
                source={noreminder}
              />
              <Text className="text-[#2f2d51] dark:text-[#d2d2d2] self-center font-inter font-medium">
                No reminders yet!
              </Text>
            </View>
          ) : (
            <SafeAreaView className="flex-1">
              <FlatList
                pagingEnabled
                snapToInterval={ITEM_WIDTH}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={reminders}
                keyExtractor={(e, i) => i.toString()}
                renderItem={({ item }) => {
                  const daysOfWeek = [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ];

                  const timestamp = new Date(item.reminder.time);
                  let timeOptions;

                  let dayOfWeekName;

                  if (item.ocurrence === "Daily") {
                    const options = {
                      hour: "numeric",
                      minute: "numeric",
                    };
                    timeOptions = options;
                  } else if (item.ocurrence === "Weekly") {
                    const dayOfWeekNumber = timestamp.getDay();
                    dayOfWeekName = daysOfWeek[dayOfWeekNumber];

                    const options = {
                      hour: "numeric",
                      minute: "numeric",
                    };
                    timeOptions = options;
                  } else if (item.ocurrence === "None") {
                    const options = {
                      month: "numeric",
                      day: "numeric",
                      year: "2-digit",
                      hour: "numeric",
                      minute: "numeric",
                    };
                    timeOptions = options;
                  }
                  const formattedDate = timestamp.toLocaleString(
                    "en-US",
                    timeOptions,
                  );

                  return (
                    <View
                      className="p-[10px] mr-[15px] gap-[5px] rounded-lg bg-[#f2f7ff] dark:bg-[#121212]"
                      style={{
                        maxWidth: ITEM_WIDTH + 100,
                      }}
                    >
                      <View className="flex-row items-center gap-[5px]">
                        <Ionicons
                          name="time-outline"
                          size={24}
                          color={colorScheme == "dark" ? "#f1d592" : "#dda41c"}
                        />
                        {item.ocurrence === "Daily" && (
                          <Text className="text-base font-inter font-medium text-[#dda41c] dark:text-[#f1d592]">
                            {item.ocurrence} at {formattedDate}
                          </Text>
                        )}
                        {item.ocurrence === "Weekly" && (
                          <Text className="text-base font-inter font-medium text-[#dda41c] dark:text-[#f1d592]">
                            {item.ocurrence} on {dayOfWeekName}s at{" "}
                            {formattedDate}
                          </Text>
                        )}
                        {item.ocurrence === "None" && (
                          <Text className="text-base font-inter font-medium text-[#dda41c] dark:text-[#f1d592]">
                            {formattedDate}
                          </Text>
                        )}
                      </View>
                      <View className="gap-[5px]">
                        <Text
                          numberOfLines={1}
                          lineBreakMode="tail"
                          className="font-inter font-medium text-lg text-[#2f2d51] dark:text-white"
                        >
                          {item.reminder.message}
                        </Text>

                        <Text
                          numberOfLines={2}
                          lineBreakMode="tail"
                          className="font-inter text-base font-normal text-[#bebebe]"
                        >
                          {item.reminder.note}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-[10px] self-end mt-auto">
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate(TEST_SCREEN, {
                              type: "Edit",
                              reminderEditId: item.reminder.id,
                              reminderIdentifier: item.identifier,
                              ocurrence: item.ocurrence,
                              reminderToEditTitle: item.reminder.message,
                              reminderToEditNote: item.reminder.note,
                              reminderToEditTime: item.reminder.time.toString(),
                            })
                          }
                        >
                          <Text className="text-[#2f2d51] dark:text-white font-inter font-semibold text-base">
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <View className="w-[1.2px] h-full bg-[#2f2d51] dark:bg-white" />
                        <TouchableOpacity
                          onPress={() => dismissNotification(item)}
                        >
                          <Text className="font-inter font-semibold text-base text-[#ff3b3b]">
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            </SafeAreaView>
          )}
        </View>
      </View>
      <NewFeaturesModal
        theme={theme}
        setFeatureVisible={setFeatureVisible}
        featureVisible={featureVisible}
      />
      <QuestionoftheWeek colorScheme={colorScheme} theme={theme} />
      <GospelofJesus colorScheme={colorScheme} theme={theme} />
      <MerchComponent colorScheme={colorScheme} theme={theme} />
      <View className="w-full mt-auto mb-5">
        <View className="mb-10 w-full gap-[2px]">
          <Text className="dark:text-white text-[#2f2d51] font-inter font-bold text-lg">
            Quick links
          </Text>
          <Divider className="mb-3 mt-1" />
          <TouchableOpacity
            onPress={() => setFeatureVisible(true)}
            className="w-full dark:bg-[#212121] mb-[5px] rounded-lg bg-white px-[6px] py-3 justify-between items-center flex-row"
          >
            <View className="flex-row items-center">
              <Feather
                name="info"
                size={24}
                color={
                  colorScheme == "dark"
                    ? "#f1d592"
                    : theme == "BlackWhite"
                      ? "black"
                      : "#bb8b18"
                }
              />
              <Text className="dark:text-[#f1d592] text-[#bb8b18] ml-[10px] font-inter font-medium">
                What's New in v9.5!
              </Text>
            </View>
            <AntDesign
              name="right"
              size={18}
              color={colorScheme == "dark" ? "#f1d592" : "#bb8b18"}
            />
          </TouchableOpacity>
          {Platform.OS === "android" && (
            <TouchableOpacity
              className="w-full dark:bg-[#212121] mb-[10px] rounded-lg bg-white px-[6px] py-3 justify-between items-center flex-row"
              onPress={() =>
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp",
                )
              }
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="logo-google-playstore"
                  size={24}
                  color={colorScheme == "dark" ? "#d6d6d6" : "#606060"}
                />
                <Text className="font-inter dark:text-[#f0f0f0] text-[#606060] font-medium ml-[10px]">
                  Check for Updates
                </Text>
              </View>
              <AntDesign
                name="right"
                size={18}
                color={colorScheme == "dark" ? "#d6d6d6" : "#606060"}
              />
            </TouchableOpacity>
          )}
          {Platform.OS === "ios" && (
            <TouchableOpacity
              className="w-full dark:bg-[#212121] mb-[10px] rounded-lg bg-white px-[6px] py-3 justify-between items-center flex-row"
              onPress={() =>
                Linking.openURL(
                  "https://apps.apple.com/us/app/prayerlist-app/id6443480347",
                )
              }
            >
              <View className="flex-row items-center">
                <AntDesign
                  name="apple1"
                  size={24}
                  color={colorScheme == "dark" ? "#d6d6d6" : "#606060"}
                />
                <Text className="ml-[10px] font-inter font-medium dark:text-[#f0f0f0] text-[#606060]">
                  Check for Updates
                </Text>
              </View>
              <AntDesign
                name="right"
                size={18}
                color={colorScheme == "dark" ? "#d6d6d6" : "#2f2d51"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  bgImg: {
    flex: 1,
    justifyContent: "center",
  },
  containerDark: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  dismiss: {
    alignSelf: "flex-start",
    // alignSelf:'left',
    marginVertical: 5,
    padding: 2,
    // borderBottomColor: '#ff4e4e',
    // borderBottomWidth: 0.2
  },
  refreshDark: {
    width: "100%",
    backgroundColor: "#212121",
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 15,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  refresh: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 15,
    // borderColor: "#dddddd",
    // borderWidth: 0.4,
    shadowColor: "#bdbdbd",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refreshBlack: {
    width: "100%",
    backgroundColor: "white",
    paddingHorizontal: 6,
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 15,
    borderColor: "black",
    borderWidth: 0.4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
  },
  section: {
    backgroundColor: "#a6c8ff",
  },
  sectionDark: {
    backgroundColor: "#212121",
  },
  wrapper: {
    width: "80%",
  },
  select: {
    fontSize: 13,
    paddingVertical: 5,
    color: "black",
    fontFamily: "Inter-Regular",
  },
  selectDark: {
    fontSize: 13,
    paddingVertical: 5,
    color: "white",
    fontFamily: "Inter-Regular",
  },

  category: {
    backgroundColor: "#2F2D51",
    color: "black",
    marginTop: 10,
    height: 50,
    alignItems: "center",
  },
  categoryDark: {
    backgroundColor: "#121212",
    color: "white",
    marginTop: 10,
    height: 50,
    alignItems: "center",
  },

  dropdown: {
    backgroundColor: "#2F2D51",
    height: 800,
  },
  dropdownDark: {
    backgroundColor: "#121212",
    height: 800,
  },
  dropdownText: {
    color: "black",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  inputText: {
    color: "white",
  },
  dropdownTextDark: {
    color: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  listText: {
    fontFamily: "Inter-Regular",
    color: "#2f2d51",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 10,
  },
  listTextDark: {
    fontFamily: "Inter-Regular",
    fontSize: 15,
    lineHeight: 20,
    color: "white",
    marginBottom: 10,
  },
  instructions: {
    marginBottom: 5,
    fontSize: 16,
    fontFamily: "Inter-Medium",
  },
  instructionsDark: {
    marginBottom: 5,
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "white",
  },
  welcome: {
    fontSize: 22,
    marginVertical: 15,
    fontFamily: "Inter-Bold",
    letterSpacing: 2,
    alignSelf: "center",
    color: "#2F2D51",
  },
  welcomeDark: {
    marginVertical: 15,
    fontSize: 22,
    fontFamily: "Inter-Bold",
    alignSelf: "center",
    letterSpacing: 2,
    color: "white",
  },
  welcomeBlack: {
    marginVertical: 15,
    fontSize: 22,
    fontFamily: "Inter-Bold",
    alignSelf: "center",
    letterSpacing: 2,
    color: "black",
  },
  greeting: {
    fontSize: 18,
    // marginVertical: 5,
    fontFamily: "Inter-Bold",
    letterSpacing: 2,
    alignSelf: "center",
    color: "#2F2D51",
  },
  greetingDark: {
    // marginVertical: 5,
    fontSize: 18,
    fontFamily: "Inter-Black",
    alignSelf: "flex-start",
    letterSpacing: 2,
    color: "#d2d2d2",
  },
  greetingBlack: {
    marginVertical: 5,
    fontSize: 19,
    fontFamily: "Inter-Medium",
    alignSelf: "flex-start",
    letterSpacing: 2,
    color: "black",
  },
  imgContainer: {
    backgroundColor: "white",
    position: "relative",
    height: 180,
    width: 180,
    borderRadius: 100,
    marginVertical: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 250,
    height: 250,
  },
  button: {
    marginTop: 25,
    width: 160,
    backgroundColor: "#2f2d51",
    shadowColor: "#9f9f9f",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 8,
    padding: 16,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDark: {
    marginTop: 20,
    width: 160,
    backgroundColor: "#A5C9FF",
    padding: 16,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBlack: {
    marginTop: 20,
    width: 160,
    backgroundColor: "black",
    padding: 14,
    borderRadius: 50,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
