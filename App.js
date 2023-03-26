import 'react-native-gesture-handler';
import React, { useState } from 'react';
import registerNNPushToken from 'native-notify';
import AnimatedSplash from 'react-native-animated-splash-screen';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Navigation from './Navigation';
import 'react-native-url-polyfill/auto'
let persistor = persistStore(store)

export default function App() {

  registerNNPushToken(3959, 'lARWUk5vPpm64VSZBudWx7');
  const [loading, setLoading] = useState(false)

  setTimeout(() => {
    setLoading(true)
  }, 1000)

  return (
    <AnimatedSplash
      translucent={true}
      isLoaded={loading}
      logoImage={require("./assets/prayer.png")}
      backgroundColor={"white"}
      logoHeight={200}
      logoWidth={200}
    >
      <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </AnimatedSplash>
  )
}