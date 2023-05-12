import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, TouchableOpacity } from 'react-native';
import { Feather, Entypo, AntDesign, Ionicons } from '@expo/vector-icons'
import { TouchableHighlight } from 'react-native';
import { Divider } from 'react-native-paper';
import { deletePrayer } from '../redux/prayerReducer';
import { useDispatch } from 'react-redux';

const BottomBox = ({ slideUpValue, opacity, theme, selectedEdit,
  setSelectedEdit,
  isBoxVisible, setIsBoxVisible }) => {

  const dispatch = useDispatch()
  const handleDelete = (prayer) => {
    dispatch(deletePrayer(prayer))
    setSelectedEdit('')
    setIsBoxVisible(false)
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500, // in milliseconds
      useNativeDriver: true
    }).start()
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy }) => dy > 0,
      onPanResponderMove: (_, { dy }) => {
        slideUpValue.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (dy > 100 || vy > 0.5) {
          console.log('in swipedown')
          Animated.timing(slideUpValue, {
            toValue: 500,
            duration: 300,
            useNativeDriver: true,
          }).start(() => setIsBoxVisible(false));
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500, // in milliseconds
            useNativeDriver: true
          }).start()
        } else {
          console.log('swipe down')
          Animated.timing(slideUpValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.box,
          {
            transform: [{ translateY: slideUpValue }],
            opacity: slideUpValue.interpolate({
              inputRange: [-500, 0, 500],
              outputRange: [0, 1, 0],
            }),
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginVertical: 10, borderRadius: 5 }} onPress={() => handleDelete(selectedEdit)}>
          <AntDesign style={{ marginRight: 10 }} name="close" size={24} color={theme == 'dark' ? "#ff6666" : "#ff6262"} />
          <Text style={theme == 'dark' ? { color: '#ff6666', fontSize: 15, fontFamily: 'Inter-Medium' } : { color: '#ff6262', fontSize: 15, fontFamily: 'Inter-Medium' }}>Delete prayer</Text>
        </TouchableOpacity>
        <Divider style={{ marginVertical: 5, backgroundColor: 'grey' }} />
        <TouchableOpacity onPress={() => copyToClipboard(item.prayer)} style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', marginRight: 10 }}>
          <Ionicons style={{ marginRight: 10 }} name="ios-copy-outline" size={24} color={theme == 'dark' ? "#aaaaaa" : "#454277"} />
          <Text style={theme == 'dark' ? { color: '#aaaaaa', fontSize: 15, fontFamily: 'Inter-Medium' } : { color: '#454277', fontSize: 15, fontFamily: 'Inter-Medium' }}>Copy prayer</Text>
        </TouchableOpacity>
        <Divider style={{ marginVertical: 5, backgroundColor: 'grey' }} />
        <TouchableHighlight underlayColor={'#212121'} style={{ width: '100%', marginVertical: 10, padding: 5, borderRadius: 5, justifyContent: 'center' }} onPress={() => handleAddToAnsweredPrayer(item)}>
          <Text
            style={theme == 'dark' ? { color: '#66b266', fontFamily: 'Inter-Medium' }
              : { color: '#89ff89', fontFamily: 'Inter-Medium' }}>Mark as answered</Text>
        </TouchableHighlight>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'blue',
    color: 'white',
    borderRadius: 5,
    margin: 20,
  },
  box: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3b3b3b',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
});

export default BottomBox;
