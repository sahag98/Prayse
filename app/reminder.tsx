// @ts-nocheck
import React from "react";
import * as Notifications from "expo-notifications";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, Ionicons } from "@expo/vector-icons";

import { deleteReminder } from "../redux/remindersReducer";
import { TEST_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

const ReminderScreen = () => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.user.theme);
  const { colorScheme } = useColorScheme();
  const reminders = useSelector((state) => state.reminder.reminders);
  const dispatch = useDispatch();

  const dismissNotification = async (item) => {
    dispatch(deleteReminder(item.reminder.id));
    await Notifications.cancelScheduledNotificationAsync(item.identifier);
  };

  return (
    <Container className="dark:bg-[#121212] bg-[#f2f7ff] flex-1">
      <HeaderView className="justify-between mb-5 w-full">
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
            Reminders
          </HeaderTitle>
        </View>
      </HeaderView>
      {reminders.length == 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="self-center font-inter font-medium dark:text-[#d2d2d2] text-[#2f2d51] text-lg">
            No reminders yet!
          </Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(e, i) => i.toString()}
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
              <View className="dark:border-[#525252] border-[#ffcf8b] bg-white dark:bg-none border-2 p-3 w-full mr-4 gap-2 mb-4">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="time-outline"
                    size={24}
                    color={colorScheme == "dark" ? "#f1d592" : "#dda41c"}
                  />
                  {item.ocurrence === "Daily" && (
                    <Text className="font-inter font-medium dark:text-[#f1d592] text-[#dda41c]">
                      {item.ocurrence} at {formattedDate}
                    </Text>
                  )}
                  {item.ocurrence === "Weekly" && (
                    <Text className="font-inter font-medium dark:text-[#f1d592] text-[#dda41c]">
                      {item.ocurrence} on {dayOfWeekName}s at {formattedDate}
                    </Text>
                  )}
                  {item.ocurrence === "None" && (
                    <Text className="font-inter font-medium dark:text-[#f1d592] text-[#dda41c]">
                      {formattedDate}
                    </Text>
                  )}
                </View>
                <View className="gap-1">
                  <Text
                    className="dark:text-white text-[#2f2d51] font-inter font-normal text-[16px]"
                    style={{
                      marginBottom: item.reminder.note ? 0 : 5,
                    }}
                  >
                    {item.reminder.message}
                  </Text>
                  {item.reminder.note && (
                    <Text className="font-inter font-normal dark:text-gray-500 mb-2">
                      {item.reminder.note}
                    </Text>
                  )}
                </View>
                <View className="flex-row gap-3 self-end items-center mt-auto">
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
                    <Text className="dark:text-white text-[#2f2d51] font-inter font-medium">
                      Edit
                    </Text>
                  </TouchableOpacity>
                  <View className="h-full dark:bg-white bg-[#2f2d51] w-[1.2px]" />
                  <TouchableOpacity onPress={() => dismissNotification(item)}>
                    <Text className="font-inter font-medium text-red-500">
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </Container>
  );
};

export default ReminderScreen;

const styles = StyleSheet.create({});
