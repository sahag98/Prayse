import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, HeaderTitle } from '../styles/appStyles';
import {
  ListView,
  TodoText,
  TodoDate,
  TodoCategory,
} from '../styles/appStyles';
import { useSelector } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableOpacity } from 'react-native';

const Folder = ({ navigation }) => {
  const theme = useSelector(state => state.user.theme)
  const folders = useSelector(state => state.folder.folders)

  const handleOpen = (item) => {
    navigation.navigate('PrayerPage', {
      title: item.name,
      prayers: item.prayers,
      id: item.id
    })
  }
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <ListView>
          <TouchableOpacity onPress={() => { handleOpen(item) }}>
            <Text>
              {item.name}
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Text>
              Add a folder
            </Text>
          </TouchableOpacity> */}
        </ListView>

      </View>
    )
  }

  return (
    <>
      <HeaderTitle>Folders</HeaderTitle>
      <SwipeListView
        data={folders}
        keyExtractor={(e, i) => i.toString()}
        renderItem={renderItem}

      />
    </>
  );
}

const styles = StyleSheet.create({})

export default Folder;
