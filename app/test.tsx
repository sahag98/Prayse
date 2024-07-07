// @ts-nocheck
import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Link, useLocalSearchParams, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Toast from "react-native-toast-message";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import calendar from "../assets/calendar.png";
import time from "../assets/time.png";
import {
  addNewReminder,
  deleteReminder,
  editReminder,
} from "../redux/remindersReducer";
import { HOME_SCREEN, REMINDER_SCREEN, SETTINGS_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

export default function TestScreen() {
  const navigation = useNavigation();
  const routeParams = useLocalSearchParams();
  const isFocused = useIsFocused();
  const theme = useSelector((state) => state.user.theme);
  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [repeatOption, setRepeatOption] = useState("");
  const [visible, setVisible] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const { colorScheme } = useColorScheme();
  const [isRepeat, setIsRepeat] = useState(false);
  const toggleSwitch = () => {
    setIsRepeat((previousState) => !previousState);
    setRepeatOption("");
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (routeParams.reminder != undefined && routeParams.type == "Add") {
      setReminderDate("");
      setRepeatOption("");
      setIsRepeat(false);
      setReminderTime("");
      setNewReminder(routeParams?.reminder);
    }

    if (routeParams.reminder == undefined && routeParams.type == "Add") {
      setNewReminder("");
      setNewNote("");
      setReminderDate("");
      setRepeatOption("");
      setIsRepeat(false);
      setReminderTime("");
    }

    if (routeParams.reminderToEditTitle && routeParams.type != "Add") {
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

      if (routeParams.ocurrence != "None") {
        setIsRepeat(true);
        setRepeatOption(routeParams.ocurrence.toLowerCase());
      }

      if (routeParams.ocurrence == "None") {
        setIsRepeat(false);
        setRepeatOption("");
      }
    }

    // if (
    //   params.reminderToEditTitle.length < 0 &&
    //   params.type != "Add"
    // ) {
    //   setNewReminder("");
    //   setNewNote("");
    //   setReminderDate("");
    //   setReminderTime("");
    // }
  }, [isFocused]);

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: "Reminder has been created.",
      text2: "View",
      visibilityTime: 3000,
      position: "bottom",
      onPress: () => navigation.navigate(HOME_SCREEN),
    });
  };

  const showEditToast = (type, content) => {
    Toast.show({
      type: "edit",
      text1: "Reminder has been edited.",
      text2: "View",
      visibilityTime: 3000,
      position: "bottom",
      onPress: () => navigation.navigate(HOME_SCREEN),
    });
  };

  const scheduleNotification = async (reminder, combinedDate, type) => {
    const secondsUntilNotification = Math.floor(
      (combinedDate.getTime() - Date.now()) / 1000,
    );

    if (repeatOption == "daily" && isRepeat) {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: reminder.message,
          data: { url: REMINDER_SCREEN },
        },
        trigger: {
          hour: combinedDate.getHours(),
          minute: combinedDate.getMinutes(),
          repeats: true,
        },
      });
      if (type == "edit") {
        dispatch(
          editReminder({
            reminder,
            identifier,
            ocurrence: "Daily",
          }),
        );
      } else {
        dispatch(
          addNewReminder({
            reminder,
            identifier,
            ocurrence: "Daily",
          }),
        );
      }
    } else if (repeatOption == "weekly" && Platform.OS == "ios") {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: reminder.message,
          data: { url: REMINDER_SCREEN },
        },
        trigger: {
          weekday: combinedDate.getDay() + 1,
          hour: combinedDate.getHours(),
          minute: combinedDate.getMinutes(),
          repeats: isRepeat,
        },
      });

      if (type == "edit") {
        dispatch(
          editReminder({
            reminder,
            identifier,
            ocurrence: "Weekly",
          }),
        );
      } else {
        dispatch(
          addNewReminder({
            reminder,
            identifier,
            ocurrence: "Weekly",
          }),
        );
      }
    } else if (repeatOption == "weekly" && Platform.OS == "android") {
      const newDate = new Date(
        combinedDate.getTime() + 6 * 24 * 60 * 60 * 1000,
      );
      const seconds = newDate.getTime() / 1000;
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: reminder.message,
          data: { url: REMINDER_SCREEN },
        },
        trigger: {
          seconds,
          repeats: isRepeat,
        },
      });

      if (type == "edit") {
        dispatch(
          editReminder({
            reminder,
            identifier,
            ocurrence: "Weekly",
          }),
        );
      } else {
        dispatch(
          addNewReminder({
            reminder,
            identifier,
            ocurrence: "Weekly",
          }),
        );
      }
    } else {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: reminder.message,
          data: { url: REMINDER_SCREEN },
        },
        trigger: {
          seconds: secondsUntilNotification,
        },
      });

      if (type == "edit") {
        dispatch(
          editReminder({
            reminder,
            identifier,
            ocurrence: "None",
          }),
        );
      } else {
        dispatch(
          addNewReminder({
            reminder,
            identifier,
            ocurrence: "None",
          }),
        );
      }
    }
  };

  const handleEditReminder = async () => {
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
      note: newNote,
      time: combinedDate,
    };

    await Notifications.cancelScheduledNotificationAsync(
      routeParams.reminderIdentifier,
    );

    dispatch(deleteReminder(routeParams.reminderEditId));

    scheduleNotification(
      newReminderObj,
      combinedDate,
      "add",
      // reminderTime.getHours(),
      // reminderTime.getMinutes()
    );

    showEditToast();
    setNewReminder("");
    setNewNote("");
    setReminderDate("");
    setReminderTime("");
    setRepeatOption("");
    setIsRepeat(false);
    Keyboard.dismiss();
    navigation.goBack();
  };

  const addReminder = () => {
    if (newReminder.length == 0) {
      setTitleError("Title is required.");
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
      note: newNote,
      time: combinedDate,
    };

    scheduleNotification(newReminderObj, combinedDate, "add");

    setReminders([...reminders, newReminderObj]);
    showToast();
    setNewReminder("");
    setNewNote("");
    setReminderDate("");
    setReminderTime("");
    setRepeatOption("");
    setIsRepeat(false);
    navigation.goBack();
    Keyboard.dismiss();
  };

  const clearAll = () => {
    setNewReminder("");
    setDatePickerVisibility(false);
    setTimePickerVisibility(false);
    setReminderDate("");
    setNewNote("");
    setRepeatOption("");
    setReminderTime("");
    navigation.goBack();
  };
  const showDatePicker = () => {
    Keyboard.dismiss();
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    Keyboard.dismiss();

    if (reminderDate.length == 0) {
      const today = new Date();
      setReminderDate(today);
    }
    setReminderTime(Date.now());
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();

    setReminderDate(date);
  };

  const handleTimeConfirm = (time) => {
    hideTimePicker();
    setReminderTime(time);
  };

  return (
    <Container className="flex-1 dark:bg-[#121212] bg-[#f2f7ff] justify-center items-center p-4">
      <HeaderView style={{ justifyContent: "space-between", width: "100%" }}>
        <View className="flex-row gap-1">
          <TouchableOpacity onPress={clearAll}>
            <AntDesign
              name="left"
              size={24}
              color={colorScheme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
          <HeaderTitle
            style={
              colorScheme == "dark"
                ? { color: "white", fontFamily: "Inter-Bold" }
                : { color: "#2f2d51", fontFamily: "Inter-Bold" }
            }
          >
            {routeParams.type} Reminder
          </HeaderTitle>
        </View>
        <TouchableOpacity
          onPress={routeParams.type == "Add" ? addReminder : handleEditReminder}
          disabled={newReminder.length == 0}
          className="flex-row gap-1 items-center"
        >
          <Text
            className="text-xl font-inter font-bold"
            style={
              newReminder.length === 0 ||
              reminderDate.toString().length === 0 ||
              reminderTime.toString().length === 0
                ? {
                    color: colorScheme == "dark" ? "#5c5c5c" : "grey",
                  }
                : {
                    color: theme == "light" ? "#2f2d51" : "#A5C9FF",
                  }
            }
          >
            {routeParams.type}
          </Text>
          {routeParams.type == "Edit" ? (
            <Feather
              name="edit-2"
              size={23}
              color={
                newReminder.length === 0 ||
                reminderDate.toString().length === 0 ||
                reminderTime.toString().length === 0
                  ? colorScheme == "dark"
                    ? "#5c5c5c"
                    : "grey"
                  : colorScheme == "light"
                    ? "#2f2d51"
                    : "#A5C9FF"
              }
            />
          ) : (
            <Entypo
              name="plus"
              size={30}
              color={
                newReminder.length === 0 ||
                reminderDate.toString().length === 0 ||
                reminderTime.toString().length === 0
                  ? colorScheme == "dark"
                    ? "#5c5c5c"
                    : "grey"
                  : colorScheme == "light"
                    ? "#2f2d51"
                    : "#A5C9FF"
              }
            />
          )}
        </TouchableOpacity>
      </HeaderView>
      <View className="flex-1 mt-3 w-full relative gap-2">
        <View className="dark:bg-[#212121] bg-[#b7d3ff] w-full p-3 rounded-lg gap-2">
          <TextInput
            className="dark:text-white text-[#2f2d51] min-h-8"
            placeholderTextColor={colorScheme == "dark" ? "#a1a1a1" : "#808080"}
            placeholder="Prayer Title"
            selectionColor={colorScheme == "dark" ? "white" : "#2f2d51"}
            value={newReminder}
            onChangeText={(text) => setNewReminder(text)}
          />

          <View className="w-full dark:bg-gray-500 bg-[#2f2d51] h-[1px]" />
          <TextInput
            placeholderTextColor={colorScheme == "dark" ? "#a1a1a1" : "#808080"}
            className="min-h-12 dark:text-white text-[#2f2d51]"
            placeholder="Prayer Notes"
            multiline
            textAlignVertical="top"
            numberOfLines={3}
            value={newNote}
            onChangeText={(text) => setNewNote(text)}
          />
        </View>

        <View className="dark:bg-[#212121] bg-[#b7d3ff] p-3 gap-2 rounded-lg">
          <TouchableOpacity
            onPress={showDatePicker}
            className="w-full flex-row justify-between p-2 items-center"
          >
            <View className="gap-2">
              <View className="flex-row items-center gap-3">
                <Image
                  style={
                    colorScheme == "dark"
                      ? [styles.img, { tintColor: "#f1d592" }]
                      : [styles.img, { tintColor: "#dda41c" }]
                  }
                  source={calendar}
                />
                <Text className="font-inter font-medium dark:text-white text-[#2f2d51]">
                  Date
                </Text>
              </View>
              {reminderDate.toString().length > 0 && (
                <Text className="font-inter font-normal dark:text-white text-[#2f2d51]">
                  {reminderDate.toDateString()}
                </Text>
              )}
            </View>
            <AntDesign
              name="right"
              size={22}
              color={colorScheme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
          <View className="w-full dark:bg-gray-500 bg-[#2f2d51] h-[1px]" />
          <TouchableOpacity
            onPress={showTimePicker}
            className="w-full flex-row justify-between p-2"
          >
            <View className="gap-2">
              <View className="flex-row items-center gap-3">
                <Image
                  style={
                    colorScheme == "dark"
                      ? [styles.img, { tintColor: "#A5C9FF" }]
                      : [styles.img, { tintColor: "#438eff" }]
                  }
                  source={time}
                />
                <Text className="font-inter font-medium dark:text-white text-[#2f2d51]">
                  Time
                </Text>
              </View>
              {reminderTime.toString().length > 0 && (
                <Text className="font-inter font-normal dark:text-white text-[#2f2d51]">
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
              color={colorScheme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
        </View>

        <View className="dark:bg-[#212121] bg-[#b7d3ff] flex-row items-center justify-between rounded-lg p-3">
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Feather
              name="repeat"
              size={24}
              color={colorScheme == "dark" ? "white" : "#2f2d51"}
            />
            <Text className="dark:text-white text-[#2f2d51] font-inter font-medium">
              Repeat
            </Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#767577" }}
            thumbColor={isRepeat ? "#4eff4e" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isRepeat}
          />
        </View>
        {isRepeat && (
          <View className="flex-row gap-5 mt-3">
            <TouchableOpacity
              onPress={() => setRepeatOption("daily")}
              className="gap-2 flex-row items-center"
            >
              <View
                className="w-5 dark:border-white border-[#2f2d51] border-2 h-5 rounded-full"
                style={
                  colorScheme == "dark"
                    ? {
                        backgroundColor:
                          repeatOption === "daily" ? "#00cc00" : "#3e3e3e",
                      }
                    : {
                        backgroundColor:
                          repeatOption === "daily" ? "#00cc00" : "white",
                      }
                }
              />
              <Text className="dark:text-white text-[#2f2d51] font-inter font-medium">
                Daily
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="gap-2 flex-row items-center"
              onPress={() => setRepeatOption("weekly")}
            >
              <View
                className="w-5 dark:border-white border-[#2f2d51] border-2 h-5 rounded-full"
                style={
                  colorScheme == "dark"
                    ? {
                        backgroundColor:
                          repeatOption === "weekly" ? "#00cc00" : "#3e3e3e",
                      }
                    : {
                        backgroundColor:
                          repeatOption === "weekly" ? "#00cc00" : "white",
                      }
                }
              />
              <Text className="dark:text-white text-[#2f2d51] font-inter font-medium">
                Weekly
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="mt-2 flex-1">
          <Text className="text-[#ff3b3b] mb-2 font-inter font-medium">
            Required fields: Title, date and time.
          </Text>

          <Link href={`/${SETTINGS_SCREEN}`}>
            <Text className="dark:text-[#d2d2d2] text-[#2f2d51] text-[13px] font-inter font-normal">
              To receive the reminders, make sure to enable notifications in
              both your phone and Prayse settings{" "}
              <Feather
                name="external-link"
                size={14}
                color={colorScheme == "dark" ? "#d2d2d2" : "#2f2d51"}
              />
              .
            </Text>
          </Link>

          <View className="mt-auto mb-5 w-full">
            <Text className="text-[#2f2d51] dark:text-[#d2d2d2] font-inter font-normal">
              "Continue in prayer, and watch in the same with thanksgiving."
            </Text>
            <Text className="text-[#2f2d51] self-end dark:text-[#d2d2d2] font-inter font-normal">
              - Colossians 4:2
            </Text>
          </View>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
        />

        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleTimeConfirm}
          onCancel={hideTimePicker}
        />
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
