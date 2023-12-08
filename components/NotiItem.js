import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { deleteNoti } from "../redux/notiReducer";
import { useSupabase } from "../context/useSupabase";
import * as Notifications from "expo-notifications";

const NotiItem = ({ item, theme, setNotiVisible, navigation }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSupabase();
  const viewNotification = (screen) => {
    if (!screen) {
      console.log(item);
      dismissNotification(item);
      dispatch(deleteNoti(item.noti_id));
      setNotiVisible(false);
      return;
    }
    if (screen == "Question" && !isLoggedIn) {
      console.log("not logged in");
      navigation.navigate(screen);
    }
    setNotiVisible(false);
    dismissNotification(item);
    navigation.navigate(screen);
    dispatch(deleteNoti(item.noti_id));
  };

  const dismissNotification = async (item) => {
    await Notifications.dismissNotificationAsync(item.identifier);
  };

  console.log(item.date);

  return (
    <View
      style={{
        zIndex: 99,
        flexDirection: "row",
        alignItems: "center",
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
        <Text
          style={
            theme == "dark"
              ? { color: "white", fontFamily: "Inter-Light", fontSize: 12 }
              : { color: "#2f2d51", fontFamily: "Inter-Light", fontSize: 12 }
          }
        >
          {item.date}
        </Text>
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
              ? { fontFamily: "Inter-Medium", color: "#A5C9FF" }
              : { fontFamily: "Inter-Medium", color: "#2f2d51" }
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
