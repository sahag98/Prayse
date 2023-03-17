import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, HeaderTitle, ListView1 } from '../styles/appStyles';
import AppLoading from 'expo-app-loading';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

const OldPrayerPage = ({ navigation }) => {
  const theme = useSelector(state => state.user.theme)
  const [todos, setTodos] = useState([])
  const [ready, setReady] = useState(false)

  const loadTodos = () => {
    AsyncStorage.getItem("storedTodos").then(data => {
      if (data !== null) {
        setTodos(JSON.parse(data))
      }
    }).catch((error) => console.log(error))
  }

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
        <ListView1>
          <View>
            <Text>
              {item.title}
            </Text>
          </View>
        </ListView1>
      </View>
    )
  }
  return (
    <Container>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color={theme == "light" ? "#2f2d51" : "grey"} />
        </TouchableOpacity>
        <HeaderTitle style={theme == 'dark' ? { color: 'white' } : { color: 'black' }}>Original Prayers</HeaderTitle>
      </View>
      <SwipeListView
        data={todos}
        keyExtractor={(e, i) => i.toString()}
        renderItem={renderItem}

      />
    </Container>
  );
}

const styles = StyleSheet.create({})

export default OldPrayerPage;
