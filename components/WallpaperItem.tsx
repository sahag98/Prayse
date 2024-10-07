import { Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import S3Image from "./S3Image";
import { getPrimaryBackgroundColorStyle } from "@lib/customStyles";
import Feather from "@expo/vector-icons/Feather";
const WallpaperItem = ({
  item,
  index,
  scrollX,
  actualTheme,
  colorScheme,
  handleDownloadPress,
}: any) => {
  const { width } = Dimensions.get("screen");

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [-width * 0.25, 0, width * 0.25],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollX.value,
            [(index - 1) * width, index * width, (index + 1) * width],
            [0.9, 1, 0.9],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width,
          justifyContent: "center",
          gap: 20,
          alignItems: "center",
        },
      ]}
    >
      <S3Image
        imgKey={item.image}
        theme={colorScheme}
        actualTheme={actualTheme}
        style={{ width: 300, height: 500, borderRadius: 10 }}
      />
      <TouchableOpacity
        onPress={() => handleDownloadPress(item.image)}
        className="p-3 rounded-full bg-light-primary dark:bg-dark-accent"
        style={[getPrimaryBackgroundColorStyle(actualTheme)]}
      >
        <Feather
          name="download"
          size={40}
          color={
            actualTheme && actualTheme.PrimaryTxt
              ? actualTheme.PrimaryTxt
              : colorScheme === "dark"
                ? "#121212"
                : "#f2f7ff"
          }
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default WallpaperItem;
