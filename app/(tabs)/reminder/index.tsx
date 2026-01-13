import React from "react";
import { useColorScheme } from "nativewind";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Notifications from "expo-notifications";
import ReminderItem from "@components/ReminderItem";

import { Ionicons } from "@expo/vector-icons";
import {
  getMainTextColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "../../../types/reduxTypes";
import { deleteAllReminders } from "@redux/remindersReducer";
import { Container } from "@components/Container";
import HeaderText from "@components/HeaderText";

interface ReminderItem {
  identifier: string;
  [key: string]: unknown;
}

interface RootState {
  reminder: {
    reminders: ReminderItem[];
  };
  theme: {
    actualTheme: ActualTheme;
  };
}

const ReminderScreen = () => {
  const { colorScheme } = useColorScheme();
  const reminders = useSelector((state: any) => state.reminder.reminders);
  const actualTheme = useSelector(
    (state: RootState) => state.theme.actualTheme
  );

  console.log(JSON.stringify(reminders, null, 2));

  const dispatch = useDispatch();

  async function handleDeleteAllReminders() {
    const allReminders =
      await Notifications.getAllScheduledNotificationsAsync();

    allReminders.map(async (reminder) => {
      await Notifications.cancelScheduledNotificationAsync(reminder.identifier);
    });
    dispatch(deleteAllReminders());
  }

  return (
    <Container>
      <View className="justify-between mb-4 flex-row items-center  w-full">
        <View className="flex-row justify-between items-center w-full">
          <HeaderText className="text-3xl" text="Reminders" />

          {reminders.length > 0 && (
            <Pressable
              onPress={() =>
                Alert.alert(
                  "Delete Reminders",
                  "This action will permenantly delete all reminders.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: handleDeleteAllReminders,
                    },
                  ]
                )
              }
            >
              <Ionicons name="trash-outline" size={24} color="red" />
            </Pressable>
          )}
        </View>
      </View>
      <View className="mb-5">
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-medium self-start text-light-primary text-base dark:text-dark-primary"
        >
          Colossians 4:2
        </Text>
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-regular text-light-primary text-base dark:text-dark-primary"
        >
          Continue in prayer, and watch in the same with thanksgiving.
        </Text>
      </View>

      <FlatList
        data={reminders}
        className="flex-1"
        contentContainerStyle={{ gap: 10, flexGrow: 1 }} // Increased bottom padding and added flexGrow
        keyExtractor={(item) => item.identifier}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center w-3/4 self-center justify-center">
            <View className="gap-1 mb-10  items-center">
              <Ionicons
                name="time-outline"
                size={70}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
                }
              />
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-center text-2xl font-inter-semibold text-light-primary dark:text-dark-primary"
              >
                No Reminders yet.
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-sm text-center font-inter-medium leading-5 text-light-primary dark:text-dark-primary"
              >
                Go to the prayer tab to add prayers to your lists, and setup
                reminders for each.
              </Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <ReminderItem
            actualTheme={actualTheme}
            colorScheme={colorScheme}
            reminder={item}
          />
        )}
      />
    </Container>
  );
};

export default ReminderScreen;
