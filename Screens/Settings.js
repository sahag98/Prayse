import React, { useState } from 'react';
import { View, StyleSheet, Platform, Linking, TouchableOpacity } from 'react-native';
import { Container } from '../styles/appStyles';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font'
import { Divider, FAB, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { darkMode, large, regular, small, systemTheme } from '../redux/userReducer';
import { addFolder, removeAllFolders } from '../redux/folderReducer';
import { IOS_ITEM_ID, ANDROID_PACKAGE_NAME } from '@env'
import { TextInput } from 'react-native';
import uuid from 'react-native-uuid';

const Settings = ({ navigation }) => {
  const [active, setActive] = useState(false)
  const theme = useSelector(state => state.user.theme)
  const size = useSelector(state => state.user.fontSize)
  const [open, setOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const dispatch = useDispatch()

  let [fontsLoaded] = useFonts({
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
  })

  function giveFeedback(market) {
    if (market == "android") {
      Linking.openURL(`market://details?id=${ANDROID_PACKAGE_NAME}&showAllReviews=true`)
    }
    if (market == "ios") {
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${IOS_ITEM_ID}?action=write-review`
      );
    }
  }

  const Switch = (theme) => {
    dispatch(darkMode(theme))
    if (theme == 'light') {
      setActive(!active)
    }
    if (theme == 'dark') {
      setActive(!active)
    }
  }

  const SystemTheme = () => {
    dispatch(systemTheme())
  }

  const changeFont = (font) => {
    if (font == 'large') {
      dispatch(large())
    }
    if (font == 'regular') {
      dispatch(regular())
    }
    if (font == 'small') {
      dispatch(small())
    }

  }
  return (
    <Container style={theme == 'dark' ? { backgroundColor: "#121212" } : { backgroundColor: "#F2F7FF" }}>
      <View style={styles.wrapper}>
        <Text style={theme == 'light' ? styles.settingsTitle : styles.settingsTitleDark}>App Settings</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={theme == 'light' ? styles.appearance : styles.appearanceDark}>APPEARANCE</Text>
        <Divider />
        <View style={{ marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <TouchableOpacity onPress={() => Switch('light')}
              style={theme == "light" ? styles.activeLight : styles.inactiveLight}
            >
              <View style={styles.lightButton}>
                <Text style={{ color: 'black', paddingLeft: 5 }}>Aa</Text>
              </View>
            </TouchableOpacity>
            <Text
              style={theme == 'dark' ? { color: 'white', marginTop: 5 } : { color: "#2f2d51", marginTop: 5 }}>
              Light
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => Switch('dark')}
              style={theme == "dark" ? styles.activeDark : styles.inactiveDark}
            >
              <View style={styles.darkButton}>
                <Text style={{ color: 'black', paddingLeft: 5, color: 'white' }}>Aa</Text>
              </View>
            </TouchableOpacity>
            <Text
              style={theme == 'dark' ? { color: 'white', marginTop: 5 } : { color: "#2f2d51", marginTop: 5 }}>
              Dark
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={SystemTheme} style={styles.system}>
              <View style={styles.systemDark}>
                <Text style={{ color: 'black', paddingLeft: 5, color: 'white' }}>Aa</Text>
              </View>
              <View style={styles.systemLight}>
                <Text style={{ color: 'black', paddingLeft: 5 }}>Aa</Text>
              </View>
            </TouchableOpacity>
            <Text style={theme == 'dark' ? { color: 'white', marginTop: 5 } : { color: "#2f2d51", marginTop: 5 }}>System</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={theme == 'light' ? styles.appearance : styles.appearanceDark}>PRAYER FONT SIZE</Text>
        <Divider style={{ marginBottom: 10 }} />
        <View style={styles.fontSizeWrapper}>
          <View style={{ display: 'flex', marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => changeFont('large')} style={size == 20 ? styles.FontActive : styles.FontInActive}>
              <Text style={{ color: 'black', paddingLeft: 5 }}>Large Font</Text>
            </TouchableOpacity>
            <Text style={theme == 'dark' ? { color: 'white', paddingLeft: 10, fontSize: 20 } : { color: '#2f2d51', paddingLeft: 10, fontSize: 20 }}>Text example</Text>
          </View>
          <View style={{ display: 'flex', marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => changeFont('regular')} style={size == 15 ? styles.FontActive : styles.FontInActive}>
              <Text style={{ color: 'black', paddingLeft: 5 }}>Regular Font</Text>
            </TouchableOpacity>
            <Text style={theme == 'dark' ? { color: 'white', paddingLeft: 10, fontSize: 15 } : { paddingLeft: 10, fontSize: 15, color: "#2f2d51" }}>Text example</Text>
          </View>
          <View style={{ display: 'flex', marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => changeFont('small')} style={size == 12 ? styles.FontActive : styles.FontInActive}>
              <Text style={{ color: 'black', paddingLeft: 5 }}>Small Font</Text>
            </TouchableOpacity>
            <Text style={theme == 'dark' ? { color: 'white', paddingLeft: 10, fontSize: 12 } : { color: "#2f2d51", paddingLeft: 10, fontSize: 12 }}>Text example</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <Text style={theme == 'light' ? styles.appearance : styles.appearanceDark}>ADDITIONAL LINKS</Text>
        <Divider style={{ marginBottom: 10 }} />
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {Platform.OS === 'ios' && <TouchableOpacity onPress={() => giveFeedback('ios')} style={styles.reviewButton}>
            <MaterialIcons style={{ marginRight: 10, color: '#3547cD' }} name="rate-review" size={24} color="black" />
            <Text style={{ color: '#3547cD' }}>Write a Review</Text>
          </TouchableOpacity>}
          {Platform.OS === 'android' && <TouchableOpacity onPress={() => giveFeedback('android')} style={styles.reviewButton}>
            <MaterialIcons style={{ marginRight: 10, color: '#3547cD' }} name="rate-review" size={24} color="black" />
            <Text style={{ color: '#3547cD' }}>Write a Review</Text>
          </TouchableOpacity>}
          <TouchableOpacity onPress={() => Linking.openURL('https://www.buymeacoffee.com/arzsahag')} style={styles.donateButton}>
            <AntDesign style={{ marginRight: 10 }} name="hearto" size={24} color="red" />
            <Text style={{ color: 'red' }}>Donate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  reviewButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    borderRadius: 5,
    padding: 15,
    backgroundColor: 'white'
  },
  donateButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    backgroundColor: 'white'
  },
  donateButtonDark: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 5,
    width: '45%',
    backgroundColor: 'white'
  },
  wrapper: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  feedback: {
    backgroundColor: '#2f2d51',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    padding: 15,
    width: '100%'
  },
  feedbackDark: {
    backgroundColor: '#2e2e2e',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    padding: 15,
    width: '100%'
  },
  settingsTitleDark: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Inter-Medium'
  },
  activeLight: {
    borderWidth: 2,
    borderColor: 'white',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#d3d3d3',
    height: 80,
    width: 100,
    borderRadius: 5,
    padding: 35
  },
  inactiveLight: {
    position: 'relative'
    , overflow: 'hidden',
    backgroundColor: '#d3d3d3',
    height: 80,
    width: 100,
    borderRadius: 5,
    padding: 35
  },
  lightButton: {
    position: 'absolute',
    bottom: 0,
    right: -1,
    borderTopLeftRadius: 5,
    backgroundColor: 'white',
    height: 60,
    width: 75
  },
  darkButton: {
    position: 'absolute',
    bottom: 0,
    right: -1,
    borderTopLeftRadius: 5,
    backgroundColor: '#212121',
    height: 60,
    width: 75
  },
  system: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'black',
    width: 100,
    height: 80,
    borderRadius: 5,
    padding: 35
  },
  systemDark: {
    position: 'absolute',
    right: -1,
    backgroundColor: '#212121',
    height: 100,
    width: 50
  },
  systemLight: {
    position: 'absolute',
    left: -1,
    backgroundColor: 'white',
    height: 100,
    width: 50
  },
  activeDark: {
    borderWidth: 2,
    borderColor: 'white',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#373737',
    height: 80,
    width: 100,
    borderRadius: 5,
    padding: 35
  },
  inactiveDark: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#373737',
    height: 80,
    width: 100,
    borderRadius: 5,
    padding: 35
  },
  FontActive: {
    borderWidth: 2,
    borderColor: 'white',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    height: 80,
    width: 100,
    borderRadius: 5
  },
  FontInActive: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d3d3d3',
    height: 80,
    width: 100,
    borderRadius: 5
  },
  settingsTitle: {
    color: '#2f2d51',
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'Inter-Medium'
  },
  appearance: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    paddingBottom: 5,
    color: '#2f2d51'
  },
  appearanceDark: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    paddingBottom: 5,
    color: 'white',
  },
  fontSizeWrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  }
})

export default Settings;
