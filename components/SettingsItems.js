import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons';

const SettingsItems = ({ options, theme, navigation }) => {
  return (
    <>
      {options.map((option) => (
        <TouchableOpacity key={option.id} onPress={() => navigation.navigate(option.screen)}
          style={theme == 'dark' ? styles.verseDark : styles.verse}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {option.icon}
            <Text
              style={{ fontFamily: 'Inter-Regular', color: 'white', fontSize: 16 }}>
              {option.title}
            </Text>
          </View>
          <AntDesign style={{ marginLeft: 10 }} name="right" size={14} color='white' />
        </TouchableOpacity>
      ))}
    </>
  )
}

export default SettingsItems

const styles = StyleSheet.create({
  verseDark: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#151515',
    padding: 20,
    borderRadius: 5,
    justifyContent: 'space-between',
    marginBottom: 15
  },
  verse: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2f2d51',
    padding: 20,
    borderRadius: 5,
    justifyContent: 'space-between',
    marginBottom: 15
  },
})