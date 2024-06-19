import React from "react";
import { Buffer } from "buffer";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import AnimatedSplash from "react-native-animated-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { SupabaseProvider } from "@context/SupabaseProvider";
import { useRouterNotifications } from "@hooks/router";
import { store } from "@redux/store";
import {
  CHECKLIST_SCREEN,
  DEVO_LIST_SCREEN,
  FAVORITES_SCREEN,
  GOSPEL_SCREEN,
  NOTIFICATIONS_SCREEN,
  OLD_PRAYER_SCREEN,
  ONBOARDING_SCREEN,
  OUR_PRESENTATION_SCREEN,
  PRAYER_GROUP_SCREEN,
  PRAYER_ROOM_SCREEN,
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
} from "@routes";

import splashScreenIcon from "../assets/prayse-transparent.png";

import "../global.css";

import "react-native-url-polyfill/auto";
import "expo-dev-client";

global.Buffer = Buffer;
const persistor = persistStore(store);

export default function App() {
  useRouterNotifications();

  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props) => (
      <BaseToast
        {...props}
        style={{
          marginTop: 10,
          borderLeftColor: "#93d8f8",
          height: 50,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          fontWeight: "500",
        }}
        text2Style={{
          fontSize: 14,
          textAlign: "right",
          fontWeight: "500",
        }}
      />
    ),
    edit: (props) => (
      <BaseToast
        {...props}
        style={{
          marginTop: 10,
          borderLeftColor: "orange",
          height: 50,
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          fontWeight: "500",
        }}
        text2Style={{
          fontSize: 14,
          textAlign: "right",
          fontWeight: "500",
        }}
      />
    ),
    /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
    error: (props) => (
      <ErrorToast
        {...props}
        style={{
          marginTop: 10,
          borderLeftColor: "#ff1414",
          height: 50,
          backgroundColor: "#ff9d9d",
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          fontWeight: "400",
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
  };

  const [loaded] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
  });

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return (
    <>
      <AnimatedSplash
        translucent
        isLoaded={loaded}
        logoImage={splashScreenIcon}
        backgroundColor="white"
        logoHeight={150}
        logoWidth={150}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SafeAreaProvider>
                <SupabaseProvider>
                  <Stack initialRouteName="(tabs)">
                    <Stack.Screen
                      name="(tabs)"
                      options={{
                        headerShown: false,
                      }}
                    />
                    <Stack.Screen
                      name={DEVO_LIST_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={ROADMAP_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={PUBLIC_GROUPS_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={OLD_PRAYER_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={ONBOARDING_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={REMINDER_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={QUESTION_LIST_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={QUESTION_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={SETTINGS_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={REFLECTION_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={FAVORITES_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={VERSE_OF_THE_DAY_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={GOSPEL_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={OUR_PRESENTATION_SCREEN}
                      options={{ headerShown: false }}
                    />
                    {/* <Stack.Screen
                      name="prayer"
                      options={{ headerShown: false }}
                    /> */}
                    <Stack.Screen
                      name={TEST_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={CHECKLIST_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={NOTIFICATIONS_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={PRAYER_ROOM_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={PUBLIC_COMMUNITY_SCREEN}
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name={PRAYER_GROUP_SCREEN}
                      options={{ headerShown: false }}
                    />
                    {/* <Stack.Screen
                      name={COMMUNITY_SCREEN}
                      options={{ headerShown: false }}
                    /> */}
                    {/* <Stack.Screen
                      name={MORE_SCREEN}
                      options={{ headerShown: false }}
                    /> */}
                    <Stack.Screen name="+not-found" />
                  </Stack>
                </SupabaseProvider>
              </SafeAreaProvider>
            </PersistGate>
          </Provider>
        </GestureHandlerRootView>
      </AnimatedSplash>
      <Toast config={toastConfig} />
    </>
  );
}
