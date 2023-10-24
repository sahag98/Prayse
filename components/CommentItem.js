import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Image } from "react-native";
import Moment from "moment";

const CommentItem = ({ item, theme, session }) => {
  return (
    <View style={styles.commentContainer}>
      <View style={styles.content}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
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
          {item.profiles.admin == true && (
            <Text
              style={
                theme == "dark"
                  ? {
                      backgroundColor: "#ff4e4e",
                      paddingVertical: 3,
                      paddingHorizontal: 6,
                      fontFamily: "Inter-Medium",
                      fontSize: 10,
                      color: "white",
                      borderRadius: 10,
                      marginLeft: 10,
                    }
                  : {
                      backgroundColor: "#ff3b3b",
                      marginLeft: 10,
                      paddingVertical: 3,
                      paddingHorizontal: 6,
                      fontFamily: "Inter-Medium",
                      fontSize: 10,
                      color: "white",
                      borderRadius: 10,
                    }
              }
            >
              admin
            </Text>
          )}
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
        {item.comment}
      </Text>
    </View>
  );
};

export default CommentItem;

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
