import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
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

import bible from "../assets/Bible.png";
import cm2 from "../assets/cm2.png";
import prayseIcon from "../assets/prayer.png";

const onboardingSteps = [
  {
    icon: prayseIcon,
    title: "Welcome To Prayse",
    description:
      "An app where you can create and manage your prayer list, helping you stay organized in your spiritual walk with God.",
  },
  {
    icon: cm2,
    title: "Community",
    description:
      "Whether you're looking to deepen your own prayer life or connect with others in your community, our app is a valuable tool for anyone seeking to grow in their faith.",
  },
  {
    icon: bible,
    title: "Devotionals & Verse of the Day",
    description:
      "Meditate daily on devotionals provided by @triedbyfire, and daily verses, reminding you of God's Word.",
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.user.theme);
  const [screenIndex, setScreenIndex] = useState(0);
  const [hasOnboardingEnded, sethasOnboardingEnded] = useState(false);
  const data = onboardingSteps[screenIndex];

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
    navigation.navigate("Home");
    // router.push("/");
  };

  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack),
  );

  return (
    <SafeAreaView
      style={
        theme == "dark"
          ? [styles.page, { backgroundColor: "#121212" }]
          : styles.page
      }
    >
      <StatusBar style="light" />

      <View style={styles.stepIndicatorContainer}>
        {onboardingSteps.map((step, index) => (
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
          <Animated.View
            style={{ borderRadius: 200, overflow: "hidden" }}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <Image
              style={
                theme == "dark"
                  ? data.title == "Welcome To Prayse"
                    ? [styles.image]
                    : [styles.image, { tintColor: "white" }]
                  : styles.image
              }
              source={data.icon}
            />
            {/* <FontAwesome5
              
              name={data.icon}
              size={150}
              color="#121212"
            /> */}
          </Animated.View>

          <View style={styles.footer}>
            <Animated.Text
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={
                theme == "dark"
                  ? [styles.title, { color: "white" }]
                  : styles.title
              }
            >
              {data.title}
            </Animated.Text>
            <Animated.Text
              entering={SlideInRight.delay(50)}
              exiting={SlideOutLeft}
              style={
                theme == "dark"
                  ? [styles.description, { color: "#d2d2d2" }]
                  : styles.description
              }
            >
              {data.description}
            </Animated.Text>

            <View style={styles.buttonsRow}>
              <Text
                onPress={endOnboarding}
                style={
                  theme == "dark"
                    ? [styles.buttonText, { color: "white" }]
                    : styles.buttonText
                }
              >
                Skip
              </Text>

              <Pressable
                onPress={onContinue}
                style={
                  theme == "dark"
                    ? [styles.button, { backgroundColor: "#A5C9FF" }]
                    : styles.button
                }
              >
                <Text
                  style={
                    theme == "dark"
                      ? [{ color: "#121212" }, styles.buttonText]
                      : [{ color: "white" }, styles.buttonText]
                  }
                >
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
  page: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#f2f7ff",
  },
  pageContent: {
    padding: 20,

    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  image: {
    alignSelf: "center",
    width: 180,
    borderRadius: 100,
    height: 180,
    margin: 20,
    marginTop: 70,
  },
  title: {
    color: "#2f2d51",
    fontSize: 30,
    fontFamily: "Inter-Bold",
    letterSpacing: 1.3,
    textAlign: "center",
    marginVertical: 20,
  },
  description: {
    color: "#2f2d51",
    fontSize: 17,

    lineHeight: 28,
  },
  footer: {
    // marginTop: "auto",

    flex: 1,
  },

  buttonsRow: {
    marginTop: "auto",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    gap: 20,
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

  // steps
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
