import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Provider as PaperProvider } from 'react-native-paper'
import Main from './Screens/Main'
import { StatusBar } from 'expo-status-bar'
import Welcome from './Screens/Welcome'
import Gospel from './Screens/Gospel'
import Community from './Screens/Community'
import Settings from './Screens/Settings'
import { useSelector } from 'react-redux';
import PrayerPage from './Screens/PrayerPage';
const Stack = createStackNavigator()

const Navigation = () => {
  const theme = useSelector(state => state.user.theme)
  return (
    <>
      <StatusBar style={theme == 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <PaperProvider>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name='Welcome'
              component={Welcome}
            />
            <Stack.Screen
              name='PrayerPage'
              component={PrayerPage}
            />
            <Stack.Screen
              name='Main'
              component={Main}
              initialParams={{ itemId: 42 }}
            />
            <Stack.Screen
              name='Community'
              component={Community}
            />
            <Stack.Screen
              name='Gospel'
              component={Gospel}
            />
            <Stack.Screen
              name='Settings'
              component={Settings}
            />
          </Stack.Navigator>
        </PaperProvider>

      </NavigationContainer>
    </>
  );
}

export default Navigation;
