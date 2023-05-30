import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, HeaderTitle } from '../styles/appStyles'
import { useDispatch, useSelector } from 'react-redux'
import { addToFavorites } from '../redux/favoritesReducer'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import * as Clipboard from 'expo-clipboard';
import uuid from 'react-native-uuid';

const VerseOfTheDay = ({ route }) => {
  const theme = useSelector(state => state.user.theme)
  const favorites = useSelector(state => state.favorites.favoriteVerses)
  const dispatch = useDispatch()
  const [verse, setVerse] = useState('')
  const [verseTitle, setVerseTitle] = useState('')
  const [isCopied, setisCopied] = useState(false)
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  useEffect(() => {
    setisCopied(false)
    loadDailyVerse()
    loadDailyVerseTitle()
    if (route.params) {
      AsyncStorage.setItem("storedVerse", route.params.verse)
      AsyncStorage.setItem("storedVerseTitle", route.params.title)
      loadDailyVerse()
    }
  }, [isFocused])

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
    await Clipboard.setStringAsync(verse)
    setisCopied(true)
  };

  const HandleFavorites = (verse) => {
    dispatch(addToFavorites({
      verse: verse,
      id: uuid.v4(),
    }))
    // dispatch(deleteFavorites())
  }

  // favorites?.some(item => item.v)
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
      <Text style={theme == 'dark' ? { fontSize: 16, fontFamily: 'Inter-Medium', color: '#e0e0e0', marginBottom: 10 } : { fontSize: 16, fontFamily: 'Inter-Medium', color: '#2f2d51', marginBottom: 10 }}>
        Welcome to our Verse of the Day page! Our goal is to provide you with a daily reminder of God's love, grace,
        and wisdom, and to help you grow in your faith journey.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={theme == 'dark' ? styles.favoritesDark : styles.favorites}>
        <Text style={theme == 'dark' ? { fontFamily: 'Inter-Medium', color: 'white', fontSize: 16 } : { fontFamily: 'Inter-Medium', color: '#2f2d51', fontSize: 16 }}>Favorites list</Text>
        <AntDesign style={{ marginLeft: 10 }} name="right" size={20} color={theme == 'dark' ? 'white' : '#2f2d51'} />
      </TouchableOpacity>
      <View style={{ justifyContent: 'center', marginTop: 15 }}>
        <Text style={theme == 'dark' ? styles.verseDark : styles.verse}>{message[0]}</Text>
        <View>
          <Text style={theme == 'dark' ? styles.verseTitleDark : styles.verseTitle}>-{message[1]}</Text>
          <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => copyToClipboard(verse)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={theme == 'dark' ? { marginRight: 5, color: '#aaaaaa' } : { marginRight: 10, color: '#454277' }}>{isCopied ? "Copied" : "Copy"}</Text>
              <Ionicons name="ios-copy-outline" size={24} color={theme == 'dark' ? "#aaaaaa" : "#454277"} />
            </TouchableOpacity>
            {favorites?.some(item => item.verse === verse) ?
              <TouchableOpacity disabled={true} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={theme == 'dark' ? { marginRight: 5, color: '#d8d800', fontFamily: 'Inter-Regular', fontSize: 14 } : { fontFamily: 'Inter-Regular', fontSize: 14, marginRight: 10, color: '#c4c400' }}>Favorited</Text>
                <AntDesign name="staro" size={25} color={theme == 'dark' ? "#d8d800" : "#c4c400"} />
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => HandleFavorites(verse)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={theme == 'dark' ? { marginRight: 5, color: '#aaaaaa', fontFamily: 'Inter-Regular', fontSize: 14 } : { fontFamily: 'Inter-Regular', fontSize: 14, marginRight: 10, color: '#454277' }}>Favorite</Text>
                <AntDesign name="staro" size={25} color={theme == 'dark' ? "#aaaaaa" : "#454277"} />
              </TouchableOpacity>
            }

          </View>
        </View>
      </View>
    </Container>
  )
}

export default VerseOfTheDay

const styles = StyleSheet.create({
  favoritesDark: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#151515',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  favorites: {
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#93d8f8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
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