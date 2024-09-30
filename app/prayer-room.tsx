// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import { Audio, ResizeMode, Video } from "expo-av";
import Constants from "expo-constants";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AnimatedLottieView from "lottie-react-native";
import { useColorScheme } from "nativewind";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
} from "@lib/customStyles";
import { useIsFocused } from "@react-navigation/native";
import { addFolder } from "@redux/folderReducer";

import Ebpad from "../assets/audio/Ebpad.mp3";
import OrganicG from "../assets/audio/OrganicG.mp3";
import darkGradient from "../assets/video/dark-gradient.mp4";
import gradient from "../assets/video/gradient.mp4";
import { CHECKLIST_SCREEN, FOLDER_SCREEN } from "../routes";
import { Container } from "../styles/appStyles";

const PrayerRoom = () => {
  const navigation = useNavigation();
  const prayers = useSelector((state) => state.prayer.prayer);

  const UnarchivedPrayers = prayers.filter(
    (prayer) => prayer.status !== "Archived",
  );
  const folders = useSelector((state) => state.folder.folders);
  const [screenIndex, setScreenIndex] = useState(0);

  const [isPraying, setIsPraying] = useState(false);

  const router = useRouter();

  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const routeParams = useLocalSearchParams();
  const data = UnarchivedPrayers[screenIndex];
  const { colorScheme } = useColorScheme();
  // const pulse = useSharedValue(0);
  const opacityValue = useSharedValue(0);
  const fadeIn = useSharedValue(0);
  const prayerFadeIn = useSharedValue(0);
  const momentFadeIn = useSharedValue(0);
  const pressFadeIn = useSharedValue(0);
  const roomFadeIn = useSharedValue(0);
  const video = useRef(null);
  const isFocused = useIsFocused();

  const [sound, setSound] = useState();
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const dispatch = useDispatch();

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

    const audioFiles = [Ebpad, OrganicG];
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomAudioFile = audioFiles[randomIndex];
    playSound(randomAudioFile);
  };

  useEffect(() => {
    doFadeInAnimation();
    doPressFadeInAnimation();
  }, []);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const animatedOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value * 1,
  }));

  const animatedFadeInStyle = useAnimatedStyle(() => ({
    opacity: fadeIn.value * 1,
  }));

  const animatedPrayerFadeInStyle = useAnimatedStyle(() => ({
    opacity: prayerFadeIn.value * 1,
  }));

  const animatedPressFadeInStyle = useAnimatedStyle(() => ({
    opacity: pressFadeIn.value * 1,
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

  const doPressFadeInAnimation = () => {
    pressFadeIn.value = withTiming(1, {
      duration: 2000,
      easing: Easing.ease,
    });
  };

  const doPrayerFadeIn = () => {
    prayerFadeIn.value = withDelay(
      3000,
      withTiming(1, {
        duration: 4000,
        easing: Easing.ease,
      }),
    );
  };

  const doRoomFadeIn = () => {
    roomFadeIn.value = withTiming(1, {
      duration: 3000,
      easing: Easing.ease,
    });
  };

  const doMomentFadeIn = () => {
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
        }),
      ),
    );
  };

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  async function loadVideo() {
    // await video.current.loadAsync(gradient);
    await video.current.playAsync();
  }

  useEffect(() => {
    if (isPraying) {
      opacityValue.value = withSequence(
        withDelay(
          9000,
          withTiming(1, {
            duration: 2000,
            easing: Easing.ease,
          }),
        ),
        withDelay(
          5000,
          withTiming(0.5, {
            duration: 2000,
            easing: Easing.ease,
          }),
        ),
      );
      loadVideo();
      doRoomFadeIn();
      doMomentFadeIn();
      doPrayerFadeIn();
    }
  }, [isPraying, isFocused]);

  function handleCreateFolder() {
    dispatch(
      addFolder({
        id: uuid.v4(),
        name: "Folder",
        prayers: [],
      }),
    );
    router.push("folder");
  }

  const onContinue = () => {
    const isLastScreen = screenIndex === UnarchivedPrayers.length - 1;
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
    navigation.navigate(CHECKLIST_SCREEN);
    setIsPraying(false);

    if (sound) {
      pauseSound();
    }

    // router.push("/");
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack),
  );

  if (UnarchivedPrayers?.length === 0) {
    return (
      <Container
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background dark:bg-dark-background"
      >
        <View className="flex-row w-full items-center">
          <TouchableOpacity
            className="mr-3"
            onPress={() => {
              if (routeParams?.previousScreen) {
                console.log("previous screen:");
                navigation.goBack();
              } else {
                navigation.navigate(FOLDER_SCREEN);
              }

              if (sound) {
                pauseSound();
              }
              setIsPraying(false);
              prayerFadeIn.value = 0;
            }}
          >
            <Ionicons
              name="chevron-back"
              size={35}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "light"
                    ? "#2f2d51"
                    : "white"
              }
            />
          </TouchableOpacity>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary"
          >
            Prayer Room
          </Text>
        </View>
        <View className="flex-1 justify-center w-11/12 self-center items-center gap-3">
          <FontAwesome5
            name="list-alt"
            size={60}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
          {folders.length === 0 ? (
            <>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter-medium text-center text-lg text-light-primary dark:text-dark-primary"
              >
                No prayers added yet! Create a prayer folder and add prayers to
                it.
              </Text>
              <TouchableOpacity
                onPress={handleCreateFolder}
                style={getPrimaryBackgroundColorStyle(actualTheme)}
                className="bg-light-primary dark:bg-dark-accent p-4 rounded-lg justify-center items-center"
              >
                <Text
                  style={getPrimaryTextColorStyle(actualTheme)}
                  className="text-light-background dark:text-dark-background font-inter-bold"
                >
                  Create Folder
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-medium text-center text-lg text-light-primary dark:text-dark-primary"
            >
              No prayers added yet! Add prayers to your folders.
            </Text>
          )}
        </View>
      </Container>
    );
  }

  return (
    <View
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background p-0 flex-1"
    >
      {isPraying ? (
        <Animated.View
          className="flex-1 bg-light-background dark:bg-dark-background items-center w-full"
          style={[animatedRoomFadeInStyle]}
        >
          {Platform.OS === "android" ? (
            <>
              <Video
                ref={video}
                style={styles.video}
                source={colorScheme === "dark" ? darkGradient : gradient}
                useNativeControls={false}
                resizeMode={ResizeMode.COVER}
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />
              <StatusBar hidden />
              <View
                className="flex-1 absolute h-full z-20"
                style={{
                  paddingTop: statusBarHeight,
                }}
              >
                <View className="flex-row z-30 w-full items-center">
                  <TouchableOpacity
                    className="mr-3"
                    onPress={() => {
                      console.log(routeParams?.previousScreen);
                      if (routeParams?.previousScreen) {
                        navigation.goBack();
                      } else {
                        navigation.navigate(FOLDER_SCREEN);
                      }

                      if (sound) {
                        pauseSound();
                      }
                      setIsPraying(false);
                    }}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={35}
                      color={
                        actualTheme && actualTheme.MainTxt
                          ? actualTheme.MainTxt
                          : colorScheme === "light"
                            ? "#2f2d51"
                            : "white"
                      }
                    />
                  </TouchableOpacity>
                  <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary">
                    Prayer Room
                  </Text>
                </View>

                <View className="flex-row gap-2 mx-4 mt-2">
                  {UnarchivedPrayers.map((step, index) => (
                    <View
                      key={index}
                      className="flex-1 h-2 bg-gray-400 rounded-lg"
                      style={{
                        backgroundColor:
                          index === screenIndex
                            ? actualTheme && actualTheme.Secondary
                              ? actualTheme.Secondary
                              : colorScheme === "dark"
                                ? "white"
                                : "#2f2d51"
                            : "#acacac",
                      }}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  onPress={checkSound}
                  style={getPrimaryBackgroundColorStyle(actualTheme)}
                  className="self-end mt-3 bg-light-primary dark:bg-dark-accent p-4 mr-4 rounded-full"
                >
                  <Feather
                    name={isPlayingSound ? "volume-2" : "volume-x"}
                    size={30}
                    color={
                      actualTheme && actualTheme.PrimaryTxt
                        ? actualTheme.PrimaryTxt
                        : colorScheme === "dark"
                          ? "#121212"
                          : "white"
                    }
                  />
                </TouchableOpacity>
                <GestureDetector gesture={swipes}>
                  <View
                    className="p-5 mb-16 gap-8 justify-center items-center flex-1"
                    key={screenIndex}
                  >
                    <Animated.Text
                      className="font-inter-semibold text-light-primary dark:text-dark-primary text-3xl z-20 tracking-wide my-2"
                      style={[
                        getMainTextColorStyle(actualTheme),
                        animatedMomentFadeInStyle,
                      ]}
                    >
                      Take a moment and Pray
                    </Animated.Text>
                    <View>
                      <Animated.Text
                        entering={SlideInRight}
                        exiting={SlideOutLeft}
                        className="font-inter-semibold text-2xl text-light-primary dark:text-dark-primary"
                        style={[
                          getMainTextColorStyle(actualTheme),
                          animatedPrayerFadeInStyle,
                        ]}
                      >
                        {data.prayer}
                      </Animated.Text>
                      {data.verse && (
                        <Animated.Text
                          entering={SlideInRight}
                          exiting={SlideOutLeft}
                          className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
                          style={[
                            getMainTextColorStyle(actualTheme),
                            animatedPrayerFadeInStyle,
                          ]}
                        >
                          Verse: {data.verse}
                        </Animated.Text>
                      )}
                    </View>
                    <Animated.Text
                      className="font-inter-medium text-light-primary dark:text-dark-primary"
                      style={[
                        getMainTextColorStyle(actualTheme),
                        animatedOpacityStyle,
                      ]}
                    >
                      {screenIndex === UnarchivedPrayers.length - 1
                        ? "Swipe right to go to checklist"
                        : "Swipe right to go to the next prayer."}
                    </Animated.Text>
                  </View>
                </GestureDetector>
                <View className="absolute flex-row items-center justify-center bottom-5 w-full">
                  {!isPraying ? (
                    <AnimatedTouchable
                      onPress={async () => {
                        setIsPraying(true);

                        loadAndPlayRandomAudio();
                      }}
                      className="bg-light-primary p-4 rounded-full dark:bg-dark-secondary border border-light-secondary dark:border-dark-accent"
                      style={[
                        getPrimaryBackgroundColorStyle(actualTheme),
                        animatedFadeInStyle,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="hands-pray"
                        size={55}
                        color={
                          actualTheme && actualTheme.MainTxt
                            ? actualTheme.MainTxt
                            : acolorScheme === "dark"
                              ? "#a5c9ff"
                              : "#b7d3ff"
                        }
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
            </>
          ) : (
            <Video
              ref={video}
              style={styles.video}
              source={colorScheme === "dark" ? darkGradient : gradient}
              useNativeControls={false}
              resizeMode={ResizeMode.COVER}
              isLooping
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            >
              <StatusBar hidden />
              <View
                className="flex-1 z-20"
                style={{ paddingTop: statusBarHeight }}
              >
                <View className="flex-row z-30 w-full items-center">
                  <TouchableOpacity
                    className="mr-3"
                    onPress={() => {
                      if (routeParams?.previousScreen) {
                        console.log("previous screen:");
                        navigation.goBack();
                      } else {
                        navigation.navigate(FOLDER_SCREEN);
                      }

                      if (sound) {
                        pauseSound();
                      }
                      setIsPraying(false);
                    }}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={35}
                      color={
                        actualTheme && actualTheme.MainTxt
                          ? actualTheme.MainTxt
                          : colorScheme === "light"
                            ? "#2f2d51"
                            : "white"
                      }
                    />
                  </TouchableOpacity>
                  <Text
                    style={getMainTextColorStyle(actualTheme)}
                    className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary"
                  >
                    Prayer Room
                  </Text>
                </View>
                <View className="flex-row gap-2 mx-4 mt-2">
                  {UnarchivedPrayers.map((step, index) => (
                    <View
                      key={index}
                      className="flex-1 h-2 bg-gray-400 rounded-lg"
                      style={{
                        backgroundColor:
                          index === screenIndex
                            ? actualTheme && actualTheme.Secondary
                              ? actualTheme.Secondary
                              : colorScheme === "dark"
                                ? "white"
                                : "#2f2d51"
                            : "#acacac",
                      }}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  onPress={checkSound}
                  style={getPrimaryBackgroundColorStyle(actualTheme)}
                  className="self-end mt-3 bg-light-primary dark:bg-dark-accent p-4 mr-4 rounded-full"
                >
                  <Feather
                    name={isPlayingSound ? "volume-2" : "volume-x"}
                    size={30}
                    color={
                      actualTheme && actualTheme.PrimaryTxt
                        ? actualTheme.PrimaryTxt
                        : colorScheme === "dark"
                          ? "#121212"
                          : "white"
                    }
                  />
                </TouchableOpacity>
                <GestureDetector gesture={swipes}>
                  <View
                    className="p-5 mb-16 gap-8 justify-center items-center flex-1"
                    key={screenIndex}
                  >
                    <Animated.Text
                      className="font-inter-semibold text-light-primary dark:text-dark-primary text-3xl z-20 tracking-wide"
                      style={[
                        getMainTextColorStyle(actualTheme),
                        animatedMomentFadeInStyle,
                      ]}
                    >
                      Take a moment and Pray
                    </Animated.Text>
                    <View>
                      <Animated.Text
                        entering={SlideInRight}
                        exiting={SlideOutLeft}
                        className="font-inter-medium text-2xl text-light-primary dark:text-dark-primary"
                        style={[
                          getMainTextColorStyle(actualTheme),
                          animatedPrayerFadeInStyle,
                        ]}
                      >
                        {data.prayer}
                      </Animated.Text>
                    </View>
                    <Animated.Text
                      className="font-inter-medium text-light-primary dark:text-dark-primary"
                      style={[
                        getMainTextColorStyle(actualTheme),
                        animatedOpacityStyle,
                      ]}
                    >
                      {screenIndex === UnarchivedPrayers.length - 1
                        ? "Swipe right to go to checklist"
                        : "Swipe right to go to the next prayer."}
                    </Animated.Text>
                  </View>
                </GestureDetector>

                <View className="absolute flex-row items-center justify-center bottom-5 w-full">
                  {!isPraying ? (
                    <AnimatedTouchable
                      onPress={async () => {
                        setIsPraying(true);

                        loadAndPlayRandomAudio();
                      }}
                      className="bg-light-primary p-4 rounded-full dark:bg-dark-secondary border border-light-secondary dark:border-dark-accent"
                      style={[
                        getPrimaryBackgroundColorStyle(actualTheme),
                        animatedFadeInStyle,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="hands-pray"
                        size={55}
                        color={
                          actualTheme && actualTheme.MainTxt
                            ? actualTheme.MainTxt
                            : acolorScheme === "dark"
                              ? "#a5c9ff"
                              : "#b7d3ff"
                        }
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
          )}
        </Animated.View>
      ) : (
        <View
          className="w-full flex-1"
          style={{
            paddingTop: statusBarHeight,
          }}
        >
          <View className="flex-row w-full items-center">
            <TouchableOpacity
              className="mr-3"
              onPress={() => {
                if (routeParams?.previousScreen) {
                  navigation.goBack();
                } else {
                  navigation.navigate(FOLDER_SCREEN);
                }
                if (sound) {
                  pauseSound();
                }

                setIsPraying(false);
              }}
            >
              <Ionicons
                name="chevron-back"
                size={35}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "light"
                      ? "#2f2d51"
                      : "white"
                }
              />
            </TouchableOpacity>
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary"
            >
              Prayer Room
            </Text>
          </View>
          <View className="flex-row gap-2 mx-4 mt-2">
            {UnarchivedPrayers.map((step, index) => (
              <View
                key={index}
                className="flex-1 h-2 bg-gray-400 rounded-lg"
                style={{
                  backgroundColor:
                    index === screenIndex
                      ? actualTheme && actualTheme.Primary
                        ? actualTheme.Primary
                        : colorScheme === "dark"
                          ? "white"
                          : "#2f2d51"
                      : "#acacac",
                }}
              />
            ))}
          </View>

          <GestureDetector gesture={swipes}>
            <View
              className="p-5 mb-16 gap-8 justify-center items-center flex-1"
              key={screenIndex}
            >
              <View>
                <Animated.Text
                  entering={SlideInRight}
                  exiting={SlideOutLeft}
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-medium text-2xl text-light-primary dark:text-dark-primary"
                >
                  {data.prayer}
                </Animated.Text>
              </View>
            </View>
          </GestureDetector>

          <View className="absolute flex-row items-center justify-center bottom-5 w-full">
            {!isPraying ? (
              <View className="items-center gap-4">
                <Animated.Text
                  className="font-inter-medium text-light-primary dark:text-dark-primary"
                  style={[
                    getMainTextColorStyle(actualTheme),
                    animatedPressFadeInStyle,
                  ]}
                >
                  Press to start prayer
                </Animated.Text>
                <AnimatedTouchable
                  onPress={() => {
                    setIsPraying(true);

                    loadAndPlayRandomAudio();
                  }}
                  className="p-4 rounded-full bg-light-primary dark:bg-dark-secondary border border-light-secondary dark:border-dark-accent"
                  style={[
                    getPrimaryBackgroundColorStyle(actualTheme),
                    actualTheme && { borderWidth: 0 },
                    animatedFadeInStyle,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="hands-pray"
                    size={55}
                    color={
                      actualTheme && actualTheme.PrimaryTxt
                        ? actualTheme.PrimaryTxt
                        : colorScheme === "dark"
                          ? "#a5c9ff"
                          : "#b7d3ff"
                    }
                  />
                </AnimatedTouchable>
              </View>
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
    fontSize: 13,
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
    fontSize: 24,
    zIndex: 80,
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
    marginBottom: 70,
    gap: 30,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  stepIndicatorContainer: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 15,
    marginTop: 5,
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
