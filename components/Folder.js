import React, { useEffect, useState } from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet, Platform, FlatList } from 'react-native';
import {
  HeaderTitle, ModalContainer,
  ModalView,
  StyledInput,
  ModalAction,
  ModalActionGroup,
  ModalIcon, ListView1, TodoText
} from '../styles/appStyles';
import { useDispatch, useSelector } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableOpacity, Animated } from 'react-native';
import { AntDesign, Entypo, Feather } from '@expo/vector-icons';
import { AnimatedFAB, FAB } from 'react-native-paper';
import { Modal } from 'react-native';
import { addFolder, deleteFolder } from '../redux/folderReducer';
import uuid from 'react-native-uuid';
import { useFonts } from 'expo-font';
import { useRef } from 'react';

const Folder = ({ navigation, todos }) => {
  const folderInputRef = useRef(null)
  const theme = useSelector(state => state.user.theme)
  const folders = useSelector(state => state.folder.folders)
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [isExtended, setIsExtended] = useState(true);
  const [idToDelete, setIdToDelete] = useState(null)
  const [extended, setExtended] = useState(true);
  const isIOS = Platform.OS === 'ios'
  const [fabvisible, setFabvisible] = useState(true)

  const { current: velocity } = useRef(new Animated.Value(0))

  useEffect(() => {
    if (!isIOS) {
      velocity.addListener(({ value }) => {
        setIsExtended(value <= 0);
      });
    } else setIsExtended(extended);
  }, [velocity, extended, isIOS]);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0
    if (!isIOS) {
      return velocity.setValue(currentScrollPosition)
    }
    setExtended(currentScrollPosition <= 0);
  };
  let [fontsLoaded] = useFonts({
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  })

  const dispatch = useDispatch()
  const handleCloseModal = () => {
    setVisible(false)
    setOpen(false)
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
    setIdToDelete(id)
  }

  const renderItem = ({ item, index }) => {
    return (
      <View>
        <ListView1 style={theme == 'dark' ? [styles.elevationDark, { backgroundColor: '#212121' }] : [styles.elevation, { backgroundColor: '#2f2d51' }]} underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'} onPress={() => { handleOpen(item) }}>
          <View style={{ display: 'flex', position: 'relative', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign style={{ marginRight: 10 }} name="folder1" size={24} color="#f1d592" />
              <Text style={{ color: 'white', fontFamily: 'Inter-Medium' }}>
                {item.name}
              </Text>
            </View>
            <Feather onPress={() => { handleDeleteFolder(item.id); setOpen(true) }} name='x' size={30} color="#f1d592" />
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
      {todos.length != 0 &&
        <ListView1 style={theme == 'dark' ? [styles.elevationDark, { backgroundColor: '#212121' }] : [styles.elevation, { backgroundColor: '#2f2d51' }]} underlayColor={theme == 'dark' ? '#121212' : '#F2F7FF'} onPress={goToOrignalPrayer}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'white', fontFamily: 'Inter-Medium' }}>Original Prayers</Text>
            <AntDesign name="right" size={24} color="white" />
          </View>
        </ListView1>
      }
      {folders.length == 0 && <TodoText style={theme == 'dark' ? styles.pressDark : styles.press}>Add a folder to write your prayers in!</TodoText>}
      <FlatList
        data={folders}
        keyExtractor={(e, i) => i.toString()}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={renderItem}
      />
      <View style={styles.actionButtons}>
        <AnimatedFAB
          icon={'plus'}
          label={'Add Folder'}
          extended={isExtended}
          onPress={() => { setVisible(true) }}
          visible={fabvisible}
          animateFrom={'left'}
          iconMode={'dynamic'}
          color={"white"}
          style={theme == 'dark' ? styles.fabStyleDark : styles.fabStyle}
        />
      </View>

      <Modal
        animationType='fade'
        transparent={true}
        visible={open}
        onRequestClose={handleCloseModal}
        statusBarTranslucent={true}
      // onShow={() => inputRef.current?.focus()}
      >
        <ModalContainer style={theme == 'dark' ? { backgroundColor: 'rgba(0, 0, 0, 0.8)' } : { backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <ModalView style={theme == 'dark' ? { backgroundColor: '#212121' } : { backgroundColor: '#93D8F8' }}>
            <ModalIcon>
              <HeaderTitle style={theme == 'dark' ? { fontFamily: 'Inter-Bold', fontSize: 18, color: 'white' } : { fontSize: 18, fontFamily: 'Inter-Bold' }}>Are you sure you want to delete this folder and all its prayers?</HeaderTitle>
            </ModalIcon>
            <ModalActionGroup>
              <ModalAction color={'white'} onPress={() => setOpen(false)}>
                <AntDesign name='close' size={28} color={theme == 'dark' ? 'black' : '#2F2D51'} />
              </ModalAction>
              <ModalAction color={theme == 'dark' ? '#121212' : '#2F2D51'} onPress={() => { dispatch(deleteFolder(idToDelete)); setOpen(false) }}>
                <AntDesign name='check' size={28} color={'white'} />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </ModalContainer>
      </Modal>

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
  fabStyleDark: {
    position: 'relative',
    alignSelf: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#212121',

  },
  fabStyle: {
    position: 'relative',
    alignSelf: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    backgroundColor: '#2f2d51',

  },
  elevation: {
    shadowColor: '#12111f',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  elevationDark: {
    shadowColor: '#040404',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 7,
  },
  press: {
    fontFamily: 'Inter-Regular',
    padding: 10,
    alignSelf: 'center',
    color: '#2F2D51',
    fontSize: 14
  },
  pressDark: {
    fontFamily: 'Inter-Regular',
    padding: 10,
    alignSelf: 'center',
    color: 'white',
    fontSize: 14
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
