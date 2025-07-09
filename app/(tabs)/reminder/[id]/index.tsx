import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import React from "react";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { Container, HeaderView } from "@styles/appStyles";
import {
  getMainBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { useColorScheme } from "nativewind";
import { useDispatch, useSelector } from "react-redux";
import { cancelScheduledNotificationAsync } from "expo-notifications";
//@ts-ignore
import { ActualTheme } from "@types/reduxTypes";
import { posthog } from "@lib/posthog";
import { FontAwesome5, Ionicons, AntDesign } from "@expo/vector-icons";
import { REMINDER_SCREEN, TEST_SCREEN } from "@routes";
import { deleteReminder, handleReminderAmen } from "@redux/remindersReducer";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolateColor,
} from "react-native-reanimated";
import { switchPrayerStatus } from "@redux/prayerReducer";
import * as DropdownMenu from "zeego/dropdown-menu";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SingleReminderScreen = () => {
  const { colorScheme } = useColorScheme();
  const dispatch = useDispatch();
  const prayerList = useSelector((state: any) => state.prayer.prayer);
  const reminders = useSelector(
    (state: { reminder: { reminders: any[] } }) => state.reminder.reminders,
  );
  const navigation = useNavigation();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const { id } = useLocalSearchParams();

  const singleReminder = reminders.find(
    (reminder) => reminder.reminder.id === id,
  );

  const prayer = prayerList.find(
    (p: any) => p.id === singleReminder?.reminder?.prayer_id,
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

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        buttonProgress.value,
        [0, 1],
        [colorScheme === "dark" ? "#a5c9ff" : "#2f2d51", "#4ade80"],
      ),
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        buttonProgress.value,
        [0, 1],
        [colorScheme === "dark" ? "#121212" : "#ffffff", "#000000"],
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

  console.log(singleReminder);

  function handleAmen() {
    posthog.capture("Amen");
    buttonProgress.value = withTiming(1, { duration: 800 });
    textProgress.value = withTiming(1, { duration: 800 });
    dispatch(handleReminderAmen(singleReminder.reminder.id));

    setTimeout(() => router.push(REMINDER_SCREEN), 1000);
    if (singleReminder.ocurrence === "None") {
      setTimeout(
        () => dispatch(deleteReminder(singleReminder?.reminder.id)),
        1300,
      );
    }
  }

  function handlePrayerStatus(
    prayer: any,
    newStatus: "Active" | "Answered" | "Archived" | null,
  ) {
    dispatch(switchPrayerStatus({ prayer, newStatus }));
  }

  if (!singleReminder) return null;

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      //@ts-ignore
      className="bg-light-background dark:bg-dark-background flex-1"
    >
      <HeaderView>
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
        <View className="flex-row items-center gap-4">
          <Pressable
            onPress={() =>
              //@ts-expect-error
              navigation.navigate(TEST_SCREEN, {
                type: "Edit",
                reminderEditId: singleReminder.reminder.id,
                reminderEditPrayerId: singleReminder.reminder.prayer_id,
                reminderIdentifier: singleReminder.identifier,
                ocurrence: singleReminder.ocurrence,
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
                ],
              )
            }
          >
            <Ionicons name="trash-outline" size={24} color="red" />
          </Pressable>
        </View>
      </HeaderView>
      <ScrollView contentContainerClassName="gap-5 mt-7">
        <View className="w-full flex-row justify-between items-center">
          <View className="flex-row bg-light-secondary dark:bg-dark-secondary self-start rounded-lg p-2 items-center gap-2">
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
                {singleReminder.ocurrence} at {formattedDate}
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
                    className="self-start flex-row items-center gap-2 p-2 rounded-lg bg-light-secondary dark:bg-dark-secondary"
                    // onPress={() => {
                    //   console.log("hereeee");
                    //   setIsChangingStatus(true);
                    // }}
                  >
                    <Text className="font-inter-semibold text-light-primary dark:text-dark-primary">
                      {prayer?.status}
                    </Text>
                    <AntDesign
                      name="down"
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
      <AnimatedPressable
        onPress={handleAmen}
        style={[animatedButtonStyle]}
        className="mt-auto flex-row gap-2 absolute bottom-0 self-center w-full mb-4 p-4 rounded-lg justify-center items-center"
      >
        <View className="items-center justify-center">
          <Animated.Text
            style={[animatedTextStyle, animatedTextContentStyle]}
            className="font-inter-bold text-lg"
          >
            Amen 🙏
          </Animated.Text>
          <Animated.Text
            style={[animatedTextStyle, animatedCheckStyle]}
            className="font-inter-bold text-lg"
          >
            ✓
          </Animated.Text>
        </View>
      </AnimatedPressable>
    </Container>
  );
};

export default SingleReminderScreen;
