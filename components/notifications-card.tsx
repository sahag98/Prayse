// @ts-nocheck
import React from "react";
import * as Notifications from "expo-notifications";
import { Link, useNavigation } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { deleteReminder } from "@redux/remindersReducer";
import { REMINDER_SCREEN, TEST_SCREEN } from "@routes";

import noreminder from "../assets/noreminders.png";

interface NotificationsCardProps {
  theme: string;
  actualTheme: {
    Accent: string;
    AccentTxt: string;
    Bg: string;
    MainTxt: string;
    Primary: string;
    PrimaryTxt: string;
    Secondary: string;
    SecondaryTxt: string;
    id: string;
  };
}
export const NoticationsCard: React.FC<NotificationsCardProps> = ({
  theme,
  actualTheme,
}) => {
  const reminders = useSelector((state) => state.reminder.reminders);
  const ITEM_WIDTH = Dimensions.get("window").width / 2;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const dismissNotification = async (item) => {
    dispatch(deleteReminder(item.reminder.id));
    await Notifications.cancelScheduledNotificationAsync(item.identifier);
  };

  return (
    <View className="w-full flex-1">
      <View
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="bg-light-secondary dark:bg-dark-secondary my-[5px] flex-1 dark:border-[1px] border-none dark:border-[#474747] gap-[10px] rounded-lg p-[10px] mb-[15px]"
      >
        <View className="flex-row items-center  justify-between">
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter font-bold text-xl text-[#2f2d51] dark:text-white"
          >
            Reminders
          </Text>
          <View className="flex-row items-center gap-3">
            <Link asChild href={`/${REMINDER_SCREEN}`}>
              <TouchableOpacity
                href={`/${REMINDER_SCREEN}`}
                className="flex-row items-center gap-[5px]"
              >
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter font-semibold text-lg text-[#444444] dark:text-white"
                >
                  View all
                </Text>
              </TouchableOpacity>
            </Link>
            <Link
              asChild
              className="flex-row items-center gap-1"
              href={`/${TEST_SCREEN}?type=Add`}
            >
              <TouchableOpacity
                href={`/${TEST_SCREEN}?type=Add`}
                className="flex-row items-center gap-1"
              >
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter font-semibold text-lg text-[#2f2d51] dark:text-[#a5c9ff]"
                >
                  Add
                </Text>
                <Ionicons
                  name="add-circle-outline"
                  size={30}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : theme === "dark"
                        ? "#A5C9FF"
                        : "#2f2d51"
                  }
                />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
        {reminders.length === 0 ? (
          <View className="flex-1 justify-center items-center gap-[10px]">
            <Image
              style={{
                tintColor: theme === "dark" ? "white" : "#2f2d51",
                width: 40,
                height: 40,
              }}
              source={noreminder}
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="text-[#2f2d51] dark:text-[#d2d2d2] self-center font-inter font-medium"
            >
              No reminders yet!
            </Text>
          </View>
        ) : (
          <SafeAreaView className="flex-1">
            <FlatList
              pagingEnabled
              snapToInterval={ITEM_WIDTH}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={reminders}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => {
                const daysOfWeek = [
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ];

                const timestamp = new Date(item.reminder.time);
                let timeOptions;

                let dayOfWeekName;

                if (item.ocurrence === "Daily") {
                  const options = {
                    hour: "numeric",
                    minute: "numeric",
                  };
                  timeOptions = options;
                } else if (item.ocurrence === "Weekly") {
                  const dayOfWeekNumber = timestamp.getDay();
                  dayOfWeekName = daysOfWeek[dayOfWeekNumber];

                  const options = {
                    hour: "numeric",
                    minute: "numeric",
                  };
                  timeOptions = options;
                } else if (item.ocurrence === "None") {
                  const options = {
                    month: "numeric",
                    day: "numeric",
                    year: "2-digit",
                    hour: "numeric",
                    minute: "numeric",
                  };
                  timeOptions = options;
                }
                const formattedDate = timestamp.toLocaleString(
                  "en-US",
                  timeOptions,
                );

                return (
                  <View
                    className="p-[10px] mr-[15px] gap-[5px] rounded-lg bg-light-background dark:bg-dark-background"
                    style={[
                      getMainBackgroundColorStyle(actualTheme),
                      {
                        maxWidth: ITEM_WIDTH + 100,
                      },
                    ]}
                  >
                    <View className="flex-row items-center gap-[5px]">
                      <Ionicons
                        name="time-outline"
                        size={24}
                        color={theme === "dark" ? "#f1d592" : "#dda41c"}
                      />
                      {item.ocurrence === "Daily" && (
                        <Text className="text-base font-inter font-medium text-[#dda41c] dark:text-[#f1d592]">
                          {item.ocurrence} at {formattedDate}
                        </Text>
                      )}
                      {item.ocurrence === "Weekly" && (
                        <Text className="text-base font-inter font-medium text-[#dda41c] dark:text-[#f1d592]">
                          {item.ocurrence} on {dayOfWeekName}s at{" "}
                          {formattedDate}
                        </Text>
                      )}
                      {item.ocurrence === "None" && (
                        <Text className="text-base font-inter font-medium text-[#dda41c] dark:text-[#f1d592]">
                          {formattedDate}
                        </Text>
                      )}
                    </View>
                    <View className="gap-[5px]">
                      <Text
                        numberOfLines={1}
                        lineBreakMode="tail"
                        style={getMainTextColorStyle(actualTheme)}
                        className="font-inter font-semibold text-lg text-[#2f2d51] dark:text-white"
                      >
                        {item.reminder.message}
                      </Text>

                      <Text
                        numberOfLines={2}
                        lineBreakMode="tail"
                        style={getMainTextColorStyle(actualTheme)}
                        className="font-inter text-base font-normal text-[#bebebe]"
                      >
                        {item.reminder.note}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-[10px] self-end mt-auto">
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(TEST_SCREEN, {
                            type: "Edit",
                            reminderEditId: item.reminder.id,
                            reminderIdentifier: item.identifier,
                            ocurrence: item.ocurrence,
                            reminderToEditTitle: item.reminder.message,
                            reminderToEditNote: item.reminder.note,
                            reminderToEditTime: item.reminder.time.toString(),
                          })
                        }
                      >
                        <Text
                          style={getSecondaryTextColorStyle(actualTheme)}
                          className="text-[#2f2d51] dark:text-white font-inter font-semibold text-base"
                        >
                          Edit
                        </Text>
                      </TouchableOpacity>
                      <View className="w-[1.2px] h-full bg-[#2f2d51] dark:bg-white" />
                      <TouchableOpacity
                        onPress={() => dismissNotification(item)}
                      >
                        <Text className="font-inter font-semibold text-base text-[#ff3b3b]">
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
            />
          </SafeAreaView>
        )}
      </View>
    </View>
  );
};
