import React from "react";
import { Image } from "expo-image";
import { Text, View } from "react-native";

import { ActualTheme } from "../types/reduxTypes";

type WallpaperItemProps = {
  item: {
    id: number;
    image: any;
  };
  actualTheme: ActualTheme;
  theme: "light" | "dark" | undefined;
};

const WallpaperItem = ({ item }: WallpaperItemProps) => {
  return (
    <View className="bg-blue-200 w-full h-full rounded-2xl items-center justify-center border">
      {/* <Text>WallpaperItem</Text> */}
      <Image
        source={item.image}
        style={{ width: "100%", height: "100%" }}
        // className="w-full h-full"
      />
    </View>
  );
};

export default WallpaperItem;
