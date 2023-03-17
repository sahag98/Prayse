import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet } from 'react-native';
import {
  HeaderTitle, ModalContainer,
  ModalView,
  StyledInput,
  ModalAction,
  ModalActionGroup,
  ModalIcon, ListView1
} from '../styles/appStyles';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableOpacity } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { FAB } from 'react-native-paper';
import { Modal } from 'react-native';
import { addFolder, deleteAllFolders, deleteFolder } from '../redux/folderReducer';
import uuid from 'react-native-uuid';
import { useFonts } from 'expo-font';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useRef } from 'react';

const Folder = ({ navigation }) => {
  const folderInputRef = useRef(null)

  const theme = useSelector(state => state.user.theme)
  const folders = useSelector(state => state.folder.folders)
  const [visible, setVisible] = useState(false)
  const [folderName, setFolderName] = useState("")
  let [fontsLoaded] = useFonts({
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  })

  const dispatch = useDispatch()
  const handleCloseModal = () => {
    setVisible(false)
    setFolderName("")
  }
  function goToOrignalPrayer() {
    navigation.navigate('OldPrayerPage')
  }
  function add() {
    dispatch(addFolder({
      id: uuid.v4(),
      name: folderName,
      prayers: []
    }))
    setVisible(false)
    setFolderName("")
  }
  const handleOpen = (item) => {
    navigation.navigate('PrayerPage', {
      title: item.name,
      prayers: item.prayers,
      id: item.id
    })
  }

  function handleDeleteFolder(id) {
    dispatch(deleteFolder(id))
  }
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <ListView1 underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'} onPress={() => { handleOpen(item) }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign style={{ marginRight: 10 }} name="folder1" size={24} color="black" />
              <Text style={{ fontFamily: 'Inter-Medium' }}>
                {item.name}
              </Text>
            </View>
            <Feather onPress={() => handleDeleteFolder(item.id)} name='x' size={28} color="black" />
          </View>
        </ListView1>

      </View>
    )
  }

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <View style={{ display: 'flex', marginVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' }
          : { fontFamily: 'Inter-Medium', color: '#2F2D51' }}>Folders</HeaderTitle>
      </View>
      <ListView1 underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'} onPress={goToOrignalPrayer}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Inter-Medium' }}>Original Prayers</Text>
          <AntDesign name="right" size={24} color="black" />
        </View>
      </ListView1>
      <SwipeListView
        data={folders}
        keyExtractor={(e, i) => i.toString()}
        renderItem={renderItem}
      />
      <View style={styles.actionButtons}>
        <FAB
          icon="plus"
          style={styles.fabStyle}
          onPress={() => { setVisible(true) }}
          color="#2F2D51"
          customSize={60}
        />
        <Text style={theme == 'dark' ? { color: 'white', fontFamily: 'Inter-Medium', marginLeft: 10 } : { fontFamily: 'Inter-Medium', color: '#2f2d51', marginLeft: 10 }}>Add Folder</Text>
      </View>

      <Modal
        animationType='fade'
        transparent={true}
        visible={visible}
        onRequestClose={handleCloseModal}
        onModalShow={() => folderInputRef.current.focus()}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ModalContainer style={theme == 'dark' ? { backgroundColor: '#121212' } : { backgroundColor: '#F2F7FF' }}>
            <ModalView style={theme == 'dark' ? { backgroundColor: '#212121' } : { backgroundColor: '#93D8F8' }}>
              <ModalIcon>
                <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' } : { fontFamily: 'Inter-Bold' }}>Folder</HeaderTitle>
                <AntDesign style={{ marginTop: 10 }} name='edit' size={32} color={theme == 'dark' ? 'white' : '#2F2D51'} />
              </ModalIcon>
              <StyledInput
                ref={folderInputRef}
                style={theme == 'dark' ? styles.inputDark : styles.input}
                placeholder="Enter folder name"
                placeholderTextColor={'white'}
                selectionColor={'white'}
                // autoFocus={true}
                onChangeText={(text) => setFolderName(text)}
                value={folderName}
                onSubmitEditing={(e) => { e.key === 'Enter' && e.preventDefault() }}
                multiline={true}
              />
              <ModalActionGroup>
                <ModalAction color={'white'} onPress={handleCloseModal}>
                  <AntDesign name='close' size={28} color={'#2F2D51'} />
                </ModalAction>
                <ModalAction color={theme == 'dark' ? '#121212' : '#2F2D51'} onPress={add}>
                  <AntDesign name='check' size={28} color={'white'} />
                </ModalAction>
              </ModalActionGroup>
            </ModalView>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fabStyle: {
    position: 'relative',
    alignSelf: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: 'white',

  },
  actionButtons: {
    position: 'absolute',
    bottom: 10,
    height: 70,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  fabStyle3: {
    bottom: 10,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#2F2D51',
  },
  fabStyle3Dark: {
    bottom: 10,
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#A5C9FF',
  },
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

export default Folder;
