import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Main from "./Screens/Main";
import { StatusBar } from "expo-status-bar";
import Welcome from "./Screens/Welcome";
import Gospel from "./Screens/Gospel";
import Community from "./Screens/Community";
import Settings from "./Screens/Settings";
import { useSelector } from "react-redux";
import PrayerPage from "./Screens/PrayerPage";
import OldPrayerPage from "./Screens/oldPrayerPage";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Devotional from "./Screens/Devotional";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import More from "./Screens/More";
import VerseOfTheDay from "./Screens/VerseOfTheDay";
import Favorites from "./Screens/Favorites";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSupabase } from "./context/useSupabase";
import CommunityHome from "./Screens/CommunityHome";
import Login from "./Screens/Login";
import Question from "./Screens/Question";
import PublicCommunity from "./Screens/PublicCommunity";
import Test from "./Screens/Test";
import * as Linking from "expo-linking";
import Reminder from "./Screens/Reminder";
import PrayerGroup from "./Screens/PrayerGroup";
import OnboardingScreen from "./Screens/Onboarding";
import Relfection from "./Screens/Relfection";
import DevoList from "./Screens/DevoList";
import Checklist from "./Screens/Checklist";
const Tab = createBottomTabNavigator();

const Navigation = () => {
  const insets = useSafeAreaInsets();
  const theme = useSelector((state) => state.user.theme);
  const { isLoggedIn, currentUser } = useSupabase();
  const [showNewBadge, setShowNewBadge] = useState(false);

  useEffect(() => {
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

  const prefix = Linking.createURL("/");
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: "home",
        Settings: "settings",
      },
    },
  };

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  let [fontsLoaded] = useFonts({
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
        linking={linking}
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
                iconName = focused ? "ios-list" : "ios-list-outline";
              } else if (route.name === "Prayer") {
                iconName = focused ? "hands-pray" : "hands-pray";
              } else if (route.name === "Devotional") {
                iconName = focused ? "ios-bookmarks" : "ios-bookmarks-outline";
              } else if (route.name === "Community") {
                iconName = focused ? "ios-globe" : "ios-globe-outline";
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
