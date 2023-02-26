import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';

const CategoryTabs = ({ theme, prayerList, status, setStatus, selected }) => {
  return (
    <>
      {prayerList.length != 0 &&
        <View>
          <ScrollView horizontal={true} contentContainerStyle={styles.tab}>
            {selected.map((selected, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setStatus(selected)}
                style={theme == 'dark' ? [styles.btnTabDark, status === selected && styles.btnActiveDark] : [styles.btnTab, status === selected && styles.btnActive]}
              >
                <Text
                  style={theme == 'dark' ? [styles.textTabDark, status === selected && styles.textTabActiveDark] : [styles.textTab, status === selected && styles.textTabActive]}>
                  {selected}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      }
    </>
  );
}

const styles = StyleSheet.create({
  tab: {
    height: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnTab: {
    backgroundColor: 'white',
    padding: 7,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 5
  },

  btnTabDark: {
    backgroundColor: '#212121',
    padding: 7,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginHorizontal: 5
  },

  textTab: {
    color: 'black',
    fontSize: 13
  },

  textTabDark: {
    color: 'white',
    fontSize: 13
  },

  textTabActive: {
    color: 'white'
  },

  textTabActiveDark: {
    color: 'black'
  },

  btnActive: {
    backgroundColor: '#2F2D51'
  },

  btnActiveDark: {
    backgroundColor: 'white'
  },
})

export default CategoryTabs;
