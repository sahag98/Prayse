import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withRepeat,
  Easing,
  withTiming,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from "@react-navigation/native";
import { ActualTheme } from "../types/reduxTypes";

import tbf from "../assets/tbf-logo.jpg";
import DevoItem from "../components/DevoItem";
import config from "../config";
import { useSupabase } from "../context/useSupabase";
import useIsReady from "../hooks/useIsReady";
import { client } from "../lib/client";
import { COMMUNITY_SCREEN, LOGIN_SCREEN, MORE_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

import "react-native-url-polyfill/auto";
import { cn } from "@lib/utils";
import AddPraiseModal from "@modals/add-praise-modal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DevoListScreen = () => {
  const navigation = useNavigation();
  const routeParams = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { currentUser, supabase } = useSupabase();
  const isReady = useIsReady();
  const praiseBottomSheetRef = useRef<BottomSheetModal>(null);
  const [praises, setPraises] = useState([]);
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

  console.log("praise count: ", praiseCount);

  async function getPraises() {
    const { data, error } = await supabase
      .from("praises")
      .select("*, profiles(*)")
      .order("id", { ascending: false });

    return data;
  }

  console.log("praises: ", praises);

  const praisesList = [
    { id: 1, name: "John", content: "Praise for waking up today." },
    { id: 2, name: "Bob", content: "Praise for waking up today." },
    { id: 3, name: "Larry", content: "Praise for waking up today." },
    { id: 4, name: "Laura", content: "Praise for waking up today." },
    { id: 5, name: "Jane", content: "Praise for waking up today." },
    { id: 6, name: "Mandy", content: "Praise for waking up today." },
    { id: 7, name: "Nancy", content: "Praise for waking up today." },
    { id: 8, name: "James", content: "Praise for the blessings in my life." },
    { id: 9, name: "Sarah", content: "Praise for my family's health." },
    { id: 10, name: "David", content: "Praise for a new opportunity at work." },
    {
      id: 11,
      name: "Emily",
      content: "Praise for the beautiful weather today.",
    },
    { id: 12, name: "Chris", content: "Praise for God's guidance in my life." },
    {
      id: 13,
      name: "Rachel",
      content: "Praise for strength through challenges.",
    },
    { id: 14, name: "Michael", content: "Praise for peace in my heart." },
    {
      id: 15,
      name: "Olivia",
      content: "Praise for my loving friends and family.",
    },
    {
      id: 16,
      name: "Ethan",
      content: "Praise for all the good things in life.",
    },
    {
      id: 17,
      name: "Sophia",
      content: "Praise for being able to help others.",
    },
    {
      id: 18,
      name: "William",
      content: "Praise for finding joy in the small moments.",
    },
    { id: 19, name: "Ava", content: "Praise for a fulfilling day of work." },
    {
      id: 20,
      name: "Lucas",
      content: "Praise for God's endless love and grace.",
    },
    { id: 21, name: "Grace", content: "Praise for the peace of mind I have." },
    { id: 22, name: "Zoe", content: "Praise for the strength to keep going." },
    {
      id: 23,
      name: "Ben",
      content: "Praise for a new day and new beginnings.",
    },
    {
      id: 24,
      name: "Charlotte",
      content: "Praise for laughter and joy with loved ones.",
    },
  ];

  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();

  // Random position for each item, ensuring they stay within the screen bounds
  const getRandomPosition = () => {
    const randomX = Math.floor(Math.random() * 250) - 125; // Random x between -125 and 125 (limits within screen width)
    const randomY = Math.floor(Math.random() * 500) - 250; // Random y between -250 and 250 (adjustable for vertical movement)
    return { x: randomX, y: randomY };
  };

  // const BusyIndicator = () => {
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
    const position = useSharedValue(getRandomPosition()); // Randomize initial position
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
    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: withSpring(position.value.x, { damping: 3 }) },
        ],
      };
    });

    const hoverStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: hoverTranslateY.value }],
    }));

    return (
      <Animated.View
        className={cn(
          "bg-light-secondary w-fit gap-2 self-start p-3 rounded-lg",
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

  // if (!currentUser) {
  //   return (
  //     <SafeAreaView
  //       style={getMainBackgroundColorStyle(actualTheme)}
  //       className="flex-1 bg-light-background dark:bg-dark-background"
  //     >
  //       <View className="flex-row mb-4 px-4 items-center">
  //         <TouchableOpacity
  //           onPress={() => {
  //             if (routeParams?.previousScreen) {
  //               navigation.goBack();
  //             }
  //           }}
  //         >
  //           <AntDesign
  //             name="left"
  //             size={30}
  //             color={
  //               actualTheme && actualTheme.MainTxt
  //                 ? actualTheme.MainTxt
  //                 : colorScheme == "dark"
  //                   ? "white"
  //                   : "#2f2d51"
  //             }
  //           />
  //         </TouchableOpacity>
  //         <Text
  //           style={getMainTextColorStyle(actualTheme)}
  //           className="font-inter ml-2 text-2xl font-bold text-light-primary dark:text-dark-primary"
  //         >
  //           Praise
  //         </Text>
  //       </View>
  //       <View className="flex-1 gap-3 items-center justify-center">
  //         <Text
  //           style={getMainTextColorStyle(actualTheme)}
  //           className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
  //         >
  //           Sign in to share a praise with us!
  //         </Text>
  //         <Pressable
  //           onPress={() => router.push(LOGIN_SCREEN)}
  //           style={getPrimaryBackgroundColorStyle(actualTheme)}
  //           className="bg-light-primary items-center justify-center w-1/2 dark:bg-dark-accent p-4 rounded-lg"
  //         >
  //           <Text className="font-inter-bold text-base text-light-background dark:text-dark-background">
  //             Sign in
  //           </Text>
  //         </Pressable>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  if (isLoading) return null;
  return (
    <>
      <SafeAreaView
        style={getMainBackgroundColorStyle(actualTheme)}
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
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter ml-2 text-2xl font-bold text-light-primary dark:text-dark-primary"
          >
            Praise
          </Text>
        </View>
        <View className="flex-1 px-4 justify-center items-center">
          <FlatList
            style={{ width: "100%", flexGrow: 1, flex: 1 }}
            data={data}
            inverted
            className=""
            ListHeaderComponent={() => <View className="h-10" />}
            contentContainerClassName="gap-5 flex-grow"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="flex-1 gap-3 items-center justify-center">
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-semibold text-xl text-light-primary dark:text-dark-primary"
                >
                  No praises just yet!
                </Text>
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-regular text-light-primary dark:text-dark-primary"
                >
                  Be the first one to start it off today.
                </Text>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <AnimatedPraiseItem item={item} />}
          />
          {praiseCount < 10 && (
            <View className="py-4 w-full items-center">
              <Pressable
                onPress={() => praiseBottomSheetRef.current?.present()}
                className="bg-light-primary size-20 items-center justify-center rounded-full"
              >
                <AntDesign
                  name="plus"
                  size={24}
                  color={
                    actualTheme && actualTheme.MainTxt
                      ? actualTheme.MainTxt
                      : colorScheme == "dark"
                        ? "white"
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

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#93D8F8",
    borderRadius: 10,
    color: "#2f2d51",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  imgContainer: {
    backgroundColor: "white",
    height: 180,
    width: 180,
    borderRadius: 100,
    marginVertical: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  refreshDark: {
    paddingVertical: 7,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  refresh: {
    paddingVertical: 7,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionDark: {
    color: "#d6d6d6",
    fontFamily: "Inter-Medium",
    fontSize: 16,
  },
  description: {
    color: "#2F2D51",
    fontFamily: "Inter-Medium",
    fontSize: 16,
  },
  ownerDark: {
    color: "#d6d6d6",
    fontFamily: "Inter-Bold",
  },
  owner: {
    color: "#2F2D51",
    fontFamily: "Inter-Bold",
  },
  dayDark: {
    color: "#d6d6d6",
    letterSpacing: 1,
    fontSize: 20,
    fontFamily: "Inter-Bold",
  },
  day: {
    color: "#2F2D51",
    letterSpacing: 1,
    fontSize: 20,
    fontFamily: "Inter-Bold",
  },
  contentDark: {
    color: "#d6d6d6",
    fontSize: 15,
    lineHeight: 35,
    fontFamily: "Inter-Regular",
    marginBottom: 70,
  },
  content: {
    color: "#2F2D51",
    fontSize: 15,
    fontFamily: "Inter-Regular",
    lineHeight: 35,
    marginBottom: 70,
  },
});

export default DevoListScreen;
