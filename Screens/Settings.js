import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Linking, TouchableOpacity, Switch } from 'react-native';
import { Container, HeaderTitle, HeaderView } from '../styles/appStyles';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font'
import { Divider, FAB, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { darkMode, large, regular, small, systemTheme } from '../redux/userReducer';
import { addFolder, removeAllFolders } from '../redux/folderReducer';
import { IOS_ITEM_ID, ANDROID_PACKAGE_NAME } from '@env'
import { TextInput } from 'react-native';
import uuid from 'react-native-uuid';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { PROJECT_ID, NOTIFICATION_API } from '@env'

const Settings = ({ navigation }) => {
  const [active, setActive] = useState(false)
  const theme = useSelector(state => state.user.theme)
  const [isEnabled, setIsEnabled] = useState(false);
  const size = useSelector(state => state.user.fontSize)
  const [open, setOpen] = useState(false)
  const [folderName, setFolderName] = useState("")
  const dispatch = useDispatch()


  async function sendToken(expoPushToken) {
    console.log(' in send')
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };
    console.log('about to fetch')
    await fetch(NOTIFICATION_API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  useEffect(() => {
    async function Perm() {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      if (existingStatus !== 'granted') {
        setIsEnabled(false)
      } else {
        setIsEnabled(true)
      }
    }
    Perm()
  }, [])

  async function getPermission() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        setIsEnabled(false)
        const { status } = await Notifications.requestPermissionsAsync();
        console.log(status)
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('not granted')
        return;
      }
      console.log('permission granted')
      token = (await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })).data;
      setIsEnabled(true)
      console.log(token)
    } else {
      alert('Must use physical device for Push Notifications');
    }
    sendToken(token)
  }




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

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState)
    if (isEnabled == false) {
      getPermission()
      return
    }
  };

  const SwitchTheme = (theme) => {
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
      <View>
        <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={{ marginRight: 5 }} onPress={() => navigation.navigate('More')}>
            <Ionicons name="chevron-back" size={30} color={theme == "light" ? "#2f2d51" : "white"} />
          </TouchableOpacity>
          <HeaderTitle
            style={theme == 'dark' ? { fontFamily: 'Inter-Bold', color: 'white' }
              : { fontFamily: 'Inter-Bold', color: '#2F2D51' }}>
            Settings
          </HeaderTitle>
        </View>
      </View>
      <View>
        <Text style={theme == 'light' ? styles.appearance : styles.appearanceDark}>APPEARANCE</Text>
        <Divider />
        <View style={Platform.isPad ? { marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' } : { marginTop: 10, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <TouchableOpacity onPress={() => SwitchTheme('light')}
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
            <TouchableOpacity onPress={() => SwitchTheme('dark')}
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
              <Text style={{ fontFamily: 'Inter-Regular', color: 'black', paddingLeft: 5 }}>Large Font</Text>
            </TouchableOpacity>
            <Text style={theme == 'dark' ? { fontFamily: 'Inter-Regular', color: 'white', paddingLeft: 10, fontSize: 20 } : { fontFamily: 'Inter-Regular', color: '#2f2d51', paddingLeft: 10, fontSize: 20 }}>Text example</Text>
          </View>
          <View style={{ display: 'flex', marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => changeFont('regular')} style={size == 16 ? styles.FontActive : styles.FontInActive}>
              <Text style={{ color: 'black', paddingLeft: 5 }}>Regular Font</Text>
            </TouchableOpacity>
            <Text style={theme == 'dark' ? { fontFamily: 'Inter-Regular', color: 'white', paddingLeft: 10, fontSize: 16 } : { fontFamily: 'Inter-Regular', paddingLeft: 10, fontSize: 15, color: "#2f2d51" }}>Text example</Text>
          </View>
          <View style={{ display: 'flex', marginBottom: 15, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => changeFont('small')} style={size == 12 ? styles.FontActive : styles.FontInActive}>
              <Text style={{ fontFamily: 'Inter-Regular', color: 'black', paddingLeft: 5 }}>Small Font</Text>
            </TouchableOpacity>
            <Text style={theme == 'dark' ? { fontFamily: 'Inter-Regular', color: 'white', paddingLeft: 10, fontSize: 12 } : { fontFamily: 'Inter-Regular', color: "#2f2d51", paddingLeft: 10, fontSize: 12 }}>Text example</Text>
          </View>
        </View>
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: 'black', fontFamily: 'Inter-Medium', fontSize: 15 }}>Get Notifications</Text>
          <Switch
            trackColor={{ false: "grey", true: "grey" }}
            thumbColor={isEnabled ? "green" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
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
    borderRadius: 5,
    padding: 15,
    backgroundColor: 'white'
  },
  reviewButtonDark: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 15,
    backgroundColor: '#212121'
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
    borderWidth: 3,
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
