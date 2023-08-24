import "react-native-gesture-handler";
import React, { useState } from "react";
import AnimatedSplash from "react-native-animated-splash-screen";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Buffer } from "buffer";
global.Buffer = Buffer;
import { persistStore } from "redux-persist";
import Navigation from "./Navigation";
import "react-native-url-polyfill/auto";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SupabaseProvider } from "./context/SupabaseProvider";
// import 'expo-dev-client';
let persistor = persistStore(store);
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

export default function App() {
  const [loading, setLoading] = useState(false);

  const toastConfig = {
    /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "#93d8f8", height: 50 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 13,
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
          borderLeftColor: "#ff1414",
          height: 50,
          backgroundColor: "#ff9d9d",
        }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 13,
          fontWeight: "500",
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),
    /*
      Or create a completely new type - `tomatoToast`,
      building the layout from scratch.
  
      I can consume any custom `props` I want.
      They will be passed when calling the `show` method (see below)
    */
  };

  setTimeout(() => {
    setLoading(true);
  }, 500);

  return (
    <>
      <AnimatedSplash
        translucent={true}
        isLoaded={loading}
        logoImage={require("./assets/prayer.png")}
        backgroundColor={"white"}
        logoHeight={200}
        logoWidth={200}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
              <SupabaseProvider>
                <Navigation />
              </SupabaseProvider>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </AnimatedSplash>
      <Toast config={toastConfig} />
    </>
  );
}
