import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import Moment from "moment";

const CommentItem = ({ item, theme }) => {
  console.log(theme);
  return (
    <View style={styles.commentContainer}>
      <View style={styles.content}>
        <Image
          style={styles.profileImg}
          source={{ uri: item.profiles.avatar_url }}
        />

        <View style={{ gap: 5 }}>
          <Text
            style={
              theme == "dark"
                ? { color: "white", fontSize: 13, fontFamily: "Inter-Bold" }
                : { color: "#2f2d51", fontSize: 13, fontFamily: "Inter-Bold" }
            }
          >
            {item.profiles.full_name}
          </Text>
          <Text
            style={
              theme == "dark"
                ? {
                    fontSize: 13,
                    color: "white",
                    fontFamily: "Inter-Regular",
                  }
                : {
                    fontSize: 13,
                    color: "#2f2d51",
                    fontFamily: "Inter-Regular",
                  }
            }
          >
            {item.comment}
          </Text>
        </View>
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
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    gap: 5,
  },
  commentContainer: {
    paddingVertical: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 5,
  },
  profileImg: {
    width: 45,
    height: 45,
    borderColor: "#A5C9FF",
    borderWidth: 1,
    marginRight: 10,
    borderRadius: 50,
  },
});
