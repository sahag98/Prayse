import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Container, HeaderTitle } from '../styles/appStyles'
import { useDispatch, useSelector } from 'react-redux'
import { setVerse } from '../redux/prayerReducer'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused, useNavigation } from '@react-navigation/native'

const VerseOfTheDay = ({ route }) => {
  const theme = useSelector(state => state.user.theme)
  const [verse, setVerse] = useState('')
  const navigation = useNavigation()
  const isFocused = useIsFocused();
  useEffect(() => {
    loadDailyVerse()
    if (route.params) {
      AsyncStorage.setItem("storedVerse", route.params.verse)
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


  return (
    <Container style={theme == 'dark' ? { backgroundColor: "#121212" } : { backgroundColor: "#F2F7FF" }}>
      <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginRight: 5 }} onPress={() => navigation.navigate('More')}>
          <Ionicons name="chevron-back" size={30} color={theme == "light" ? "#2f2d51" : "white"} />
        </TouchableOpacity>
        <HeaderTitle
          style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' }
            : { fontFamily: 'Inter-Bold', color: '#2F2D51' }}>
          Verse of the Day
        </HeaderTitle>
      </View>
      <Text style={theme == 'dark' ? styles.verseDark : styles.verse}>{verse}</Text>
    </Container>
  )
}

export default VerseOfTheDay

const styles = StyleSheet.create({
  verseDark: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 35,
    color: 'white'
  },
  verse: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 35,
    color: '#2f2d51'
  }
})