import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const PrayerTabs = ({ actualTheme, titles, activeTab, setActiveTab }: any) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(titles.indexOf(activeTab), {
      duration: 300,
    });
  }, [activeTab, titles]);

  const animatedBorderStyle = useAnimatedStyle(() => {
    const width = 100 / titles.length;
    return {
      left: `${animatedValue.value * width}%`,
      width: `${width}%`,
      height: 2,
      position: "absolute",
      bottom: 0,
      backgroundColor: actualTheme.MainTxt,
    };
  });

  const animatedTextStyles = useDerivedValue(() => {
    return titles.map((_: string, index: number) => ({
      color: interpolateColor(
        animatedValue.value,
        [index - 0.5, index, index + 0.5],
        ["grey", actualTheme.MainTxt, "grey"],
      ),
    }));
  });

  return (
    <View className="flex-row relative">
      {titles.map((title: string, index: number) => (
        <TouchableOpacity
          key={title}
          onPress={() => setActiveTab(title)}
          className="flex-1 pb-2"
        >
          <Animated.Text
            style={animatedTextStyles.value[index]}
            className="text-light-primary dark:text-dark-primary font-inter font-semibold text-xl text-center"
          >
            {title}
          </Animated.Text>
        </TouchableOpacity>
      ))}
      <Animated.View style={animatedBorderStyle} />
    </View>
  );
};

export default PrayerTabs;
