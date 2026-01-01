// @ts-nocheck
import * as Notifications from "expo-notifications";
import { router, useNavigation } from "expo-router";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import {
  getPrimaryBackgroundColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { deleteReminder } from "@redux/remindersReducer";
import { TEST_SCREEN } from "@routes";

import { ActualTheme } from "../types/reduxTypes";

type ReminderObject = {
  identifier: string;
  ocurrence: string;
  reminder: Reminder;
};

type Reminder = {
  id: string;
  message: string;
  note: string;
  time: Date | string; // Can be Date or ISO string (stored as string in Redux)
};

const ReminderItem = ({
  actualTheme,
  colorScheme,
  reminder,
}: {
  actualTheme: ActualTheme;
  colorScheme: "light" | "dark" | undefined;
  reminder: ReminderObject;
}) => {
  const content = reminder.reminder;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // const [justPrayed, setJustPrayed] = useState(false);
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const timestamp = new Date(content.time);
  let timeOptions;

  let dayOfWeekName;

  if (reminder.ocurrence === "Daily") {
    const options = {
      hour: "numeric",
      minute: "numeric",
    };
    timeOptions = options;
  } else if (reminder.ocurrence === "Weekly") {
    const dayOfWeekNumber = timestamp.getDay();
    dayOfWeekName = daysOfWeek[dayOfWeekNumber];

    const options = {
      hour: "numeric",
      minute: "numeric",
    };
    timeOptions = options;
  } else if (reminder.ocurrence === "None") {
    const options = {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
    };
    timeOptions = options;
  }

  const dismissNotification = async (item) => {
    dispatch(deleteReminder(item.reminder.id));
    await Notifications.cancelScheduledNotificationAsync(item.identifier);
  };

  //@ts-ignore
  const formattedDate = timestamp.toLocaleString("en-US", timeOptions);

  // const currentDate = new Date().toLocaleString("en-US", timeOptions);
  // const isFocused = useIsFocused();

  // const isPrayTime = formattedDate === currentDate;

  return (
    <Pressable
      onPress={() => router.push(`/reminder/${reminder.reminder.id}`)}
      style={getSecondaryBackgroundColorStyle(actualTheme)}
      className="gap-3 p-4 items-center rounded-lg bg-light-secondary dark:bg-dark-secondary justify-between w-full"
    >
      <View className="flex-row w-full gap-2 justify-between">
        <View className="gap-2 flex-1">
          {/* <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
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
              {reminder.ocurrence === "Daily" && (
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-regular text-sm  text-light-primary dark:text-dark-primary"
                >
                  {reminder.ocurrence} at {formattedDate}
                </Text>
              )}
              {reminder.ocurrence === "Weekly" && (
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-regular text-sm text-light-primary dark:text-dark-primary"
                >
                  {reminder.ocurrence} on {dayOfWeekName}s at {formattedDate}
                </Text>
              )}
              {reminder.ocurrence === "None" && (
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-regular text-sm text-light-primary dark:text-dark-primary"
                >
                  {formattedDate}
                </Text>
              )}
            </View>
          </View> */}
          <Text
            numberOfLines={1}
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter-medium text-light-primary dark:text-dark-primary text-lg"
          >
            {content.message}
          </Text>
          {/* {content.note && (
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              numberOfLines={5}
              className="font-inter-regular text-light-primary dark:text-dark-primary leading-6"
            >
              {content.note}
            </Text>
          )} */}
        </View>

        <AntDesign
          name="right"
          size={24}
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "light"
                ? "#2f2d51"
                : "white"
          }
        />
      </View>

      {/* <View className="flex-row gap-3 self-end items-center mt-auto">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(TEST_SCREEN, {
              type: "Edit",
              reminderEditId: content.id,
              reminderIdentifier: reminder.identifier,
              ocurrence: reminder.ocurrence,
              reminderToEditTitle: content.message,
              reminderToEditNote: content.note,
              reminderToEditTime: content.time.toString(),
            })
          }
        >
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="dark:text-white text-[#2f2d51] font-inter-medium"
          >
            Edit
          </Text>
        </TouchableOpacity>
        <View
          style={getPrimaryBackgroundColorStyle(actualTheme)}
          className="h-full dark:bg-white bg-[#2f2d51] w-[1.2px]"
        />
        <TouchableOpacity onPress={() => dismissNotification(reminder)}>
          <Text className="font-inter-medium text-red-500">Delete</Text>
        </TouchableOpacity>
      </View> */}
    </Pressable>
  );
};

export default ReminderItem;
