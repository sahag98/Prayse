// @ts-nocheck
import React from "react";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "nativewind";
import { FlatList, Text, View } from "react-native";
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
  const { colorScheme } = useColorScheme();
  const reminders = useSelector((state) => state.reminder.reminders);
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const dispatch = useDispatch();

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="dark:bg-[#121212] bg-[#f2f7ff] flex-1"
    >
      <HeaderView className="justify-between  w-full">
        <HeaderTitle
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-bold py-3 text-lg text-light-primary dark:text-dark-primary"
        >
          Reminders
        </HeaderTitle>
      </HeaderView>
      <View className="mb-5">
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-regular text-light-primary text-base dark:text-dark-primary"
        >
          Continue in prayer, and watch in the same with thanksgiving.
        </Text>
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-medium self-end text-light-primary text-base dark:text-dark-primary"
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
                className=" text-center font-inter-medium leading-5 text-light-primary dark:text-dark-primary"
              >
                Navigate to the prayer tab to add prayers to your folders, and
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
