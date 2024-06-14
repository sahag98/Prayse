import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Linking, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";

import { useSupabase } from "./context/useSupabase";
import ChecklistScreen from "./screens/ChecklistScreen";
import CommunityHomeScreen from "./screens/CommunityHomeScreen";
import DevoListScreen from "./screens/DevoListScreen";
import DevotionalScreen from "./screens/DevotionalScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import GospelScreen from "./screens/GospelScreen";
import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import MoreScreen from "./screens/MoreScreen";
import NotificationScreen from "./screens/NotificationsScreen";
import OldPrayerScreen from "./screens/OldPrayerScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import OurPresentationScreen from "./screens/OurPresentationScreen";
import PrayerGroupScreen from "./screens/PrayerGroupScreen";
import PrayerRoomScreen from "./screens/PrayerRoomScreen";
import PrayerScreen from "./screens/PrayerScreen";
import PublicCommunityScreen from "./screens/PublicCommunityScreen";
import PublicGroupsScreen from "./screens/PublicGroupsScreen";
import QuestionListScreen from "./screens/QuestionListScreen";
import QuestionScreen from "./screens/QuestionScreen";
import RelfectionScreen from "./screens/RelfectionScreen";
// import * as Linking from "expo-linking";
import ReminderScreen from "./screens/ReminderScreen";
import RoadMapScreen from "./screens/RoadMapScreen";
import {
  CHECKLIST_SCREEN,
  COMMUNITY_SCREEN,
  DEVO_LIST_SCREEN,
  DEVOTIONAL_SCREEN,
  FAVORITES_SCREEN,
  GOSPEL_SCREEN,
  HOME_SCREEN,
  MORE_SCREEN,
  NOTIFICATION_SCREEN,
  OLD_PRAYER_SCREEN,
  ONBOARDING_SCREEN,
  OUR_PRESENTATION_SCREEN,
  PRAYER_GROUP_SCREEN,
  PRAYER_PAGE_SCREEN,
  PRAYER_ROOM_SCREEN,
  PRAYER_SCREEN,
  PUBLIC_COMMUNITY_SCREEN,
  PUBLIC_GROUPS_SCREEN,
  QUESTION_LIST_SCREEN,
  QUESTION_SCREEN,
  REFLECTION_SCREEN,
  REMINDER_SCREEN,
  ROADMAP_SCREEN,
  SETTINGS_SCREEN,
  TEST_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "./screens/routes";
import SettingsScreen from "./screens/SettingsScreen";
import TestScreen from "./screens/TestScreen";
import VerseOfTheDayScreen from "./screens/VerseOfTheDayScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
const Tab = createBottomTabNavigator();

const Navigation = () => {
  const insets = useSafeAreaInsets();
  const theme = useSelector((state) => state.user.theme);

  const { isLoggedIn, currentUser, supabase } = useSupabase();
  const [showNewBadge, setShowNewBadge] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    // getUserGroups();
    const checkFirstTime = async () => {
      // await AsyncStorage.removeItem("hasPressedPrayerTab");
      try {
        const value = await AsyncStorage.getItem("hasPressedPrayerTab");
        if (value === null) {
          // First time pressing the "Prayer" tab
          setShowNewBadge(true);
          AsyncStorage.setItem("hasPressedPrayerTab", "true");
        }
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
      }
    };

    checkFirstTime();
  }, []);

  // const prefix = Linking.createURL("/");
  // const linking = {
  //   prefixes: [prefix],
  //   config: {
  //     screens: {
  //       Home: "home",
  //       Settings: "settings",
  //     },
  //   },
  // };

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  const [fontsLoaded] = useFonts({
    "Inter-Black": require("./assets/fonts/Inter-Black.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
  });
  if (!fontsLoaded) {
    return <BusyIndicator />;
  }
  return (
    <View
      style={
        theme == "dark"
          ? {
              flex: 1,
              backgroundColor: "#121212",
              // Paddings to handle safe area

              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }
          : {
              flex: 1,
              backgroundColor: "white",
              // Paddings to handle safe area

              paddingBottom: insets.bottom,
              paddingLeft: insets.left,
              paddingRight: insets.right,
            }
      }
    >
      <StatusBar style={theme == "dark" ? "light" : "dark"} />

      <NavigationContainer
        linking={{
          config: {
            // Configuration for linking
          },
          async getInitialURL() {
            // First, you may want to do the default deep link handling
            // Check if app was opened from a deep link
            const url = await Linking.getInitialURL();

            if (url != null) {
              return url;
            }

            // Handle URL from expo push notifications
            const response =
              await Notifications.getLastNotificationResponseAsync();
            return response?.notification.request.content.data.url;
          },
          subscribe(listener) {
            const onReceiveURL = ({ url }) => listener(url);

            // Listen to incoming links from deep linking
            const eventListenerSubscription = Linking.addEventListener(
              "url",
              onReceiveURL,
            );

            // Listen to expo push notifications
            const subscription =
              Notifications.addNotificationResponseReceivedListener(
                (response) => {
                  const url = response.notification.request.content.data.url;

                  // Any custom logic to see whether the URL needs to be handled
                  //...

                  // Let React Navigation handle the URL
                  listener(url);
                },
              );

            return () => {
              // Clean up the event listeners
              eventListenerSubscription.remove();

              subscription.remove();
            };
          },
        }}
        theme={theme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let Color;

              switch (route.name) {
                case HOME_SCREEN:
                  iconName = focused ? "home" : "home-outline";
                  break;
                case MORE_SCREEN:
                  iconName = focused ? "list" : "list-outline";
                  break;
                case PRAYER_SCREEN:
                  iconName = focused ? "hands-pray" : "hands-pray";
                  break;
                case DEVOTIONAL_SCREEN:
                  iconName = focused ? "bookmarks" : "bookmarks-outline";
                  break;
                case COMMUNITY_SCREEN:
                  iconName = focused ? "globe" : "globe-outline";
                  break;
              }

              if (route.name === PRAYER_SCREEN) {
                return (
                  <MaterialIcons name={iconName} size={size} color={color} />
                );
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },

            tabBarActiveTintColor:
              theme == "dark"
                ? "white"
                : theme == "BlackWhite"
                  ? "black"
                  : "#2f2d51",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen
            name={HOME_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
            })}
            component={WelcomeScreen}
          />
          <Tab.Screen
            name={PRAYER_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
              tabBarBadge: showNewBadge ? "New" : null,
              tabBarBadgeStyle: { paddingHorizontal: 5, fontSize: 10 },
            })}
            component={MainScreen}
          />
          <Tab.Screen
            name={DEVOTIONAL_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
            })}
            component={DevotionalScreen}
          />
          <Tab.Screen
            name={DEVO_LIST_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={DevoListScreen}
          />
          <Tab.Screen
            name={ROADMAP_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={RoadMapScreen}
          />
          <Tab.Screen
            name={PUBLIC_GROUPS_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={PublicGroupsScreen}
          />
          <Tab.Screen
            name={OLD_PRAYER_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={OldPrayerScreen}
          />
          <Tab.Screen
            name={ONBOARDING_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={OnboardingScreen}
          />
          <Tab.Screen
            name={REMINDER_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={ReminderScreen}
          />
          <Tab.Screen
            name={QUESTION_LIST_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={isLoggedIn ? QuestionListScreen : LoginScreen}
          />
          <Tab.Screen
            name={QUESTION_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={isLoggedIn ? QuestionScreen : LoginScreen}
          />
          <Tab.Screen
            name={SETTINGS_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={SettingsScreen}
          />
          <Tab.Screen
            name={REFLECTION_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={RelfectionScreen}
          />
          <Tab.Screen
            name={FAVORITES_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={FavoritesScreen}
          />
          <Tab.Screen
            name={VERSE_OF_THE_DAY_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={VerseOfTheDayScreen}
          />
          <Tab.Screen
            name={GOSPEL_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={GospelScreen}
          />
          <Tab.Screen
            name={OUR_PRESENTATION_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={OurPresentationScreen}
          />
          <Tab.Screen
            name={PRAYER_PAGE_SCREEN}
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={PrayerScreen}
          />
          <Tab.Screen
            name={TEST_SCREEN}
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={TestScreen}
          />
          <Tab.Screen
            name={CHECKLIST_SCREEN}
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={ChecklistScreen}
          />
          <Tab.Screen
            name={NOTIFICATION_SCREEN}
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={NotificationScreen}
          />
          <Tab.Screen
            name={PRAYER_ROOM_SCREEN}
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={PrayerRoomScreen}
          />
          <Tab.Screen
            name={PUBLIC_COMMUNITY_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={isLoggedIn ? PublicCommunityScreen : LoginScreen}
          />
          <Tab.Screen
            name={PRAYER_GROUP_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={isLoggedIn ? PrayerGroupScreen : LoginScreen}
          />
          <Tab.Screen
            name={COMMUNITY_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
            })}
            component={isLoggedIn ? CommunityHomeScreen : LoginScreen}
          />
          <Tab.Screen
            name={MORE_SCREEN}
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
            })}
            component={MoreScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigation;
