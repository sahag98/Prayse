import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  ActivityIndicator,
  Platform,
  Linking,
  View,
  Modal,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import prayer from "../assets/prayer-nobg.png";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { useFonts } from "expo-font";
// import Unorderedlist from "react-native-unordered-list";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider } from "react-native-paper";
import {
  Container,
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
  WelcomeContainer,
} from "../styles/appStyles";
import * as SplashScreen from "expo-splash-screen";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useIsFocused } from "@react-navigation/native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  FadeIn,
  Transition,
  Transitioning,
} from "react-native-reanimated";
import { PROJECT_ID, NOTIFICATION_API } from "@env";
import moment from "moment";
import { addQuickFolder } from "../redux/folderReducer";
import uuid from "react-native-uuid";
import { KeyboardAvoidingView } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Keyboard } from "react-native";
import { addPrayer } from "../redux/prayerReducer";
import * as Updates from "expo-updates";
import { Badge } from "react-native-paper";
import { addNoti, deleteAll } from "../redux/notiReducer";
import NotiItem from "../components/NotiItem";
import NewFeaturesModal from "../components/NewFeaturesModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DonationModal from "../components/DonationModal";
import { client } from "../lib/client";
import { nativeApplicationVersion } from "expo-application";
import UpdateModal from "../components/UpdateModal";
import { useSupabase } from "../context/useSupabase";
import { Dimensions } from "react-native";
import { deleteReminder } from "../redux/remindersReducer";
import axios from "axios";
import ReminderModal from "../components/ReminderModal";
import MerchComponent from "../components/MerchComponent";

import noreminder from "../assets/noreminders.png";

// SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const data = notification.request.content.data;
    // if (data && data.screen) {
    //   // navigate to the screen specified in the data object
    //   navigation.navigate(data.screen);
    // }
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
  await fetch(NOTIFICATION_API, {
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
      console.log(status);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log(
        "To recieve notifications in the future, enable Notifications from the App Settings."
      );
      return;
    }

    token = (
      await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })
    ).data;
  } else {
    console.log("Must use physical device for Push Notifications");
  }
  return token;
}

const initialOffset = 200;

