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

export default function App() {
  const [loading, setLoading] = useState(false);

  setTimeout(() => {
    setLoading(true);
  }, 500);

  return (
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
  );
}
