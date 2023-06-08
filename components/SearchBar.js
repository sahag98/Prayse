import React from 'react';
import { TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { EvilIcons, AntDesign } from '@expo/vector-icons';

const SearchBar = ({ search, setSearch }) => {
  return (
    <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5, marginBottom: 10 }}>
      <View style={{ width: '80%', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <EvilIcons name="search" size={24} color="black" />
        <TextInput
          style={styles.textInputStyle}
          value={search}
          placeholder='Search prayers...'
          placeholderTextColor={'#212121'}
          selectionColor={'white'}
          onChangeText={(text) => setSearch(text)}
          autoFocus={false}
        />
      </View>
      <TouchableOpacity onPress={() => setSearch('')}>
        <AntDesign name="close" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputStyle: {
    width: '100%',
    fontSize: 13,
    marginLeft: 10
  },
})

export default SearchBar;
