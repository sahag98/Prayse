import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
// import prayerIcon from "../assets/prayIcon.png";
import { format } from "timeago.js";
import { useSupabase } from "../context/useSupabase";
import Moment from "moment";
import { useSelector } from "react-redux";
import CommentModal from "./CommentModal";
import axios from "axios";

const PrayerItem = ({ getPrayers, prayers, session, item }) => {
  const theme = useSelector((state) => state.user.theme);
  const [commentVisible, setCommentVisible] = useState(false);
  const { currentUser, logout, supabase } = useSupabase();
  const [likes, setLikes] = useState([]);
  const [commentsArray, setCommentsArray] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const isNewItem = item === prayers[0];

  useEffect(() => {
    setLoadingLikes(true);
    // console.log("use effect");
    fetchLikes(item.id).then(() => {
      setLoadingLikes(false);
    });
    fetchComments(item.id).then(() => {
      setLoadingLikes(false);
    });
  }, [item.id]);

  async function fetchComments(prayerId) {
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("*, profiles(*)")
      .eq("prayer_id", prayerId)
      // .neq("parent_comment_id", prayerId)
      // .eq("parent_comment_id", null)
      .order("id", { ascending: false });
    setCommentsArray(comments);

    if (commentsError) {
      console.log(commentsError);
    }
  }

  async function fetchLikes(prayerId) {
    const { data: likes, error: likesError } = await supabase
      .from("likes")
      .select()
      .eq("prayer_id", prayerId);
    setLikes(likes);

    if (likesError) {
      console.log(likesError);
    }
  }

  // console.log("created at: ", format(item.created_at));
  const sendNotification = async (expoToken, title) => {
    const message = {
      to: expoToken,
      sound: "default",
      title: title,
      body: `${currentUser.full_name} is praying on ${item.prayer}.`,
      data: { screen: "Community" },
    };

    await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });
  };

  async function toggleLike(id, expoToken) {
    if (isLikedByMe) {
      const { data, error } = await supabase
        .from("likes")
        .delete()
        .eq("prayer_id", id)
        .eq("user_id", currentUser.id);
      fetchLikes(id);
      return;
    }
    const { data, error } = await supabase.from("likes").insert({
      prayer_id: id,
      user_id: currentUser.id,
    });
    if (expoToken.length > 0) {
      sendNotification(expoToken, "Community");
    }
    if (error) {
      console.log(error);
    }
    fetchLikes(id);
  }

  const isLikedByMe = !!likes?.find((like) => like.user_id == currentUser.id);
  return (
    <View
      style={{
        gap: 10,
        marginBottom: 15,
      }}
    >
      <View
        style={
          theme == "dark" ? styles.prayerContainerDark : styles.prayerContainer
        }
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              style={
                theme == "dark" ? styles.profileImgDark : styles.profileImg
              }
              source={{
                uri: item.profiles?.avatar_url
                  ? item.profiles?.avatar_url
                  : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
              }}
            />
            <Text
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Bold", color: "white" }
                  : { fontFamily: "Inter-Bold", color: "#2f2d51" }
              }
            >
              {item.profiles?.full_name}
            </Text>
            {item.profiles?.admin == true && (
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
                      }
                    : {
                        backgroundColor: "#ff3b3b",
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
                    fontSize: 12,
                  }
                : {
                    color: "#2f2d51",
                    fontFamily: "Inter-Light",
                    fontSize: 12,
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
                  marginTop: 5,
                  marginLeft: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  lineHeight: 20,
                  width: "100%",
                  color: "white",
                  fontFamily: "Inter-Regular",
                }
              : {
                  marginTop: 5,
                  marginLeft: 5,
                  lineHeight: 20,
                  paddingVertical: 5,
                  paddingHorizontal: 5,
                  width: "100%",
                  color: "#2f2d51",
                  fontFamily: "Inter-Regular",
                }
          }
        >
          {item.prayer}
        </Text>

        <CommentModal
          fetchComments={fetchComments}
          supabase={supabase}
          session={session}
          prayer={item}
          commentsArray={commentsArray}
          commentVisible={commentVisible}
          user={currentUser}
          setCommentVisible={setCommentVisible}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => toggleLike(item.id, item.profiles?.expoToken)}
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
        >
          {isNewItem && loadingLikes ? (
            <ActivityIndicator size="small" color={"black"} />
          ) : (
            <>
              <Text
                style={
                  isLikedByMe
                    ? { color: "#ff4e4e" }
                    : theme == "dark"
                    ? { color: "white" }
                    : { color: "#2f2d51" }
                }
              >
                {likes.length}
              </Text>
              <Image
                style={
                  isLikedByMe
                    ? { width: 22, height: 22, tintColor: "#ff4e4e" }
                    : theme == "dark"
                    ? { width: 22, height: 22, tintColor: "white" }
                    : { width: 22, height: 22, tintColor: "#2f2d51" }
                }
                source={{
                  uri: "https://cdn.glitch.global/1948cbef-f54d-41c2-acf7-6548a208aa97/Black%20and%20White%20Rectangle%20Sports%20Logo%20(1).png?v=1698692894367",
                }}
              />
            </>
          )}
        </TouchableOpacity>

        {item.disable_response ? (
          <TouchableOpacity
            disabled={item.disable_response}
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          >
            {isNewItem && loadingLikes ? (
              <ActivityIndicator size="small" color={"#c6c6df"} />
            ) : (
              <FontAwesome
                name="comment-o"
                size={22}
                color={theme == "dark" ? "#2f2f2f" : "#c6c6df"}
              />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setCommentVisible(true)}
            style={
              item.disable_response
                ? {
                    color: "red",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }
                : { flexDirection: "row", alignItems: "center", gap: 5 }
            }
          >
            {isNewItem && loadingLikes ? (
              <ActivityIndicator size="small" color={"black"} />
            ) : (
              <>
                <Text
                  style={
                    theme == "dark"
                      ? { color: "#d6d6d6" }
                      : { color: "#2f2d51" }
                  }
                >
                  {commentsArray.length}
                </Text>

                <FontAwesome
                  name="comment-o"
                  size={22}
                  color={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
                />
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PrayerItem;

const styles = StyleSheet.create({
  prayerContainer: {
    backgroundColor: "white",
    borderColor: "#2f2d51",
    borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 10,
  },
  prayerContainerDark: {
    backgroundColor: "#212121",
    // borderColor: "black",
    // borderWidth: 0.5,
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 10,
  },
  profileImg: {
    borderColor: "#2F2D51",
    borderWidth: 0.2,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  profileImgDark: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
