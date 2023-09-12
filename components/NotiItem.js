import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { deleteNoti } from "../redux/notiReducer";

const NotiItem = ({ item, setNotiVisible, navigation }) => {
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
        <Text style={{ color: "#2f2d51", fontFamily: "Inter-Regular" }}>
          {item.notification}
        </Text>
        <Text
          style={{ color: "#2f2d51", fontFamily: "Inter-Light", fontSize: 13 }}
        >
          {item.date}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => viewNotification(item.screen)}
        style={{
          position: "relative",
          borderLeftColor: "#2f2d51",
          borderLeftWidth: 1,
          alignItems: "center",
          width: "20%",
        }}
      >
        <Text style={{ fontFamily: "Inter-Medium", color: "#2f2d51" }}>
          View
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotiItem;

const styles = StyleSheet.create({});
