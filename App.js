import 'react-native-gesture-handler';
import React, { useRef, useState, useEffect } from 'react';
import registerNNPushToken from 'native-notify';
import AnimatedSplash from 'react-native-animated-splash-screen';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Navigation from './Navigation';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import 'react-native-url-polyfill/auto'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import 'expo-dev-client';
import { useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
let persistor = persistStore(store)

// Notifications.setNotificationHandler({
//   handleNotification: async (notification) => {
//     // const navigation = useNavigation()
//     // console.log('in set noti', notification)
//     // const data = notification.request.content.data;
//     // if (data && data.screen) {
//     //   // navigate to the screen specified in the data object
//     //   navigation.navigate(data.screen);
//     // }

//     return {
//       shouldShowAlert: true,
//       shouldPlaySound: false,
//       shouldSetBadge: false,
//     };
//   },
// });

// async function sendToken(expoPushToken) {
//   console.log(' in send')
//   const message = {
//     to: expoPushToken,
//     sound: 'default',
//     title: 'Original Title',
//     body: 'And here is the body!',
//     data: { someData: 'goes here' },
//   };
//   console.log('about to fetch')
//   await fetch('https://prayse.herokuapp.com/api/tokens', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;
//   console.log('in reg function')
//   if (Platform.OS === 'android') {
//     Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       console.log(status)
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       console.log('hello')
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     console.log('after if')
//     token = (await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })).data;
//     console.log(token)
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }
//   return token;
// }


export default function App() {
  // const navigation = useNavigation()

  // registerNNPushToken(3959, 'lARWUk5vPpm64VSZBudWx7');
  const [loading, setLoading] = useState(false)
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();
  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => sendToken(token)).catch(err => console.log(err));
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });

  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     const res = response.notification.request.content.data
  //     if (res && res.screen) {
  //       // navigate to the screen specified in the data object
  //       navigation.navigate(res.screen);
  //     }
  //   });

  //   // sendToken(expoPushToken)

  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

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
          <SafeAreaProvider>
            <Navigation />
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </AnimatedSplash>
  )
}