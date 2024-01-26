import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Moment from "moment";
const ReflectionItem = ({ item, theme }) => {
  return (
    <View style={{ gap: 10, paddingVertical: 15 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image
            style={styles.avatar}
            source={{
              uri: item.profiles.avatar_url
                ? item.profiles.avatar_url
                : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
            }}
          />
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontSize: 15,
              fontFamily: "Inter-Medium",
            }}
          >
            {item.profiles.full_name}
          </Text>
        </View>
        <Text
          style={{
            color: theme == "dark" ? "white" : "#2f2d51",
            fontSize: 12,
            fontFamily: "Inter-Regular",
          }}
        >
          {Moment(item.created_at).fromNow()}
        </Text>
      </View>
      <Text
        style={{
          color: theme == "dark" ? "white" : "#2f2d51",
          fontFamily: "Inter-Regular",
        }}
      >
        {item.reflection}
      </Text>
    </View>
  );
};

export default ReflectionItem;

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
});
