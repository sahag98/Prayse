import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, HeaderTitle } from '../styles/appStyles'
import { useDispatch, useSelector } from 'react-redux'
import { addToFavorites, deleteFavorites, setVerse } from '../redux/prayerReducer'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Clipboard from 'expo-clipboard';

const VerseOfTheDay = ({ route }) => {
  const theme = useSelector(state => state.user.theme)
  const favorites = useSelector(state => state.prayer.favoriteVerses)
  const dispatch = useDispatch()
  const [verse, setVerse] = useState('')
  const [verseTitle, setVerseTitle] = useState('')
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  useEffect(() => {
    loadDailyVerse()
    loadDailyVerseTitle()
    if (route.params) {
      AsyncStorage.setItem("storedVerse", route.params.verse)
      AsyncStorage.setItem("storedVerseTitle", route.params.title)
      loadDailyVerse()
    }
  }, [isFocused])

  console.log(favorites)

  const loadDailyVerse = () => {
    AsyncStorage.getItem("storedVerse").then(data => {
      if (data !== null) {
        setVerse(data)
      }
      else {
        setVerse('No daily verse just yet')
      }
    }).catch((error) => console.log(error))
  }

  const loadDailyVerseTitle = () => {
    AsyncStorage.getItem("storedVerseTitle").then(data => {
      if (data !== null) {
        setVerseTitle(data)
      }
      else {
        setVerseTitle('')
      }
    }).catch((error) => console.log(error))
  }

  const copyToClipboard = async (verse) => {
    await Clipboard.setStringAsync(verse);
  };

  const HandleFavorites = (verse) => {
    dispatch(addToFavorites(verse))
  }

  const message = verse.split('-')

  return (
    <Container style={theme == 'dark' ? { backgroundColor: "#121212" } : { backgroundColor: "#F2F7FF" }}>
      <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginRight: 5, }} onPress={() => navigation.navigate('More')}>
          <Ionicons name="chevron-back" size={30} color={theme == "light" ? "#2f2d51" : "white"} />
        </TouchableOpacity>
        <HeaderTitle
          style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' }
            : { fontFamily: 'Inter-Bold', color: '#2F2D51' }}>
          Verse of the Day
        </HeaderTitle>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={{ width: '100%', backgroundColor: '#151515', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 }}>
        <Text style={{ fontFamily: 'Inter-Medium', color: 'white', fontSize: 16 }}>Favorites list</Text>
        <AntDesign style={{ marginLeft: 10 }} name="right" size={14} color='white' />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={theme == 'dark' ? styles.verseDark : styles.verse}>{message[0]}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={theme == 'dark' ? styles.verseTitleDark : styles.verseTitle}>- {message[1]}</Text>
          <TouchableOpacity onPress={() => copyToClipboard(verse)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={theme == 'dark' ? { marginRight: 5, color: '#aaaaaa' } : { marginRight: 10, color: '#454277' }}>Copy</Text>
            <Ionicons name="ios-copy-outline" size={24} color={theme == 'dark' ? "#aaaaaa" : "#454277"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => HandleFavorites(verse)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={theme == 'dark' ? { marginRight: 5, color: '#aaaaaa' } : { marginRight: 10, color: '#454277' }}>Favorite</Text>
            <AntDesign name="staro" size={25} color={theme == 'dark' ? "#aaaaaa" : "#454277"} />
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  )
}

export default VerseOfTheDay

const styles = StyleSheet.create({
  verseDark: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 45,
    color: 'white'
  },
  verse: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 40,
    color: '#2f2d51'
  },
  verseTitleDark: {
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    color: 'white'
  },
  verseTitle: {
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    color: '#2f2d51'
  }
})