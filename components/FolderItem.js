import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons';

const FolderItem = ({ item, theme, navigation, open, setOpen, setIdToDelete, idToDelete }) => {

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
  return (
    <View key={item.id}>
      <View style={theme == 'dark' ? [styles.containerDark, styles.elevationDark] : [styles.container, styles.elevation]}>
        <View style={{ display: 'flex', position: 'relative', height: '100%', justifyContent: 'center' }}>
          <View style={{
            display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
            position: 'absolute', top: 0
          }}>
            <AntDesign name="folder1" size={22} color="#f1d592" />
            <Feather style={{ marginLeft: 5 }} onPress={() => { handleDeleteFolder(item.id); setOpen(true) }} name='x' size={26} color="#f1d592" />
          </View>
          <View>
            <Text style={{ color: 'white', fontSize: 16, marginVertical: 5, fontFamily: 'Inter-Medium' }}>
              {item.name}
            </Text>
          </View>
          <TouchableOpacity onPress={() => { handleOpen(item) }} style={theme == 'dark' ? styles.viewDark : styles.view}>
            <Text style={{ color: 'white', fontFamily: 'Inter-Medium', fontSize: 13 }}>View prayers</Text>
            <AntDesign style={{ marginLeft: 10 }} name="right" size={14} color={theme == 'dark' ? "white" : 'white'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default FolderItem

const width = Dimensions.get('window').width - 30

const styles = StyleSheet.create({
  elevation: {
    shadowColor: '#12111f',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 4,
  },
  elevationDark: {
    shadowColor: '#040404',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  container: {
    backgroundColor: '#2f2d51',
    padding: 8,
    width: width / 2 - 8,
    height: 130,
    marginBottom: 20,
    borderRadius: 10
  },

  containerDark: {
    backgroundColor: '#212121',
    padding: 8,
    width: width / 2 - 8,
    height: 130,
    marginBottom: 20,
    borderRadius: 10
  },
  viewDark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0, padding: 7,
    width: '100%',
    backgroundColor: "#2e2e2e",
    borderRadius: 5
  }
  ,
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0, padding: 7,
    width: '100%',
    backgroundColor: "#423f72",
    borderRadius: 5
  },
})