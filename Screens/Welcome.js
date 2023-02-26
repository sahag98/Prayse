import React, { useRef, useEffect } from 'react'
import { Dimensions, Platform, Linking, View, Text, StyleSheet, TouchableOpacity, Image, Animated } from "react-native"
import prayer from '../assets/prayer-nobg.png'
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font'
import Unorderedlist from 'react-native-unordered-list';
import AppLoading from 'expo-app-loading';
import Svg, { Path } from 'react-native-svg';
import { useSelector } from 'react-redux';

export default function Welcome({ navigation }) {
    const theme = useSelector(state => state.user.theme)

    const fadeAnim = useRef(new Animated.Value(0)).current


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

        <View style={theme == 'dark' ? styles.containerDark : styles.container}>

            <Text style={theme == 'dark' ? styles.welcomeDark : styles.welcome}>Welcome to the prayer app.</Text>

            <View style={styles.imgContainer}>
                <Image
                    style={styles.img}
                    source={prayer}
                />
            </View>
            <View style={styles.wrapper}>
                <Text style={theme == 'dark' ? styles.instructionsDark : styles.instructions}>Instructions:</Text>
                <Unorderedlist
                    color={theme == 'dark' ? 'white' : 'black'}
                    bulletUnicode={0x25E6}
                    style={{ marginLeft: 10 }}
                >
                    <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>To edit a prayer press on it.</Text>
                </Unorderedlist>
                <Unorderedlist
                    color={theme == 'dark' ? 'white' : 'black'}
                    bulletUnicode={0x25E6}
                    style={{ marginLeft: 10 }}
                >
                    <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>
                        To remove a single prayer click on the X button on that prayer.
                    </Text>
                </Unorderedlist>
                <Unorderedlist
                    color={theme == 'dark' ? 'white' : 'black'}
                    bulletUnicode={0x25E6}
                    style={{ marginLeft: 10 }}
                >
                    <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>
                        To remove the whole prayer list click on the X button located at the top right corner of the screen.
                    </Text>
                </Unorderedlist>
                <Unorderedlist
                    color={theme == 'dark' ? 'white' : 'black'}
                    bulletUnicode={0x25E6}
                    style={{ marginLeft: 10, marginBottom: 10 }}
                >
                    <Text style={theme == 'dark' ? styles.listTextDark : styles.listText}>
                        To use dark mode, change the theme of your phone to dark mode, and vice versa.
                    </Text>
                </Unorderedlist>
                <TouchableOpacity
                    style={theme == 'dark' ? styles.buttonDark : styles.button}
                    title='Create a prayer list'
                    onPress={() => navigation.navigate('Main')}
                >
                    <Text style={theme == 'dark' ? styles.startedDark : styles.started}>Get Started</Text>
                    <AntDesign style={{ marginLeft: 7 }} name="rightcircleo" size={22} color={theme == 'dark' ? '#080808' : 'white'} />
                </TouchableOpacity>
            </View>
            <View style={styles.bottom}>
                <View style={theme == 'dark' ? styles.boxDark : styles.box}>
                    <Svg
                        height={180}
                        width={Dimensions.get('screen').width}
                        viewBox="0 0 1440 320"
                        style={styles.bottomWave}
                    >
                        <Path
                            fill={theme == 'dark' ? "#7272FF" : "#2F2D51"}
                            d='M0,160L40,165.3C80,171,160,181,240,160C320,139,400,85,480,74.7C560,64,640,96,720,128C800,160,880,192,960,197.3C1040,203,1120,181,1200,165.3C1280,149,1360,139,1400,133.3L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'
                        />
                    </Svg>
                    {
                        Platform.OS === 'android' &&
                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.sahag98.prayerListApp')}
                        >
                            <View style={theme == "dark" ? styles.linkContainerDark : styles.linkContainer}>
                                <Text
                                    style={{ color: 'white', fontFamily: 'Inter-Medium' }}
                                >
                                    Check for Updates
                                </Text>
                                <Ionicons style={{ paddingLeft: 10 }} name="logo-google-playstore" size={24} color="white" />
                            </View>
                        </TouchableOpacity>


                    }
                    {
                        Platform.OS === 'ios' &&
                        <TouchableOpacity
                            onPress={() => Linking.openURL('https://apps.apple.com/us/app/prayerlist-app/id6443480347')}
                        >
                            <View style={theme == "dark" ? styles.linkContainerDark : styles.linkContainer}>
                                <Text
                                    style={{ color: 'white', fontFamily: 'Inter-Medium' }}
                                >
                                    Check for Updates
                                    <AntDesign style={{ paddingLeft: 10 }} name="apple1" size={24} color="white" />
                                </Text>
                            </View>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View >
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
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    listText: {
        fontFamily: 'Inter-Light',
        fontSize: 12.8,
        maxWidth: '90%',

    },
    listTextDark: {
        fontFamily: 'Inter-Light',
        fontSize: 12.8,
        maxWidth: '90%',
        color: 'white'
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
        fontFamily: 'Inter-Bold',
        letterSpacing: 2,
        color: '#2F2D51'

    },
    welcomeDark: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        letterSpacing: 2,
        color: 'white'
    },
    imgContainer: {
        backgroundColor: 'white',
        borderRadius: 130,
        marginVertical: 20,
        justifyContent: 'center',
    },
    img: {
        width: 250,
        height: 250,
    },
    button: {
        marginVertical: 10,
        backgroundColor: '#2F2D51',
        padding: 15,
        width: 170,
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999

    },
    buttonDark: {
        marginVertical: 20,
        backgroundColor: '#7272FF',
        padding: 15,
        width: 170,
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999
    },
    bottom: {
        position: 'absolute',
        width: Dimensions.get('screen').width,
        bottom: 0,
    },
    bottomWave: {
        position: 'absolute',
        bottom: -10
    },
    box: {
        backgroundColor: '#2F2D51',
        height: 70,
    },
    boxDark: {
        backgroundColor: '#7272FF',
        height: 70,
    },
    started: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Inter-Medium'
    },
    startedDark: {
        color: '#080808',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Inter-Medium'
    },
    linkContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#3c3a59',
        alignSelf: 'center',
        color: 'white',
        zIndex: 99
    },
    linkContainerDark: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        backgroundColor: '#2F2D51',
        alignSelf: 'center',
        zIndex: 99
    },

})