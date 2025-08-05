// @ts-nocheck
import React, { useCallback, useState } from "react";
import * as Notifications from "expo-notifications";
import {
  Link,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, Feather } from "@expo/vector-icons";
import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "@types/reduxTypes";
import { posthog } from "@lib/posthog";
import calendar from "../assets/calendar.png";
import time from "../assets/time.png";
import {
  addNewReminder,
  deleteReminder,
  editReminder,
} from "../redux/remindersReducer";
import { REMINDER_SCREEN, SETTINGS_SCREEN } from "../routes";
import useStore from "@hooks/store";
import { CheckReview } from "@hooks/useShowReview";
import { Container } from "@components/Container";

export default function TestScreen() {
  const navigation = useNavigation();
  const routeParams = useLocalSearchParams();
  console.log("params: ", routeParams.prayer_times);

  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [newNote, setNewNote] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [repeatOption, setRepeatOption] = useState("");
  const [reminderDate, setReminderDate] = useState(null);
  const [reminderTime, setReminderTime] = useState(null);
  const { colorScheme } = useColorScheme();
  const [isRepeat, setIsRepeat] = useState(false);
  const [isIOSDatePickerVisible, setIOSDatePickerVisible] = useState(false);
  const [isIOSTimePickerVisible, setIOSTimePickerVisible] = useState(false);

  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const toggleSwitch = () => {
    setIsRepeat((previousState) => !previousState);
    setRepeatOption("");
  };
  const dispatch = useDispatch();

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.

      if (routeParams.reminder !== undefined && routeParams.type === "Add") {
        setReminderDate(null);
        setRepeatOption("");
        setIsRepeat(false);
        setReminderTime(null);
        setNewReminder(routeParams?.reminder);
        if (routeParams.note) {
          console.log("here");
          setNewNote(routeParams.note);
        }
      }

      if (routeParams.reminder === undefined && routeParams.type === "Add") {
        setNewReminder("");
        setNewNote("");
        setReminderDate(null);
        setRepeatOption("");
        setIsRepeat(false);
        setReminderTime(null);
      }

      if (routeParams.reminderToEditTitle && routeParams.type !== "Add") {
        setNewReminder(routeParams.reminderToEditTitle);
        setNewNote(routeParams.reminderToEditNote);
        const originalTimestamp = routeParams.reminderToEditTime;

        const dateObject = new Date(originalTimestamp);
        const date = new Date(
          dateObject.getFullYear(),
          dateObject.getMonth(),
          dateObject.getDate(),
        );
        setReminderDate(date);
        const time = new Date(0); // Initialize with the epoch
        time.setHours(dateObject.getHours());
        time.setMinutes(dateObject.getMinutes());

        setReminderTime(time);

        if (routeParams.ocurrence !== "None") {
          setIsRepeat(true);
          setRepeatOption(routeParams.ocurrence.toLowerCase());
        }

        if (routeParams.ocurrence === "None") {
          setIsRepeat(false);
          setRepeatOption("");
        }
      }
      // Return function is invoked whenever the route gets out of focus.
    }, []),
  );

  const router = useRouter();

  const { reviewRequested, setReviewRequested } = useStore();

  const showToast = (type) => {
    Toast.show({
      type,
      text1: "Reminder has been created.",
      text2: "View",
      visibilityTime: 3000,
      position: "bottom",
      onPress: () => router.replace("/(tabs)/reminder"),
    });
  };

  const scheduleNotification = async (reminder, combinedDate, type) => {
    console.log("type: ", type);
    const secondsUntilNotification = Math.floor(
      (combinedDate.getTime() - Date.now()) / 1000,
    );

    if (repeatOption === "daily" && isRepeat) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Pray 🙏",
          body: reminder.message,
          data: { screen: REMINDER_SCREEN, reminder_id: reminder.id },
          sound: "default",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: combinedDate.getHours(),
          minute: combinedDate.getMinutes(),
          repeats: true,
        },
      });
      if (type === "edit") {
        dispatch(
          editReminder({
            reminder,
            identifier,
            prayer_times: routeParams.prayer_times,
            ocurrence: "Daily",
          }),
        );
      } else {
        dispatch(
          addNewReminder({
            reminder,
            identifier,
            prayer_times: routeParams.prayer_times,
            ocurrence: "Daily",
          }),
        );
      }
    } else if (repeatOption === "weekly" && Platform.OS === "ios") {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Pray 🙏",
          body: reminder.message,
          data: { url: REMINDER_SCREEN, reminder_id: reminder.id },
          sound: "default",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: combinedDate.getDay() + 1,
          hour: combinedDate.getHours(),
          minute: combinedDate.getMinutes(),
          repeats: isRepeat,
        },
      });

      if (type === "edit") {
        dispatch(
          editReminder({
            reminder,
            identifier,
            prayer_times: routeParams.prayer_times,
            ocurrence: "Weekly",
          }),
        );
      } else {
        dispatch(
          addNewReminder({
            reminder,
            identifier,
            prayer_times: routeParams.prayer_times,
            ocurrence: "Weekly",
          }),
        );
      }
    } else if (repeatOption === "weekly" && Platform.OS === "android") {
      const newDate = new Date(
        combinedDate.getTime() + 6 * 24 * 60 * 60 * 1000,
      );
      const seconds = newDate.getTime() / 1000;
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Pray 🙏",
          body: reminder.message,
          data: { url: REMINDER_SCREEN, reminder_id: reminder.id },
          sound: "default",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          seconds,
          repeats: isRepeat,
        },
      });

      if (type === "edit") {
        dispatch(
          editReminder({
            reminder,
            identifier,
            prayer_times: routeParams.prayer_times,
            ocurrence: "Weekly",
          }),
        );
      } else {
        dispatch(
          addNewReminder({
            reminder,
            identifier,
            prayer_times: routeParams.prayer_times,
            ocurrence: "Weekly",
          }),
        );
      }
    } else {
      console.log("HEREEE", secondsUntilNotification);
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Pray 🙏",
          body: reminder.message,
          data: { url: REMINDER_SCREEN, reminder_id: reminder.id },
          sound: "default",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilNotification,
        },
      });

      if (type === "edit") {
        dispatch(
          editReminder({
            reminder,
            identifier,
            prayer_times: routeParams.prayer_times,
            ocurrence: "None",
          }),
        );
      } else {
        dispatch(
          addNewReminder({
            reminder,
            identifier,
            prayer_times: routeParams.prayer_times,
            ocurrence: "None",
          }),
        );
      }
    }
  };

  const handleEditReminder = async () => {
    if (!reminderDate || !reminderTime) {
      Toast.show({
        type: "error",
        text1: "Please select both date and time.",
      });
      return;
    }
    const combinedDate = new Date(
      reminderDate.getFullYear(),
      reminderDate.getMonth(),
      reminderDate.getDate(),
      reminderTime.getHours(),
      reminderTime.getMinutes(),
    );

    const newReminderObj = {
      id: uuid.v4(),
      message: newReminder,
      prayer_id: routeParams.reminderEditPrayerId,

      note: newNote,
      time: combinedDate,
    };

    await Notifications.cancelScheduledNotificationAsync(
      routeParams.reminderIdentifier,
    );

    dispatch(deleteReminder(routeParams.reminderEditId));

    scheduleNotification(newReminderObj, combinedDate, "add");

    setNewReminder("");
    setNewNote("");
    setReminderDate(null);
    setReminderTime(null);
    setRepeatOption("");
    setIsRepeat(false);
    Keyboard.dismiss();
    router.replace(`/reminder/${newReminderObj.id}`);
  };

  const addReminder = async () => {
    if (newReminder.length === 0) {
      setTitleError("Title is required.");
      return;
    }
    if (!reminderDate || !reminderTime) {
      Toast.show({
        type: "error",
        text1: "Please select both date and time.",
      });
      return;
    }
    const combinedDate = new Date(
      reminderDate.getFullYear(),
      reminderDate.getMonth(),
      reminderDate.getDate(),
      reminderTime.getHours(),
      reminderTime.getMinutes(),
    );

    const newReminderObj = {
      id: uuid.v4(),
      message: newReminder,
      prayer_id: routeParams.reminderId,
      prayer_times: routeParams.prayer_times,
      note: newNote,
      time: combinedDate,
    };

    scheduleNotification(newReminderObj, combinedDate, "add");

    setReminders([...reminders, newReminderObj]);
    showToast();
    setNewReminder("");
    setNewNote("");
    setReminderDate(null);
    setReminderTime(null);
    setRepeatOption("");
    setIsRepeat(false);

    if (!reviewRequested) {
      CheckReview();
      setReviewRequested(true);
    }
    posthog.capture("Create reminder");
    navigation.goBack();
    Keyboard.dismiss();
  };

  const clearAll = () => {
    setNewReminder("");
    setShowDatePicker(false);
    setShowTimePicker(false);
    setReminderDate(null);
    setNewNote("");
    setRepeatOption("");
    setReminderTime(null);
    navigation.goBack();
  };

  const handleDatePress = () => {
    Keyboard.dismiss();
    if (Platform.OS === "ios") {
      setIOSDatePickerVisible(true);
    } else {
      setShowDatePicker(true);
    }
  };

  const handleTimePress = () => {
    Keyboard.dismiss();
    if (!reminderDate) {
      const today = new Date();
      setReminderDate(today);
    }
    if (Platform.OS === "ios") {
      setIOSTimePickerVisible(true);
    } else {
      setReminderTime(new Date());
      setShowTimePicker(true);
    }
  };

  // iOS handlers
  const handleIOSDateConfirm = (date) => {
    setIOSDatePickerVisible(false);
    setReminderDate(date);
  };
  const handleIOSDateCancel = () => {
    setIOSDatePickerVisible(false);
  };
  const handleIOSTimeConfirm = (time) => {
    setIOSTimePickerVisible(false);
    setReminderTime(time);
  };
  const handleIOSTimeCancel = () => {
    setIOSTimePickerVisible(false);
  };

  function useDailyOption() {
    const reminderTime = new Date();
    reminderTime.setHours(12, 0, 0, 0); // Set time to 12:00 PM
    setReminderDate(new Date());
    setReminderTime(reminderTime);
    setIsRepeat(true);
    setRepeatOption("daily");
  }

  function useWeeklyOption() {
    const reminderTime = new Date();
    reminderTime.setHours(12, 0, 0, 0); // Set time to 12:00 PM

    const reminderDate = new Date();

    // Calculate days to next Wednesday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = reminderDate.getDay();
    const daysUntilWednesday = (3 - currentDay + 7) % 7 || 7; // Ensure it's at least 1 day ahead
    reminderDate.setDate(reminderDate.getDate() + daysUntilWednesday);

    setReminderDate(reminderDate);
    setReminderTime(reminderTime);
    setIsRepeat(true);
    setRepeatOption("weekly");
  }

  return (
    <Container className="flex-1 justify-center items-center p-4">
      <View className="flex-row justify-between w-full items-center">
        <View className="flex-row gap-2 items-center">
          <TouchableOpacity onPress={clearAll}>
            <AntDesign
              name="left"
              size={24}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>

          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary"
          >
            {routeParams.type} Reminder
          </Text>
        </View>
        <TouchableOpacity
          onPress={
            routeParams.type === "Add" ? addReminder : handleEditReminder
          }
          disabled={newReminder.length === 0 || !reminderTime}
          className="flex-row gap-1 items-center"
        >
          {routeParams.type === "Edit" ? (
            <Feather
              name="edit-2"
              size={23}
              color={
                newReminder.length === 0 || !reminderDate || !reminderTime
                  ? colorScheme === "dark"
                    ? "#5c5c5c"
                    : "#cbcbcb"
                  : actualTheme && actualTheme.Primary
                    ? actualTheme.Primary
                    : colorScheme === "light"
                      ? "#2f2d51"
                      : "#A5C9FF"
              }
            />
          ) : (
            <AntDesign
              name="check"
              size={30}
              color={
                newReminder.length === 0 || !reminderDate || !reminderTime
                  ? colorScheme === "dark"
                    ? "#5c5c5c"
                    : "#cbcbcb"
                  : actualTheme && actualTheme.Primary
                    ? actualTheme.Primary
                    : colorScheme === "light"
                      ? "#2f2d51"
                      : "#A5C9FF"
              }
            />
          )}
        </TouchableOpacity>
      </View>
      <View className="flex-1 mt-3 w-full relative gap-2">
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="dark:bg-dark-secondary bg-light-secondary w-full p-3 rounded-lg gap-2"
        >
          <TextInput
            style={getSecondaryTextColorStyle(actualTheme)}
            className="dark:text-white text-[#2f2d51 font-inter-regular min-h-10 max-h-12"
            placeholderTextColor={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                  ? "#a1a1a1"
                  : "#808080"
            }
            placeholder="Title"
            selectionColor={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
            value={newReminder}
            onChangeText={(text) => setNewReminder(text)}
          />

          <View
            style={
              actualTheme &&
              actualTheme.SecondaryTxt && {
                backgroundColor: actualTheme.SecondaryTxt,
              }
            }
            className="w-full dark:bg-gray-500 bg-light-primary h-[1px]"
          />
          <TextInput
            style={getSecondaryTextColorStyle(actualTheme)}
            placeholderTextColor={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                  ? "#a1a1a1"
                  : "#808080"
            }
            className="min-h-20 max-h-40 dark:text-white font-inter-regular text-[#2f2d51]"
            placeholder="Write notes about the prayer here..."
            selectionColor={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
            multiline
            textAlignVertical="top"
            numberOfLines={3}
            value={newNote}
            onChangeText={(text) => setNewNote(text)}
          />
        </View>
        <Text className="text-center text-light-primary dark:text-dark-primary text-lg my-1 font-inter-semibold">
          Set A Custom Date/Time
        </Text>
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="dark:bg-dark-secondary bg-light-secondary p-3 gap-2 rounded-lg"
        >
          <TouchableOpacity
            onPress={handleDatePress}
            className="w-full flex-row justify-between p-2 items-center"
          >
            <View className="gap-2">
              <View className="flex-row items-center gap-3">
                <Image
                  style={
                    colorScheme === "dark"
                      ? [styles.img, { tintColor: "#A5C9FF" }]
                      : [styles.img, { tintColor: "#2f2d51" }]
                  }
                  source={calendar}
                />
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-medium dark:text-dark-primary text-light-primary"
                >
                  Date
                </Text>
              </View>
              {reminderDate && (
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-regular dark:text-dark-primary text-light-primary"
                >
                  {reminderDate.toDateString()}
                </Text>
              )}
            </View>
            <AntDesign
              name="right"
              size={22}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
          <View
            style={
              actualTheme &&
              actualTheme.SecondaryTxt && {
                backgroundColor: actualTheme.SecondaryTxt,
              }
            }
            className="w-full dark:bg-gray-500 bg-light-primary h-[1px]"
          />
          <TouchableOpacity
            onPress={handleTimePress}
            className="w-full flex-row justify-between p-2"
          >
            <View className="gap-2">
              <View className="flex-row items-center gap-3">
                <Image
                  style={
                    colorScheme === "dark"
                      ? [styles.img, { tintColor: "#A5C9FF" }]
                      : [styles.img, { tintColor: "#2F2D51" }]
                  }
                  source={time}
                />
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-medium dark:text-dark-primary text-light-primary"
                >
                  Time
                </Text>
              </View>
              {reminderTime && (
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-regular dark:text-dark-primary text-light-primary"
                >
                  {new Date(reminderTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              )}
            </View>
            <AntDesign
              name="right"
              size={22}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
        </View>

        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="dark:bg-dark-secondary bg-light-secondary flex-row items-center justify-between rounded-lg p-3"
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather
              name="repeat"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="dark:text-dark-primary text-light-primary font-inter-medium"
            >
              Repeat
            </Text>
          </View>
          <Switch
            trackColor={{
              false: "#cbcbcb",
              true: colorScheme === "dark" ? "#a5c9ff" : "#2f2d51",
            }}
            thumbColor={isRepeat ? "white" : "white"}
            ios_backgroundColor="#cbcbcb"
            onValueChange={toggleSwitch}
            value={isRepeat}
          />
        </View>

        {isRepeat && (
          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={useDailyOption}
              className={cn(
                " items-center justify-center rounded-lg p-4 flex-1",
                repeatOption === "daily"
                  ? "bg-light-primary dark:bg-dark-accent"
                  : "bg-light-secondary dark:bg-dark-secondary",
              )}
            >
              <Text
                className={cn(
                  "font-inter-semibold text-light-primary dark:text-dark-primary",
                  repeatOption === "daily"
                    ? "text-light-background dark:text-dark-background"
                    : "text-light-primary dark:text-dark-primary",
                )}
              >
                Once a day
              </Text>
            </Pressable>
            <Pressable
              onPress={useWeeklyOption}
              className={cn(
                " items-center justify-center rounded-lg p-4 flex-1",
                repeatOption === "weekly"
                  ? "bg-light-primary dark:bg-dark-accent"
                  : "bg-light-secondary dark:bg-dark-secondary",
              )}
            >
              <Text
                className={cn(
                  "font-inter-semibold text-light-primary dark:text-dark-primary",
                  repeatOption === "weekly"
                    ? "text-light-background dark:text-dark-background"
                    : "text-light-primary dark:text-dark-primary",
                )}
              >
                Once a week
              </Text>
            </Pressable>
          </View>
        )}

        <View className="mt-auto mb-10">
          <Text className="text-[#ff3b3b] mb-1 font-inter-medium">
            Required fields: Title, date and time.
          </Text>

          <Link href={`/${SETTINGS_SCREEN}`}>
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="dark:text-[#d2d2d2] text-light-primary text-sm font-inter-regular"
            >
              To receive reminders, make sure to enable notifications in both
              your phone and app settings.
              <Feather
                name="external-link"
                size={14}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "#d2d2d2"
                      : "#2f2d51"
                }
              />
              .
            </Text>
          </Link>
        </View>

        {/* Date Picker */}
        {Platform.OS === "ios" ? (
          <DateTimePickerModal
            isVisible={isIOSDatePickerVisible}
            mode="date"
            onConfirm={handleIOSDateConfirm}
            onCancel={handleIOSDateCancel}
            date={reminderDate || new Date()}
          />
        ) : (
          showDatePicker && (
            <DateTimePicker
              value={reminderDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setReminderDate(selectedDate);
              }}
            />
          )
        )}
        {/* Time Picker */}
        {Platform.OS === "ios" ? (
          <DateTimePickerModal
            isVisible={isIOSTimePickerVisible}
            mode="time"
            onConfirm={handleIOSTimeConfirm}
            onCancel={handleIOSTimeCancel}
            date={reminderTime || new Date()}
          />
        ) : (
          showTimePicker && (
            <DateTimePicker
              value={reminderTime || new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setReminderTime(selectedTime);
              }}
            />
          )
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 25,
    height: 25,
  },
});
