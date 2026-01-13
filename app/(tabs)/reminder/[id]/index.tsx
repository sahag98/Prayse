import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";

import { getSecondaryTextColorStyle } from "@lib/customStyles";
import { useColorScheme } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { cancelScheduledNotificationAsync } from "expo-notifications";
//@ts-ignore
import { ActualTheme } from "@types/reduxTypes";
import { posthog } from "@lib/posthog";
import { FontAwesome5, Ionicons, AntDesign } from "@expo/vector-icons";
import { REMINDER_SCREEN, SET_REMINDER_SCREEN } from "@routes";
import { deleteReminder, handleReminderAmen } from "@redux/remindersReducer";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolateColor,
  cancelAnimation,
  runOnJS,
  withRepeat,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { switchPrayerStatus } from "@redux/prayerReducer";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Container } from "@components/Container";

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SingleReminderScreen = () => {
  const { colorScheme } = useColorScheme();
  const dispatch = useDispatch();
  const prayerList = useSelector((state: any) => state.prayer.prayer);
  const reminders = useSelector(
    (state: { reminder: { reminders: any[] } }) => state.reminder.reminders
  );
  const navigation = useNavigation();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme
  );
  const { id } = useLocalSearchParams();

  const singleReminder = reminders.find(
    (reminder) => reminder.reminder.id === id
  );

  const prayer = prayerList.find(
    (p: any) => p.id === singleReminder?.reminder?.prayer_id
  );

  //   console.log(JSON.stringify(singleReminder, null, 2));
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const timestamp = new Date(singleReminder?.reminder.time);
  let timeOptions;

  let dayOfWeekName;

  if (singleReminder?.ocurrence === "Daily") {
    const options = {
      hour: "numeric",
      minute: "numeric",
    };
    timeOptions = options;
  } else if (singleReminder?.ocurrence === "Weekly") {
    const dayOfWeekNumber = timestamp.getDay();
    dayOfWeekName = daysOfWeek[dayOfWeekNumber];

    const options = {
      hour: "numeric",
      minute: "numeric",
    };

    timeOptions = options;
  } else if (singleReminder?.ocurrence === "Monthly") {
    const dayOfWeekNumber = timestamp.getDay();
    dayOfWeekName = daysOfWeek[dayOfWeekNumber];

    const options = {
      hour: "numeric",
      minute: "numeric",
    };

    timeOptions = options;
  } else if (singleReminder?.ocurrence === "None") {
    const options = {
      month: "short",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
    };
    timeOptions = options;
  }

  const dismissNotification = async () => {
    dispatch(deleteReminder(singleReminder?.reminder.id));
    await cancelScheduledNotificationAsync(singleReminder.identifier);
    router.replace(REMINDER_SCREEN);
  };

  //@ts-ignore
  const formattedDate = timestamp.toLocaleString("en-US", timeOptions);

  const buttonProgress = useSharedValue(0);
  const textProgress = useSharedValue(0);
  const holdProgress = useSharedValue(0);
  const buttonWidth = useSharedValue(0);
  const buttonHeight = useSharedValue(0);
  const [showAmenModal, setShowAmenModal] = useState(false);
  const hapticsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pulse = useSharedValue(0);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        buttonProgress.value,
        [0, 1],
        [colorScheme === "dark" ? "#a5c9ff" : "#2f2d51", "#4ade80"]
      ),

      transform: [{ scale: 1 + 0.025 * pulse.value }], // pulse the button itself
      borderWidth: 1 + 6.5 * pulse.value, // grows from 1 → 3
      borderColor:
        colorScheme === "light"
          ? `rgba(186, 185, 216, ${0.5 + 0.5 * (1 - pulse.value)})`
          : `rgba(67, 142, 255, ${0.5 + 0.5 * (1 - pulse.value)})`,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        buttonProgress.value,
        [0, 1],
        [colorScheme === "dark" ? "#121212" : "#ffffff", "#000000"]
      ),
    };
  });

  const animatedTextContentStyle = useAnimatedStyle(() => ({
    opacity: 1 - textProgress.value,
  }));

  const animatedCheckStyle = useAnimatedStyle(() => ({
    opacity: textProgress.value,
    position: "absolute",
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: buttonWidth.value * holdProgress.value,
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#4ade80",
  }));

  useEffect(() => {
    pulse.value = withRepeat(withTiming(0.8, { duration: 3000 }), -1, true);
  }, []);

  function handleAmenSuccess() {
    posthog.capture("Amen");
    dispatch(handleReminderAmen(singleReminder.reminder.id));
    setShowAmenModal(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setShowAmenModal(false), 5000);
    setTimeout(() => router.push(REMINDER_SCREEN), 5050);
    if (singleReminder.ocurrence === "None") {
      setTimeout(
        () => dispatch(deleteReminder(singleReminder?.reminder.id)),
        1600
      );
    }
  }

  const startHaptics = () => {
    if (hapticsIntervalRef.current) return;
    // Initial haptic feedback when starting to hold
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Continuous haptic feedback during hold with less frequent intervals
    hapticsIntervalRef.current = setInterval(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 200);
  };

  const stopHaptics = () => {
    if (hapticsIntervalRef.current) {
      clearInterval(hapticsIntervalRef.current);
      hapticsIntervalRef.current = null;
    }
  };

  const stopHapticsWithFeedback = () => {
    if (hapticsIntervalRef.current) {
      clearInterval(hapticsIntervalRef.current);
      hapticsIntervalRef.current = null;
      // Provide subtle feedback when releasing early
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const holdGesture = Gesture.LongPress()
    .minDuration(1200)
    .onBegin(() => {
      cancelAnimation(holdProgress);
      holdProgress.value = withTiming(1, { duration: 1200 }, (finished) => {
        if (finished) {
          runOnJS(stopHaptics)();
          runOnJS(handleAmenSuccess)();
        }
      });
      runOnJS(startHaptics)();
    })
    .onFinalize(() => {
      if (holdProgress.value < 1) {
        cancelAnimation(holdProgress);
        holdProgress.value = withTiming(0, { duration: 200 });
        runOnJS(stopHapticsWithFeedback)();
      } else {
        runOnJS(stopHaptics)();
      }
    });

  function handlePrayerStatus(
    prayer: any,
    newStatus: "Active" | "Answered" | "Archived" | null
  ) {
    dispatch(switchPrayerStatus({ prayer, newStatus }));
  }

  if (!singleReminder) return null;

  return (
    <Container
      //@ts-ignore
      className="bg-light-background dark:bg-dark-background flex-1"
    >
      <View className="flex-row justify-between items-center mb-4">
        <Link className="items-center" asChild href={`/${REMINDER_SCREEN}`}>
          <Pressable>
            <Ionicons
              name="chevron-back"
              size={30}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "light"
                  ? "#2f2d51"
                  : "white"
              }
            />
          </Pressable>
        </Link>
        <View className="flex-row items-center gap-8">
          <Pressable
            onPress={() =>
              //@ts-expect-error
              navigation.navigate(SET_REMINDER_SCREEN, {
                type: "Edit",
                reminderEditId: singleReminder.reminder.id,
                reminderEditPrayerId: singleReminder.reminder.prayer_id,
                reminderIdentifier: singleReminder.identifier,
                ocurrence: singleReminder.ocurrence,
                prayer_times: singleReminder.prayer_times,
                reminderToEditTitle: singleReminder.reminder.message,
                reminderToEditNote: singleReminder.reminder.note,
                reminderToEditTime: singleReminder.reminder.time.toString(),
              })
            }
          >
            <FontAwesome5
              name="edit"
              size={24}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "light"
                  ? "#2f2d51"
                  : "white"
              }
            />
          </Pressable>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Delete Reminder",
                "This action will permenantly delete this reminder.",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: dismissNotification,
                  },
                ]
              )
            }
          >
            <Ionicons name="trash-outline" size={28} color="#ff3333" />
          </Pressable>
        </View>
      </View>
      <ScrollView contentContainerClassName="gap-5 mt-7">
        <View className="w-full flex-row justify-between items-center">
          <View className="flex-row bg-light-secondary dark:bg-dark-secondary self-start rounded-xl px-3 py-2 items-center gap-2">
            <Ionicons
              name="time-outline"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                  ? "#d2d2d2"
                  : "#2f2d51"
              }
            />
            {singleReminder.ocurrence === "Daily" && (
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-medium text-sm text-light-primary dark:text-dark-primary"
              >
                {singleReminder.ocurrence} @ {formattedDate}
              </Text>
            )}
            {singleReminder.ocurrence === "Weekly" && (
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-medium text-sm text-light-primary dark:text-dark-primary"
              >
                {singleReminder.ocurrence} on {dayOfWeekName} @ {formattedDate}
              </Text>
            )}
            {singleReminder.ocurrence === "Monthly" && (
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-medium text-sm text-light-primary dark:text-dark-primary"
              >
                {singleReminder.ocurrence} on {dayOfWeekName} {formattedDate}
              </Text>
            )}
            {singleReminder.ocurrence === "None" && (
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-medium text-sm text-light-primary dark:text-dark-primary"
              >
                {formattedDate}
              </Text>
            )}
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="dark:text-dark-primary text-light-primary font-inter-regular text-sm">
              You've prayed{" "}
              <Text className="font-inter-bold text-base">
                {singleReminder.prayer_times ? singleReminder.prayer_times : 0}
              </Text>
              {singleReminder.prayer_times < 2 ? " time" : " times"}
            </Text>
          </View>
        </View>

        <View className="gap-3">
          <View className="flex-row gap-3 justify-between items-center">
            <Text
              //   numberOfLines={1}
              className="text-2xl flex-1 text-light-primary dark:text-dark-primary font-inter-semibold"
            >
              {singleReminder.reminder.message}
            </Text>

            <View className="flex-row items-center">
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Pressable
                    className="self-start flex-row items-center gap-2 px-4 py-2 rounded-lg bg-light-secondary dark:bg-dark-secondary"
                    // onPress={() => {
                    //   console.log("hereeee");
                    //   setIsChangingStatus(true);
                    // }}
                  >
                    <Text className="font-inter-semibold text-sm text-light-primary dark:text-dark-primary">
                      {prayer?.status}
                    </Text>
                    <AntDesign
                      name="down"
                      size={12}
                      color={
                        actualTheme && actualTheme.MainTxt
                          ? actualTheme.MainTxt
                          : colorScheme === "light"
                          ? "#2f2d51"
                          : "white"
                      }
                    />
                  </Pressable>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DropdownMenu.Item
                    onSelect={() => handlePrayerStatus(prayer, "Active")}
                    key="1"
                  >
                    <DropdownMenu.ItemTitle>Active</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onSelect={() => handlePrayerStatus(prayer, "Answered")}
                    key="2"
                  >
                    <DropdownMenu.ItemTitle>Answered</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item
                    key="3"
                    onSelect={() => handlePrayerStatus(prayer, "Archived")}
                  >
                    <DropdownMenu.ItemTitle>Archived</DropdownMenu.ItemTitle>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
              <View />
              {/* <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Pressable
                  className="self-start flex-row items-center gap-2 p-2 rounded-lg bg-light-secondary dark:bg-dark-secondary"
                  onPress={() => {
                    console.log("hereeee");
                    setIsChangingStatus(true);
                  }}
                >
                  <Text className="font-inter-semibold text-light-primary dark:text-dark-primary">
                    {prayer?.status}
                  </Text>
                  <AntDesign
                    name={isChangingStatus ? "up" : "down"}
                    size={15}
                    color={
                      actualTheme && actualTheme.MainTxt
                        ? actualTheme.MainTxt
                        : colorScheme === "light"
                          ? "#2f2d51"
                          : "white"
                    }
                  />
                </Pressable>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Label>Change Status</DropdownMenu.Label>
                <DropdownMenu.Item onSelect={handlePrayerStatus} key="1">
                  <DropdownMenu.ItemTitle>Active</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
                <DropdownMenu.Item onSelect={handlePrayerStatus} key="2">
                  <DropdownMenu.ItemTitle>Answered</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>

                <DropdownMenu.Item
                  key="3"
                  onSelect={() => dispatch(archivePrayer(prayer))}
                >
                  <DropdownMenu.ItemTitle>Archived</DropdownMenu.ItemTitle>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root> */}
            </View>
          </View>
        </View>
        <View className="gap-2">
          <Text className="text-light-primary text-lg dark:text-dark-primary font-inter-medium">
            Notes
          </Text>
          <View className="w-full h-[0.5px] bg-light-primary dark:bg-dark-primary" />
          {singleReminder.reminder.note ? (
            <Text className="text-light-primary text-sm dark:text-dark-primary font-inter-regular">
              {singleReminder.reminder.note}
            </Text>
          ) : (
            <Text className="text-light-primary text-sm dark:text-dark-primary font-inter-regular">
              You don't have any notes for this prayer.
            </Text>
          )}
        </View>
      </ScrollView>
      <GestureDetector gesture={holdGesture}>
        <View className="mt-auto absolute bottom-0 self-center w-full mb-4">
          {/* Pulse ring behind the button (full-width, not clipped) */}
          {/* <Animated.View style={[pulseRingStyle]} /> */}
          {/* Actual button with clipping for fill overlay */}
          {/* <Animated.View style={[pulseBorderStyle]} /> */}
          <Animated.View
            onLayout={(e) => {
              buttonWidth.value = e.nativeEvent.layout.width;
              buttonHeight.value = e.nativeEvent.layout.height;
            }}
            style={[animatedButtonStyle, { overflow: "hidden", zIndex: 1 }]}
            className="w-full flex-row gap-2 p-5 rounded-xl justify-center items-center"
          >
            <Animated.View pointerEvents="none" style={[fillStyle]} />
            <View className="items-center justify-center">
              <Animated.Text
                style={[animatedTextStyle, animatedTextContentStyle]}
                className="font-inter-bold text-lg"
              >
                Hold to say Amen 🙏
              </Animated.Text>
              <Animated.Text
                style={[animatedTextStyle, animatedCheckStyle]}
                className="font-inter-bold text-lg"
              >
                ✓
              </Animated.Text>
            </View>
          </Animated.View>
        </View>
      </GestureDetector>

      <Modal
        transparent
        visible={showAmenModal}
        animationType="fade"
        onRequestClose={() => setShowAmenModal(false)}
      >
        <View className="flex-1 items-center justify-center">
          <View className="bg-[#00000099] absolute inset-0" />
          <View className="bg-light-secondary dark:bg-dark-secondary px-6 py-4 w-4/5 rounded-xl items-center justify-center">
            <Text className="font-inter-semibold text-xl text-light-primary dark:text-dark-primary">
              Every single prayer counts.
            </Text>
            <Text className="font-inter-regular text-sm text-light-primary dark:text-dark-primary mt-1">
              “For the eyes of the Lord are on the righteous, and His ears are
              open to their prayers.” – 1 Peter 3:12
            </Text>
          </View>
        </View>
      </Modal>
    </Container>
  );
};

export default SingleReminderScreen;
