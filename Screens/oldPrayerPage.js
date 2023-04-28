import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, HeaderTitle, HeaderView, ListView1 } from '../styles/appStyles';
import AppLoading from 'expo-app-loading';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import * as Clipboard from 'expo-clipboard';

const OldPrayerPage = ({ navigation }) => {
  const theme = useSelector(state => state.user.theme)
  const [todos, setTodos] = useState([])
  const [ready, setReady] = useState(false)
  const [selectedEdit, setSelectedEdit] = useState('')
  const loadTodos = () => {
    AsyncStorage.getItem("storedTodos").then(data => {
      if (data !== null) {
        setTodos(JSON.parse(data))
      }
    }).catch((error) => console.log(error))
  }

  const copyToClipboard = async (title) => {
    await Clipboard.setStringAsync(title);
  };

  if (!ready) {
    return (
      <AppLoading
        startAsync={loadTodos}
        onFinish={() => setReady(true)}
        onError={console.warn}
      />
    )
  }

  const renderItem = ({ item }) => {
    return (
      <View>
        <ListView1 style={theme == 'dark' ? { backgroundColor: '#212121' } : { backgroundColor: '#93D8F8' }}>
          <View style={{ flexDirection: 'row', position: 'relative', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={theme == 'dark' ? { color: 'white' } : { color: '#2f2d51' }}>
              {item.title}
            </Text>
            <TouchableOpacity onPress={() => copyToClipboard(item.title)} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={theme == 'dark' ? { marginRight: 10, color: '#aaaaaa' } : { marginRight: 10, color: '#454277' }}>Copy</Text>
              <Ionicons name="ios-copy-outline" size={24} color={theme == 'dark' ? "#aaaaaa" : "#454277"} />
            </TouchableOpacity>
          </View>
        </ListView1>
      </View>
    )
  }
  return (
    <Container style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
      <HeaderView style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Folders')}>
          <Ionicons name="chevron-back" size={30} color={theme == "light" ? "#2f2d51" : "grey"} />
        </TouchableOpacity>
        <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' } : { fontFamily: 'Inter-Bold', color: '#2f2d51' }}>Original Prayers</HeaderTitle>
        <Text st>Clear original prayers</Text>
      </HeaderView>
      <SwipeListView
        data={todos}
        showsVerticalScrollIndicator={false}
        keyExtractor={(e, i) => i.toString()}
        renderItem={renderItem}

      />
    </Container>
  );
}

const styles = StyleSheet.create({
  editContainerDark: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#3b3b3b',
    zIndex: 99,
    width: '60%',
    height: '150%',
    borderRadius: 5
  },
  editContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#63c7f5',
    zIndex: 99,
    width: '60%',
    height: '150%',
    borderRadius: 5
  },
})

export default OldPrayerPage;