const Welcome = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.expoToken);
  const [openings, setOpenings] = useState(0);
  const [donationModal, setDonationModal] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [featureVisible, setFeatureVisible] = useState(false);
  const [icon, setIcon] = useState(null);
  const { supabase } = useSupabase();
  const [expanded, setExpanded] = useState(true);
  const handlePress = () => setExpanded(!expanded);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const reminders = useSelector((state) => state.reminder.reminders);
  const notis = useSelector((state) => state.noti.notifications);
  const folders = useSelector((state) => state.folder.folders);
  const quickFolderExists = useSelector(
    (state) => state.folder.quickFolderExists
  );
  const offset = useSharedValue(initialOffset);
  // const fadeAnim = useRef(new Animated.Value(0)).current;
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [quickModal, setQuickModal] = useState(false);
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
  const [reminderVisible, setReminderVisible] = useState(false);
  const [image, setImage] = useState(null);

  async function fetchUpdate() {
    try {
      let { data: update, error } = await supabase
        .from("update")
        .select("isUpdateAvailable");

      if (update[0].isUpdateAvailable != nativeApplicationVersion.toString()) {
        // setIsUpdateAvailable(true);
      } else {
        console.log("update is not available");
        setIsUpdateAvailable(false);
      }
    } catch (error) {
      console.log(error);
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

  async function handleQuickPrayer() {
    console.log(quickFolderExists);
    if (quickFolderExists === undefined || quickFolderExists === false) {
      console.log("its undefined");
      try {
        await dispatch(
          addQuickFolder({
            id: 4044,
            name: "Quick Prayers",
            prayers: [],
          })
        );
      } catch (error) {
        console.log(error);
      }
      console.log("folder created");
      handleSubmit();
    } else if (quickFolderExists === true) {
      console.log("folder already exists, adding prayer to it");
      handleSubmit();
    }
  }

  function handleSubmit() {
    dispatch(
      addPrayer({
        prayer: quickprayervalue,
        folder: "Quick Prayers",
        folderId: 4044,
        category: quickcategoryvalue,
        date: new Date().toLocaleString(),
        id: uuid.v4(),
      })
    );
    setQuickModal(false);
    setQuickprayervalue("");
  }

  function handleCloseTooltip() {
    setToolVisible(false);
  }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  function handleCloseModal() {
    setQuickprayervalue("");
    setQuickModal(false);
  }

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data
    ) {
      console.log("last noti: ", lastNotificationResponse.notification);
      const data = lastNotificationResponse.notification.request.content.data;
      const body = lastNotificationResponse.notification.request.content.body;
      console.log("data of last noti: ", data);
      if (data && data.updateLink) {
        if (Platform.OS === "ios") {
          Linking.openURL(
            "https://apps.apple.com/us/app/prayerlist-app/id6443480347"
          );
        } else if (Platform.OS === "android") {
          Linking.openURL(
            "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp"
          );
        }
      }

      if (data && data.anyLink) {
        Linking.openURL(data.anyLink);
      }

      if (data && data.screen) {
        console.log("in screen");
        //navigate to the screen specified in the data object
        if (data.screen == "VerseOfTheDay") {
          navigation.navigate(data.screen, {
            verse: body,
            title: data.verseTitle,
          });
        } else if (
          data.screen == "Community" &&
          data.currGroup &&
          data.allGroups
        ) {
          navigation.navigate(data.screen, {
            group: data.currGroup,
            allGroups: data.allGroups,
          });
        } else if (data.screen == "Reflection" && data.devoTitle) {
          navigation.navigate(data.screen, {
            devoTitle: data.devoTitle,
          });
        } else {
          navigation.navigate(data.screen);
        }
      }
    }
  }, [lastNotificationResponse]);

  useEffect(() => {
    // AsyncStorage.getItem("modalShown").then((value) => {
    //   if (value === null) {
    //     // If the modal hasn't been shown before, show it and set the flag
    //     setFeatureVisible(true);
    //     AsyncStorage.setItem("modalShown", "true");
    //   }
    // });
    const loadOpenings = async () => {
      // await AsyncStorage.removeItem("AppOpenings");
      // await AsyncStorage.removeItem("ReminderOn");
      const reminder = await AsyncStorage.getItem("ReminderOn");
      if (reminder === null || reminder !== "false") {
        try {
          const storedOpenings = await AsyncStorage.getItem("appOpenings");
          console.log("getting openings :", storedOpenings);
          if (storedOpenings !== null) {
            console.log("not null");
            setOpenings(parseInt(storedOpenings, 10));
          }
        } catch (error) {
          console.error("Error loading app openings ", error);
        }
      }
    };
    loadOpenings();

    // Animated.timing(fadeAnim, {
    //   toValue: 1,
    //   duration: 3000,
    //   useNativeDriver: true,
    // }).start();

    getHour();
    function getHour() {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting("Good morning ");
        setIcon(
          <Feather
            name="sun"
            size={30}
            color={theme == "dark" ? "#d8d800" : "#d8d800"}
          />
        );
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting("Good afternoon ");
        setIcon(
          <Feather
            name="sun"
            size={30}
            color={theme == "dark" ? "#d8d800" : "#d8d800"}
          />
        );
      } else {
        setGreeting("Good Evening ");
        setIcon(
          <Feather
            name="moon"
            size={30}
            color={theme == "dark" ? "#a6a6a6" : "#9a9a9a"}
          />
        );
      }
    }

    const storedData = async () => {
      // await AsyncStorage.removeItem("isFirstTime");
      try {
        const isFirstTime = await AsyncStorage.getItem("isFirstTime");

        if (isFirstTime == null) {
          console.log("it is the first time");
          setIsFirst(true);
          await AsyncStorage.setItem("isFirstTime", "true");
        } else if (isFirstTime != null) {
          setIsFirst(false);
        }
      } catch (error) {
        console.log(error);
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

    // Check if it's the 10th opening
    if (openings > 0 && openings % 10 === 0) {
      console.log("modal should open");
      setDonationModal(true);
    }
  }, [isFocused]);

  const dismissNotification = async (item) => {
    dispatch(deleteReminder(item.reminder.id));
    await Notifications.cancelScheduledNotificationAsync(item.identifier);
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => sendToken(token).then(console.log("token sent")))
      .catch((err) => console.log(err));
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        let date = Date();
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
          dispatch(
            addNoti({
              noti_id: uuid.v4(),
              date: formattedDate,
              notification: notification.request.content.body,
              screen: notification.request.content.data?.screen,
              prayerId: notification.request.content.data?.prayerId,
              identifier: notification.request.identifier,
            })
          );
        }

        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const body = response.notification.request.content.body;
        const res = response.notification.request.content.data;
      });
    fetchUpdate();
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
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

  const ITEM_WIDTH = Dimensions.get("window").width / 2;

  const [fontsLoaded] = useFonts({
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <BusyIndicator />;
  }

  if (isFirst == true) {
    navigation.navigate("Onboarding");
  }

  return (
    <WelcomeContainer
      contentContainerStyle={{ alignItems: "center" }}
      onLayout={onLayoutRootView}
      style={
        theme == "dark"
          ? {
              display: "flex",
              position: "relative",
              // alignItems: "center",

              backgroundColor: "#121212",
            }
          : theme == "BlackWhite"
          ? {
              display: "flex",
              position: "relative",
              // alignItems: "center",
              backgroundColor: "white",
            }
          : {
              display: "flex",
              position: "relative",
              // alignItems: "center",
              backgroundColor: "#F2F7FF",
            }
      }
    >
      <View
        style={{
          alignItems: "center",
          marginBottom: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Animated.View
          entering={FadeIn.duration(2000)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Animated.Text
            style={
              theme == "dark"
                ? styles.greetingDark
                : theme == "BlackWhite"
                ? styles.greetingBlack
                : styles.greeting
            }
          >
            {greeting}
          </Animated.Text>
          {icon}
        </Animated.View>

        <View style={{ position: "relative", padding: 10 }}>
          <UpdateModal
            theme={theme}
            isUpdateAvailable={isUpdateAvailable}
            setIsUpdateAvailable={setIsUpdateAvailable}
          />
          <DonationModal
            donationModal={donationModal}
            setDonationModal={setDonationModal}
            theme={theme}
            setIsReminderOn={setIsReminderOff}
          />
          <TouchableOpacity
            onPress={() => setNotiVisible((prev) => !prev)}
            style={
              theme == "dark"
                ? {
                    backgroundColor: "#212121",
                    borderRadius: 50,
                    padding: 12,
                  }
                : {
                    backgroundColor: "#2f2d51",
                    borderRadius: 50,
                    padding: 12,
                  }
            }
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
          <Badge
            size={18}
            style={{
              position: "absolute",
              fontFamily: "Inter-Medium",
              fontSize: 12,
              top: 8,
              right: 6,
            }}
          >
            {notis.length}
          </Badge>
        </View>
      </View>
      <View style={{ width: "100%", flex: 1 }}>
        <View
          style={
            theme == "dark"
              ? {
                  backgroundColor: "#212121",
                  flex: 1,
                  marginVertical: 5,
                  borderWidth: 1,
                  borderColor: "#474747",
                  gap: 10,
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 20,
                }
              : {
                  backgroundColor: "#ffcd8b",
                  gap: 10,
                  shadowColor: "#9f9f9f",
                  shadowOffset: {
                    width: 0,
                    height: 6,
                  },
                  shadowOpacity: 0.2,
                  shadowRadius: 5.62,

                  elevation: 8,
                  flex: 1,
                  marginVertical: 5,
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 20,
                }
          }
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Bold", fontSize: 17, color: "white" }
                  : {
                      fontFamily: "Inter-Bold",
                      fontSize: 17,
                      color: "#2f2d51",
                    }
              }
            >
              Prayer Reminders
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
                onPress={() => navigation.navigate("Reminder")}
              >
                <Text
                  style={
                    theme == "dark"
                      ? {
                          fontFamily: "Inter-Medium",
                          fontSize: 16,
                          color: "white",
                        }
                      : {
                          fontFamily: "Inter-Medium",
                          fontSize: 16,
                          color: "#444444",
                        }
                  }
                >
                  View All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
                onPress={() =>
                  navigation.navigate("Test", {
                    type: "Add",
                  })
                }
              >
                <Text
                  style={
                    theme == "dark"
                      ? {
                          fontFamily: "Inter-Medium",
                          fontSize: 16,
                          color: "#A5C9FF",
                        }
                      : {
                          fontFamily: "Inter-Medium",
                          fontSize: 16,
                          color: "#2f2d51",
                        }
                  }
                >
                  Add
                </Text>
                <Ionicons
                  name="add-circle-outline"
                  size={30}
                  color={theme == "dark" ? "#A5C9FF" : "#2f2d51"}
                />
              </TouchableOpacity>
            </View>
          </View>
          {reminders.length == 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Image
                style={{
                  tintColor: theme == "dark" ? "white" : "#2f2d51",
                  width: 50,
                  height: 50,
                }}
                source={noreminder}
              />
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#d2d2d2",
                        alignSelf: "center",
                        fontSize: 15,
                        fontFamily: "Inter-Medium",
                      }
                    : {
                        color: "#2f2d51",
                        alignSelf: "center",
                        fontSize: 15,
                        fontFamily: "Inter-Medium",
                      }
                }
              >
                No reminders yet!
              </Text>
            </View>
          ) : (
            <SafeAreaView style={{ flex: 1 }}>
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
                    console.log("none");
                    let options = {
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
                    timeOptions
                  );

                  return (
                    <View
                      style={
                        theme == "dark"
                          ? {
                              padding: 10,
                              marginRight: 15,
                              gap: 5,
                              borderRadius: 10,

                              backgroundColor: "#121212",
                              maxWidth: ITEM_WIDTH + 100,
                            }
                          : {
                              marginRight: 15,
                              gap: 5,
                              justifyContent: "space-between",
                              padding: 10,
                              borderRadius: 10,
                              backgroundColor: "#f2f7ff",
                              maxWidth: ITEM_WIDTH + 100,
                            }
                      }
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <Ionicons
                          name="time-outline"
                          size={24}
                          color={theme == "dark" ? "#f1d592" : "#dda41c"}
                        />
                        {item.ocurrence === "Daily" && (
                          <Text
                            style={
                              theme == "dark"
                                ? {
                                    fontSize: 14,
                                    fontFamily: "Inter-Medium",
                                    color: "#f1d592",
                                  }
                                : {
                                    fontSize: 14,
                                    fontFamily: "Inter-Medium",
                                    color: "#dda41c",
                                  }
                            }
                          >
                            {item.ocurrence} at {formattedDate}
                          </Text>
                        )}
                        {item.ocurrence === "Weekly" && (
                          <Text
                            style={
                              theme == "dark"
                                ? {
                                    fontSize: 14,
                                    fontFamily: "Inter-Regular",
                                    color: "#f1d592",
                                  }
                                : {
                                    fontSize: 14,
                                    fontFamily: "Inter-Regular",
                                    color: "#dda41c",
                                  }
                            }
                          >
                            {item.ocurrence} on {dayOfWeekName}s at{" "}
                            {formattedDate}
                          </Text>
                        )}
                        {item.ocurrence === "None" && (
                          <Text
                            style={
                              theme == "dark"
                                ? {
                                    fontSize: 14,
                                    fontFamily: "Inter-Regular",
                                    color: "#f1d592",
                                  }
                                : {
                                    fontSize: 14,
                                    fontFamily: "Inter-Regular",
                                    color: "#dda41c",
                                  }
                            }
                          >
                            {formattedDate}
                          </Text>
                        )}
                      </View>
                      <View style={{ gap: 5 }}>
                        <Text
                          numberOfLines={1}
                          lineBreakMode="tail"
                          style={
                            theme == "dark"
                              ? {
                                  fontFamily: "Inter-Regular",
                                  fontSize: 15,
                                  color: "white",
                                }
                              : {
                                  fontFamily: "Inter-Regular",
                                  fontSize: 15,
                                  color: "#2f2d51",
                                }
                          }
                        >
                          {item.reminder.message}
                        </Text>

                        <Text
                          numberOfLines={2}
                          lineBreakMode="tail"
                          style={{
                            fontFamily: "Inter-Regular",
                            fontSize: 13,
                            color: "#bebebe",
                          }}
                        >
                          {item.reminder.note}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          alignSelf: "flex-end",
                          marginTop: "auto",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Test", {
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
                          <Text
                            style={
                              theme == "dark"
                                ? {
                                    fontFamily: "Inter-Medium",
                                    fontSize: 13,
                                    color: "white",
                                  }
                                : {
                                    fontFamily: "Inter-Medium",
                                    fontSize: 13,
                                    color: "#2f2d51",
                                  }
                            }
                          >
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={
                            theme == "dark"
                              ? {
                                  width: 1.2,
                                  height: "100%",
                                  backgroundColor: "white",
                                }
                              : {
                                  width: 1.2,
                                  height: "100%",
                                  backgroundColor: "#2f2d51",
                                }
                          }
                        />
                        <TouchableOpacity
                          onPress={() => dismissNotification(item)}
                        >
                          <Text
                            style={{
                              fontFamily: "Inter-Medium",
                              fontSize: 13,
                              color: "#ff3b3b",
                            }}
                          >
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
        {notiVisible && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={
              theme == "dark"
                ? {
                    backgroundColor: "#212121",
                    borderColor: "#A5C9FF",
                    borderWidth: 1,
                    zIndex: 99,
                    position: "absolute",
                    borderRadius: 10,
                    overflow: "hidden",
                    top: -5,
                    right: 0,
                  }
                : {
                    backgroundColor: "#93d8f8",
                    borderColor: "#2f2d51",
                    borderWidth: 1,
                    zIndex: 99,
                    position: "absolute",
                    borderRadius: 10,
                    overflow: "hidden",
                    top: -5,
                    right: 0,
                  }
            }
          >
            {notis.length == 0 ? (
              <View style={{ padding: 12 }}>
                <Text
                  style={
                    theme == "dark"
                      ? { color: "white", fontFamily: "Inter-Medium" }
                      : { color: "#2f2d51", fontFamily: "Inter-Medium" }
                  }
                >
                  No new notifications yet!
                </Text>
              </View>
            ) : (
              <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                  data={notis}
                  keyExtractor={(item) => item.noti_id}
                  onEndReachedThreshold={0}
                  initialNumToRender={4}
                  windowSize={8}
                  ListFooterComponent={() => (
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(deleteAll());
                        setNotiVisible(false);
                      }}
                      style={{ padding: 10, alignSelf: "flex-end" }}
                    >
                      <Text
                        style={
                          theme == "dark"
                            ? { fontFamily: "Inter-Bold", color: "#e24774" }
                            : { fontFamily: "Inter-Bold", color: "#ff6262" }
                        }
                      >
                        Clear all
                      </Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <Divider
                      style={
                        theme == "dark"
                          ? { backgroundColor: "#525252" }
                          : { backgroundColor: "#2f2d51" }
                      }
                    />
                  )}
                  scrollEventThrottle={16}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <NotiItem
                      theme={theme}
                      navigation={navigation}
                      setNotiVisible={setNotiVisible}
                      item={item}
                    />
                  )}
                />
              </SafeAreaView>
            )}
          </Animated.View>
        )}
      </View>
      <NewFeaturesModal
        theme={theme}
        setFeatureVisible={setFeatureVisible}
        featureVisible={featureVisible}
      />
      <MerchComponent theme={theme} />
      <View
        style={{
          width: "100%",
          marginTop: "auto",
          marginBottom: 20,
          zIndex: notiVisible ? -10 : 1,
        }}
      >
        <View
          style={
            notiVisible ? { width: "100%", gap: 2 } : { width: "100%", gap: 2 }
          }
        >
          <Text
            style={
              theme == "dark"
                ? { color: "white", fontFamily: "Inter-Bold", fontSize: 17 }
                : { color: "#2f2d51", fontFamily: "Inter-Bold", fontSize: 17 }
            }
          >
            Quick links
          </Text>
          <Divider
            style={
              theme == "BlackWhite"
                ? { backgroundColor: "black", marginBottom: 10, marginTop: 5 }
                : { marginBottom: 10, marginTop: 5 }
            }
          />
          <TouchableOpacity
            onPress={() => setFeatureVisible(true)}
            style={
              theme == "dark"
                ? styles.refreshDark
                : theme == "BlackWhite"
                ? styles.refreshBlack
                : styles.refresh
            }
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Feather
                name="info"
                size={24}
                color={
                  theme == "dark"
                    ? "#f1d592"
                    : theme == "BlackWhite"
                    ? "black"
                    : "#bb8b18"
                }
              />
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#f1d592",
                        marginLeft: 10,
                        fontFamily: "Inter-Regular",
                      }
                    : theme == "BlackWhite"
                    ? {
                        color: "black",
                        marginLeft: 10,
                        fontFamily: "Inter-Regular",
                      }
                    : {
                        color: "#bb8b18",
                        marginLeft: 10,
                        fontFamily: "Inter-Regular",
                      }
                }
              >
                What's New in v9.2!
              </Text>
            </View>
            <AntDesign
              name="right"
              size={18}
              color={
                theme == "dark"
                  ? "#f1d592"
                  : theme == "BlackWhite"
                  ? "black"
                  : "#bb8b18"
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Gospel")}
            style={
              theme == "dark"
                ? styles.refreshDark
                : theme == "BlackWhite"
                ? styles.refreshBlack
                : styles.refresh
            }
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="cross"
                size={24}
                color={theme == "BlackWhite" ? "black" : "#8cbaff"}
              />
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#A5C9FF",
                        marginLeft: 10,
                        fontFamily: "Inter-Regular",
                      }
                    : theme == "BlackWhite"
                    ? {
                        color: "black",
                        marginLeft: 10,
                        fontFamily: "Inter-Regular",
                      }
                    : {
                        color: "#738cb2",
                        marginLeft: 10,
                        fontFamily: "Inter-Regular",
                      }
                }
              >
                The Gospel of Jesus
              </Text>
            </View>
            <AntDesign
              name="right"
              size={18}
              color={
                theme == "dark"
                  ? "#8cbaff"
                  : theme == "BlackWhite"
                  ? "black"
                  : "#738cb2"
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.buymeacoffee.com/prayse")
            }
            style={
              theme == "dark"
                ? styles.refreshDark
                : theme == "BlackWhite"
                ? styles.refreshBlack
                : styles.refresh
            }
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="hearto"
                size={24}
                color={theme == "BlackWhite" ? "black" : "#DE3163"}
              />
              <Text
                style={
                  theme == "dark"
                    ? {
                        color: "#e24774",
                        marginLeft: 10,
                        fontFamily: "Inter-Regular",
                      }
                    : theme == "BlackWhite"
                    ? {
                        color: "black",
                        marginLeft: 10,
                        fontFamily: "Inter-Regular",
                      }
                    : {
                        color: "#cb3f68",
                        marginLeft: 10,
                        fontFamily: "Inter-Regular",
                      }
                }
              >
                Support Prayse
              </Text>
            </View>
            <AntDesign
              name="right"
              size={18}
              color={
                theme == "dark"
                  ? "#e24774"
                  : theme == "BlackWhite"
                  ? "black"
                  : "#cb3f68"
              }
            />
          </TouchableOpacity>
          {Platform.OS === "android" && (
            <TouchableOpacity
              style={
                theme == "dark"
                  ? styles.refreshDark
                  : theme == "BlackWhite"
                  ? styles.refreshBlack
                  : styles.refresh
              }
              onPress={() =>
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp"
                )
              }
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="logo-google-playstore"
                  size={24}
                  color={
                    theme == "dark"
                      ? "#d6d6d6"
                      : theme == "BlackWhite"
                      ? "black"
                      : "#606060"
                  }
                />
                <Text
                  style={
                    theme == "dark"
                      ? {
                          color: "#f0f0f0",
                          fontFamily: "Inter-Regular",
                          marginLeft: 10,
                        }
                      : theme == "BlackWhite"
                      ? {
                          color: "black",
                          fontFamily: "Inter-Regular",
                          marginLeft: 10,
                        }
                      : {
                          color: "#606060",
                          fontFamily: "Inter-Regular",
                          marginLeft: 10,
                        }
                  }
                >
                  Check for Updates
                </Text>
              </View>
              <AntDesign
                name="right"
                size={18}
                color={
                  theme == "dark"
                    ? "#d6d6d6"
                    : theme == "BlackWhite"
                    ? "black"
                    : "#606060"
                }
              />
            </TouchableOpacity>
          )}
          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={theme == "dark" ? styles.refreshDark : styles.refresh}
              onPress={() =>
                Linking.openURL(
                  "https://apps.apple.com/us/app/prayerlist-app/id6443480347"
                )
              }
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="apple1"
                  size={24}
                  color={theme == "dark" ? "#d6d6d6" : "#606060"}
                />
                <Text
                  style={
                    theme == "dark"
                      ? {
                          color: "#f0f0f0",
                          fontFamily: "Inter-Regular",
                          marginLeft: 10,
                        }
                      : {
                          color: "#606060",
                          fontFamily: "Inter-Regular",
                          marginLeft: 10,
                        }
                  }
                >
                  Check for Updates
                </Text>
              </View>
              <AntDesign
                name="right"
                size={18}
                color={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            marginBottom: 40,
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Folders")}
            style={
              theme == "dark"
                ? [styles.buttonDark, { backgroundColor: "#212121" }]
                : theme == "BlackWhite"
                ? styles.buttonBlack
                : styles.button
            }
          >
            <Text
              style={
                theme == "dark"
                  ? { color: "white", fontFamily: "Inter-Bold" }
                  : theme == "BlackWhite"
                  ? { color: "white", fontFamily: "Inter-Bold" }
                  : { color: "white", fontFamily: "Inter-Bold" }
              }
            >
              Create Folder
            </Text>
            <AntDesign
              style={{ marginLeft: 10 }}
              name="right"
              size={20}
              color={theme == "dark" ? "white" : "white"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setQuickModal(true)}
            style={
              theme == "dark"
                ? [styles.buttonDark]
                : theme == "BlackWhite"
                ? [
                    styles.buttonDark,
                    {
                      backgroundColor: "white",
                      borderColor: "black",
                      borderWidth: 1,
                    },
                  ]
                : [styles.button, { backgroundColor: "#b7d3ff" }]
            }
          >
            <Text
              style={
                theme == "dark"
                  ? { color: "#121212", fontFamily: "Inter-Bold" }
                  : theme == "BlackWhite"
                  ? { color: "black", fontFamily: "Inter-Bold" }
                  : { color: "#2f2d51", fontFamily: "Inter-Bold" }
              }
            >
              Quick Prayer
            </Text>
            <AntDesign
              style={{ marginLeft: 10 }}
              name="pluscircleo"
              size={24}
              color={
                theme == "dark"
                  ? "#121212"
                  : theme == "BlackWhite"
                  ? "black"
                  : "#2f2d51"
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={quickModal}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ModalContainer
            style={
              theme == "dark"
                ? { backgroundColor: "#121212" }
                : { backgroundColor: "#F2F7FF" }
            }
          >
            <ModalView
              style={
                theme == "dark"
                  ? { backgroundColor: "#212121" }
                  : { backgroundColor: "#b7d3ff" }
              }
            >
              <ModalIcon>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 5,
                  }}
                >
                  <HeaderTitle
                    style={
                      theme == "dark"
                        ? { fontFamily: "Inter-Bold", color: "white" }
                        : { fontFamily: "Inter-Bold" }
                    }
                  >
                    Quick Prayer
                  </HeaderTitle>
                  <AntDesign
                    name="edit"
                    size={24}
                    color={theme == "dark" ? "white" : "#2F2D51"}
                  />
                </View>
              </ModalIcon>
              <StyledInput
                style={
                  theme == "dark"
                    ? {
                        height: inputHeight < 60 ? 60 : inputHeight,
                        marginTop: 10,
                        alignItems: "center",
                        alignSelf: "center",
                        textAlignVertical: "center",
                        fontFamily: "Inter-Regular",
                        backgroundColor: "#121212",
                      }
                    : {
                        height: inputHeight < 60 ? 60 : inputHeight,
                        marginTop: 10,
                        textAlignVertical: "center",
                        fontFamily: "Inter-Regular",
                        backgroundColor: "#2F2D51",
                      }
                }
                placeholder="Add a prayer"
                placeholderTextColor={"#e0e0e0"}
                selectionColor={"white"}
                autoFocus={true}
                onChangeText={(text) => setQuickprayervalue(text)}
                value={quickprayervalue}
                onContentSizeChange={handleContentSizeChange}
                onSubmitEditing={(e) => {
                  e.key === "Enter" && e.preventDefault();
                }}
                multiline={true}
              />
              <TouchableOpacity
                style={styles.dismiss}
                onPress={dismissKeyboard}
              >
                <Text
                  style={{
                    color: "#ff4e4e",
                    fontFamily: "Inter-Regular",
                    fontSize: 13,
                  }}
                >
                  Dismiss Keyboard
                </Text>
              </TouchableOpacity>
              <Text style={theme == "dark" ? styles.selectDark : styles.select}>
                Select a Category (optional):
              </Text>
              <SelectList
                placeholder="selectcategory"
                setSelected={setQuickcategoryvalue}
                data={data}
                search={false}
                defaultOption={{ key: "None", value: "None" }}
                boxStyles={
                  theme == "dark" ? styles.categoryDark : styles.category
                }
                dropdownStyles={
                  theme == "dark" ? styles.dropdownDark : styles.dropdown
                }
                dropdownTextStyles={styles.dropdownTextDark}
                inputStyles={styles.inputText}
                arrowicon={<AntDesign name="down" size={15} color="white" />}
                maxHeight="250"
              />
              <ModalActionGroup>
                <ModalAction color={"white"} onPress={handleCloseModal}>
                  <AntDesign
                    name="close"
                    size={28}
                    color={theme == "dark" ? "#121212" : "#2F2D51"}
                  />
                </ModalAction>
                <ModalAction
                  color={theme == "dark" ? "#121212" : "#2F2D51"}
                  onPress={handleQuickPrayer}
                >
                  <AntDesign name="check" size={28} color={"white"} />
                </ModalAction>
              </ModalActionGroup>
            </ModalView>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
    </WelcomeContainer>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F7FF",
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 22,
    // marginVertical: 5,
    fontFamily: "Inter-Bold",
    letterSpacing: 2,
    alignSelf: "center",
    color: "#2F2D51",
  },
  greetingDark: {
    // marginVertical: 5,
    fontSize: 22,
    fontFamily: "Inter-Black",
    alignSelf: "flex-start",
    letterSpacing: 2,
    color: "white",
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
