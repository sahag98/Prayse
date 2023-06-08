import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { Container, HeaderTitle } from '../styles/appStyles'
import { useSelector } from 'react-redux'
import { MaterialCommunityIcons, Ionicons, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font'
import { Platform } from 'react-native'
import { IOS_ITEM_ID, ANDROID_PACKAGE_NAME } from '@env'
import { Linking } from 'react-native'
import SettingsItems from '../components/SettingsItems'

const More = ({ navigation }) => {
  const theme = useSelector(state => state.user.theme)

  function giveFeedback(market) {
    if (market == "android") {
      Linking.openURL(`market://details?id=${ANDROID_PACKAGE_NAME}&showAllReviews=true`)
    }
    if (market == "ios") {
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${IOS_ITEM_ID}?action=write-review`
      );
    }
  }

  const options = [
    {
      id: 1,
      icon: <Ionicons name="book-outline" style={{ marginRight: 10 }} size={24} color="white" />,
      title: 'Verse of the Day',
      screen: 'VerseOfTheDay'
    },

    {
      id: 2,
      icon: <AntDesign name="infocirlceo" style={{ marginRight: 10 }} size={24} color="white" />,
      title: 'About',
      link: 'https://prayse-website.vercel.app/'
    },
    {
      id: 3,
      icon: <Feather name="shield" style={{ marginRight: 10 }} size={24} color="white" />,
      title: 'Privacy Policy',
      link: 'https://www.privacypolicies.com/live/887580d1-6bf3-4b0a-a716-a732bf8141fa'
    },
    {
      id: 4,
      icon: <MaterialCommunityIcons name="email-edit-outline" style={{ marginRight: 10 }} size={24} color="white" />,
      title: 'Contact Developer',
      link: 'mailto:arzsahag@gmail.com'
    },
    {
      id: 5,
      icon: <AntDesign name="setting" style={{ marginRight: 10 }} size={24} color="white" />,
      title: 'Settings',
      screen: 'Settings'
    },
    {
      id: 6,
      icon: <MaterialCommunityIcons name="thought-bubble-outline" style={{ marginRight: 10 }} size={24} color="white" />,
      title: 'Next Update Suggestions!',
      screen: 'Settings'
    },
  ]

  let [fontsLoaded] = useFonts({
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  })

  const BusyIndicator = () => {

    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  if (!fontsLoaded) {
    return <BusyIndicator />
  }

  return (
    <Container style={theme == 'dark' ? { backgroundColor: "#121212" } : { backgroundColor: "#F2F7FF" }}>
      <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white', marginVertical: 10 }
        : { fontFamily: 'Inter-Bold', color: '#2F2D51', marginVertical: 10 }}>More
      </HeaderTitle>
      <SettingsItems
        options={options}
        theme={theme}
        navigation={navigation}
      />
      {Platform.OS === 'ios' ?
        <TouchableOpacity onPress={() => giveFeedback('ios')}
          style={theme == 'dark' ? styles.verseDark : styles.verse}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="feedback" size={24} style={{ marginRight: 10 }} color="white" />
            <Text style={{ fontFamily: 'Inter-Medium', color: 'white', fontSize: 16 }}>Feedback</Text>
          </View>
          <AntDesign style={{ marginLeft: 10 }} name="right" size={14} color={theme == 'dark' ? "white" : 'white'} />
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={() => giveFeedback('android')}
          style={theme == 'dark' ? styles.verseDark : styles.verse}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="feedback" size={24} style={{ marginRight: 10 }} color="white" />
            <Text style={{ fontFamily: 'Inter-Medium', color: 'white', fontSize: 16 }}>Feedback</Text>
          </View>
          <AntDesign style={{ marginLeft: 10 }} name="right" size={14} color='white' />
        </TouchableOpacity>
      }
    </Container>
  )
}

export default More

const styles = StyleSheet.create({
  verseDark: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    padding: 20,
    borderRadius: 5,
    justifyContent: 'space-between',
    marginBottom: 15
  },
  verse: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f2d51',
    padding: 20,
    borderRadius: 5,
    justifyContent: 'space-between',
    marginBottom: 15
  },
})