import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Provider as PaperProvider } from 'react-native-paper'
import Main from './Screens/Main'
import { StatusBar } from 'expo-status-bar'
import Welcome from './Screens/Welcome'
import Gospel from './Screens/Gospel'
import Community from './Screens/Community'
import Settings from './Screens/Settings'
import { useSelector } from 'react-redux';
import PrayerPage from './Screens/PrayerPage';
import OldPrayerPage from './Screens/oldPrayerPage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Devotional from './Screens/Devotional';
import { useFonts } from 'expo-font';
// import AppLoading from 'expo-app-loading';
import { View, ActivityIndicator, Linking } from 'react-native';
import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import More from './Screens/More';
import VerseOfTheDay from './Screens/VerseOfTheDay';
import Favorites from './Screens/Favorites';
import { getInitialURL } from 'expo-linking';
import * as Notifications from 'expo-notifications';

const Tab = createBottomTabNavigator()

const Navigation = () => {
  const insets = useSafeAreaInsets()
  const theme = useSelector(state => state.user.theme)

  const BusyIndicator = () => {

    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };
  let [fontsLoaded] = useFonts({
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
  })
  if (!fontsLoaded) {
    return <BusyIndicator />
  }
  return (
    <View style={theme == 'dark' ? {
      flex: 1,
      backgroundColor: '#121212',
      // Paddings to handle safe area

      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    } : {
      flex: 1,
      backgroundColor: 'white',
      // Paddings to handle safe area

      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }}>
      <StatusBar style={theme == 'dark' ? 'light' : 'dark'} />

      <NavigationContainer
        theme={theme === 'dark' ? DarkTheme : DefaultTheme}
        linking={{
          prefixes: ['prayselinks://'],
          config: {
            screens: {
              VerseOfTheDay: 'VerseOfTheDay-screen'
            }
            // Configuration for linking
          },
          async getInitialURL() {
            // First, you may want to do the default deep link handling
            // Check if app was opened from a deep link
            const url = await Linking.getInitialURL();
            console.log(url)
            if (url != null) {
              return url;
            }

            // Handle URL from expo push notifications
            const response = await Notifications.getLastNotificationResponseAsync();
            console.log('response', response)
            return response?.notification.request.content.data.url;
          },
          // subscribe(listener) {
          //   const onReceiveURL = (url) => listener(url);

          //   // Listen to incoming links from deep linking
          //   const eventListenerSubscription = Linking.addEventListener('url', onReceiveURL);

          //   // Listen to expo push notifications
          //   const subscription = Notifications.addNotificationResponseReceivedListener(response => {
          //     const url = response.notification.request.content.data.url;
          //     // console.log('url in subscription', url)
          //     // Any custom logic to see whether the URL needs to be handled
          //     //...

          //     // Let React Navigation handle the URL
          //     listener(url);
          //   });

          //   return () => {
          //     // Clean up the event listeners
          //     eventListenerSubscription.remove();
          //     subscription.remove();
          //   };
          // },
        }}>
        <Tab.Navigator screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let Color;
            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'More') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }
            else if (route.name === 'Folders') {
              iconName = focused ? 'folder-open' : 'folder-outline';
            }
            else if (route.name === 'Devotional') {
              iconName = focused ? 'ios-bookmarks' : 'ios-bookmarks-outline';
            }
            else if (route.name === 'Community') {
              iconName = focused ? 'ios-globe' : 'ios-globe-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },

          tabBarActiveTintColor: theme == 'dark' ? 'white' : '#2f2d51',
          tabBarInactiveTintColor: 'gray',
        })}
        >
          <Tab.Screen
            name="Home"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 } })}
            component={Welcome}
          />
          <Tab.Screen
            name="Folders"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 } })}
            component={Main}
          />
          <Tab.Screen
            name="Devotional"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 } })}
            component={Devotional}
          />
          <Tab.Screen
            name="OldPrayerPage"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { display: 'none' }, tabBarButton: () => null })}
            component={OldPrayerPage}
          />
          <Tab.Screen
            name="Settings"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { display: 'none' }, tabBarButton: () => null })}
            component={Settings}
          />
          <Tab.Screen
            name="Favorites"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { display: 'none' }, tabBarButton: () => null })}
            component={Favorites}
          />
          <Tab.Screen
            name="VerseOfTheDay"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { display: 'none' }, tabBarButton: () => null })}
            component={VerseOfTheDay}
          />
          <Tab.Screen
            name="Gospel"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { display: 'none' }, tabBarButton: () => null })}
            component={Gospel}
          />
          <Tab.Screen
            name="PrayerPage"
            options={() => ({ tabBarStyle: { display: 'none' }, tabBarButton: () => null })}
            component={PrayerPage}
          />
          <Tab.Screen
            name="Community"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 } })}
            component={Community}
          />
          <Tab.Screen
            name="More"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5, paddingTop: 2 } })}
            component={More}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default Navigation;
