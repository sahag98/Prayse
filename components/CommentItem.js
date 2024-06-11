import React, { useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Toast from "react-native-toast-message";

import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

const CommentItem = ({
  item,
  user,
  isReplying,
  setIsReplying,
  handleCloseModal,
  supabase,
  theme,
}) => {
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

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const sendNotification = async (expoToken) => {
    const message = {
      to: expoToken,
      sound: "default",
      title: "New Reply ✏️",
      body: `${user.full_name} has replied to: ${item.comment}.`,
      data: { screen: "PublicCommunity" },
    };

    await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });
  };

  const addReply = async (id) => {
    if (reply.length <= 0) {
      showToast("error", "The reply field can't be left empty.");
      setIsShowingReplies(false);
    } else {
      const { error } = await supabase.from("comments").insert({
        // prayer_id: prayerId,
        user_id: user.id,
        comment: reply,
        parent_comment_id: id,
      });

      showToast("success", "Reply added successfully. ✔️");
      if (user.expoToken.length > 0) {
        sendNotification(user.expoToken, "New Response 💭");
      }
      if (error) {
        showToast("error", error);
      }
      fetchReplies();
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
              theme === "dark"
                ? { color: "white", fontSize: 15, fontFamily: "Inter-Bold" }
                : { color: "#2f2d51", fontSize: 15, fontFamily: "Inter-Bold" }
            }
          >
            {item.profiles.full_name}
          </Text>
          {item.profiles.admin === true && (
            <Text
              style={
                theme === "dark"
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
            theme === "dark"
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
          theme === "dark"
            ? {
                fontSize: 14,
                color: "white",
                fontFamily: "Inter-Regular",
                lineHeight: 20,
                marginLeft: 5,
                marginBottom: 10,
              }
            : {
                fontSize: 14,
                color: "#2f2d51",
                fontFamily: "Inter-Regular",
                lineHeight: 20,
                marginLeft: 5,
                marginBottom: 10,
              }
        }
      >
        {item.comment}
      </Text>
      {isReplying !== item.id ? (
        <TouchableOpacity
          onPress={() => setIsReplying(item.id)}
          style={{
            alignSelf: "flex-end",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginRight: 10,
          }}
        >
          <Text
            style={
              theme === "dark"
                ? {
                    color: "#A5C9FF",
                    fontSize: 13,
                    fontFamily: "Inter-Regular",
                  }
                : {
                    color: "#2f2d51",
                    fontSize: 13,
                    fontFamily: "Inter-Regular",
                  }
            }
          >
            Reply
          </Text>
          <FontAwesome5
            name="reply"
            size={17}
            color={theme === "dark" ? "#A5C9FF" : "#2f2d51"}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => setIsReplying("")}
          style={{
            alignSelf: "flex-end",
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            marginRight: 10,
          }}
        >
          <Text
            style={
              theme === "dark"
                ? {
                    color: "#A5C9FF",
                    fontSize: 13,
                    fontFamily: "Inter-Medium",
                  }
                : {
                    color: "#2f2d51",
                    fontSize: 13,
                    fontFamily: "Inter-Medium",
                  }
            }
          >
            Close Reply
          </Text>
          <AntDesign
            name="close"
            size={17}
            color={theme === "dark" ? "#A5C9FF" : "#2f2d51"}
          />
        </TouchableOpacity>
      )}
      {isReplying === item.id && (
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          style={{ marginVertical: 10 }}
        >
          <TextInput
            style={
              theme === "dark"
                ? {
                    backgroundColor: "#212121",
                    padding: 10,
                    paddingHorizontal: 10,
                    color: "white",
                    borderRadius: 10,
                  }
                : {
                    backgroundColor: "white",
                    padding: 10,

                    borderRadius: 10,
                    borderColor: "#2f2d51",
                    borderWidth: 1,
                  }
            }
            placeholder="Write a reply"
            placeholderTextColor={theme === "dark" ? "#b8b8b8" : "#2f2d51"}
            value={reply}
            onChangeText={(text) => setReply(text)}
          />
          <TouchableOpacity
            style={
              theme === "dark"
                ? {
                    backgroundColor: "#A5C9FF",
                    padding: 12,
                    borderRadius: 10,
                    marginTop: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }
                : {
                    backgroundColor: "#2f2d51",
                    padding: 12,
                    borderRadius: 10,
                    marginTop: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }
            }
            onPress={() => addReply(item.id)}
          >
            <Text
              style={
                theme === "dark"
                  ? { color: "#121212", fontFamily: "Inter-Medium" }
                  : { color: "white", fontFamily: "Inter-Medium" }
              }
            >
              Reply
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {replyArray.length > 0 && (
        <TouchableOpacity
          onPress={() => setIsShowingReplies(!isShowingReplies)}
        >
          {isShowingReplies ? (
            <Text
              style={
                theme === "dark"
                  ? {
                      color: "white",
                      fontSize: 13,
                      fontFamily: "Inter-Medium",
                    }
                  : {
                      color: "#2f2d51",
                      fontSize: 13,
                      fontFamily: "Inter-Medium",
                    }
              }
            >
              Close replies ({replyArray.length})
            </Text>
          ) : (
            <Text
              style={
                theme === "dark"
                  ? {
                      color: "white",
                      fontSize: 13,
                      fontFamily: "Inter-Medium",
                    }
                  : {
                      color: "#2f2d51",
                      fontSize: 13,
                      fontFamily: "Inter-Medium",
                    }
              }
            >
              View replies ({replyArray.length})
            </Text>
          )}
        </TouchableOpacity>
      )}
      {isShowingReplies && (
        <Animated.View
          entering={FadeIn.duration(500)}
          exiting={FadeOut.duration(500)}
          style={
            theme === "dark"
              ? {
                  backgroundColor: "#212121",
                  gap: 10,
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 5,
                }
              : {
                  backgroundColor: "#b7d3ff",
                  gap: 10,
                  padding: 10,
                  borderRadius: 5,
                  marginTop: 5,
                }
          }
        >
          <Text
            style={
              theme === "dark"
                ? {
                    textAlign: "center",
                    fontFamily: "Inter-Bold",
                    color: "#A5C9FF",
                  }
                : {
                    textAlign: "center",
                    fontFamily: "Inter-Bold",
                    color: "#2f2d51",
                  }
            }
          >
            Replies
          </Text>
          {replyArray.lengh === 0 ? (
            <Text style={{ backgroundColor: "red", height: 10, width: 20 }}>
              No replies yet.
            </Text>
          ) : (
            <>
              {replyArray.map((r) => (
                <>
                  <View
                    key={r.id}
                    style={{
                      flexDirection: "row",

                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View
                      key={r.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Image
                        style={styles.replyprofileImg}
                        source={{
                          uri: r.profiles.avatar_url
                            ? r.profiles.avatar_url
                            : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
                        }}
                      />
                      <Text
                        style={
                          theme === "dark"
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
                        {r.profiles.full_name}
                      </Text>
                    </View>
                    <Text
                      style={
                        theme === "dark"
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
                      {Moment(r.created_at).fromNow()}
                    </Text>
                  </View>
                  <Text
                    style={
                      theme === "dark"
                        ? {
                            fontFamily: "Inter-Regular",
                            color: "white",
                            marginTop: 5,
                            marginLeft: 5,
                          }
                        : { fontFamily: "Inter-Regular", marginLeft: 5 }
                    }
                  >
                    {r.comment}
                  </Text>
                </>
              ))}
            </>
          )}
        </Animated.View>
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
    paddingVertical: 8,
    gap: 10,
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
