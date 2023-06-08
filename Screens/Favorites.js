import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import { Container, HeaderTitle } from '../styles/appStyles'
import { TouchableOpacity } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { FlatList } from 'react-native'
import FavoriteVerses from '../components/FavoriteVerses'

const Favorites = ({ navigation }) => {
  const theme = useSelector(state => state.user.theme)
  const favorites = useSelector(state => state.favorites.favoriteVerses)

  const renderFavoriteVerses = ({ item }) => {
    return (
      <FavoriteVerses
        item={item}
        theme={theme}
      />
    )
  }
  return (
    <Container style={theme == 'dark' ? { backgroundColor: "#121212" } : { backgroundColor: "#F2F7FF" }}>
      <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginRight: 5, }} onPress={() => navigation.navigate('VerseOfTheDay')}>
          <Ionicons name="chevron-back" size={30} color={theme == "dark" ? "white" : "#2f2d51"} />
        </TouchableOpacity>
        <HeaderTitle
          style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' }
            : { fontFamily: 'Inter-Bold', color: '#2F2D51' }}>
          Favorite Verses
        </HeaderTitle>
      </View>
      {favorites.length == 0 &&
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text style={theme == 'dark' ? { color: 'white', fontSize: 16, fontFamily: 'Inter-Medium' } : { color: '#2f2d51', fontSize: 16, fontFamily: 'Inter-Medium' }}>Nothing on the list just yet!</Text>
          <Text style={theme == 'dark' ? { color: 'white', fontSize: 14, marginTop: 5, fontFamily: 'Inter-Regular' } : { marginTop: 5, color: '#2f2d51', fontSize: 14, fontFamily: 'Inter-Regular' }}>Add verses by clicking on the favorite button</Text>
        </View>
      }
      <FlatList
        data={favorites}
        keyExtractor={(e, i) => i.toString()}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        renderItem={renderFavoriteVerses}
      />
    </Container>
  )
}

export default Favorites

const styles = StyleSheet.create({})