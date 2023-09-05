import React from "react";
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
import Devotional from "./Screens/Devotional";
import { useFonts } from "expo-font";
import { View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import More from "./Screens/More";
import VerseOfTheDay from "./Screens/VerseOfTheDay";
import Favorites from "./Screens/Favorites";
import { useSupabase } from "./context/useSupabase";
import CommunityHome from "./Screens/CommunityHome";
import Login from "./Screens/Login";
import Question from "./Screens/Question";

const Tab = createBottomTabNavigator();

const Navigation = () => {
  const insets = useSafeAreaInsets();
  const theme = useSelector((state) => state.user.theme);
  const { isLoggedIn } = useSupabase();
  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  let [fontsLoaded] = useFonts({
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

      <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
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
              } else if (route.name === "Folders") {
                iconName = focused ? "folder-open" : "folder-outline";
              } else if (route.name === "Devotional") {
                iconName = focused ? "ios-bookmarks" : "ios-bookmarks-outline";
              } else if (route.name === "Community") {
                iconName = focused ? "ios-globe" : "ios-globe-outline";
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
            name="Folders"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
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
            name="OldPrayerPage"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={OldPrayerPage}
          />
          <Tab.Screen
            name="Question"
            options={() => ({
              tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
              tabBarStyle: { display: "none" },
              tabBarButton: () => null,
            })}
            component={Question}
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
          {isLoggedIn ? (
            <Tab.Screen
              name="Community"
              options={() => ({
                tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
                tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
              })}
              component={CommunityHome}
            />
          ) : (
            <Tab.Screen
              name="Community"
              options={() => ({
                tabBarLabelStyle: { fontSize: 11, fontFamily: "Inter-Medium" },
                tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 },
              })}
              component={Login}
            />
          )}
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
