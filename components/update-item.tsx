import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { UpdateItemType } from "../types/appTypes";
import AntDesign from "@expo/vector-icons/AntDesign";
import Animated, {
  useSharedValue,
  useDerivedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useAccordion } from "@hooks/useAccordion";
import { useColorScheme } from "nativewind";
import { Image } from "expo-image";
function AccordionItem({
  isExpanded,
  children,
  viewKey,
  style,
  duration = 500,
}: any) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle, style]}
    >
      <View
        onLayout={(e) => (height.value = e.nativeEvent.layout.height)}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const UpdateItem = ({ item }: { item: UpdateItemType }) => {
  const { colorScheme } = useColorScheme();
  const { setHeight, animateHeightStyle, animateRef, isOpened } =
    useAccordion();
  const animatedChevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: withTiming(`${isOpened.value ? -180 : 0}deg`, {
          duration: 200,
        }),
      },
    ],
  }));

  const open = useSharedValue(false);
  const rotation = useSharedValue(0);
  const [selectedId, setSelectedId] = useState("");
  const onPress = (id: string) => {
    open.value = !open.value;
    // setSelectedId(id);
    if (open.value) {
      console.log("close");

      rotation.value = withSpring(0, {
        damping: 15,
        stiffness: 120,
      });
    } else {
      // setSelectedId('');
      console.log("open");
      rotation.value = withSpring(180, {
        damping: 15,
        stiffness: 120,
      });
    }

    // rotation.value = withSpring(180, {
    //   damping: 15,
    //   stiffness: 120,
    // });
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  return (
    <Pressable
      onPress={() => onPress(item.title)}
      className=" rounded-2xl border border-light-primary dark:border-dark-secondary p-5"
    >
      <View className="flex-row items-center justify-between">
        <View className="gap-1">
          <Text className="text-lg font-inter-semibold text-light-primary dark:text-dark-primary sm:text-2xl">
            {item.title}
          </Text>
        </View>
        <Animated.View style={iconStyle}>
          <AntDesign
            name="down"
            size={20}
            color={colorScheme === "dark" ? "white" : "black"}
          />
        </Animated.View>
      </View>
      <AccordionItem isExpanded={open} viewKey="Accordion">
        {item.data.map((d, idx) => (
          <View className="my-2" key={idx}>
            <Text className="font-inter-regular text-light-primary dark:text-dark-primary">
              {d.description}
            </Text>
            {d.img && (
              <Image
                source={d.img}
                placeholder={d.blurhash}
                contentFit="cover"
                transition={1000}
                style={{ width: "100%", aspectRatio: 9 / 16, borderRadius: 10 }}
              />
            )}
          </View>
        ))}
      </AccordionItem>
    </Pressable>
  );
};

export default UpdateItem;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "absolute",
    display: "flex",
  },
  animatedView: {
    width: "100%",
    overflow: "hidden",
  },
  box: {
    height: 120,
    width: 120,
    color: "#f8f9ff",
    backgroundColor: "#b58df1",
    borderRadius: 20,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
