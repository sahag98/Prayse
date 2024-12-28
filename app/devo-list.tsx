import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  Easing,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "../types/reduxTypes";
import { useSupabase } from "../context/useSupabase";

import "react-native-url-polyfill/auto";
import { cn } from "@lib/utils";
import AddPraiseModal from "@modals/add-praise-modal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import praiseImg from "../assets/praise-list.png";
import { SafeAreaView } from "react-native-safe-area-context";
const DevoListScreen = () => {
  const navigation = useNavigation();
  const routeParams = useLocalSearchParams();
  //@ts-ignore
  const { currentUser, supabase } = useSupabase();
  const praiseBottomSheetRef = useRef<BottomSheetModal>(null);
  const [praiseCount, setPraiseCount] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["praises"],
    queryFn: getPraises,
  });

  useEffect(() => {
    const checkPraiseCount = async () => {
      console.log("here");
      const count = await AsyncStorage.getItem("praiseCount");
      const lastResetDate = await AsyncStorage.getItem("lastResetDate");

      const today = new Date().toISOString().split("T")[0];

      if (lastResetDate !== today) {
        await AsyncStorage.setItem("praiseCount", "0");
        await AsyncStorage.setItem("lastResetDate", today);
        setPraiseCount(0);
      } else {
        setPraiseCount(count ? parseInt(count) : 0);
      }
    };

    checkPraiseCount();
  }, [data]);

  async function getPraises() {
    const { data, error } = await supabase
      .from("praises")
      .select("*, profiles(*)")
      .order("id", { ascending: true });

    return data;
  }

  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();

  //   return (
  //     <View
  //       style={getMainBackgroundColorStyle(actualTheme)}
  //       className="bg-light-background dark:bg-dark-background flex-1 justify-center"
  //     >
  //       <ActivityIndicator
  //         size="large"
  //         color={
  //           actualTheme && actualTheme.MainTxt
  //             ? actualTheme.MainTxt
  //             : colorScheme == "dark"
  //               ? "white"
  //               : "#2f2d51"
  //         }
  //       />
  //     </View>
  //   );
  // };

  // Animated style for each item in the FlatList
  const AnimatedPraiseItem = ({ item }: { item: any }) => {
    const hoverTranslateY = useSharedValue(0);

    hoverTranslateY.value = withRepeat(
      withTiming(10, {
        duration: 3000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
    // Animate vertical movement

    const hoverStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: hoverTranslateY.value }],
    }));

    return (
      <Animated.View
        className={cn(
          "bg-light-secondary dark:bg-dark-secondary w-fit gap-2 self-start p-3 rounded-lg",
          item.id % 2 === 0 && "self-end",
        )}
        style={hoverStyle}
      >
        {item.user_id ? (
          <View>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-semibold ext-light-primary dark:text-dark-primary text-sm"
            >
              {item.profiles.full_name}
            </Text>
          </View>
        ) : (
          <View>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-semibold ext-light-primary dark:text-dark-primary text-sm"
            >
              Anonymous
            </Text>
          </View>
        )}

        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-regular text-light-primary dark:text-dark-primary"
        >
          {item.content}
        </Text>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-light-background dark:bg-dark-background">
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={[
          getMainBackgroundColorStyle(actualTheme),
          {
            flex: 1,
            backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
          },
        ]}
        className="bg-light-background flex-1 dark:bg-dark-background"
      >
        <View className="flex-row mb-4 px-4 items-center">
          <TouchableOpacity
            onPress={() => {
              if (routeParams?.previousScreen) {
                navigation.goBack();
              }
            }}
          >
            <AntDesign
              name="left"
              size={30}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme == "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 px-4 justify-center items-center">
          {data && (
            <View
              style={getMainBackgroundColorStyle(actualTheme)}
              className="bg-white dark:bg-dark-secondary shadow-md shadow-gray-200 dark:shadow-gray-700 p-2 rounded-xl"
            >
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="text-sm text-light-primary dark:text-dark-primary font-inter-regular"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </View>
          )}
          <FlatList
            style={{ width: "100%", flexGrow: 1, flex: 1 }}
            data={data}
            inverted={data.lengh > 0}
            className=""
            ListHeaderComponent={() => <View className="h-10" />}
            contentContainerClassName="gap-5 flex-grow"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="flex-1 gap-3 items-center justify-center">
                <Image
                  source={praiseImg}
                  style={{
                    tintColor: colorScheme === "dark" ? "white" : "#2f2d51",
                    width: 120,
                    height: 120,
                  }}
                />
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-semibold text-xl text-light-primary dark:text-dark-primary"
                >
                  Today's praises
                </Text>
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-regular text-light-primary dark:text-dark-primary"
                >
                  Be the first one to start off the list!
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AnimatedPraiseItem item={item} />}
          />
          {praiseCount < 10 && (
            <View className="py-5 w-full items-center">
              <Pressable
                onPress={() => praiseBottomSheetRef.current?.present()}
                className="bg-light-primary dark:bg-dark-accent size-20 items-center justify-center rounded-full"
              >
                <Entypo
                  name="plus"
                  size={30}
                  color={
                    actualTheme && actualTheme.MainTxt
                      ? actualTheme.MainTxt
                      : colorScheme == "dark"
                        ? "#121212"
                        : "white"
                  }
                />
              </Pressable>
            </View>
          )}
          {praiseCount >= 10 && (
            <View className="p-3">
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="text-lg text-light-primary dark:text-dark-primary font-inter-medium"
              >
                Thank you for praising God with us today. Come back tomorrow to
                start it off.
              </Text>
            </View>
          )}
        </View>
        <AddPraiseModal
          praiseBottomSheetRef={praiseBottomSheetRef}
          actualTheme={actualTheme}
          currentUser={currentUser}
          supabase={supabase}
          theme={colorScheme}
        />
      </SafeAreaView>
    </>
  );
};

export default DevoListScreen;
