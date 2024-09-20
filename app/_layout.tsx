// @ts-nocheck
import React from "react";
import { Buffer } from "buffer";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
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

import splashScreenIcon from "../assets/prayse-transparent.png";

import StackContainer from "./Stack";

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
    success: (props: any) => (
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
    edit: (props: any) => (
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
    error: (props: any) => (
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
    inter: require("../assets/fonts/inter.ttf"),
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
        {/* <Text>Hey</Text> */}
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SafeAreaProvider>
                <SupabaseProvider>
                  <StackContainer />
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
