// @ts-nocheck
import React, { useState } from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import uuid from "react-native-uuid";
import { useDispatch, useSelector } from "react-redux";

import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Ionicons,
} from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import { addToAnsweredPrayer } from "../redux/answeredReducer";
import { deletePrayer } from "../redux/prayerReducer";
import { FOLDER_SCREEN } from "../routes";
import { Container } from "../styles/appStyles";
import { AnsweredPrayer, Prayer } from "../types/reduxTypes";

const Checklist = () => {
  const theme = useSelector((state: any) => state.user.theme);
  const prayers: Prayer[] = useSelector((state: any) => state.prayer.prayer);
  const [selectKeepAction, setSelectKeepAction] = useState("");
  const [selectAnswerAction, setSelectAnswerAction] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [answeredAlready, setAnsweredAlready] = useState("");
  const dispatch = useDispatch();
  const answeredPrayers: AnsweredPrayer[] = useSelector(
    (state: any) => state.answered.answeredPrayers,
  );

  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector((state) => state.theme.actualTheme);

  const handleAddToAnsweredPrayer = (prayer: Prayer) => {
    if (
      answeredPrayers?.some(
        (item) =>
          item.prayer.id === prayer.id && item.prayer.prayer === prayer.prayer,
      )
    ) {
      console.log("exists");
      setAnsweredAlready(prayer.id);
    } else {
      dispatch(
        addToAnsweredPrayer({
          answeredDate: new Date().toDateString(),
          prayer,
          id: uuid.v4(),
        }),
      );
      setAnsweredAlready("");
    }
  };

  const handleDelete = (prayerId: string) => {
    dispatch(deletePrayer(prayerId));
  };

  if (prayers.length == 0) {
    return (
      <Container
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background dark:bg-dark-background"
      >
        <View className="flex-row w-full items-center">
          <Link asChild href={`/${FOLDER_SCREEN}`}>
            <TouchableOpacity href={`/${FOLDER_SCREEN}`} className="mr-1">
              <Ionicons
                name="chevron-back"
                size={35}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "light"
                      ? "#2f2d51"
                      : "white"
                }
              />
            </TouchableOpacity>
          </Link>
          <Text
            className="font-bold text-2xl font-inter text-light-primary dark:text-dark-primary"
            style={getMainTextColorStyle(actualTheme)}
          >
            Prayer Checklist
          </Text>
        </View>
        <View className="flex-1 justify-center gap-3 items-center">
          <FontAwesome5
            name="list-alt"
            size={50}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
          <Text
            className="font-inter font-medium text-lg text-light-primary dark:text-dark-primary"
            style={getMainTextColorStyle(actualTheme)}
          >
            No prayers added yet!
          </Text>
        </View>
      </Container>
    );
  }

  return (
    <Container
      className="bg-light-background dark:bg-dark-background"
      style={getMainBackgroundColorStyle(actualTheme)}
    >
      <View className="flex-row w-full items-center">
        <Link asChild href={`/${FOLDER_SCREEN}`}>
          <TouchableOpacity href={`/${FOLDER_SCREEN}`} className="mr-1">
            <Ionicons
              name="chevron-back"
              size={35}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "light"
                    ? "#2f2d51"
                    : "white"
              }
            />
          </TouchableOpacity>
        </Link>
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter font-bold text-2xl text-light-primary dark:text-dark-primary"
        >
          Prayer Checklist
        </Text>
      </View>

      <FlatList
        data={prayers}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0}
        initialNumToRender={8}
        windowSize={8}
        contentContainerStyle={{ paddingTop: 10, gap: 10 }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: Prayer }) => (
          <View
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary dark:bg-dark-secondary p-3 rounded-lg gap-3"
          >
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter text-lg font-medium mb-3 text-light-primary dark:text-dark-primary"
            >
              {item.prayer}
            </Text>

            {selectedItems.includes(item.id) ||
            (selectAnswerAction == item.id &&
              selectedItems.includes(item.id)) ? (
              <View className="flex-row items-center justify-center gap-2">
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter font-medium text-light-primary dark:text-gray-500 self-center py-2"
                >
                  {selectKeepAction == item.id && "Will Keep"}
                  {selectAnswerAction == item.id && "Marked as answered"}
                </Text>
                <FontAwesome5
                  name="check"
                  size={20}
                  color={
                    actualTheme && actualTheme.SecondaryTxt
                      ? actualTheme.SecondaryTxt
                      : colorScheme === "dark"
                        ? "grey"
                        : "#2f2d51"
                  }
                />
              </View>
            ) : (
              <>
                <View className="flex-row items-center justify-between flex-1 gap-3">
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItems((prev) => [...prev, item.id]);
                      setSelectKeepAction(item.id);
                    }}
                    style={getPrimaryBackgroundColorStyle(actualTheme)}
                    className="p-3 bg-light-primary dark:bg-dark-background flex-1 items-center justify-between flex-row rounded-lg"
                  >
                    <Text
                      style={getPrimaryTextColorStyle(actualTheme)}
                      className="font-inter font-bold text-light-background dark:text-dark-primary"
                    >
                      Keep
                    </Text>
                    <AntDesign
                      name="back"
                      size={24}
                      color={
                        actualTheme && actualTheme.PrimaryTxt
                          ? actualTheme.PrimaryTxt
                          : "white"
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={getPrimaryBackgroundColorStyle(actualTheme)}
                    className="p-3 bg-light-primary dark:bg-dark-background flex-1 items-center justify-between flex-row rounded-lg"
                  >
                    <Text className="font-inter font-bold text-red-500">
                      Delete
                    </Text>
                    <Fontisto name="close" size={24} color="#ff3333" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItems((prev) => [...prev, item.id]);
                    setSelectAnswerAction(item.id);
                    handleAddToAnsweredPrayer(item);
                  }}
                  style={getPrimaryBackgroundColorStyle(actualTheme)}
                  className="p-3 bg-light-primary dark:bg-dark-background flex-1 items-center justify-between flex-row rounded-lg"
                >
                  <Text className="font-inter font-bold text-green-500">
                    Answered
                  </Text>
                  <FontAwesome
                    name="check-circle-o"
                    size={24}
                    color="#00cd00"
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />
    </Container>
  );
};

export default Checklist;
