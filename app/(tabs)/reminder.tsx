// @ts-nocheck
import React from "react";
import * as Notifications from "expo-notifications";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import ReminderItem from "@components/ReminderItem";

import { Ionicons } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "@types/reduxTypes";

import { Container, HeaderTitle, HeaderView } from "../../styles/appStyles";
// import { deleteReminder } from "../redux/remindersReducer";

const ReminderScreen = () => {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.user.theme);
  const { colorScheme } = useColorScheme();
  const reminders = useSelector((state) => state.reminder.reminders);
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const dispatch = useDispatch();

  const dismissNotification = async (item) => {
    dispatch(deleteReminder(item.reminder.id));
    await Notifications.cancelScheduledNotificationAsync(item.identifier);
  };

  console.log(reminders[0]?.reminder);

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="dark:bg-[#121212] bg-[#f2f7ff] flex-1"
    >
      <HeaderView className="justify-between  w-full">
        <TouchableOpacity
          // style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="justify-center my-1 items-center rounded-xl py-3"
          onPress={() => setFolderClicked(true)}
        >
          <HeaderTitle
            style={getMainTextColorStyle(actualTheme)}
            className="font-bold font-inter text-lg text-light-primary dark:text-dark-primary"
          >
            Reminders
          </HeaderTitle>
        </TouchableOpacity>
      </HeaderView>
      <View className="gap-1 mb-5">
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter text-light-primary text-base dark:text-dark-primary"
        >
          Continue in prayer, and watch in the same with thanksgiving.
        </Text>
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter font-medium text-light-primary text-base dark:text-dark-primary"
        >
          Colossians 4:2
        </Text>
      </View>

      <FlatList
        data={reminders}
        className="flex-1"
        contentContainerStyle={{ gap: 10, flexGrow: 1 }} // Increased bottom padding and added flexGrow
        keyExtractor={(e, i) => i.toString()}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center w-5/6 self-center justify-center">
            <View className="gap-1 mb-10 items-center">
              <Ionicons
                name="time-outline"
                size={45}
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
                className="text-center text-2xl font-inter font-semibold text-light-primary dark:text-dark-primary"
              >
                No Reminders yet.
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className=" text-center font-inter leading-5 font-medium text-light-primary dark:text-dark-primary"
              >
                Navigate to the prayer tab to add prayers to your folders and
                setup reminders for each.
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
