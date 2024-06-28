// @ts-nocheck
import React from "react";
import * as Notifications from "expo-notifications";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";

import { useSupabase } from "../context/useSupabase";
import { deleteNoti } from "../redux/notiReducer";
import { QUESTION_SCREEN } from "../routes";

const NotiItem = ({ item, theme, navigation }) => {
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
      style={{
        width: "100%",
        flexDirection: "row",
        backgroundColor: theme === "dark" ? "#212121" : "#b7d3ff",
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 15,
        padding: 10,
        justifyContent: "space-between",
        gap: 10,
      }}
      key={item.noti_id}
    >
      <View style={{ gap: 5, padding: 10, width: "80%" }}>
        <Text
          style={
            theme === "dark"
              ? { color: "white", fontFamily: "Inter-Regular" }
              : { color: "#2f2d51", fontFamily: "Inter-Regular" }
          }
        >
          {item.notification}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => viewNotification(item.url || item.screen)}
        style={
          theme === "dark"
            ? {
                position: "relative",
                borderLeftColor: "#A5C9FF",
                borderLeftWidth: 1,
                alignItems: "center",
                width: "20%",
              }
            : {
                position: "relative",
                borderLeftColor: "#2f2d51",
                borderLeftWidth: 1,
                alignItems: "center",
                width: "20%",
              }
        }
      >
        <Text
          style={
            theme === "dark"
              ? { fontFamily: "Inter-Bold", color: "#A5C9FF" }
              : { fontFamily: "Inter-Bold", color: "#2f2d51" }
          }
        >
          View
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotiItem;
