import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import prayerIcon from "../assets/prayIcon.png";
import { format } from "timeago.js";
import { useSupabase } from "../context/useSupabase";
import Moment from "moment";
import { useSelector } from "react-redux";
import CommentModal from "./CommentModal";

const PrayerItem = ({ getPrayers, prayers, item }) => {
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
      .eq("prayer_id", prayerId);

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

  async function toggleLike(id) {
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
              style={styles.profileImg}
              source={{ uri: item.profiles.avatar_url }}
            />
            <Text
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Bold", color: "white" }
                  : { fontFamily: "Inter-Bold" }
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={
              theme == "dark"
                ? {
                    marginLeft: 10,
                    paddingVertical: 5,
                    lineHeight: 20,
                    width: "100%",
                    color: "white",
                    fontFamily: "Inter-Regular",
                  }
                : {
                    marginLeft: 10,
                    lineHeight: 20,
                    paddingVertical: 5,
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
            prayer={item}
            commentsArray={commentsArray}
            commentVisible={commentVisible}
            user={currentUser}
            setCommentVisible={setCommentVisible}
          />
        </View>
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
          onPress={() => toggleLike(item.id)}
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
                source={prayerIcon}
              />
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCommentVisible(true)}
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
        >
          {isNewItem && loadingLikes ? (
            <ActivityIndicator size="small" color={"black"} />
          ) : (
            <>
              <Text
                style={
                  theme == "dark" ? { color: "#d6d6d6" } : { color: "#2f2d51" }
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
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
