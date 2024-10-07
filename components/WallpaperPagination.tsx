import { Dimensions, StyleSheet, View } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const WallpaperPagination = ({
  items,
  paginationIndex,
  scrollX,
  colorScheme,
  actualTheme,
}: any) => {
  console.log("pIndex:", paginationIndex);
  const { width } = Dimensions.get("screen");
  return (
    <View className="flex-row h-14 justify-center items-center">
      {items.map((_: any, index: number) => {
        //eslint-disable-next-line
        const pgAnimatedStyle = useAnimatedStyle(() => {
          const dotWidth = interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [8, 20, 8],
            Extrapolation.CLAMP,
          );
          return {
            width: dotWidth,
          };
        });
        return (
          <Animated.View
            key={index}
            style={[
              pgAnimatedStyle,
              styles.dot,
              {
                backgroundColor:
                  paginationIndex === index
                    ? actualTheme && actualTheme.Primary
                      ? actualTheme.Primary
                      : colorScheme === "dark"
                        ? "#a5c9ff"
                        : "#2f2d51"
                    : "#aaa",
              },
            ]}
          />
        );
      })}
    </View>
  );
};

export default WallpaperPagination;

const styles = StyleSheet.create({
  dot: {
    height: 8,
    width: 8,
    borderRadius: 100,
    backgroundColor: "#aaa",
    marginHorizontal: 2,
  },
});
