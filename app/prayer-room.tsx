//@ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import { Audio, ResizeMode, Video } from "expo-av";
import Constants from "expo-constants";
import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import AnimatedLottieView from "lottie-react-native";
import { useColorScheme } from "nativewind";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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
  withRepeat,
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

// import Ebpad from "../assets/audio/Epbad.mp3";
// import OrganicG from "../assets/audio/OrganicG.mp3";

import { CHECKLIST_SCREEN, FOLDER_SCREEN } from "../routes";
import { Container, HeaderView } from "../styles/appStyles";
import { ActualTheme, Prayer } from "../types/reduxTypes";

const PrayerRoom = () => {
  const navigation = useNavigation();
  const prayers = useSelector(
    (state: { prayer: { prayer: Prayer[] } }) => state.prayer.prayer,
  );

  const UnarchivedPrayers = prayers.filter(
    (prayer) => prayer.status !== "Archived",
  );
  const folders = useSelector((state: any) => state.folder.folders);
  const [screenIndex, setScreenIndex] = useState(0);

  const [isPraying, setIsPraying] = useState(false);

  const router = useRouter();

  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
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
  const beginScale = useSharedValue(1);
  const [sound, setSound] = useState();
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [saying, setSaying] = useState("");
  const dispatch = useDispatch();

  const sayings = [
    "When you seek God, He meets you where you are.",
    "The closer you get to God, the closer He gets to you.",
    "Move your heart toward God, and He will move His grace toward you.",
    "Lean into God, and He will embrace you with His presence.",
    "Take a step toward God, and He’ll take a step toward you.",
    "Open your heart to God, and He will open His blessings to you.",
  ];

  const getTodayDate = () => {
    // Format date as YYYY-MM-DD to represent a unique day
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    pressFadeIn.value = withDelay(
      14000,
      withTiming(1, { duration: 3000, easing: Easing.ease }),
    );
    const fetchSaying = async () => {
      try {
        // Get the saved date and saying from AsyncStorage
        const savedDate = await AsyncStorage.getItem("sayingDate");
        const savedSaying = await AsyncStorage.getItem("dailySaying");
        const todayDate = getTodayDate();

        if (savedDate === todayDate && savedSaying) {
          // If the date matches today, use the saved saying
          setSaying(savedSaying);
        } else {
          // If the date doesn't match, choose a new saying
          const randomIndex = Math.floor(Math.random() * sayings.length);
          const newSaying = sayings[randomIndex];

          // Save the new saying and date in AsyncStorage
          await AsyncStorage.setItem("sayingDate", todayDate);
          await AsyncStorage.setItem("dailySaying", newSaying);

          setSaying(newSaying);
        }
      } catch (error) {
        console.error("Error fetching saying:", error);
      }
    };

    fetchSaying();
  }, []);

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
    // doPressFadeInAnimation();
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

  const animatedBeginScaleInStyle = useAnimatedStyle(() => ({
    transform: [{ scale: beginScale.value * 1 }],
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

  // useEffect(() => {
  //   if (isPraying) {
  //     opacityValue.value = withSequence(
  //       withDelay(
  //         9000,
  //         withTiming(1, {
  //           duration: 2000,
  //           easing: Easing.ease,
  //         })
  //       ),
  //       withDelay(
  //         5000,
  //         withTiming(0.5, {
  //           duration: 2000,
  //           easing: Easing.ease,
  //         })
  //       )
  //     );
  //     loadVideo();
  //     doRoomFadeIn();
  //     doMomentFadeIn();
  //     doPrayerFadeIn();
  //   }
  // }, [isPraying, isFocused]);

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

  return (
    <SafeAreaView
      // style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background p-0 relative flex-1"
    >
      <Pressable onPress={() => setIsPraying(true)} className="flex-1 px-4">
        <AnimatedBackground />
        <HeaderView>
          <Link asChild href={`/${FOLDER_SCREEN}`}>
            <TouchableOpacity href={`/${FOLDER_SCREEN}`}>
              <Ionicons
                name="chevron-back"
                size={30}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "light"
                      ? "#2f2d51"
                      : "white"
                }
              />
            </TouchableOpacity>
          </Link>
          {isPraying && (
            <TouchableOpacity onPress={checkSound}>
              <Feather
                name={isPlayingSound ? "volume-2" : "volume-x"}
                size={30}
                color={
                  actualTheme && actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>
          )}
        </HeaderView>
        <PrayerPreparation saying={saying} />
        <Animated.Text
          style={animatedPressFadeInStyle}
          className="text-center font-inter-medium text-light-primary dark:text-dark-primary text-lg mb-10"
        >
          Tap the screen to begin.
        </Animated.Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default PrayerRoom;

function PrayerPreparation({ saying }: { saying: string }) {
  const welcomeFadeIn = useSharedValue(0);
  const sayingFadeIn = useSharedValue(0);
  const promptFadeIn = useSharedValue(0);
  const momentFadeIn = useSharedValue(0);

  useEffect(() => {
    welcomeFadeIn.value = withTiming(1, {
      duration: 3000,
      easing: Easing.ease,
    });

    sayingFadeIn.value = withDelay(
      3000,
      withTiming(1, {
        duration: 3000,
        easing: Easing.ease,
      }),
    );

    promptFadeIn.value = withDelay(
      6000,
      withTiming(1, {
        duration: 3000,
        easing: Easing.ease,
      }),
    );
    momentFadeIn.value = withDelay(
      9000,
      withTiming(1, {
        duration: 3000,
        easing: Easing.ease,
      }),
    );
  }, []);

  const animatedSayingFadeInStyle = useAnimatedStyle(() => ({
    opacity: sayingFadeIn.value * 1,
  }));
  const animatedPromptFadeInStyle = useAnimatedStyle(() => ({
    opacity: promptFadeIn.value * 1,
  }));
  const animatedMomentFadeInStyle = useAnimatedStyle(() => ({
    opacity: momentFadeIn.value * 1,
  }));
  const animatedWelcomeFadeInStyle = useAnimatedStyle(() => ({
    opacity: welcomeFadeIn.value * 1,
  }));
  return (
    <View className="gap-5 flex-1 justify-center mt-10">
      <Animated.Text
        style={animatedWelcomeFadeInStyle}
        className="font-inter-medium opacity-0 text-light-primary dark:text-dark-primary"
      >
        Welcome
      </Animated.Text>
      <Animated.Text
        style={animatedSayingFadeInStyle}
        className="font-inter-medium text-light-primary dark:text-dark-primary text-2xl"
      >
        {saying}
      </Animated.Text>
      <Animated.Text
        style={animatedPromptFadeInStyle}
        className="font-inter-medium text-light-primary dark:text-dark-primary mt-10 text-2xl"
      >
        As you go through the following prompts, simply come as you are.
      </Animated.Text>
      <Animated.Text
        style={animatedMomentFadeInStyle}
        className="font-inter-medium text-light-primary dark:text-dark-primary text-2xl"
      >
        Take a moment to quiet your mind and prepare to connect with God.
      </Animated.Text>
    </View>
  );
}

function AnimatedBackground() {
  const { height } = useWindowDimensions();

  const top1 = useSharedValue(0.3 * height);
  const top2 = useSharedValue(0.5 * height);
  const top3 = useSharedValue(0.7 * height);

  useEffect(() => {
    const options = {
      duration: 6000,
      easing: Easing.bezier(0.5, 0, 0.5, 1),
    };
    top1.value = withRepeat(withTiming(0.2 * height, options), -1, true);
    top2.value = withDelay(
      1000,
      withRepeat(withTiming(0.4 * height, options), -1, true),
    );
    top3.value = withDelay(
      2000,
      withRepeat(withTiming(0.6 * height, options), -1, true),
    );
  }, []);

  return (
    <View className="absolute top-0 overflow-hidden bottom-0 left-0 right-0 items-center">
      {/* circles */}
      <Animated.View
        className="absolute w-[400%] aspect-square rounded-full bg-[#e5edf9] dark:bg-[#1a1a1a]"
        style={{ top: top1 }}
      />
      <Animated.View
        className="absolute w-[400%] aspect-square rounded-full bg-[#cde0fc] dark:bg-[#212121]"
        style={{ top: top2 }}
      />
      <Animated.View
        className="absolute w-[400%] aspect-square rounded-full bg-[#b6d3fe] dark:bg-[#262626]"
        style={{ top: top3 }}
      />
    </View>
  );
}
