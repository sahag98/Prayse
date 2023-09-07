import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import Moment from "moment";

const AnswerItem = ({ item, theme }) => {
  return (
    <View style={styles.commentContainer}>
      <View style={styles.content}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
          <Image
            style={styles.profileImg}
            source={{ uri: item.profiles.avatar_url }}
          />
          <Text
            style={
              theme == "dark"
                ? { color: "white", fontSize: 14, fontFamily: "Inter-Bold" }
                : { color: "#2f2d51", fontSize: 14, fontFamily: "Inter-Bold" }
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
                  fontSize: 11,
                  marginTop: 2,
                }
              : {
                  color: "#2f2d51",
                  fontFamily: "Inter-Light",
                  fontSize: 11,
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
    // justifyContent: "center",
  },
  commentContainer: {
    paddingVertical: 10,

    justifyContent: "space-between",
    flexDirection: "column",
    marginBottom: 5,
  },
  profileImg: {
    width: 40,
    height: 40,
    borderColor: "#A5C9FF",
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 50,
  },
});
