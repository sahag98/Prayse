import React, { useRef, useState, useEffect } from 'react'
import { Dimensions, Platform, Linking, View, Text, StyleSheet, TouchableOpacity, Image, Animated } from "react-native"
import prayer from '../assets/prayer-nobg.png'
import { Ionicons, AntDesign, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font'
import Unorderedlist from 'react-native-unordered-list';
import AppLoading from 'expo-app-loading';
import Svg, { Path } from 'react-native-svg';
import { useSelector, useDispatch } from 'react-redux';
import { Divider, List } from 'react-native-paper';
import { Container, ModalContainer, ModalView, ToolTipView } from '../styles/appStyles';
import { closeTool } from '../redux/userReducer';
import { Modal } from 'react-native';

// import { Alert } from 'react-native';
// import Constants from 'expo-constants';
// import * as Updates from 'expo-updates';

// async function checkAppVersion() {
//     const { version } = Constants.manifest;

//     // Get the latest version from the app store
//     const latestVersion = await Updates.checkForUpdateAsync();

//     // Compare the app version with the latest version
//     if (latestVersion.isAvailable && latestVersion.version !== version) {
//         Alert.alert(
//             'New Update Available',
//             'A new version of the app is available. Do you want to update now?',
//             [
//                 {
//                     text: 'Later',
//                     style: 'cancel'
//                 },
//                 {
//                     text: 'Update',
//                     onPress: () => {
//                         // Start the update process
//                         Updates.reloadAsync();
//                     }
//                 }
//             ]
//         );
//     }
// }

export default function Welcome({ navigation }) {
    const theme = useSelector(state => state.user.theme)
    const [toolVisible, setToolVisible] = useState(false)
    const [expanded, setExpanded] = useState(true);

    const handlePress = () => setExpanded(!expanded);

    function handleCloseTooltip() {
        setToolVisible(false)
    }

    const fadeAnim = useRef(new Animated.Value(0)).current
    // checkAppVersion()

    useEffect(() => {
        Animated.timing(
            fadeAnim,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }
        ).start()
    }, [fadeAnim]);

    let [fontsLoaded] = useFonts({
        'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
        'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
        'Inter-Light': require('../assets/fonts/Inter-Light.ttf'),
    })

    if (!fontsLoaded) {
        return <AppLoading />
    }

    return (
        <Container style={theme == 'dark' ? { display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' } : { display: 'flex', position: 'relative', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F7FF' }}>
            <Text style={theme == 'dark' ? styles.welcomeDark : styles.welcome}>Welcome to your prayer app</Text>
            <View style={styles.imgContainer}>
                <Image
                    style={styles.img}
                    source={prayer}
                />
            </View>
            <Modal
                animationType='fade'
                transparent={true}
                visible={toolVisible}
                onRequestClose={handleCloseTooltip}
                statusBarTranslucent={true}
            >
                <ModalContainer style={theme == 'dark' ? { backgroundColor: 'rgba(0, 0, 0, 0.8)' } : { backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>

                    <TouchableOpacity onPress={handleCloseTooltip} style={theme == 'dark' ? { borderRadius: 5, position: 'relative', padding: 15, width: '100%', backgroundColor: '#212121' } : { borderRadius: 5, position: 'relative', padding: 15, width: '100%', backgroundColor: '#93D8F8' }}>
                        <TouchableOpacity style={{ position: 'absolute', top: 5, right: 5, padding: 10 }} onPress={handleCloseTooltip}>
                            <AntDesign name="close" size={22} color={theme == 'dark' ? 'white' : "#2f2d51"} />
                        </TouchableOpacity>

                        <Text style={theme == 'dark' ? { color: 'white', marginBottom: 5, fontFamily: 'Inter-Medium', fontSize: 15 } : { color: '#2f2d51', fontFamily: 'Inter-Medium', marginBottom: 5, fontSize: 15 }}>What's New:</Text>
                        <Unorderedlist
                            color={theme == 'dark' ? 'white' : 'black'}
                            bulletUnicode={0x2713}
                        >
                            <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>New and intuitive navigation system using the bottom tabs.</Text>
                        </Unorderedlist>
                        <Unorderedlist
                            color={theme == 'dark' ? 'white' : 'black'}
                            bulletUnicode={0x2713}
                        >
                            <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>
                                New devotional page that will have a daily devotional.
                            </Text>
                        </Unorderedlist>
                        <Unorderedlist
                            color={theme == 'dark' ? 'white' : 'black'}
                            bulletUnicode={0x2713}
                        >
                            <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>
                                Quick links on home page.
                            </Text>
                        </Unorderedlist>
                        <Unorderedlist
                            color={theme == 'dark' ? 'white' : 'black'}
                            bulletUnicode={0x2713}
                        >
                            <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>
                                Small bugfixes all around the app.
                            </Text>
                        </Unorderedlist>
                        <Unorderedlist
                            color={theme == 'dark' ? 'white' : 'black'}
                            bulletUnicode={0x2713}
                        >
                            <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>
                                Added confirmation for deleting folders.
                            </Text>
                        </Unorderedlist>
                    </TouchableOpacity>
                </ModalContainer>
            </Modal>
            <View style={{ width: '100%' }}>
                <Text style={theme == 'dark' ? { color: 'white', fontFamily: 'Inter-Regular', fontSize: 15 } : { color: '#2f2d51', fontFamily: 'Inter-Regular', fontSize: 15 }}>Quick links</Text>
                <Divider style={{ marginBottom: 10, marginTop: 5 }} />
                <TouchableOpacity onPress={() => setToolVisible(true)} style={theme == 'dark' ? styles.refreshDark : styles.refresh}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Feather name="info" size={24} color={theme == 'dark' ? "#f1d592" : "#bb8b18"} />
                        <Text style={theme == 'dark' ? { color: '#f1d592', marginLeft: 5, fontFamily: 'Inter-Regular' } : { color: '#bb8b18', marginLeft: 5, fontFamily: 'Inter-Regular' }}>Check What's New!</Text>
                    </View>
                    <AntDesign name="right" size={18} color={theme == 'dark' ? "#f1d592" : '#bb8b18'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Gospel')} style={theme == 'dark' ? styles.refreshDark : styles.refresh}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="cross" size={24} color="#8cbaff" />
                        <Text style={theme == 'dark' ? { color: '#A5C9FF', marginLeft: 5, fontFamily: 'Inter-Regular' } : { color: '#738cb2', marginLeft: 5, fontFamily: 'Inter-Regular' }}>The Gospel of Jesus</Text>
                    </View>
                    <AntDesign name="right" size={18} color={theme == 'dark' ? "#8cbaff" : '#738cb2'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.buymeacoffee.com/arzsahag')} style={theme == 'dark' ? styles.refreshDark : styles.refresh}>
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <AntDesign name="hearto" size={24} color="#DE3163" />
                        <Text style={theme == 'dark' ? { color: '#e24774', marginLeft: 5, fontFamily: 'Inter-Regular' } : { color: '#cb3f68', marginLeft: 5, fontFamily: 'Inter-Regular' }}>Donate to support future updates!</Text>
                    </View>
                    <AntDesign name="right" size={18} color={theme == 'dark' ? "#e24774" : '#cb3f68'} />
                </TouchableOpacity>
                {
                    Platform.OS === 'android' &&
                    <TouchableOpacity
                        style={theme == 'dark' ? styles.refreshDark : styles.refresh}
                        onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp')}
                    >
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="logo-google-playstore" size={24} color={theme == 'dark' ? "#d6d6d6" : "#606060"} />
                            <Text
                                style={theme == 'dark' ? { color: '#f0f0f0', fontFamily: 'Inter-Regular', marginLeft: 5 } : { color: '#606060', fontFamily: 'Inter-Regular', marginLeft: 5 }}
                            >
                                Check for Updates
                            </Text>
                        </View>
                        <AntDesign name="right" size={18} color={theme == 'dark' ? "#d6d6d6" : '#606060'} />
                    </TouchableOpacity>
                }
                {
                    Platform.OS === 'ios' &&
                    <TouchableOpacity
                        style={theme == 'dark' ? styles.refreshDark : styles.refresh}
                        onPress={() => Linking.openURL('https://apps.apple.com/us/app/prayerlist-app/id6443480347')}
                    >
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <AntDesign name="apple1" size={24} color={theme == 'dark' ? "#d6d6d6" : "#606060"} />
                            <Text
                                style={theme == 'dark' ? { color: '#f0f0f0', fontFamily: 'Inter-Regular', marginLeft: 5 } : { color: '#606060', fontFamily: 'Inter-Regular', marginLeft: 5 }}
                            >
                                Check for Updates
                            </Text>
                        </View>
                        <AntDesign name="right" size={18} color={theme == 'dark' ? "#d6d6d6" : '#2f2d51'} />
                    </TouchableOpacity>
                }
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Folders')} style={theme == 'dark' ? styles.buttonDark : styles.button}>
                <Text style={theme == 'dark' ? { fontFamily: 'Inter-Medium' } : { color: 'white', fontFamily: 'Inter-Medium' }}>Create a Folder</Text>
                <AntDesign style={{ marginLeft: 10 }} name="right" size={18} color={theme == 'dark' ? "black" : 'white'} />
            </TouchableOpacity>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F7FF',
        justifyContent: "center",
        alignItems: 'center'
    },
    containerDark: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: "center",
        alignItems: 'center'
    },
    refreshDark: {
        width: '100%',
        backgroundColor: '#212121',
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginBottom: 10,
        borderRadius: 5,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    refresh: {
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginBottom: 10,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    section: {
        backgroundColor: '#a6c8ff'
    },
    sectionDark: {

        backgroundColor: '#212121',
    },
    wrapper: {
        width: '80%'
    },
    listText: {
        fontFamily: 'Inter-Regular',
        color: '#2f2d51',
        fontSize: 14,
        marginBottom: 2
    },
    listTextDark: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        color: 'white',
        marginBottom: 2
    },
    instructions: {
        marginBottom: 5,
        fontSize: 16,
        fontFamily: 'Inter-Medium',
    },
    instructionsDark: {
        marginBottom: 5,
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: 'white'
    },
    welcome: {
        fontSize: 20,
        marginVertical: 15,
        fontFamily: 'Inter-Bold',
        letterSpacing: 2,
        alignSelf: 'center',
        color: '#2F2D51'

    },
    welcomeDark: {
        marginVertical: 15,
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        alignSelf: 'center',
        letterSpacing: 2,
        color: 'white'
    },
    imgContainer: {
        backgroundColor: 'white',
        height: 180,
        width: 180,
        borderRadius: 100,
        marginVertical: 15,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width: 250,
        height: 250,
    },
    button: {
        marginTop: 30,
        width: 160,
        backgroundColor: '#2f2d51',
        padding: 15,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDark: {
        marginTop: 30,
        width: 160,
        backgroundColor: '#A5C9FF',
        padding: 15,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
})