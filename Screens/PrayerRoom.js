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
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
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
import OrganicA from "../assets/audio/OrganicA.mp3";
import OrganicB from "../assets/audio/OrganicB.mp3";
import OrganicC from "../assets/audio/OrganicC.mp3";
import OrganicG from "../assets/audio/OrganicG.mp3";
import gradient from "../assets/video/gradient.mp4";
import darkGradient from "../assets/video/dark-gradient.mp4";

import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";
import AnimatedLottieView from "lottie-react-native";
import { useIsFocused } from "@react-navigation/native";
import { Video, ResizeMode, Audio } from "expo-av";
import Constants from "expo-constants";

const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

const PrayerRoom = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const prayers = useSelector((state) => state.prayer.prayer);
  const [screenIndex, setScreenIndex] = useState(0);
  const [hasOnboardingEnded, sethasOnboardingEnded] = useState(false);
  const [isPraying, setIsPraying] = useState(false);
  const data = prayers[screenIndex];

  const pulse = useSharedValue(0);
  const opacityValue = useSharedValue(0);
  const fadeIn = useSharedValue(0);
  const prayerFadeIn = useSharedValue(0);
  const momentFadeIn = useSharedValue(0);
  const roomFadeIn = useSharedValue(0);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const isFocused = useIsFocused();
  const [isVideoStarting, setIsVideoStarting] = useState(false);
  const [sound, setSound] = useState();
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const statusBarHeight = Constants.statusBarHeight;
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
    setIsPlayingSound(false);
    await sound.pauseAsync();
    await sound.unloadAsync();
  }

  async function checkSound() {
    if (isPlayingSound) {
      setIsPlayingSound(false);
      await sound.pauseAsync();
    } else {
      setIsPlayingSound(true);
      await sound.playAsync();
    }
  }

  const loadAndPlayRandomAudio = () => {
    console.log("loading...");

    const audioFiles = [
      Gpad,
      OrganicA,
      Bpad,
      OrganicB,
      Cpad,
      OrganicC,
      Ebpad,
      OrganicG,
    ];
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomAudioFile = audioFiles[randomIndex];
    playSound(randomAudioFile);
  };

  async function checkAudioPermission() {
    const { status, granted } = await requestPermission();
  }

  useEffect(() => {
    doFadeInAnimation();
  }, []);

  useEffect(() => {
    checkAudioPermission();

    return sound
      ? () => {
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

  const animatedPrayerFadeInStyle = useAnimatedStyle(() => ({
    opacity: prayerFadeIn.value * 1,
  }));

  const animatedMomentFadeInStyle = useAnimatedStyle(() => ({
    opacity: momentFadeIn.value * 1,
  }));

  const animatedRoomFadeInStyle = useAnimatedStyle(() => ({
    opacity: roomFadeIn.value * 1,
  }));

  const doFadeInAnimation = () => {
    fadeIn.value = withTiming(1, {
      duration: 2000,
      easing: Easing.ease,
    });
  };

  const doPrayerFadeIn = () => {
    console.log("doing fade In");
    prayerFadeIn.value = withDelay(
      3000,
      withTiming(1, {
        duration: 4000,
        easing: Easing.ease,
      })
    );
  };

  const doRoomFadeIn = () => {
    console.log("doing fade In");
    roomFadeIn.value = withTiming(1, {
      duration: 3000,
      easing: Easing.ease,
    });
  };

  const doMomentFadeIn = () => {
    console.log("doing fade In");
    momentFadeIn.value = withSequence(
      withTiming(1, {
        duration: 4000,
        easing: Easing.ease,
      }),
      withDelay(
        2000,
        withTiming(0, {
          duration: 3000,
          easing: Easing.ease,
        })
      )
    );
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  async function loadVideo() {
    console.log("loading video in...");
    // await video.current.loadAsync(gradient);
    await video.current.playAsync();

    setIsVideoStarting(true);
  }

  useEffect(() => {
    if (isPraying) {
      // pulse.value = withRepeat(
      //   withSequence(
      //     withTiming(1.1, { duration: 3000, easing: Easing.ease }),
      //     // withTiming(0.8, { duration: 2000, easing: Easing.ease }),
      //     withTiming(0.9, { duration: 3000, easing: Easing.ease }),
      //     withTiming(1.1, { duration: 3000, easing: Easing.ease })
      //     // withTiming(0, { duration: 2000, easing: Easing.in })
      //   ),
      //   1,
      //   true
      // );
      opacityValue.value = withSequence(
        withDelay(
          9000,
          withTiming(1, {
            duration: 2000,
            easing: Easing.ease,
          })
        ),
        withDelay(
          5000,
          withTiming(0, {
            duration: 2000,
            easing: Easing.ease,
          })
        )
      );
      loadVideo();
      doRoomFadeIn();
      doMomentFadeIn();
      doPrayerFadeIn();
    }
  }, [isPraying, isFocused]);

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
    navigation.navigate("Checklist");
    setIsPraying(false);
    pauseSound();
    // router.push("/");
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack)
  );

  if (prayers.length == 0) {
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
                // alignItems: "center",
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
              if (sound) {
                pauseSound();
              }
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
            style={{
              fontFamily: "Inter-Bold",
              fontSize: 20,
              color: theme == "dark" ? "white" : "#2f2d51",
            }}
          >
            Prayer Room
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
          }}
        >
          <FontAwesome5
            name="list-alt"
            size={50}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Medium",
            }}
          >
            No prayers added yet!
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <View
      style={
        theme == "dark"
          ? {
              backgroundColor: "#121212",
              padding: 0,
              paddingBottom: 0,
              flex: 1,
              // justifyContent: "center",
              // alignItems: "center",
            }
          : {
              backgroundColor: "#F2F7FF",
              padding: 0,
              paddingBottom: 0,
              flex: 1,
              // justifyContent: "center",
              alignItems: "center",
            }
      }
    >
      {isPraying ? (
        <Animated.View
          style={[
            { flex: 1, backgroundColor: "#f2f7ff", width: "100%" },
            animatedRoomFadeInStyle,
          ]}
        >
          <Video
            ref={video}
            style={styles.video}
            source={theme == "dark" ? darkGradient : darkGradient}
            useNativeControls={false}
            resizeMode={ResizeMode.COVER}
            isLooping={true}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          >
            <StatusBar hidden />
            <View style={{ flex: 1, paddingTop: statusBarHeight, zIndex: 88 }}>
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
                    if (sound) {
                      pauseSound();
                    }
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
                  style={{
                    fontFamily: "Inter-Bold",
                    fontSize: 20,
                    color: theme == "dark" ? "white" : "#2f2d51",
                  }}
                >
                  Prayer Room
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
              <TouchableOpacity
                onPress={checkSound}
                style={{
                  alignSelf: "flex-end",
                  marginTop: 10,
                  backgroundColor: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                  padding: 15,
                  marginRight: 15,
                  borderRadius: 100,
                }}
              >
                <Feather
                  name={isPlayingSound ? "volume-2" : "volume-x"}
                  size={24}
                  color={theme == "dark" ? "#121212" : "white"}
                />
              </TouchableOpacity>
              <GestureDetector gesture={swipes}>
                <View style={styles.pageContent} key={screenIndex}>
                  <Animated.Text
                    style={
                      theme == "dark"
                        ? [
                            styles.title,
                            { color: "white", fontFamily: "Inter-Bold" },
                            animatedMomentFadeInStyle,
                          ]
                        : [
                            styles.title,
                            { fontFamily: "Inter-Bold" },
                            animatedMomentFadeInStyle,
                          ]
                    }
                  >
                    Take a moment and Pray
                  </Animated.Text>
                  <View>
                    {/* <Animated.Text
                    style={
                      theme == "dark"
                        ? [styles.title, { color: "white" }]
                        : [styles.title, animatedPrayerFadeInStyle]
                    }
                  >
                    Have a moment and Pray
                  </Animated.Text> */}
                    <Animated.Text
                      entering={SlideInRight}
                      exiting={SlideOutLeft}
                      style={
                        theme == "dark"
                          ? [
                              styles.description,
                              { color: "white" },
                              animatedPrayerFadeInStyle,
                            ]
                          : [styles.description, animatedPrayerFadeInStyle]
                      }
                    >
                      Added on {data.date.split(",")[0]}
                    </Animated.Text>
                    <Animated.Text
                      entering={SlideInRight}
                      exiting={SlideOutLeft}
                      style={
                        theme == "dark"
                          ? [
                              styles.title,
                              { color: "white" },
                              animatedPrayerFadeInStyle,
                            ]
                          : [styles.title, animatedPrayerFadeInStyle]
                      }
                    >
                      {data.prayer}
                    </Animated.Text>
                  </View>
                  <Animated.Text
                    style={[
                      styles.swipeText,
                      theme == "dark" && { color: "white" },
                      // animatedStyle,
                      animatedOpacityStyle,
                    ]}
                  >
                    Swipe right to go to the next prayer.
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
                    onPress={async () => {
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
            </View>
          </Video>
        </Animated.View>
      ) : (
        <View
          style={{
            flex: 1,
            width: "100%",

            paddingTop: statusBarHeight,
          }}
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
                if (sound) {
                  pauseSound();
                }

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
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 20,
                color: theme == "dark" ? "white" : "#2f2d51",
              }}
            >
              Prayer Room
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
                style={[
                  styles.swipeText,
                  theme == "dark" && { color: "white" },
                  // animatedStyle,
                  animatedOpacityStyle,
                ]}
              >
                Swipe right to go to the next prayer.
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
                    backgroundColor: theme == "dark" ? "#212121" : "#2f2d51",
                    borderWidth: theme == "dark" ? 1 : 0,
                    borderColor: "#a5c9ff",
                    padding: 15,
                    borderRadius: 100,
                  },
                  animatedFadeInStyle,
                ]}
              >
                <MaterialCommunityIcons
                  name="hands-pray"
                  size={55}
                  color={theme == "dark" ? "#a5c9ff" : "#b7d3ff"}
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
        </View>
      )}
    </View>
  );
};

export default PrayerRoom;

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
    marginBottom: 50,
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
  video: {
    alignSelf: "center",
    flex: 1,
    zIndex: 10,
    width: "100%",
    height: "100%",
  },
});
