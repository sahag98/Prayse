import {
  measure,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

export const useAccordion = () => {
  const animateRef = useAnimatedRef();
  const isOpened = useSharedValue(false);
  const height = useSharedValue(0);

  const animateHeightStyle = useAnimatedStyle(() => ({
    height: withSpring(height.value, {
      damping: 15,
      stiffness: 120,
      mass: 0.8,
    }),
    opacity: withSpring(height.value > 0 ? 1 : 0),
  }));

  const setHeight = () => {
    "worklet";

    if (height.value === 0) {
      const measuredHeight = Number(measure(animateRef)?.height ?? 0);
      height.value = measuredHeight;
    } else {
      height.value = 0;
    }
    isOpened.value = !isOpened.value;
  };

  return {
    animateRef,
    setHeight,
    isOpened,
    animateHeightStyle,
  };
};
