// @ts-nocheck
import React, { useState } from "react";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Directions,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import { getMainBackgroundColorStyle } from "@lib/customStyles";

import bible from "../assets/Bible.png";
import prayseIcon from "../assets/prayse-logo.png";
import reminderIcon from "../assets/reminder2.png";

const onboardingSteps = [
  {
    icon: prayseIcon,
    title: "Welcome To Prayse",
    description:
      "An app where you can create and manage your prayer list, helping you stay organized in your walk with God.",
    verse:
      "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.",
    reference: "Philippians 4:6",
  },
  {
    icon: reminderIcon,
    title: "Reminders",
    description:
      "Setup prayer reminders to remember and pray for those in need of prayer.",
    verse:
      "And he spake a parable unto them to this end, that men ought always to pray, and not to faint;",
    reference: "Luke 18:1",
  },
  {
    icon: bible,
    title: "Verse of the Day",
    description:
      "Meditate daily on a daily verse, helping you stay focused and reminded of God's Word.",
    verse: "Thy word is a lamp unto my feet, and a light unto my path.",
    reference: "Psalm 119:105",
  },
];

export default function OnboardingScreen() {
  const [screenIndex, setScreenIndex] = useState(0);
  const data = onboardingSteps[screenIndex];

  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (isLastScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const endOnboarding = () => {
    setScreenIndex(0);
    router.push("/(tabs)/folder");
    // navigation.navigate("/(tabs)");
    // router.push("/");
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack),
  );

  return (
    <SafeAreaView
      style={getMainBackgroundColorStyle(actualTheme)}
      className="justify-center bg-light-background dark:bg-dark-background flex-1"
    >
      <View className="flex-row gap-2 mx-4">
        {onboardingSteps.map((step, index) => (
          <View
            key={index}
            className="flex-1 h-1 bg-gray-500 rounded-lg"
            style={[
              {
                backgroundColor:
                  index === screenIndex
                    ? colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                    : "#acacac",
              },
            ]}
          />
        ))}
      </View>
      <GestureDetector gesture={swipes}>
        <View
          className="p-5 justify-center items-center flex-1"
          key={screenIndex}
        >
          <Animated.View
            className="rounded-full mt-20 overflow-hidden"
            entering={FadeIn}
            exiting={FadeOut}
          >
            <Image
              style={
                colorScheme === "dark"
                  ? data.title === "Welcome To Prayse"
                    ? [styles.image]
                    : [styles.image, { tintColor: "white" }]
                  : styles.image
              }
              source={data.icon}
            />
          </Animated.View>

          <View className="flex-1 items-center">
            <Animated.Text
              entering={SlideInRight}
              exiting={SlideOutLeft}
              className="font-inter-bold text-3xl mb-5 self-center text-light-primary dark:text-dark-primary"
            >
              {data.title}
            </Animated.Text>
            <Animated.Text
              entering={SlideInRight.delay(50)}
              exiting={SlideOutLeft}
              className="font-inter-medium text-light-primary dark:text-dark-primary text-xl"
            >
              {data.description}
            </Animated.Text>
            <View className="mt-10">
              <Animated.Text
                entering={SlideInRight.delay(100)}
                exiting={SlideOutLeft}
                className="font-inter-regular text-light-primary dark:text-dark-primary"
              >
                "{data.verse}"
              </Animated.Text>
              <Animated.Text
                entering={SlideInRight.delay(100)}
                exiting={SlideOutLeft}
                className="font-inter-regular self-end text-light-primary dark:text-dark-primary"
              >
                {data.reference}
              </Animated.Text>
            </View>
            <View className="mt-auto flex-row w-full items-center gap-5">
              <Text
                onPress={endOnboarding}
                className="font-inter-bold text-light-primary dark:text-dark-primary text-lg text-center w-1/4"
              >
                Skip
              </Text>

              <Pressable
                onPress={onContinue}
                className="bg-light-primary dark:bg-dark-accent p-5 flex-1 rounded-xl justify-center items-center"
              >
                <Text className="font-inter-bold text-lg text-light-background dark:text-dark-background ">
                  Continue
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: "center",
    width: 150,
    borderRadius: 20,
    padding: 10,
    height: 150,
    margin: 20,
    marginTop: 70,
  },
});
