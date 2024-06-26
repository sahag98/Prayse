import React from "react";
import Moment from "moment";
import { Image, StyleSheet, Text, View } from "react-native";

const AnswerItem = ({ item, theme }) => {
  return (
    <View
      style={[
        styles.commentContainer,
        { backgroundColor: theme == "dark" ? "#212121" : "#ffd8a5" },
      ]}
    >
      <View style={styles.content}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
          <Image
            style={styles.profileImg}
            source={{
              uri: item.profiles.avatar_url
                ? item.profiles.avatar_url
                : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
            }}
          />
          <Text
            style={
              theme == "dark"
                ? { color: "white", fontSize: 15, fontFamily: "Inter-Bold" }
                : { color: "#2f2d51", fontSize: 15, fontFamily: "Inter-Bold" }
            }
          >
            {item.profiles.full_name}
          </Text>
        </View>

        <Text
          style={
            theme == "dark"
              ? {
                  color: "#d6d6d6",
                  fontFamily: "Inter-Light",
                  fontSize: 12,
                  marginTop: 2,
                }
              : {
                  color: "#2f2d51",
                  fontFamily: "Inter-Light",
                  fontSize: 12,
                  marginTop: 2,
                }
          }
        >
          {Moment(item.created_at).fromNow()}
        </Text>
      </View>
      <Text
        style={
          theme == "dark"
            ? {
                fontSize: 14,
                marginLeft: 5,
                color: "white",
                fontFamily: "Inter-Regular",
                lineHeight: 20,
              }
            : {
                fontSize: 14,
                color: "#2f2d51",
                fontFamily: "Inter-Regular",
              }
        }
      >
        {item.answer}
      </Text>
    </View>
  );
};

export default AnswerItem;

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  commentContainer: {
    padding: 10,
    borderRadius: 10,
    gap: 10,
    justifyContent: "space-between",
    flexDirection: "column",
    marginBottom: 5,
  },
  profileImg: {
    width: 50,
    height: 50,
    borderColor: "#A5C9FF",
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 50,
  },
});
