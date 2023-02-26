import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Container } from '../styles/appStyles';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addPrayer, deletePrayer } from '../redux/prayerReducer';
import uuid from 'react-native-uuid';
import Home from '../components/Home';
import useIsReady from '../hooks/useIsReady';

const PrayerPage = ({ route, navigation }) => {
  const theme = useSelector(state => state.user.theme)
  const isReady = useIsReady()
  const prayerList = useSelector(state => state.prayer.prayer)
  const { prayers, id, title } = route.params

  const [prayer, setPrayer] = useState("")
  // const [prayerList, setPrayerList] = useState([])
  const dispatch = useDispatch()

  const BusyIndicator = () => {

    return (
      <View style={theme == 'dark' ? { backgroundColor: "#121212", flex: 1, justifyContent: "center" } : { backgroundColor: '#F2F7FF', flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  if (!isReady) {
    return <BusyIndicator />;
  }


  return (
    <Home navigation={navigation} prayerList={prayerList} folder={title} />
  );
}

const styles = StyleSheet.create({
  inputDark: {
    alignItems: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Inter-Regular', backgroundColor: '#121212'
  },
  input: {
    textAlignVertical: "center",
    fontFamily: 'Inter-Regular', backgroundColor: '#2F2D51'
  }
})

export default PrayerPage;
