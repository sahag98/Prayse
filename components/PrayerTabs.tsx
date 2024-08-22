import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { cn } from "@lib/utils";

const PrayerTabs = ({ titles, activeTab, setActiveTab }: any) => {
  const tab1Value = useSharedValue(0);
  const tab2Value = useSharedValue(0);
  const tab3Value = useSharedValue(0);

  useEffect(() => {
    tab1Value.value = withTiming(activeTab === titles[0] ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    });
    tab2Value.value = withTiming(activeTab === titles[1] ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    });
    tab3Value.value = withTiming(activeTab === titles[2] ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    });
  }, [activeTab, titles]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    color: interpolateColor(
      tab1Value.value,
      [0, 1],
      ["rgb(156, 163, 175)", "rgb(59, 130, 246)"],
    ),
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    color: interpolateColor(
      tab2Value.value,
      [0, 1],
      ["rgb(156, 163, 175)", "rgb(59, 130, 246)"],
    ),
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    color: interpolateColor(
      tab3Value.value,
      [0, 1],
      ["rgb(156, 163, 175)", "rgb(59, 130, 246)"],
    ),
  }));

  return (
    <View className="flex-row relative">
      <TouchableOpacity
        onPress={() => setActiveTab(titles[0])}
        className="flex-1 gap-2 pb-2"
      >
        <Animated.Text
          style={animatedStyle1}
          className={cn("font-inter font-semibold text-xl text-center")}
        >
          {titles[0]}
        </Animated.Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab(titles[1])}
        className="flex-1 gap-2 pb-2"
      >
        <Animated.Text
          style={animatedStyle2}
          className={cn("font-inter font-semibold text-xl text-center")}
        >
          {titles[1]}
        </Animated.Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveTab(titles[2])}
        className="flex-1 gap-2 pb-2"
      >
        <Animated.Text
          style={animatedStyle3}
          className={cn("font-inter font-semibold text-xl text-center")}
        >
          {titles[2]}
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrayerTabs;
