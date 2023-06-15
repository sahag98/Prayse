import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { deleteFavoriteVerse } from '../redux/favoritesReducer';

const FavoriteVerses = ({ item, theme }) => {
  const dispatch = useDispatch()
  return (
    <View style={theme == 'dark' ? styles.fvDark : styles.fv} key={item.id}>
      <View style={{ width: '100%' }}>
        <Text
          style={theme == "dark" ? { color: 'white', fontSize: 15, fontFamily: "Inter-Bold", marginBottom: 2 }
            : { color: '#2f2d51', fontSize: 15, fontFamily: "Inter-Bold", marginBottom: 2 }}>{item?.date}</Text>
        <Text style={theme == 'dark' ? styles.fvVerseDark : styles.fvVerse}>{item.verse}</Text>
      </View>
      <TouchableOpacity onPress={() => dispatch(deleteFavoriteVerse(item.id))} style={{ position: 'absolute', top: 5, right: 5 }}>
        <AntDesign name="close" size={24} color={theme == 'dark' ? "white" : "#2f2d51"} />
      </TouchableOpacity>
    </View>
  )
}

export default FavoriteVerses

const styles = StyleSheet.create({
  fvDark: {
    backgroundColor: '#212121',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fv: {
    backgroundColor: '#93d8f8',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fvVerseDark: {
    width: '95%',
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    color: 'white'
  },
  fvVerse: {
    width: '95%',
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
    color: '#2f2d51'
  }
})