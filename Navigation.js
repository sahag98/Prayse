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
import Checklist from "./screens/Checklist";
import CommunityHome from "./screens/CommunityHome";
import DevoList from "./screens/DevoList";
import Devotional from "./screens/Devotional";
import Favorites from "./screens/Favorites";
import Gospel from "./screens/Gospel";
import Login from "./screens/Login";
import Main from "./screens/Main";
import More from "./screens/More";
import NotificationScreen from "./screens/NotificationsScreen";
import OldPrayerPage from "./screens/oldPrayerPage";
import OnboardingScreen from "./screens/Onboarding";
import OurPresentation from "./screens/OurPresentation";
import PrayerGroup from "./screens/PrayerGroup";
import PrayerPage from "./screens/PrayerPage";
import PrayerRoom from "./screens/PrayerRoom";
import PublicCommunity from "./screens/PublicCommunity";
import PublicGroups from "./screens/PublicGroups";
import Question from "./screens/Question";
import QuestionList from "./screens/QuestionList";
import Relfection from "./screens/Relfection";
// import * as Linking from "expo-linking";
import Reminder from "./screens/Reminder";
import RoadMap from "./screens/RoadMap";
import Settings from "./screens/Settings";
import Test from "./screens/Test";
import VerseOfTheDay from "./screens/VerseOfTheDay";
import Welcome from "./screens/Welcome";
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
              if (route.name === "Home") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "More") {
                iconName = focused ? "list" : "list-outline";
              } else if (route.name === "Prayer") {
                iconName = focused ? "hands-pray" : "hands-pray";
              } else if (route.name === "Devotional") {
                iconName = focused ? "bookmarks" : "bookmarks-outline";
              } else if (route.name === "Community") {
                iconName = focused ? "globe" : "globe-outline";
              }

              if (route.name === "Prayer") {
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
            name="Home"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
            })}
            component={Welcome}
          />
          <Tab.Screen
            name="Prayer"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
              tabBarBadge: showNewBadge ? "New" : null,
              tabBarBadgeStyle: { paddingHorizontal: 5, fontSize: 10 },
            })}
            component={Main}
          />
          <Tab.Screen
            name="Devotional"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
            })}
            component={Devotional}
          />
          <Tab.Screen
            name="DevoList"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={DevoList}
          />
          <Tab.Screen
            name="Roadmap"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={RoadMap}
          />
          <Tab.Screen
            name="PublicGroups"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={PublicGroups}
          />
          <Tab.Screen
            name="OldPrayerPage"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={OldPrayerPage}
          />
          <Tab.Screen
            name="Onboarding"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={OnboardingScreen}
          />
          <Tab.Screen
            name="Reminder"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={Reminder}
          />
          <Tab.Screen
            name="QuestionList"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={isLoggedIn ? QuestionList : Login}
          />
          <Tab.Screen
            name="Question"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={isLoggedIn ? Question : Login}
          />
          <Tab.Screen
            name="Settings"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={Settings}
          />
          <Tab.Screen
            name="Reflection"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={Relfection}
          />
          <Tab.Screen
            name="Favorites"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={Favorites}
          />
          <Tab.Screen
            name="VerseOfTheDay"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={VerseOfTheDay}
          />
          <Tab.Screen
            name="Gospel"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={Gospel}
          />
          <Tab.Screen
            name="OurPresentation"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={OurPresentation}
          />
          <Tab.Screen
            name="PrayerPage"
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={PrayerPage}
          />
          <Tab.Screen
            name="Test"
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={Test}
          />
          <Tab.Screen
            name="Checklist"
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={Checklist}
          />
          <Tab.Screen
            name="NotificationScreen"
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={NotificationScreen}
          />
          <Tab.Screen
            name="PrayerRoom"
            options={() => ({
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={PrayerRoom}
          />
          <Tab.Screen
            name="PublicCommunity"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={isLoggedIn ? PublicCommunity : Login}
          />
          <Tab.Screen
            name="PrayerGroup"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={isLoggedIn ? PrayerGroup : Login}
          />
          <Tab.Screen
            name="Community"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
            })}
            component={isLoggedIn ? CommunityHome : Login}
          />
          <Tab.Screen
            name="More"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
            })}
            component={More}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default Navigation;
