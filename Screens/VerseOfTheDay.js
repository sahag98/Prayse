import { StyleSheet, Text, Share, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, HeaderTitle } from '../styles/appStyles'
import { useDispatch, useSelector } from 'react-redux'
import { addToFavorites } from '../redux/favoritesReducer'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import uuid from 'react-native-uuid';
import * as Speech from 'expo-speech';

const VerseOfTheDay = ({ route }) => {
  const theme = useSelector(state => state.user.theme)
  const favorites = useSelector(state => state.favorites.favoriteVerses)
  const dispatch = useDispatch()
  const [verse, setVerse] = useState('')
  const [verseTitle, setVerseTitle] = useState('')
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  const speak = (verse) => {
    if (verse) {
      Speech.speak(verse);
    }
  };
  useEffect(() => {
    loadDailyVerse()
    loadDailyVerseTitle()
    if (route.params) {
      AsyncStorage.setItem("storedVerse", route.params.verse)
      AsyncStorage.setItem("storedVerseTitle", route.params.title)
      loadDailyVerse()
    }
  }, [isFocused])

  const onShare = async (verse) => {
    if (verse) {
      try {
        await Share.share({
          message:
            verse,
        });
      } catch (error) {
        Alert.alert(error.message);
      }
    }
  };

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

  const HandleFavorites = (verse) => {
    dispatch(addToFavorites({
      verse: verse,
      id: uuid.v4(),
      date: new Date().toDateString()
    }))
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
      <Text style={theme == 'dark' ? { fontSize: 15, fontFamily: 'Inter-Medium', color: '#e0e0e0', marginBottom: 10, lineHeight: 22 } : { lineHeight: 22, fontSize: 15, fontFamily: 'Inter-Medium', color: '#2f2d51', marginBottom: 10 }}>
        Welcome to the Verse of the Day page! Our goal is to provide you with a daily reminder of God's love, grace,
        and wisdom, and to help you grow in your faith journey.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={theme == 'dark' ? styles.favoritesDark : styles.favorites}>
        <Text
          style={theme == 'dark' ? { fontFamily: 'Inter-Medium', color: 'white', fontSize: 16 }
            : { fontFamily: 'Inter-Medium', color: '#2f2d51', fontSize: 16 }}>Favorite Verses</Text>
        <AntDesign style={{ marginLeft: 10 }} name="right" size={20} color={theme == 'dark' ? 'white' : '#2f2d51'} />
      </TouchableOpacity>
      <View style={{ justifyContent: 'center', marginTop: 15 }}>
        <Text style={theme == 'dark' ? styles.verseDark : styles.verse}>{message[0]}</Text>
        <View>
          {verse != 'No daily verse just yet. (Make sure to enable notifications to recieve the daily verse)' &&
            <Text style={theme == 'dark' ? styles.verseTitleDark : styles.verseTitle}>-{message[1]}</Text>
          }
          <View style={theme == 'dark' ? styles.utiltiesDark : styles.utilities}>
            <TouchableOpacity onPress={() => onShare(verse)} style={{ flexDirection: 'row', width: '33.33%', justifyContent: 'center', height: '100%', borderRightWidth: 1, borderColor: '#838383', alignItems: 'center' }}>
              <Text style={theme == 'dark' ? { fontSize: 14, fontFamily: 'Inter-Medium', marginRight: 10, color: '#ebebeb' } : { fontSize: 14, fontFamily: 'Inter-Medium', marginRight: 10, color: 'white' }}>Share</Text>
              <AntDesign name="sharealt" size={20} color={theme == 'dark' ? "#ebebeb" : "white"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => speak(verse)} style={{ flexDirection: 'row', width: '33.33%', justifyContent: 'center', height: '100%', borderRightWidth: 1, borderColor: '#838383', alignItems: 'center' }}>
              <Text style={theme == 'dark' ? { fontSize: 14, fontFamily: 'Inter-Medium', marginRight: 10, color: '#ebebeb' } : { fontSize: 14, fontFamily: 'Inter-Medium', marginRight: 10, color: 'white' }}>Voice</Text>
              <AntDesign name="sound" size={24} color={theme == 'dark' ? "#ebebeb" : "white"} />
            </TouchableOpacity>
            {favorites?.some(item => item.verse === verse) ?
              <TouchableOpacity disabled={true} style={{ flexDirection: 'row', width: '33.33%', justifyContent: 'center', height: '100%', alignItems: 'center' }}>
                <Text style={theme == 'dark' ? { fontSize: 14, marginRight: 5, color: '#d8d800', fontFamily: 'Inter-Medium' } : { fontSize: 14, fontFamily: 'Inter-Medium', marginRight: 10, color: '#d8d800' }}>Favorited</Text>
                <AntDesign name="staro" size={25} color={theme == 'dark' ? "#d8d800" : "#d8d800"} />
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => HandleFavorites(verse)} style={{ flexDirection: 'row', justifyContent: 'center', width: '33.33%', height: '100%', alignItems: 'center' }}>
                <Text style={theme == 'dark' ? { marginRight: 5, color: '#aaaaaa', fontFamily: 'Inter-Medium', fontSize: 14 } : { fontSize: 14, fontFamily: 'Inter-Medium', marginRight: 10, color: 'white' }}>Favorite</Text>
                <AntDesign name="staro" size={25} color={theme == 'dark' ? "#aaaaaa" : "white"} />
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
  utiltiesDark: {
    backgroundColor: '#212121',
    borderRadius: 10,
    height: 45,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  utilities: {
    backgroundColor: '#2f2d51',
    borderRadius: 10,
    height: 45,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  favoritesDark: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#151515',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 20
  },
  favorites: {
    borderRadius: 10,
    width: '100%',
    backgroundColor: '#93d8f8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
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
    color: 'white',
    marginTop: 10
  },
  verseTitle: {
    fontSize: 17,
    fontFamily: 'Inter-Medium',
    color: '#2f2d51',
    marginTop: 10
  }
})