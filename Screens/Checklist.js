import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Container } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  BounceInRight,
  SlideOutLeft,
  BounceOutLeft,
  SlideInRight,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import Gpad from "../assets/audio/Gpad.mp3";
import Bpad from "../assets/audio/Bpad.mp3";
import Cpad from "../assets/audio/Cpad.mp3";
import Ebpad from "../assets/audio/Ebpad.mp3";

import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import AnimatedLottieView from "lottie-react-native";
import { useIsFocused } from "@react-navigation/native";
import { Video, ResizeMode, Audio } from "expo-av";

const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

const Checklist = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const prayers = useSelector((state) => state.prayer.prayer);
  const [screenIndex, setScreenIndex] = useState(0);
  const [hasOnboardingEnded, sethasOnboardingEnded] = useState(false);
  const [isPraying, setIsPraying] = useState(false);
  const data = prayers[screenIndex];

  const pulse = useSharedValue(1);
  const opacityValue = useSharedValue(1);
  const fadeIn = useSharedValue(0);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const isFocused = useIsFocused();
  const [sound, setSound] = useState();
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function playSound(soundFile) {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    setSound(sound);
    setIsPlayingSound(true);
    // await sound.loadAsync(soundFile);
    await sound.playAsync();
  }

  async function pauseSound() {
    await sound.pauseAsync();
    await sound.unloadAsync();
  }

  const loadAndPlayRandomAudio = () => {
    const audioFiles = [Gpad, Bpad, Cpad, Ebpad];
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomAudioFile = audioFiles[randomIndex];

    console.log(randomAudioFile);
    playSound(randomAudioFile);
  };

  async function checkAudioPermission() {
    const { status, granted } = await requestPermission();
  }

  useEffect(() => {
    doFadeInAnimation();
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 3000, easing: Easing.ease }),
        // withTiming(0.8, { duration: 2000, easing: Easing.ease }),
        withTiming(0.8, { duration: 3000, easing: Easing.ease }),
        withTiming(1.1, { duration: 3000, easing: Easing.ease })
        // withTiming(0, { duration: 2000, easing: Easing.in })
      ),
      2,
      true
    );
    opacityValue.value = withDelay(
      9000,
      withTiming(0, {
        duration: 1500,
        easing: Easing.ease,
      })
    );
  }, []);

  useEffect(() => {
    checkAudioPermission();

    return sound
      ? () => {
          console.log("unloading sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value * 1.08 }],
  }));

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value * 1,
  }));

  const animatedFadeInStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value * 1,
  }));

  const doFadeInAnimation = () => {
    fadeIn.value = withTiming(1, {
      duration: 2000,
      easing: Easing.ease,
    });
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  async function loadVideo() {
    await video.current.loadAsync(gradient);
    await video.current.playAsync();
  }

  // useEffect(() => {
  //   // video.current.playAsync();
  //   // loadAndPlayRandomAudio();
  // }, [isFocused]);

  const onContinue = () => {
    const isLastScreen = screenIndex === prayers.length - 1;
    if (isLastScreen) {
      endChecklist();
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      endChecklist();
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const endChecklist = () => {
    setScreenIndex(0);
    navigation.navigate("Prayer");
    setIsPraying(false);
    pauseSound();
    // router.push("/");
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack)
  );

  return (
    <Container
      style={
        theme == "dark"
          ? {
              backgroundColor: "#121212",
              // justifyContent: "center",
              // alignItems: "center",
            }
          : {
              backgroundColor: "#F2F7FF",
              // justifyContent: "center",
              alignItems: "center",
            }
      }
    >
      <View
        style={{
          flexDirection: "row",

          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => {
            navigation.navigate("Prayer");
            pauseSound();
            setIsPraying(false);
          }}
        >
          <Ionicons
            name="chevron-back"
            size={35}
            color={theme == "light" ? "#2f2d51" : "white"}
          />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#2f2d51" }}
        >
          Prayer Checklist
        </Text>
      </View>
      <View style={styles.stepIndicatorContainer}>
        {prayers.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              {
                backgroundColor:
                  index === screenIndex
                    ? theme == "dark"
                      ? "white"
                      : "#2f2d51"
                    : "#acacac",
              },
            ]}
          />
        ))}
      </View>

      <GestureDetector gesture={swipes}>
        <View style={styles.pageContent} key={screenIndex}>
          <View>
            <Animated.Text
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={
                theme == "dark"
                  ? [styles.description, { color: "white" }]
                  : styles.description
              }
            >
              Added on {data.date.split(",")[0]}
            </Animated.Text>
            <Animated.Text
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={
                theme == "dark"
                  ? [styles.title, { color: "white" }]
                  : styles.title
              }
            >
              {data.prayer}
            </Animated.Text>
          </View>
          <Animated.Text
            style={[styles.swipeText, animatedStyle, animatedOpacityStyle]}
          >
            Swipe right to go to the next prayer
          </Animated.Text>
        </View>
      </GestureDetector>

      <View
        style={{
          position: "absolute",
          flexDirection: "row",

          alignItems: "center",
          justifyContent: isPraying ? "center" : "center",
          bottom: 20,
          width: "100%",
        }}
      >
        {!isPraying ? (
          <AnimatedTouchable
            onPress={() => {
              setIsPraying(true);
              loadAndPlayRandomAudio();
            }}
            style={[
              {
                backgroundColor: "#2f2d51",
                padding: 15,
                borderRadius: 100,
              },
              animatedFadeInStyle,
            ]}
          >
            <MaterialCommunityIcons
              name="hands-pray"
              size={55}
              color="#b7d3ff"
            />
          </AnimatedTouchable>
        ) : (
          <AnimatedLottieView
            speed={0.5}
            source={require("../assets/animations/praying-animation.json")}
            style={styles.animation}
            autoPlay
            resizeMode="none"
          />
        )}
      </View>
      {/* <StatusBar hidden /> */}
    </Container>
  );
};

export default Checklist;

const styles = StyleSheet.create({
  swipeText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#2f2d51",
  },
  animation: {
    width: 130,
    height: 130,
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
  },
  title: {
    color: "#2f2d51",
    fontSize: 22,
    fontFamily: "Inter-Medium",
    letterSpacing: 1.3,
    marginVertical: 5,
  },
  description: {
    color: "#2f2d51",
  },
  footer: {
    // marginTop: "auto",
    width: "100%",
    flex: 1,
  },

  buttonsRow: {
    marginTop: "auto",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 40,
  },
  button: {
    backgroundColor: "#2f2d51",
    borderRadius: 50,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter-Bold",
    padding: 15,
    paddingHorizontal: 25,
  },
  pageContent: {
    padding: 20,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 15,
  },
  stepIndicator: {
    flex: 1,
    height: 3,
    backgroundColor: "gray",
    borderRadius: 10,
  },
});
