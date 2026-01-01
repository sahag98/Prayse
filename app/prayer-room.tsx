import React, { useCallback, useEffect, useState } from "react";
import { Audio } from "expo-av";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import {
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import { Feather, Ionicons } from "@expo/vector-icons";

import { addFolder } from "@redux/folderReducer";

import { FOLDER_SCREEN, HOME_SCREEN } from "../routes";

import { ActualTheme, Prayer } from "../types/reduxTypes";
import { cn } from "@lib/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import Gpad from "../assets/pads/g.mp3";
import Dpad from "../assets/pads/d.mp3";
import ABpad from "../assets/pads/ab.mp3";
import useStore from "@lib/zustand-store";
import { CheckReview } from "@hooks/useShowReview";

const PrayerRoom = () => {
  const prayers = useSelector(
    (state: { prayer: { prayer: Prayer[] } }) => state.prayer.prayer
  );

  const unarchivedPrayers = prayers.filter(
    (prayer) => prayer.status !== "Archived"
  );

  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [isEndingPrayer, setIsEndingPrayer] = useState(false);
  const [saying, setSaying] = useState("");

  const { reviewRequested, setReviewRequested } = useStore();

  const router = useRouter();
  const dispatch = useDispatch();

  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme
  );

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
      title: "What is one area of your life where you need God's strength?",
      verses: [
        'Philippians 4:13 "I can do all things through Christ which strengtheneth me."',
        'Isaiah 40:31 "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint."',
        '2 Corinthians 12:9 "And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness."',
      ],
    },
    {
      title: "What is a lesson God is teaching you right now?",
      verses: [
        'Proverbs 3:11-12 "My son, despise not the chastening of the Lord; neither be weary of his correction: For whom the Lord loveth he correcteth; even as a father the son in whom he delighteth."',
        'Hebrews 12:11 "Now no chastening for the present seemeth to be joyous, but grievous: nevertheless afterward it yieldeth the peaceable fruit of righteousness unto them which are exercised thereby."',
        'Romans 5:3-4 "And not only so, but we glory in tribulations also: knowing that tribulation worketh patience; And patience, experience; and experience, hope."',
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
      title: "What is something you can surrender to God completely today?",
      verses: [
        'Proverbs 16:3 "Commit thy works unto the Lord, and thy thoughts shall be established."',
        'Matthew 6:33 "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you."',
        'Romans 12:1 "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service."',
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
      title: "How can you reflect God's character in your actions today?",
      verses: [
        'Ephesians 5:1-2 "Be ye therefore followers of God, as dear children; And walk in love, as Christ also hath loved us, and hath given himself for us an offering and a sacrifice to God for a sweetsmelling savour."',
        'Colossians 3:12 "Put on therefore, as the elect of God, holy and beloved, bowels of mercies, kindness, humbleness of mind, meekness, longsuffering."',
        'Matthew 5:48 "Be ye therefore perfect, even as your Father which is in heaven is perfect."',
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
      title: "What is a way you can reflect Jesus' humility today?",
      verses: [
        'Philippians 2:3-4 "Let nothing be done through strife or vainglory; but in lowliness of mind let each esteem other better than themselves. Look not every man on his own things, but every man also on the things of others."',
        'Philippians 2:5-7 "Let this mind be in you, which was also in Christ Jesus: Who, being in the form of God, thought it not robbery to be equal with God: But made himself of no reputation, and took upon him the form of a servant, and was made in the likeness of men."',
        'Matthew 23:12 "And whosoever shall exalt himself shall be abased; and he that shall humble himself shall be exalted."',
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
      title: "Is there something you need to bring before God for forgiveness?",
      verses: [
        '1 John 1:9 "If we confess our sins, He is faithful and just to forgive us our sins and to cleanse us from all unrighteousness."',
        'Psalm 51:10 "Create in me a clean heart, O God, and renew a steadfast spirit within me."',
        'Isaiah 1:18 "Come now, and let us reason together, says the Lord, Though your sins are like scarlet, they shall be as white as snow; though they are red like crimson, they shall be as wool."',
      ],
    },
    {
      title: "What is one way you can serve someone in need today?",
      verses: [
        'Matthew 25:40 "And the King shall answer and say unto them, Verily I say unto you, Inasmuch as ye have done it unto one of the least of these my brethren, ye have done it unto me."',
        'Galatians 6:10 "As we have therefore opportunity, let us do good unto all men, especially unto them who are of the household of faith."',
        'Hebrews 13:16 "But to do good and to communicate forget not: for with such sacrifices God is well pleased."',
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
    // {
    //   title:
    //     "Thank you for using our app to spend time with God. We pray this time strengthens your faith and guides your day with His grace.",
    // },
  ];

  const routeParams = useLocalSearchParams();

  const { colorScheme } = useColorScheme();
  // const pulse = useSharedValue(0);
  const pressFadeIn = useSharedValue(0);

  const [step, setStep] = useState(0);

  const sayings = [
    "When you seek God, He meets you where you are.",
    "God walks with you, even in the valley.",
    "The Lord's mercy is new every morning.",
    "Faith moves mountains when hope anchors the soul.",
    "God is working, even when you can't see it.",
    "Even a mustard seed of faith can change everything.",
    "The closer you get to God, the closer He gets to you.",
    "Move your heart toward God, and He will move His grace toward you.",
    "Lean into God, and He will embrace you with His presence.",
    "Take a step toward God, and He'll take a step toward you.",
    "The Lord's plans stand firm forever.",
    "From everlasting to everlasting, He is God.",
    "God's love never fails, never fades, never ends.",
    "Open your heart to God, and He will open His blessings to you.",
    "Focus your mind on God, and He will fill it with His truth.",
    "His ways are higher, His wisdom unfailing.",
    "Quiet your soul before God, and He will speak to your heart.",
    "Rest in God's presence, and you will find His peace.",
    "You are fully known and fully loved by God.",
    "Nothing can separate you from the love of Christ.",
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
      withTiming(1, { duration: 3000, easing: Easing.ease })
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

  useEffect(() => {
    const initializeSound = async () => {
      try {
        const pads = [Gpad, Dpad, ABpad];
        const randomIndex = Math.floor(Math.random() * pads.length);
        const randomPad = pads[randomIndex];

        const { sound } = await Audio.Sound.createAsync(randomPad, {
          shouldPlay: true,
          volume: 0,
        });
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
        });
        setSound(sound);

        // Start playing with volume 0
        await sound.playAsync();

        // Fade in the volume
        let currentVolume = 0;
        const fadeDuration = 5000; // 3 seconds fade in
        const incrementStep = 0.01; // Adjust based on desired fade smoothness

        while (currentVolume < 0.9) {
          await sound.setVolumeAsync(currentVolume);
          currentVolume += incrementStep;
          await new Promise((resolve) =>
            setTimeout(resolve, fadeDuration / (0.9 / incrementStep))
          );
        }

        // Set final volume
        await sound.setVolumeAsync(0.9);
      } catch (error) {
        console.log("Error initializing sound:", error);
      }
    };

    initializeSound();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  async function beginPrayer() {
    setIsPlayingSound(true);
  }

  function nextStep() {
    if (step === 3) {
      return;
    }
    setStep((prev) => prev + 1);
  }

  async function endPrayer() {
    if (!reviewRequested) {
      console.log("NOT REQUESTED");
      await CheckReview();
    } else {
      console.log("Already requested");
    }
    // setStep(0);
    setIsEndingPrayer(true);
    pauseSound();
    router.back();
    setReviewRequested(true);
  }

  async function pauseSound() {
    setIsPlayingSound(false);

    setTimeout(async () => {
      let currentVolume = 1;

      const decrementStep = 0.02; // Adjust based on desired fade smoothness

      while (currentVolume > 0) {
        await sound?.setVolumeAsync(currentVolume);

        currentVolume -= decrementStep;

        await new Promise((resolve) => setTimeout(resolve, 10)); // Small delay for smooth fade
      }

      // Stop the sound when fully faded out

      await sound?.stopAsync();
    }, 500);
  }

  function handleCreateFolder() {
    dispatch(
      addFolder({
        id: uuid.v4(),
        name: "Folder",
        prayers: [],
      })
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
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
      }}
      // style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background p-0 relative flex-1"
    >
      <ProgressBar step={step} totalSteps={4} />
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
        <View className="mt-3">
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
        </View>
        <PrayerPreparation
          handleCreateFolder={handleCreateFolder}
          unarchivedPrayers={unarchivedPrayers}
          allQuestions={allQuestions}
          step={step}
          isPlayingSound={isPlayingSound}
          isEndingPrayer={isEndingPrayer}
          saying={saying}
        />
        {/* <Text>{step}</Text> */}
        {step !== 3 ? (
          <Animated.Text
            // onPress={playSound}
            style={animatedPressFadeInStyle}
            className="text-center font-inter-semibold text-light-primary dark:text-dark-primary text-base mb-16"
          >
            Tap the screen to{" "}
            {isPlayingSound && step !== 4 ? "continue" : "begin"}
          </Animated.Text>
        ) : (
          <View className="mb-20 self-center bg-light-primary dark:bg-dark-accent size-20 items-center justify-center rounded-full">
            <Feather
              name="check"
              size={35}
              color={colorScheme === "dark" ? "#121212" : "#f2f7ff"}
            />
          </View>
        )}
        {/* <Animated.Text
          // onPress={playSound}
          style={animatedPressFadeInStyle}
          className="text-center font-inter-medium text-light-primary dark:text-dark-primary text-base mb-10"
        >
          Tap the screen to{" "}
          {isPlayingSound && step !== 4 ? "continue" : "begin"}
        </Animated.Text> */}
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
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  function getRandomPrayers(prayersArray: Prayer[], count: number) {
    // Shuffle the array
    const shuffled = [...prayersArray].sort(() => 0.5 - Math.random());
    // Get the first 'count' elements
    return shuffled.slice(0, count);
  }

  function getRandomQuestions(
    arr: { title: string; verses?: string[] }[],
    num: number
  ) {
    const fixedQuestion = {
      title: "Who is on your heart to pray for today?",
      verses: [],
    };

    const fixedLastQuestion = {
      title: `In Jesus' name, Amen. \n\nThank you for praying with us! \n\nWe hope this prayer strengthens your faith and guides your day with His grace!`,
      verses: [],
    };

    const arrayCopy = arr.filter(
      (q) =>
        q.title !== fixedQuestion.title && q.title !== fixedLastQuestion.title
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
        })
      );
      thanksFadeIn.value = withDelay(
        6000, // Delay to ensure previous texts have faded out
        withTiming(1, {
          duration: 3000,
          easing: Easing.ease,
        })
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
      })
    );

    promptFadeIn.value = withDelay(
      6000,
      withTiming(1, {
        duration: 3000,
        easing: Easing.ease,
      })
    );
    momentFadeIn.value = withDelay(
      8000,
      withTiming(1, {
        duration: 3000,
        easing: Easing.ease,
      })
    );

    // Start the hover animation
    hoverTranslateY.value = withRepeat(
      withTiming(10, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedSayingFadeInStyle = useAnimatedStyle(() => ({
    opacity: sayingFadeIn.value * 1,
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
    <View className="flex-1 justify-start items-start mt-20">
      <View className="absolute w-full top-0 left-0 self-start h-full flex-1 justify-start gap-3 right-0 items-start">
        <Animated.Text
          style={titleFadeInStyle}
          className="font-inter-semibold mb-5 text-balance text-3xl text-light-primary dark:text-dark-primary"
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
                  " bg-light-secondary/50 dark:bg-[#292929] w-3/4 p-2 rounded-lg"
                )}
              >
                <Animated.Text
                  style={thanksFadeInStyle}
                  className="font-inter-medium text-base text-light-primary dark:text-dark-primary"
                >
                  You don't have any prayers.
                </Animated.Text>
                <Animated.Text
                  style={thanksFadeInStyle}
                  className="font-inter-regular text-sm mt-2 text-light-primary dark:text-dark-primary"
                >
                  Go back to create a list and add prayers to it!
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
                      idx % 2 && "ml-auto"
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
                className=" bg-light-secondary border border-light-primary/25 dark:bg-[#292929] dark:border-dark-primary/25 w-3/4 p-2 rounded-lg"
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
                className="ml-auto bg-light-secondary border border-light-primary/25 dark:bg-[#292929] dark:border-dark-primary/25 w-3/4 p-2 rounded-lg"
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
                className=" bg-light-secondary border border-light-primary/25 dark:bg-[#292929] dark:border-dark-primary/25 w-3/4 p-2 rounded-lg"
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
          className="font-inter-regular text-light-primary dark:text-dark-primary"
        >
          Welcome
        </Animated.Text>
        <Animated.Text
          style={animatedSayingFadeInStyle}
          className="font-inter-semibold text-light-primary mt-3 dark:text-dark-primary text-3xl"
        >
          {saying}
        </Animated.Text>

        <Animated.Text
          style={animatedMomentFadeInStyle}
          className="font-inter-medium mt-5 text-light-primary dark:text-dark-primary text-3xl"
        >
          Have a moment to quiet your mind and reflect on these questions as you
          pray.
        </Animated.Text>
      </View>
    </View>
  );
}

function AnimatedBackground() {
  const { height } = useWindowDimensions();

  const top1 = useSharedValue(0.3 * height);
  const top2 = useSharedValue(0.5 * height);
  const top3 = useSharedValue(0.7 * height);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.

      const options = {
        duration: 6000,
        easing: Easing.bezier(0.5, 0, 0.5, 1),
      };
      top1.value = withRepeat(withTiming(0.2 * height, options), -1, true);
      top2.value = withDelay(
        1000,
        withRepeat(withTiming(0.4 * height, options), -1, true)
      );
      top3.value = withDelay(
        2000,
        withRepeat(withTiming(0.6 * height, options), -1, true)
      );
      // Return function is invoked whenever the route gets out of focus.
    }, [])
  );
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

const ProgressBar = ({
  step,
  totalSteps,
}: {
  step: number;
  totalSteps: number;
}) => {
  const { colorScheme } = useColorScheme();

  return (
    <View className="flex-row gap-2 mx-4">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          className="flex-1 h-1 bg-gray-300 rounded-lg"
          style={{
            backgroundColor:
              index <= step
                ? colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
                : colorScheme === "dark"
                ? "#525252"
                : "#d1d0d0",
          }}
        />
      ))}
    </View>
  );
};
