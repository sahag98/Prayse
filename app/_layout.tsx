import React, { useEffect } from "react";
import { isRunningInExpoGo } from "expo";

import { SplashScreen, useNavigationContainerRef } from "expo-router";
// import AnimatedSplash from "react-native-animated-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

import { SupabaseProvider } from "@context/SupabaseProvider";
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { store } from "@redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Sentry from "@sentry/react-native";

import StackContainer from "./Stack";

import "../global.css";

import "react-native-url-polyfill/auto";
import "expo-dev-client";

const persistor = persistStore(store);

const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: "https://62cc83d0927020ddab15c63295a4f908@o4506981596594176.ingest.us.sentry.io/4508010266427392",
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
});
const queryClient = new QueryClient();

function App() {
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

  const [loaded, error] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    if (loaded || error) {
      // console.log("fonts are loaded");
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SafeAreaProvider>
                <SupabaseProvider>
                  <StackContainer />
                </SupabaseProvider>
              </SafeAreaProvider>
            </PersistGate>
          </Provider>
        </QueryClientProvider>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
    </>
  );
}

export default Sentry.wrap(App);
