import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import Moment from "moment";
import { FontAwesome5 } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const CommentItem = ({
  prayerId,
  item,
  user,
  handleCloseModal,
  supabase,
  theme,
  session,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isShowingReplies, setIsShowingReplies] = useState(false);
  const [reply, setReply] = useState("");
  const [replyArray, setReplyArray] = useState([]);
  useEffect(() => {
    fetchReplies();
  }, [item.id]);
  async function fetchReplies() {
    const { data: replies, error: repliesError } = await supabase
      .from("comments")
      .select("*, profiles(*)")

      .eq("parent_comment_id", item.id)
      .order("id", { ascending: false });
    setReplyArray(replies);

    if (repliesError) {
      console.log(repliesError);
    }
  }

  console.log("replies :", replyArray);

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const addReply = async (id) => {
    if (reply.length <= 0) {
      showToast("error", "The reply field can't be left empty.");
      setCommentVisible(false);
      return;
    } else {
      const { data, error } = await supabase.from("comments").insert({
        // prayer_id: prayerId,
        user_id: user.id,
        comment: reply,
        parent_comment_id: id,
      });

      showToast("success", "Reply added successfully. ✔️");

      if (error) {
        showToast("error", error);
      }
      fetchReplies();
      // fetchComments(prayer.id);
      handleCloseModal();
      setReply("");
    }
  };

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
                marginLeft: 5,
              }
            : {
                fontSize: 14,
                color: "#2f2d51",
                fontFamily: "Inter-Regular",
                lineHeight: 20,
                marginLeft: 5,
              }
        }
      >
        {item.comment}
      </Text>
      <TouchableOpacity
        onPress={() => setIsReplying(!isReplying)}
        style={{
          alignSelf: "flex-end",
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginRight: 10,
        }}
      >
        <Text
          style={{
            color: "#2f2d51",
            fontSize: 13,
            fontFamily: "Inter-Regular",
          }}
        >
          Reply
        </Text>
        <FontAwesome5 name="reply" size={17} color="#2f2d51" />
      </TouchableOpacity>
      {isReplying && (
        <>
          <TextInput
            style={{ backgroundColor: "white", height: 50 }}
            value={reply}
            onChangeText={(text) => setReply(text)}
          />
          <Button onPress={() => addReply(item.id)} title="Reply">
            Reply
          </Button>
        </>
      )}
      <TouchableOpacity onPress={() => setIsShowingReplies(!isShowingReplies)}>
        <Text
          style={{ color: "#2f2d51", fontSize: 13, fontFamily: "Inter-Medium" }}
        >
          View replies ({replyArray.length})
        </Text>
      </TouchableOpacity>
      {isShowingReplies && (
        <View
          style={{
            backgroundColor: "#93d8f8",
            gap: 10,
            padding: 5,
            borderRadius: 5,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Inter-Medium",
              color: "#2f2d51",
            }}
          >
            Replies
          </Text>
          {replyArray.map((r) => (
            <>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  style={styles.replyprofileImg}
                  source={{
                    uri: item.profiles.avatar_url
                      ? item.profiles.avatar_url
                      : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
                  }}
                />
                <Text
                  style={
                    theme == "dark"
                      ? {
                          color: "white",

                          fontFamily: "Inter-Bold",
                        }
                      : {
                          color: "#2f2d51",

                          fontFamily: "Inter-Bold",
                        }
                  }
                >
                  {item.profiles.full_name}
                </Text>
              </View>
              <Text style={{ marginLeft: 5 }}>{r.comment}</Text>
            </>
          ))}
        </View>
      )}
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
    marginRight: 8,
    borderRadius: 50,
  },
  replyprofileImg: {
    width: 30,
    height: 30,
    borderColor: "#A5C9FF",
    borderWidth: 1,
    marginRight: 5,
    borderRadius: 50,
  },
});
