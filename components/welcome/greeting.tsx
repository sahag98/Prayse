// @ts-nocheck
import React from "react";
import { useColorScheme } from "nativewind";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Feather } from "@expo/vector-icons";
import { getMainTextColorStyle } from "@lib/customStyles";
import { CheckReview } from "@hooks/useShowReview";

interface GreetingProps {
  theme: string;
  actualTheme: {
    Bg: string;
    Primary: string;
    PrimaryTxt: string;
    Secondary: string;
    SecondaryTxt: string;
    id: string;
  };
}
export const Greeting: React.FC<GreetingProps> = ({ theme, actualTheme }) => {
  const welcomeFadeIn = useSharedValue(0);

  const { colorScheme, setColorScheme } = useColorScheme();

  const greeting = React.useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  }, []);

  const icon = React.useMemo(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 18) {
      return <Feather name="sun" size={25} color="#d8d800" />;
    }

    return (
      <Feather
        name="moon"
        size={25}
        color={theme === "dark" ? "#a6a6a6" : "#9a9a9a"}
      />
    );
  }, [theme]);

  React.useEffect(() => {
    welcomeFadeIn.value = withTiming(1, {
      duration: 2000,
      easing: Easing.ease,
    });
  }, []);

  return (
    <Animated.View className="flex flex-row items-center gap-2">
      <Animated.Text
        onPress={() => CheckReview()}
        style={getMainTextColorStyle(actualTheme)}
        className="text-xl tracking-wide font-inter-semibold  text-light-primary dark:text-[#d2d2d2]"
      >
        {greeting}
      </Animated.Text>
      {icon}
    </Animated.View>
  );
};
