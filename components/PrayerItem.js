import React, { useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

// import prayerIcon from "../assets/prayIcon.png";
import { FontAwesome } from "@expo/vector-icons";

import { useSupabase } from "../context/useSupabase";

import CommentModal from "./CommentModal";

const PrayerItem = ({ prayers, session, item }) => {
  const theme = useSelector((state) => state.user.theme);
  const scale = useSharedValue(1);
  const [commentVisible, setCommentVisible] = useState(false);
  const {
    currentUser,
    supabase,
    refreshComments,
    setRefreshComments,
    refreshLikes,
    setRefreshLikes,
  } = useSupabase();
  const [likes, setLikes] = useState([]);
  const [commentsArray, setCommentsArray] = useState([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const isNewItem = item === prayers[0];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    setLoadingLikes(true);
    fetchLikes(item.id).then(() => {
      setLoadingLikes(false);
      setRefreshLikes(false);
    });
    fetchComments(item.id).then(() => {
      setLoadingLikes(false);
      setRefreshComments(false);
    });
  }, [item.id, refreshLikes, refreshComments]);

  async function fetchComments(prayerId) {
    //prayer_id for production
    //prayertest_id for testing
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("*, profiles(*)")
      .eq("prayer_id", prayerId)
      .order("id", { ascending: true });
    setCommentsArray(comments);

    if (commentsError) {
      console.log(commentsError);
    }
  }

  async function fetchLikes(prayerId) {
    //prayer_id for production
    //prayertest_id for testing
    const { data: likes, error: likesError } = await supabase
      .from("likes")
      .select()
      .eq("prayer_id", prayerId);
    setLikes(likes);

    if (likesError) {
      console.log(likesError);
    }
  }

  const sendNotification = async (expoToken, title) => {
    const message = {
      to: expoToken,
      sound: "default",
      title,
      body: `${currentUser.full_name} is praying on: ${item.prayer}.`,
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
      scale.value = withSequence(
        withSpring(1.2, { damping: 2, stiffness: 80 }),
        withSpring(1, { damping: 2, stiffness: 80 }),
      );
      await supabase
        .from("likes")
        .delete()
        .eq("prayer_id", id)
        .eq("user_id", currentUser.id);
      fetchLikes(id);
      return;
    }
    scale.value = withSequence(
      withSpring(1.2, { damping: 2, stiffness: 80 }),
      withSpring(1, { damping: 2, stiffness: 80 }),
    );
    //prayer_id for production
    //prayertest_id for testing
    const { error } = await supabase.from("likes").insert({
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
          theme === "dark" ? styles.prayerContainerDark : styles.prayerContainer
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
                theme === "dark" ? styles.profileImgDark : styles.profileImg
              }
              source={{
                uri: item.profiles?.avatar_url
                  ? item.profiles?.avatar_url
                  : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
              }}
            />
            <Text
              style={
                theme === "dark"
                  ? { fontFamily: "Inter-Bold", fontSize: 15, color: "white" }
                  : { fontFamily: "Inter-Bold", fontSize: 15, color: "#2f2d51" }
              }
            >
              {item.profiles?.full_name}
            </Text>
            {item.profiles?.admin == true && (
              <View
                style={
                  theme === "dark"
                    ? { borderRadius: 10, backgroundColor: "#ff4e4e" }
                    : { borderRadius: 10, backgroundColor: "#ff3b3b" }
                }
              >
                <Text
                  style={
                    theme === "dark"
                      ? {
                          paddingVertical: 3,
                          paddingHorizontal: 6,
                          fontFamily: "Inter-Medium",
                          fontSize: 11,
                          color: "white",
                        }
                      : {
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
              </View>
            )}
          </View>
          <Text
            style={
              theme === "dark"
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
            theme === "dark"
              ? {
                  marginTop: 5,
                  marginLeft: 5,
                  paddingVertical: 5,
                  fontSize: 14,
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
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => toggleLike(item.id, item.profiles?.expoToken)}
          style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
        >
          {isNewItem && loadingLikes ? (
            <>
              <Text
                style={
                  isLikedByMe
                    ? {
                        color: "#ff4e4e",
                        fontFamily: "Inter-Medium",
                        fontSize: 15,
                      }
                    : theme === "dark"
                      ? {
                          color: "white",
                          fontFamily: "Inter-Medium",
                          fontSize: 15,
                        }
                      : {
                          color: "#2f2d51",
                          fontFamily: "Inter-Medium",
                          fontSize: 15,
                        }
                }
              >
                {likes.length}
              </Text>
              <Image
                style={
                  isLikedByMe
                    ? { width: 28, height: 28, tintColor: "#ff4e4e" }
                    : theme === "dark"
                      ? { width: 28, height: 28, tintColor: "white" }
                      : { width: 28, height: 28, tintColor: "#2f2d51" }
                }
                source={{
                  uri: "https://cdn.glitch.global/1948cbef-f54d-41c2-acf7-6548a208aa97/Black%20and%20White%20Rectangle%20Sports%20Logo%20(1).png?v=1698692894367",
                }}
              />
            </>
          ) : (
            <>
              <Text
                style={
                  isLikedByMe
                    ? {
                        color: "#ff4e4e",
                        fontFamily: "Inter-Medium",
                        fontSize: 15,
                      }
                    : theme === "dark"
                      ? {
                          color: "white",
                          fontFamily: "Inter-Medium",
                          fontSize: 15,
                        }
                      : {
                          color: "#2f2d51",
                          fontFamily: "Inter-Medium",
                          fontSize: 15,
                        }
                }
              >
                {likes.length}
              </Text>
              <Animated.View style={animatedStyle}>
                <Image
                  style={
                    isLikedByMe
                      ? { width: 28, height: 28, tintColor: "#ff4e4e" }
                      : theme === "dark"
                        ? { width: 28, height: 28, tintColor: "white" }
                        : { width: 28, height: 28, tintColor: "#2f2d51" }
                  }
                  source={{
                    uri: "https://cdn.glitch.global/1948cbef-f54d-41c2-acf7-6548a208aa97/Black%20and%20White%20Rectangle%20Sports%20Logo%20(1).png?v=1698692894367",
                  }}
                />
              </Animated.View>
            </>
          )}
        </TouchableOpacity>

        {item.disable_response ? (
          <TouchableOpacity
            disabled={item.disable_response}
            style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
          >
            {isNewItem && loadingLikes ? (
              <FontAwesome
                name="comment-o"
                size={28}
                color={theme === "dark" ? "#2f2f2f" : "#c6c6df"}
              />
            ) : (
              <FontAwesome
                name="comment-o"
                size={28}
                color={theme === "dark" ? "#2f2f2f" : "#c6c6df"}
              />
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setCommentVisible(true)}
            style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
          >
            {isNewItem && loadingLikes ? (
              <>
                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontSize: 15,
                          fontFamily: "Inter-Medium",
                          color: "#d6d6d6",
                        }
                      : {
                          fontSize: 15,
                          fontFamily: "Inter-Medium",
                          color: "#2f2d51",
                        }
                  }
                >
                  {commentsArray.length}
                </Text>
                <FontAwesome
                  name="comment-o"
                  size={28}
                  color={theme === "dark" ? "#d6d6d6" : "#c6c6df"}
                />
              </>
            ) : (
              <>
                <Text
                  style={
                    theme === "dark"
                      ? {
                          fontSize: 15,
                          fontFamily: "Inter-Medium",
                          color: "white",
                        }
                      : {
                          fontSize: 15,
                          fontFamily: "Inter-Medium",
                          color: "#2f2d51",
                        }
                  }
                >
                  {commentsArray.length}
                </Text>

                <FontAwesome
                  name="comment-o"
                  size={28}
                  color={theme === "dark" ? "#d6d6d6" : "#2f2d51"}
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
    backgroundColor: "#b7d3ff",

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
    borderColor: "#A5C9FF",
    borderWidth: 0.2,
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
