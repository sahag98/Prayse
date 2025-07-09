import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Container } from "@components/Container";
import { router } from "expo-router";
import Moment from "moment";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { JOURNAL_SCREEN } from "@routes";

import useStore from "@hooks/store";

const JournalScreen = () => {
  const { colorScheme } = useColorScheme();
  const { journals, handleDeleteAllJournals } = useStore();

  return (
    <Container>
      <View className="flex-row mb-6 items-center justify-between">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <AntDesign
              name="left"
              size={30}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
          <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary">
            Journals
          </Text>
        </View>
        <Pressable
          onPress={() => {
            Alert.alert(
              "Clear Journals",
              "This action will permenantly delete all journals.",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: handleDeleteAllJournals,
                },
              ],
            );
          }}
        >
          <Text className="font-inter-bold text-[#ff4d4f] dark:text-[#d32f2f]">
            Delete All
          </Text>
        </Pressable>
      </View>
      <View className="bg-white dark:bg-dark-secondary p-3 items-center flex-row justify-between rounded-xl">
        <View className="items-center gap-1">
          <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary">
            {(() => {
              const currentMonth = Moment().month();
              const journalsInMonth = journals.filter(
                (journal) => Moment(journal.date).month() === currentMonth,
              );
              return journalsInMonth.length;
            })()}
          </Text>
          <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
            This Month
          </Text>
        </View>
        <View className="items-center gap-1">
          <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary">
            {journals.length}
          </Text>
          <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
            Total Journals
          </Text>
        </View>
        <View className="items-center gap-1">
          <Text className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary">
            {(() => {
              const totalMinutes = journals.reduce(
                (acc, journal) => acc + Number(journal.time),
                0,
              );
              const hours = (totalMinutes / 60).toFixed(1);
              return `${hours} hrs`;
            })()}
          </Text>
          <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
            Time Spent
          </Text>
        </View>
      </View>
      <View className="my-6 gap-4 flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="font-inter-bold text-xl text-light-primary dark:text-dark-primary">
            Recent Journals
          </Text>
        </View>
        <FlatList
          data={journals}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, gap: 10 }}
          keyExtractor={(item) => item.date.toString()}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center gap-2">
              <Text className="font-inter-semibold text-xl text-light-primary dark:text-dark-primary">
                No journals yet
              </Text>
              <Text className="font-inter-regular text-light-primary dark:text-dark-primary">
                Start journaling to see your progress!
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/journal/view/${item.date}`)}
              className="p-3 rounded-xl bg-light-secondary dark:bg-dark-secondary"
            >
              <View className="gap-4 rounded-xl bg-light-secondary dark:bg-dark-secondary">
                <View className="flex-row gap-5 items-start justify-between">
                  <View className="flex-row flex-1 items-center gap-2">
                    <Text className="font-inter-semibold text-light-primary dark:text-dark-primary">
                      {item.content.split(" ").slice(0, 12).join(" ")}...
                    </Text>
                  </View>
                  <View className="flex-row bg-white dark:bg-dark-background px-2 py-1 rounded-lg items-center gap-1">
                    <Ionicons
                      name="time-outline"
                      size={15}
                      color={colorScheme === "dark" ? "white" : "#2f2d51"}
                    />
                    <Text className="font-inter-medium text-sm text-light-primary dark:text-dark-primary">
                      {item.type === "video"
                        ? `${Math.floor(Number(item.time) / 60)
                            .toString()
                            .padStart(
                              2,
                              "0",
                            )}:${(Number(item.time) % 60).toString().padStart(2, "0")}`
                        : `${Math.floor(Number(item.time) / 60)}:${Number(item.time) % 60}`}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2">
                  <View className="flex-row gap-1 items-center">
                    <Feather
                      name="calendar"
                      size={15}
                      color={colorScheme === "dark" ? "white" : "#2f2d51"}
                    />
                    <Text className="font-inter-medium text-sm text-light-primary dark:text-dark-primary">
                      {Moment(item.date).isSame(Moment(), "day")
                        ? "Today"
                        : Moment(item.date).isSame(
                              Moment().subtract(1, "days"),
                              "day",
                            )
                          ? "Yesterday"
                          : `${Moment().diff(Moment(item.date), "days")} days ago`}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>

      <Pressable
        onPress={() => router.push(`${JOURNAL_SCREEN}/new`)}
        className="absolute bg-light-primary dark:bg-dark-accent p-4 size-20 items-center justify-center rounded-full bottom-8 self-center"
      >
        <AntDesign
          name="plus"
          size={30}
          color={colorScheme === "dark" ? "#121212" : "white"}
        />
      </Pressable>
    </Container>
  );
};

export default JournalScreen;
