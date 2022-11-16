import 'react-native-gesture-handler';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useState, useEffect, useContext } from 'react';
import Main from './Screens/Main'
import { StatusBar } from 'expo-status-bar'
import Welcome from './Screens/Welcome'
import Gospel from './Screens/Gospel'
import { Appearance } from 'react-native';
import registerNNPushToken from 'native-notify';
import Community from './Screens/Community';

const Stack = createStackNavigator()

export default function App() {
  registerNNPushToken(3959, 'lARWUk5vPpm64VSZBudWx7');
  const [theme, setTheme] = useState(Appearance.getColorScheme());
  Appearance.addChangeListener((scheme) => {
    setTheme(scheme.colorScheme)
  })
  const [mode, setMode] = useState(false)

  return (
    <>

      <StatusBar style={theme == 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name='Welcome'
            component={Welcome}
          />
          <Stack.Screen
            name='Main'
            component={Main}
          />
          <Stack.Screen
            name='Community'
            component={Community}
          />
          <Stack.Screen
            name='Gospel'
            component={Gospel}
          />


        </Stack.Navigator>
      </NavigationContainer>
    </>

  )
}