import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Container } from '../styles/appStyles'
import { useDispatch, useSelector } from 'react-redux'
import { setVerse } from '../redux/prayerReducer'

const VerseOfTheDay = ({ route }) => {
  const theme = useSelector(state => state.user.theme)
  const dailyVerse = useSelector(state => state.prayer.verse)
  const { verse } = route.params
  const dispatch = useDispatch()
  dispatch(setVerse(verse))

  return (
    <Container style={theme == 'dark' ? { backgroundColor: "#121212" } : { backgroundColor: "#F2F7FF" }}>
      <Text style={{ color: 'white' }}>{dailyVerse}</Text>
    </Container>
  )
}

export default VerseOfTheDay

const styles = StyleSheet.create({})