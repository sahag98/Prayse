import React, { useState, useEffect, useRef } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Moment from "moment";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
} from "@lib/customStyles";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { posthog } from "@lib/posthog";

import { addFolder } from "../redux/folderReducer";
import { JOURNAL_SCREEN, PRAYER_ROOM_SCREEN } from "../routes";

import FolderItem from "./FolderItem";
import { ActualTheme } from "../types/reduxTypes";
import AddListModal from "@modals/AddListModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CheckReview } from "@hooks/useShowReview";
import { router } from "expo-router";
import { cn } from "@lib/utils";
import useStore from "@hooks/store";
import * as Haptics from "expo-haptics";

const Folder = ({
  colorScheme,
  navigation,
}: {
  colorScheme: string;
  navigation: any;
}) => {
  const folders = useSelector((state: any) => state.folder.folders);
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const tabTranslateX = useSharedValue(0);
  const [folderName, setFolderName] = useState("");
  const [prayerTab, setPrayerTab] = useState("lists");
  const [tabWidth, setTabWidth] = useState(0);
  const { journals, reviewRequested, setReviewRequested } = useStore();
  const plusOpacity = useSharedValue(prayerTab === "lists" ? 1 : 0);
  const videoOpacity = useSharedValue(prayerTab === "journals" ? 1 : 0);
  // Fade animation for FlatList
  const flatListOpacity = useSharedValue(1);
  useEffect(() => {
    flatListOpacity.value = 0;
    flatListOpacity.value = withTiming(1, { duration: 300 });
  }, [prayerTab]);
  const flatListAnimatedStyle = useAnimatedStyle(() => ({
    opacity: flatListOpacity.value,
  }));

  useEffect(() => {
    tabTranslateX.value = withTiming(prayerTab === "lists" ? 0 : tabWidth, {
      duration: 250,
    });
  }, [prayerTab, tabWidth]);

  useEffect(() => {
    if (prayerTab === "lists") {
      plusOpacity.value = withTiming(1, { duration: 200 });
      videoOpacity.value = withTiming(0, { duration: 200 });
    } else {
      plusOpacity.value = withTiming(0, { duration: 200 });
      videoOpacity.value = withTiming(1, { duration: 200 });
    }
  }, [prayerTab]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabTranslateX.value }],
    };
  });

  const plusIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: plusOpacity.value,
  }));
  const videoIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: videoOpacity.value,
  }));

  const dispatch = useDispatch();

  async function addNewFolder() {
    dispatch(
      addFolder({
        id: uuid.v4(),
        name: folderName,
        prayers: [],
      }),
    );

    setFolderName("");
    bottomSheetModalRef.current?.close();

    if (folders.length === 3 && !reviewRequested) {
      await CheckReview();
      setReviewRequested(true);
    }
    // setAddVisible(false);
    // setFolderName("");
  }

  const handleGuidedPrayerPress = async () => {
    posthog.capture("Prayer room");
    navigation.navigate(PRAYER_ROOM_SCREEN);
  };

  const renderItem = ({ item }: any) => {
    return (
      <FolderItem
        actualTheme={actualTheme}
        item={item}
        navigation={navigation}
      />
    );
  };

  return (
    <>
      <View className="px-4 h-full">
        <View className="mt-0 flex-row justify-between items-center">
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="pb-3 font-inter-bold text-3xl text-light-primary dark:text-dark-primary"
          >
            Prayer
          </Text>
        </View>
        <View
          onLayout={(e) => {
            const width = e.nativeEvent.layout.width;
            setTabWidth(width / 2);
          }}
          className="mb-4 relative flex-row bg-light-secondary dark:bg-dark-secondary p-2 rounded-full overflow-hidden"
        >
          {/* Animated Background Indicator */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "0%",
                width: "49%",
                marginVertical: 5,
                marginHorizontal: 5,

                borderRadius: 9999,
                backgroundColor: colorScheme === "dark" ? "#a5c9ff" : "#2f2d51",
              },
              animatedIndicatorStyle,
            ]}
          />

          {/* Lists Tab */}
          <Pressable
            onPress={() => setPrayerTab("lists")}
            className="flex-1 items-center justify-center p-2 z-10"
          >
            <Text
              className={cn(
                "font-inter-bold",
                prayerTab === "lists"
                  ? "text-light-background text-lg dark:text-dark-background"
                  : "text-light-primary text-lg dark:text-dark-primary",
              )}
            >
              Lists
            </Text>
          </Pressable>

          {/* Journals Tab */}
          <Pressable
            onPress={() => setPrayerTab("journals")}
            className="flex-1 items-center justify-center p-2 z-10"
          >
            <Text
              className={cn(
                "font-inter-bold",
                prayerTab === "journals"
                  ? "text-light-background text-lg dark:text-dark-background"
                  : "text-light-primary text-lg dark:text-dark-primary",
              )}
            >
              Journals
            </Text>
          </Pressable>
        </View>

        {prayerTab === "lists" ? (
          <View className="flex-1">
            <Animated.View style={[{ flex: 1 }, flatListAnimatedStyle]}>
              <FlatList
                data={folders}
                keyExtractor={(item) => item.id}
                onEndReachedThreshold={0}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                initialNumToRender={6}
                contentContainerStyle={{ flexGrow: 1, gap: 10 }}
                windowSize={8}
                renderItem={renderItem}
                numColumns={2}
                ListEmptyComponent={() => (
                  <View className="flex-1  justify-center items-center">
                    <Ionicons
                      name="list-outline"
                      size={60}
                      color={
                        actualTheme && actualTheme.MainTxt
                          ? actualTheme.MainTxt
                          : colorScheme === "dark"
                            ? "white"
                            : "#2f2d51"
                      }
                    />
                    <Text
                      style={getMainTextColorStyle(actualTheme)}
                      className="font-inter-medium text-light-primary dark:text-white text-lg"
                    >
                      Start by creating a prayer list!
                    </Text>
                  </View>
                )}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  columnGap: 8,
                }}
              />
            </Animated.View>
          </View>
        ) : (
          <>
            {/* <View className="bg-white dark:bg-dark-secondary p-3 items-center flex-row justify-between rounded-xl">
              <View className="items-center gap-1">
                <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary">
                  {(() => {
                    const currentMonth = Moment().month();
                    const journalsInMonth = journals.filter(
                      (journal) => Moment(journal.date).month() === currentMonth
                    );
                    return journalsInMonth.length;
                  })()}
                </Text>
                <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
                  This Month
                </Text>
              </View>
              <View className="items-center gap-1">
                <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary">
                  {journals.length}
                </Text>
                <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
                  Total Journals
                </Text>
              </View>
              <View className="items-center gap-1">
                <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary">
                  {(() => {
                    const totalMinutes = journals.reduce(
                      (acc, journal) => acc + Number(journal.time),
                      0
                    );
                    const hours = (totalMinutes / 60).toFixed(1);
                    return `${hours} hrs`;
                  })()}
                </Text>
                <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
                  Time Spent
                </Text>
              </View>
            </View> */}
            <View className="gap-4 flex-1">
              <Animated.View style={[{ flex: 1 }, flatListAnimatedStyle]}>
                <FlatList
                  data={journals}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1, gap: 10 }}
                  keyExtractor={(item) => item.date.toString()}
                  ListEmptyComponent={
                    <View className="flex-1  items-center justify-center gap-2">
                      <Feather
                        name="video"
                        size={55}
                        color={
                          actualTheme && actualTheme.PrimaryTxt
                            ? actualTheme.PrimaryTxt
                            : colorScheme === "dark"
                              ? "white"
                              : "#2f2d51"
                        }
                      />
                      <Text className="font-inter-semibold text-xl text-light-primary dark:text-dark-primary">
                        No journals yet
                      </Text>
                      <Text className="font-inter-regular text-light-primary dark:text-dark-primary">
                        Start journaling to see your progress!
                      </Text>
                    </View>
                  }
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => router.push(`/journal/view/${item.date}`)}
                      className="p-3 rounded-xl bg-light-secondary dark:bg-dark-secondary"
                    >
                      <View className="gap-4 rounded-xl bg-light-secondary dark:bg-dark-secondary">
                        <View className="flex-row gap-5 items-start justify-between">
                          <View className="flex-row flex-1 items-center gap-2">
                            <Text className="font-inter-semibold text-light-primary dark:text-dark-primary">
                              {item.content.split(" ").slice(0, 12).join(" ")}
                              ...
                            </Text>
                          </View>
                          <View className="flex-row bg-white dark:bg-dark-background px-2 py-1 rounded-lg items-center gap-1">
                            <Ionicons
                              name="time-outline"
                              size={15}
                              color={
                                colorScheme === "dark" ? "white" : "#2f2d51"
                              }
                            />
                            <Text className="font-inter-medium text-sm text-light-primary dark:text-dark-primary">
                              {item.type === "video"
                                ? `${Math.floor(Number(item.time) / 60)
                                    .toString()
                                    .padStart(2, "0")}:${(
                                    Number(item.time) % 60
                                  )
                                    .toString()
                                    .padStart(2, "0")}`
                                : `${Math.floor(Number(item.time) / 60)}:${
                                    Number(item.time) % 60
                                  }`}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row items-center gap-2">
                          <View className="flex-row gap-1 items-center">
                            <Feather
                              name="calendar"
                              size={15}
                              color={
                                colorScheme === "dark" ? "white" : "#2f2d51"
                              }
                            />
                            <Text className="font-inter-medium text-sm text-light-primary dark:text-dark-primary">
                              {Moment(item.date).isSame(Moment(), "day")
                                ? "Today"
                                : Moment(item.date).isSame(
                                      Moment().subtract(1, "days"),
                                      "day",
                                    )
                                  ? "Yesterday"
                                  : `${Moment().diff(
                                      Moment(item.date),
                                      "days",
                                    )} days ago`}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  )}
                />
              </Animated.View>
            </View>
          </>
        )}

        <View className="absolute self-center  justify-between w-full flex-row bottom-4">
          <TouchableOpacity
            onPress={handleGuidedPrayerPress}
            className="dark:bg-dark-secondary border border-light-background dark:border-dark-background relative flex-row items-center justify-center gap-2 bg-light-secondary p-4 rounded-xl  shadow-gray-300 dark:shadow-none"
          >
            <Text className="font-inter-bold text-lg text-light-primary dark:text-dark-primary">
              Pray
            </Text>

            <MaterialCommunityIcons
              name="hands-pray"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            onPress={() => {
              if (process.env.EXPO_OS === "ios") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              if (prayerTab === "lists") {
                bottomSheetModalRef.current?.present();
                posthog.capture("Create folder");
              } else if (prayerTab === "journals") {
                router.push(`${JOURNAL_SCREEN}/new`);
              }
            }}
            className="dark:bg-dark-accent flex-row items-center justify-center gap-2 bg-light-primary rounded-full size-20  shadow-gray-300 dark:shadow-none"
          >
            <View style={{ position: "relative", width: 28, height: 28 }}>
              <Animated.View
                style={[
                  { position: "absolute", width: 28, height: 28 },
                  plusIconAnimatedStyle,
                ]}
              >
                <AntDesign
                  name="plus"
                  size={28}
                  color={
                    actualTheme && actualTheme.PrimaryTxt
                      ? actualTheme.PrimaryTxt
                      : colorScheme === "dark"
                        ? "#121212"
                        : "white"
                  }
                />
              </Animated.View>
              <Animated.View
                style={[
                  { position: "absolute", width: 28, height: 28 },
                  videoIconAnimatedStyle,
                ]}
              >
                <Feather
                  name="video"
                  size={28}
                  color={
                    actualTheme && actualTheme.PrimaryTxt
                      ? actualTheme.PrimaryTxt
                      : colorScheme === "dark"
                        ? "#121212"
                        : "white"
                  }
                />
              </Animated.View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <AddListModal
        actualTheme={actualTheme}
        addNewFolder={addNewFolder}
        colorScheme={colorScheme}
        folderName={folderName}
        setFolderName={setFolderName}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
};

export default Folder;
