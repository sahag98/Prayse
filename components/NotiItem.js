import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { deleteNoti } from "../redux/notiReducer";
import { useSupabase } from "../context/useSupabase";
import * as Notifications from "expo-notifications";

const NotiItem = ({ item, theme, navigation }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSupabase();

  const viewNotification = (screen) => {
    if (!screen) {
      dismissNotification(item);
      dispatch(deleteNoti(item.noti_id));

      return;
    }
    if (screen == "Question" && !isLoggedIn) {
      navigation.navigate(screen);
    }

    if (screen == "Question" && isLoggedIn && item.question_id) {
      navigation.navigate(screen, {
        title: item.title,
        question_id: item.question_id,
      });
      dispatch(deleteNoti(item.noti_id));
      return;
    }

    dismissNotification(item);
    navigation.navigate(screen);
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
        backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
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
            theme == "dark"
              ? { color: "white", fontFamily: "Inter-Regular" }
              : { color: "#2f2d51", fontFamily: "Inter-Regular" }
          }
        >
          {item.notification}
        </Text>
        {/* <Text
          style={
            theme == "dark"
              ? { color: "white", fontFamily: "Inter-Light", fontSize: 12 }
              : { color: "#2f2d51", fontFamily: "Inter-Light", fontSize: 12 }
          }
        >
          {item.date}
        </Text> */}
      </View>
      <TouchableOpacity
        onPress={() => viewNotification(item.screen)}
        style={
          theme == "dark"
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
            theme == "dark"
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

const styles = StyleSheet.create({});
