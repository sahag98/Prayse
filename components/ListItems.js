import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { AntDesign, Entypo, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { TEST_SCREEN } from "../routes";
import { ListView, TodoText } from "../styles/appStyles";

import {
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import PrayerTabs from "./PrayerTabs";
import { cn } from "@lib/utils";
import { useSupabase } from "@context/useSupabase";
import { addVerseToPrayer } from "@redux/prayerReducer";
import VerseModal from "@modals/VerseModal";

import { posthog } from "@lib/posthog";

const ListItems = ({
  prayer,
  actualTheme,
  colorScheme,
  pickedPrayer,
  prayerList,
  onScroll,
  loading,
  folderId,
}) => {
  const dispatch = useDispatch();
  const versesEnabled = useSelector((state) => state.pro.prayer_verses);
  const navigation = useNavigation();

  const BusyIndicator = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  };

  const prayers = prayerList.filter((item) => item.folderId === folderId);
  const reminders = useSelector((state) => state.reminder.reminders);
  const [search, setSearch] = useState("");
  const size = useSelector((state) => state.user.fontSize);

  const [verseModal, setVerseModal] = useState(false);

  const { supabase } = useSupabase();

  const All = "All";
  const General = "General";
  const People = "People";
  const Personal = "Personal";
  const Praise = "Praise";
  const Other = "Other";

  const titles = ["Active", "Answered", "Archived"];

  const [activeTab, setActiveTab] = useState(titles[0]);

  const answeredList = prayers.filter((item) => item.status === "Answered");
  const archivedList = prayers.filter((item) => item.status === "Archived");
  const [verse, setVerse] = useState(null);
  const activeList = prayers.filter(
    (item) => item.status === "Active" || !item.status
  );

  const [isLoadingVerse, setIsLoadingVerse] = useState(false);

  const getFilteredList = () => {
    switch (activeTab) {
      case "Answered":
        return answeredList;
      case "Archived":
        return archivedList;
      default:
        return activeList;
    }
  };

  async function getBibleVerse(item) {
    setVerseModal(true);
    if (item.verse) {
      console.log("verse exists");
      setVerse(item.verse);
      return;
    }

    try {
      setIsLoadingVerse(true);
      const { data } = await supabase.functions.invoke("get-verse", {
        body: JSON.stringify({
          prayer: item.prayer,
        }),
      });
      dispatch(
        addVerseToPrayer({
          id: item.id,
          verse: data,
        })
      );
      setVerse(data);
    } catch (error) {
      Alert.alert("Error", "There was an error getting the verse");
    } finally {
      setIsLoadingVerse(false);
    }
  }

  const filteredList = getFilteredList();

  const renderItem = ({ item }) => {
    const RowText = TodoText;

    const addReminder = (item) => {
      posthog.capture("Create reminder");
      navigation.navigate(TEST_SCREEN, {
        reminder: item.prayer,
        reminderId: item.id,
        type: "Add",
      });
    };

    const isReminder = reminders.find(
      (reminder) => reminder.reminder.prayer_id === item.id
    );

    return (
      <>
        <ListView
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="bg-light-secondary dark:bg-dark-secondary relative"
        >
          <>
            <View className="flex-row items-center justify-between">
              <Text
                style={[
                  getSecondaryTextColorStyle(actualTheme),
                  { fontSize: size ? size : 16 },
                ]}
                className=" text-lg w-11/12 font-inter-medium text-light-primary dark:text-dark-primary"
              >
                {item.prayer}
              </Text>
            </View>

            {/* {item.verse && (
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-light-primary mt-2 font-inter-regular dark:text-dark-primary"
              >
                {item.verse}
              </Text>
            )} */}

            <TouchableOpacity
              onPress={() => pickedPrayer(item)}
              className="absolute top-1 right-0 p-2"
            >
              <Entypo
                name="dots-three-vertical"
                size={18}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme == "dark"
                      ? "white"
                      : "#2F2D51"
                }
              />
            </TouchableOpacity>

            <View className="flex-row justify-between mt-8 items-end">
              {item.status === "Answered" ? (
                <>
                  <View className="flex-row bg-green-300 px-2 py-1 rounded-md items-center">
                    <Text className="font-inter-medium text-light-primary dark:text-dark-background">
                      Answered on {item?.answeredDate}
                    </Text>
                  </View>
                </>
              ) : item.status === "Archived" ? (
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter-medium text-sm  text-light-primary dark:text-dark-primary"
                >
                  Archived
                </Text>
              ) : (
                <View className="flex-row items-end w-full justify-between">
                  {isReminder?.reminder.prayer_id === item.id ? (
                    <View className="rounded-lg flex-row items-center gap-2">
                      <Text
                        style={getSecondaryTextColorStyle(actualTheme)}
                        className="font-inter-medium text-sm text-light-primary dark:text-dark-primary"
                      >
                        Reminder
                      </Text>
                      <AntDesign
                        name="check"
                        size={20}
                        color={
                          actualTheme && actualTheme.SecondaryTxt
                            ? actualTheme.SecondaryTxt
                            : colorScheme === "dark"
                              ? "#a5c9ff"
                              : "#2f2d51"
                        }
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => addReminder(item)}
                      style={getPrimaryBackgroundColorStyle(actualTheme)}
                      className="flex-row items-center bg-light-primary dark:bg-dark-accent px-2 py-1 rounded-md gap-2"
                    >
                      <AntDesign
                        name="pluscircleo"
                        size={18}
                        color={
                          actualTheme && actualTheme.PrimaryTxt
                            ? actualTheme.PrimaryTxt
                            : colorScheme === "dark"
                              ? "#121212"
                              : "#f2f7ff"
                        }
                      />
                      <Text
                        style={getPrimaryTextColorStyle(actualTheme)}
                        className="font-inter-semibold text-sm text-light-background dark:text-dark-background"
                      >
                        Reminder
                      </Text>
                    </TouchableOpacity>
                  )}

                  {versesEnabled && (
                    <TouchableOpacity
                      onPress={() => getBibleVerse(item)}
                      style={getPrimaryBackgroundColorStyle(actualTheme)}
                      className="flex-row items-center bg-light-primary dark:bg-dark-accent p-2 rounded-md gap-2"
                    >
                      <FontAwesome5
                        name="bible"
                        size={22}
                        color={colorScheme === "dark" ? "#121212" : "white"}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </>
        </ListView>
      </>
    );
  };

  return (
    <View className={cn(prayer && "opacity-25", "transition-all flex-1")}>
      <VerseModal
        verseModal={verseModal}
        setVerseModal={setVerseModal}
        isLoadingVerse={isLoadingVerse}
        verse={verse}
        actualTheme={actualTheme}
        colorScheme={colorScheme}
      />
      <View className="flex-row items-center my-5 gap-5">
        <PrayerTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          titles={["Active", "Answered", "Archived"]}
          actualTheme={actualTheme}
          colorScheme={colorScheme}
        />
      </View>

      <FlatList
        data={filteredList}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }} // Increased bottom padding and added flexGrow
        keyExtractor={(e, i) => i.toString()}
        onEndReachedThreshold={0}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center h-full justify-center gap-2">
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-light-secondary  gap-5 w-4/5 dark:bg-dark-secondary items-center justify-center p-3 rounded-lg"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-center text-2xl font-inter-bold text-light-primary dark:text-dark-primary"
              >
                Your
                {activeTab === "Archived"
                  ? " archive "
                  : activeTab === "Answered"
                    ? " answered list "
                    : " prayer list "}
                is empty.
              </Text>
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="text-center font-inter-regular text-lg text-light-primary dark:text-dark-primary"
              >
                {activeTab === "Archived"
                  ? "When you don't need an active prayer for the moment, but don't want to delete it, you can archive it. You will not receive reminders for archived prayers."
                  : activeTab === "Answered"
                    ? "Mark a prayer as answered by clicking the three dots on an active prayer and select 'Mark as answered'."
                    : "Tap the + button to add a prayer to your list."}
              </Text>
            </View>
          </View>
        )}
        onScroll={onScroll}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ListItems;
