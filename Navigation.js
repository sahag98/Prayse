import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Provider as PaperProvider } from 'react-native-paper'
import Main from './Screens/Main'
import { StatusBar } from 'expo-status-bar'
import { Entypo } from '@expo/vector-icons';
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
import AppLoading from 'expo-app-loading';
const Stack = createStackNavigator()

const Tab = createBottomTabNavigator()

const Navigation = () => {
  const theme = useSelector(state => state.user.theme)
  let [fontsLoaded] = useFonts({
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
  })
  if (!fontsLoaded) {
    return <AppLoading />
  }
  return (
    <>
      <StatusBar style={theme == 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <Tab.Navigator screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let Color;
            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Settings') {
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
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5 } })}
            component={Welcome}
          />
          <Tab.Screen
            name="Folders"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5 } })}
            component={Main}
          />
          <Tab.Screen
            name="Devotional"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5 } })}
            component={Devotional}
          />
          <Tab.Screen
            name="OldPrayerPage"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { display: 'none' }, tabBarButton: () => null })}
            component={OldPrayerPage}
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
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5 } })}
            component={Community}
          />
          <Tab.Screen
            name="Settings"
            options={() => ({ tabBarLabelStyle: { fontSize: 11, fontFamily: 'Inter-Medium' }, tabBarStyle: { height: 58, paddingBottom: 5 } })}
            component={Settings}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

export default Navigation;
