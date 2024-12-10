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
  Alert,
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

import { CHECKLIST_SCREEN, FOLDER_SCREEN, HOME_SCREEN } from "../routes";
import { Container, HeaderView } from "../styles/appStyles";
import { ActualTheme, Prayer } from "../types/reduxTypes";
import { cn } from "@lib/utils";
import { incrementReviewCounter } from "@redux/remindersReducer";

const PrayerRoom = () => {
  const navigation = useNavigation();
  const prayers = useSelector(
    (state: { prayer: { prayer: Prayer[] } }) => state.prayer.prayer,
  );

  const unarchivedPrayers = prayers.filter(
    (prayer) => prayer.status !== "Archived",
  );

  const reviewCounter = useSelector(
    (state: any) => state.reminder.reviewCounter,
  );

  const [isPraying, setIsPraying] = useState(false);

  const router = useRouter();

  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );

  const FIXED_QUESTION = {
    title: "Who is on your heart to pray for today?",
  };

  const allQuestions = [
    {
      title: "What are you thankful for today?",
      verses: [
        'Psalm 118:24 "This is the day which the Lord hath made; we will rejoice and be glad in it."',
        'Psalm 107:1 "O give thanks unto the Lord, for he is good: for his mercy endureth for ever."',
        'Ephesians 5:20 "Giving thanks always for all things unto God and the Father in the name of our Lord Jesus Christ."',
      ],
    },
    {
      title: "Who is on your heart to pray for today?",
      verses: [
        'James 5:16 "Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much."',
        'Philippians 1:3-4 "I thank my God upon every remembrance of you, Always in every prayer of mine for you all making request with joy."',
        'Ephesians 6:18 "Praying always with all prayer and supplication in the Spirit, and watching thereunto with all perseverance and supplication for all saints."',
      ],
    },
    {
      title: "How can you grow closer to God today?",
      verses: [
        'Psalm 119:11 "Thy word have I hid in mine heart, that I might not sin against thee."',
        'James 4:8 "Draw nigh to God, and he will draw nigh to you. Cleanse your hands, ye sinners; and purify your hearts, ye double minded."',
        'Jeremiah 29:13 "And ye shall seek me, and find me, when ye shall search for me with all your heart."',
      ],
    },
    {
      title: "What promise of God brings you peace today?",
      verses: [
        'Isaiah 26:3 "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee."',
        'John 14:27 "Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid."',
        'Philippians 4:6-7 "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus."',
      ],
    },
    {
      title: "What is a way you can show love to others today?",
      verses: [
        'John 13:34-35 "A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another. By this shall all men know that ye are my disciples, if ye have love one to another."',
        'Galatians 5:13 "For, brethren, ye have been called unto liberty; only use not liberty for an occasion to the flesh, but by love serve one another."',
        '1 John 4:19-20 "We love him, because he first loved us. If a man say, I love God, and hateth his brother, he is a liar: for he that loveth not his brother whom he hath seen, how can he love God whom he hath not seen?"',
      ],
    },
    {
      title: "What challenges or worries would you like to surrender to God?",
      verses: [
        '1 Peter 5:7 "Casting all your care upon him; for he careth for you."',
        'Psalm 34:4 "I sought the Lord, and he heard me, and delivered me from all my fears."',
        'Matthew 11:28-30 "Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light."',
      ],
    },
    {
      title: "What is a blessing in your life that reminds you of God's love?",
      verses: [
        'John 3:16 "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."',
        'Romans 5:8 "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us."',
        'Psalm 103:11 "For as the heaven is high above the earth, so great is his mercy toward them that fear him."',
      ],
    },
    {
      title: "What step can you take today to live out your faith?",
      verses: [
        'Micah 6:8 "He hath shewed thee, O man, what is good; and what doth the Lord require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?"',
        'Matthew 5:16 "Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."',
        'Colossians 3:23 "And whatsoever ye do, do it heartily, as to the Lord, and not unto men."',
      ],
    },
    {
      title: "How has God been faithful to you recently?",
      verses: [
        "Lamentations 3:22-23 \"It is of the Lord's mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.",
        'Deuteronomy 7:9 "Know therefore that the Lord thy God, he is God, the faithful God, which keepeth covenant and mercy with them that love him and keep his commandments to a thousand generations."',
        'Psalm 36:5 "Thy mercy, O Lord, is in the heavens; and thy faithfulness reacheth unto the clouds."',
      ],
    },
    {
      title: "What is something you hope for or seek guidance on?",
      verses: [
        'James 1:5 "If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him."',
        'Proverbs 3:5-6 "Trust in the Lord with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths."',
        'Romans 8:24-25 "For we are saved by hope: but hope that is seen is not hope: for what a man seeth, why doth he yet hope for? But if we hope for that we see not, then do we with patience wait for it."',
      ],
    },
    {
      title:
        "Thank you for using our app to spend time with God. We pray this time strengthens your faith and guides your day with His grace.",
    },
  ];

  const routeParams = useLocalSearchParams();

  const { colorScheme } = useColorScheme();
  // const pulse = useSharedValue(0);
  const pressFadeIn = useSharedValue(0);

  const [step, setStep] = useState(0);
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isEndingPrayer, setIsEndingPrayer] = useState(false);
  const [saying, setSaying] = useState("");
  const dispatch = useDispatch();

  const sayings = [
    "When you seek God, He meets you where you are.",
    "The closer you get to God, the closer He gets to you.",
    "Move your heart toward God, and He will move His grace toward you.",
    "Lean into God, and He will embrace you with His presence.",
    "Take a step toward God, and He’ll take a step toward you.",
    "Open your heart to God, and He will open His blessings to you.",
    "Focus your mind on God, and He will fill it with His truth.",
    "Quiet your soul before God, and He will speak to your heart.",
    "Rest in God’s presence, and you will find His peace.",
    "Seek God with all your heart, and you will find His love.",
  ];

  const getTodayDate = () => {
    // Format date as YYYY-MM-DD to represent a unique day
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    pressFadeIn.value = withDelay(
      12000,
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

  async function beginPrayer() {
    await playSound();
  }

  function nextStep() {
    if (step === 3) {
      return;
    }
    setStep((prev) => prev + 1);
  }

  async function endPrayer() {
    dispatch(incrementReviewCounter());
    console.log("prayer ended!");
    // setStep(0);
    setIsEndingPrayer(true);
    pauseSound();
    router.back();
  }
  async function playSound() {
    const AbPad =
      "https://cdn.glitch.me/5ade1166-b0a6-48ca-8864-e523ce61e8f5/Ab.mp3?v=1732569256519";
    const DPad =
      "https://cdn.glitch.me/5ade1166-b0a6-48ca-8864-e523ce61e8f5/D.mp3?v=1732648293920";
    const GPad =
      "https://cdn.glitch.me/5ade1166-b0a6-48ca-8864-e523ce61e8f5/G.mp3?v=1732648318412";

    const pads = [AbPad, DPad, GPad];

    const randomIndex = Math.floor(Math.random() * pads.length);

    // Pick a random pad from the pads array
    const randomPad = pads[randomIndex];
    setIsPlayingSound(true);
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: randomPad,
      },
      { shouldPlay: true, volume: 0.5 },
    );
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    setSound(sound);

    // // await sound.loadAsync(soundFile);
    // await sound.playAsync();
  }

  async function pauseSound() {
    setIsPlayingSound(false);
    await sound?.pauseAsync();
    await sound?.unloadAsync();
  }

  async function checkSound() {
    if (isPlayingSound) {
      setIsPlayingSound(false);
      await sound?.pauseAsync();
    } else {
      setIsPlayingSound(true);
      await sound?.playAsync();
    }
  }

  function handleCreateFolder() {
    dispatch(
      addFolder({
        id: uuid.v4(),
        name: "Folder",
        prayers: [],
      }),
    );
    setIsEndingPrayer(true);
    pauseSound();
    router.push("folder");
  }

  const animatedPressFadeInStyle = useAnimatedStyle(() => ({
    opacity: pressFadeIn.value * 1,
  }));

  return (
    <SafeAreaView
      // style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background p-0 relative flex-1"
    >
      <Pressable
        onPress={
          isPlayingSound && step !== 3
            ? nextStep
            : isPlayingSound && step === 3
              ? endPrayer
              : beginPrayer
        }
        className="flex-1 px-4"
      >
        <AnimatedBackground />
        <HeaderView>
          <Link
            asChild
            href={
              routeParams?.previousScreen
                ? `/${HOME_SCREEN}`
                : `/${FOLDER_SCREEN}`
            }
          >
            <TouchableOpacity onPress={pauseSound}>
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
        <PrayerPreparation
          handleCreateFolder={handleCreateFolder}
          unarchivedPrayers={unarchivedPrayers}
          allQuestions={allQuestions}
          step={step}
          isPlayingSound={isPlayingSound}
          isEndingPrayer={isEndingPrayer}
          saying={saying}
        />
        <Animated.Text
          // onPress={playSound}
          style={animatedPressFadeInStyle}
          className="text-center font-inter-medium text-light-primary dark:text-dark-primary text-base mb-10"
        >
          Tap the screen to{" "}
          {isPlayingSound && step !== 3
            ? "continue"
            : isPlayingSound && step === 3
              ? "end"
              : "begin"}
          .
        </Animated.Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default PrayerRoom;

function PrayerPreparation({
  handleCreateFolder,
  unarchivedPrayers,
  allQuestions,
  step,
  isPlayingSound,
  isEndingPrayer,
  saying,
}: {
  handleCreateFolder: () => void;
  unarchivedPrayers: Prayer[];
  allQuestions: { title: string; verses?: string[] }[];
  step: number;
  isPlayingSound: boolean;
  isEndingPrayer: boolean;
  saying: string;
}) {
  const welcomeFadeIn = useSharedValue(0);
  const sayingFadeIn = useSharedValue(0);
  const promptFadeIn = useSharedValue(0);
  const momentFadeIn = useSharedValue(0);
  const titleFadeIn = useSharedValue(0);
  const thanksFadeIn = useSharedValue(0);
  const hoverTranslateY = useSharedValue(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  function getRandomPrayers(prayersArray: Prayer[], count: number) {
    // Shuffle the array
    const shuffled = [...prayersArray].sort(() => 0.5 - Math.random());
    // Get the first 'count' elements
    return shuffled.slice(0, count);
  }

  function getRandomQuestions(
    arr: { title: string; verses?: string[] }[],
    num: number,
  ) {
    const fixedQuestion = {
      title: "Who is on your heart to pray for today?",
      verses: [],
    };

    const fixedLastQuestion = {
      title:
        "Thank you for using our app to spend time with God. We pray this time strengthens your faith and guides your day with His grace.",
      verses: [],
    };

    const arrayCopy = arr.filter(
      (q) =>
        q.title !== fixedQuestion.title && q.title !== fixedLastQuestion.title,
    );

    // Shuffle the array
    for (let i = arrayCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
    }

    // Ensure unique random questions
    const randomQuestions = [
      arrayCopy[0], // First random question
      fixedQuestion, // Fixed second question
      arrayCopy[1], // Second random question, different from the first
      fixedLastQuestion, // Fixed last question
    ];

    return randomQuestions;
  }

  const randomQuestions = getRandomQuestions(allQuestions, 4);

  useEffect(() => {
    if (isPlayingSound) {
      // Fade out previous texts
      welcomeFadeIn.value = withTiming(0, {
        duration: 2000,
        easing: Easing.ease,
      });

      sayingFadeIn.value = withTiming(0, {
        duration: 2000,
        easing: Easing.ease,
      });

      promptFadeIn.value = withTiming(0, {
        duration: 2000,
        easing: Easing.ease,
      });
      momentFadeIn.value = withTiming(0, {
        duration: 2000,
        easing: Easing.ease,
      });

      // Fade in thankful text after previous texts have faded out
      titleFadeIn.value = withDelay(
        2000, // Delay to ensure previous texts have faded out
        withTiming(1, {
          duration: 3000,
          easing: Easing.ease,
        }),
      );
      thanksFadeIn.value = withDelay(
        6000, // Delay to ensure previous texts have faded out
        withTiming(1, {
          duration: 3000,
          easing: Easing.ease,
        }),
      );
    }
  }, [isPlayingSound]);

  const randomPrayers = getRandomPrayers(unarchivedPrayers, 4);

  useEffect(() => {
    // Initial fade-in sequence for the previous texts
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
      8000,
      withTiming(1, {
        duration: 3000,
        easing: Easing.ease,
      }),
    );

    // Start the hover animation
    hoverTranslateY.value = withRepeat(
      withTiming(10, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
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

  const titleFadeInStyle = useAnimatedStyle(() => ({
    opacity: titleFadeIn.value * 1,
  }));
  const thanksFadeInStyle = useAnimatedStyle(() => ({
    opacity: thanksFadeIn.value * 1,
  }));

  const hoverStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hoverTranslateY.value }],
  }));

  return (
    <View className="flex-1 justify-start items-start mt-10">
      <View className="absolute w-full top-0 left-0 self-start h-full flex-1 justify-start gap-3 right-0 items-start">
        <Animated.Text
          style={titleFadeInStyle}
          className="font-inter-semibold mb-5 text-3xl text-light-primary dark:text-dark-primary"
        >
          {randomQuestions[step].title}
        </Animated.Text>
        {step === 1 && (
          <>
            {randomPrayers.length === 0 ? (
              <AnimatedTouchable
                onPress={handleCreateFolder}
                style={[thanksFadeInStyle, hoverStyle]}
                className={cn(
                  " bg-light-secondary/50 dark:bg-[#292929] w-3/4 p-2 rounded-lg",
                )}
              >
                <Animated.Text
                  style={thanksFadeInStyle}
                  className="font-inter-medium text-base text-light-primary dark:text-dark-primary"
                >
                  You haven't added any prayers.
                </Animated.Text>
                <Animated.Text
                  style={thanksFadeInStyle}
                  className="font-inter-regular text-sm mt-2 text-light-primary dark:text-dark-primary"
                >
                  Click here to create a folder so that you can add prayers to
                  it.
                </Animated.Text>
              </AnimatedTouchable>
            ) : (
              <>
                {randomPrayers?.map((prayer, idx) => (
                  <Animated.View
                    key={prayer.id}
                    style={[thanksFadeInStyle, hoverStyle]}
                    className={cn(
                      " bg-light-secondary/50 dark:bg-[#292929] w-fit p-2 rounded-lg",
                      idx % 2 && "ml-auto",
                    )}
                  >
                    <Animated.Text
                      style={thanksFadeInStyle}
                      className="font-inter-regular text-base text-light-primary dark:text-dark-primary"
                    >
                      {prayer.prayer}
                    </Animated.Text>
                    <Animated.Text
                      style={thanksFadeInStyle}
                      className="font-inter-regular text-base text-light-primary dark:text-dark-primary"
                    >
                      {prayer?.verse}
                    </Animated.Text>
                  </Animated.View>
                ))}
              </>
            )}
            {/* <Animated.View
              style={[thanksFadeInStyle, hoverStyle]}
              className="ml-auto bg-light-secondary/50 dark:bg-[#292929] w-3/4 p-2 rounded-lg"
            >
              <Animated.Text
                style={thanksFadeInStyle}
                className="font-inter-regular text-base text-light-primary dark:text-dark-primary"
              >
                {questions[step].verses[1]}
              </Animated.Text>
            </Animated.View> */}
            {/* 
            <Animated.View
              style={[thanksFadeInStyle, hoverStyle]}
              className=" bg-light-secondary/50 dark:bg-[#292929] w-3/4 p-2 rounded-lg"
            >
              <Animated.Text
                style={thanksFadeInStyle}
                className="font-inter-regular text-base text-light-primary dark:text-dark-primary"
              >
                {questions[step].verses[2]}
              </Animated.Text>
            </Animated.View> */}
          </>
        )}
        {randomQuestions[step].verses &&
          randomQuestions[step]?.verses?.length > 0 && (
            <>
              <Animated.View
                style={[thanksFadeInStyle, hoverStyle]}
                className=" bg-light-secondary/50 dark:bg-[#292929] w-3/4 p-2 rounded-lg"
              >
                <Animated.Text
                  style={thanksFadeInStyle}
                  className="font-inter-regular text-base text-light-primary dark:text-dark-primary"
                >
                  {randomQuestions[step].verses[0]}
                </Animated.Text>
              </Animated.View>
              <Animated.View
                style={[thanksFadeInStyle, hoverStyle]}
                className="ml-auto bg-light-secondary/50 dark:bg-[#292929] w-3/4 p-2 rounded-lg"
              >
                <Animated.Text
                  style={thanksFadeInStyle}
                  className="font-inter-regular text-base text-light-primary dark:text-dark-primary"
                >
                  {randomQuestions[step].verses[1]}
                </Animated.Text>
              </Animated.View>

              <Animated.View
                style={[thanksFadeInStyle, hoverStyle]}
                className=" bg-light-secondary/50 dark:bg-[#292929] w-3/4 p-2 rounded-lg"
              >
                <Animated.Text
                  style={thanksFadeInStyle}
                  className="font-inter-regular text-base text-light-primary dark:text-dark-primary"
                >
                  {randomQuestions[step].verses[2]}
                </Animated.Text>
              </Animated.View>
            </>
          )}
      </View>
      <View className="items-start w-4/5 gap-3">
        <Animated.Text
          style={animatedWelcomeFadeInStyle}
          className="font-inter-regular text-sm text-light-primary dark:text-dark-primary"
        >
          Welcome
        </Animated.Text>
        <Animated.Text
          style={animatedSayingFadeInStyle}
          className="italic text-light-primary dark:text-dark-primary text-xl"
        >
          {saying}
        </Animated.Text>

        <Animated.Text
          style={animatedMomentFadeInStyle}
          className="font-inter-medium mt-5 text-light-primary dark:text-dark-primary text-2xl"
        >
          Have a moment to quiet your mind and prepare to connect with God.
        </Animated.Text>
      </View>
    </View>
  );
}

function AnimatedBackground() {
  const { height } = useWindowDimensions();
  const isFocused = useIsFocused();
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
  }, [isFocused]);

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
