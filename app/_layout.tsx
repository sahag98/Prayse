//@ts-nocheck

import { useEffect } from "react";
import { isRunningInExpoGo } from "expo";
import * as Notifications from "expo-notifications";
import {
  router,
  SplashScreen,
  useNavigation,
  useNavigationContainerRef,
} from "expo-router";
import AnimatedSplash from "react-native-animated-splash-screen";
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
import {
  PRAYER_GROUP_SCREEN,
  QUESTION_SCREEN,
  VERSE_OF_THE_DAY_SCREEN,
} from "@routes";
import * as Sentry from "@sentry/react-native";

import splashScreenIcon from "../assets/prayse-transparent.png";

import StackContainer from "./Stack";

import "../global.css";

import "react-native-url-polyfill/auto";
import "expo-dev-client";

const persistor = persistStore(store);

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: "https://62cc83d0927020ddab15c63295a4f908@o4506981596594176.ingest.us.sentry.io/4508010266427392",
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  integrations: [
    new Sentry.ReactNativeTracing({
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      enableNativeFramesTracking: !isRunningInExpoGo(),
      // ...
    }),
  ],
});

function useNotificationObserver() {
  const navigation = useNavigation();
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const data = notification.request.content.data;

      const url = data?.url || data?.screen;

      if (url) {
        console.log("url exists!!");

        if (
          ["PrayerGroup", PRAYER_GROUP_SCREEN].includes(url) &&
          data.group_id
        ) {
          navigation.navigate(PRAYER_GROUP_SCREEN, {
            group_id: data.group_id,
          });
        } else if (["VerseOfTheDay", VERSE_OF_THE_DAY_SCREEN].includes(url)) {
          navigation.navigate(VERSE_OF_THE_DAY_SCREEN);
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

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification);
      },
    );

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

function App() {
  useNotificationObserver();
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

  // const [loaded] = useFonts({
  //   "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
  //   "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  //   "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
  //   "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
  //   "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
  //   inter: require("../assets/fonts/inter.ttf"),
  // });

  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  return (
    <>
      <AnimatedSplash
        translucent
        isLoaded={fontsLoaded}
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

export default Sentry.wrap(App);
