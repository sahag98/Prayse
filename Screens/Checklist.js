import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
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
} from "react-native-reanimated";
import {
  GestureDetector,
  Gesture,
  Directions,
} from "react-native-gesture-handler";

const Checklist = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const prayers = useSelector((state) => state.prayer.prayer);
  const [screenIndex, setScreenIndex] = useState(0);
  const [hasOnboardingEnded, sethasOnboardingEnded] = useState(false);
  const data = prayers[screenIndex];

  console.log(data);

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
          onPress={() => navigation.navigate("Prayer")}
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
        </View>
      </GestureDetector>

      <View
        style={{
          position: "absolute",
          flexDirection: "row",

          alignItems: "center",
          justifyContent: "space-between",
          bottom: 20,
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={onBack}
          style={{ backgroundColor: "#b7d3ff", padding: 10, borderRadius: 100 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={40} color="#2f2d51" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PrayerRoom", {
              prayer: data,
            })
          }
          style={{ backgroundColor: "#2f2d51", padding: 15, borderRadius: 100 }}
        >
          <MaterialCommunityIcons name="hands-pray" size={55} color="#b7d3ff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onContinue}
          style={{ backgroundColor: "#b7d3ff", padding: 10, borderRadius: 100 }}
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={40}
            color="#2f2d51"
          />
        </TouchableOpacity>
      </View>
      {/* <StatusBar hidden /> */}
    </Container>
  );
};

export default Checklist;

const styles = StyleSheet.create({
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
