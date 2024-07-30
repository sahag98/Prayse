// @ts-nocheck
import React from "react";
import * as Notifications from "expo-notifications";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import { useSupabase } from "../context/useSupabase";
import { deleteNoti } from "../redux/notiReducer";
import { QUESTION_SCREEN } from "../routes";

const NotiItem = ({ actualTheme, item, theme, navigation }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSupabase();

  const viewNotification = (url) => {
    if (!url) {
      dismissNotification(item);
      dispatch(deleteNoti(item.noti_id));

      return;
    }
    if (["Question", QUESTION_SCREEN].includes(url) && !isLoggedIn) {
      navigation.navigate(QUESTION_SCREEN);
    }

    if (
      ["Question", QUESTION_SCREEN].includes(url) &&
      isLoggedIn &&
      item.question_id
    ) {
      navigation.navigate(QUESTION_SCREEN, {
        title: item.title,
        question_id: item.question_id,
      });
      dispatch(deleteNoti(item.noti_id));
      return;
    }

    dismissNotification(item);
    navigation.navigate(url);
    dispatch(deleteNoti(item.noti_id));
  };

  const dismissNotification = async (item) => {
    await Notifications.dismissNotificationAsync(item.identifier);
  };

  return (
    <View
      style={getSecondaryBackgroundColorStyle(actualTheme)}
      className="w-full flex-row bg-light-secondary dark:bg-dark-secondary rounded-md p-3 mb-4 justify-between gap-3"
      key={item.noti_id}
    >
      <View className="gap-2 p-3 w-[80%]">
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter font-normal text-light-primary dark:text-dark-primary"
        >
          {item.notification}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => viewNotification(item.url || item.screen)}
        className="relative items-center w-[20%] border-l dark:border-dark-accent border-light-primary"
      >
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter font-bold text-lg text-light-primary dark:text-dark-accent"
        >
          View
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotiItem;
