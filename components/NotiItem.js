import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { deleteNoti } from "../redux/notiReducer";

const NotiItem = ({ item, theme, setNotiVisible, navigation }) => {
  const dispatch = useDispatch();
  const viewNotification = (screen) => {
    setNotiVisible(false);
    navigation.navigate(screen);
    dispatch(deleteNoti(item.noti_id));
  };
  return (
    <View
      style={{
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
