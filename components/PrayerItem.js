import React, { useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import { Image, Text, TouchableOpacity, View } from "react-native";
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
import CommentModal from "../modals/CommentModal";
import {
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const PrayerItem = ({ prayers, actualTheme, colorScheme, session, item }) => {
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
        withSpring(1, { damping: 2, stiffness: 80 })
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
      withSpring(1, { damping: 2, stiffness: 80 })
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
    <View className="gap-3 mb-4">
      <View
        style={getSecondaryBackgroundColorStyle(actualTheme)}
        className="bg-light-secondary px-2 py-3 dark:bg-dark-secondary justify-between rounded-lg"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-3">
            <Image
              className=" w-14 h-14 rounded-full"
              source={{
                uri: item.profiles?.avatar_url
                  ? item.profiles?.avatar_url
                  : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
              }}
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter font-semibold text-lg text-light-primary dark:text-dark-primary"
            >
              {item.profiles?.full_name}
            </Text>
            {item.profiles?.admin == true && (
              <View className="rounded-xl bg-red-500 px-2 py-1">
                <Text className="font-inter font-medium text-xs text-white">
                  admin
                </Text>
              </View>
            )}
          </View>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter text-sm text-light-primary dark:text-[#d6d6d6]"
          >
            {Moment(item.created_at).fromNow()}
          </Text>
        </View>

        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="mt-2 leading-6 w-full text-light-primary dark:text-dark-primary font-inter"
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
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={() => toggleLike(item.id, item.profiles?.expoToken)}
          className="flex-row items-center gap-1"
        >
          {isNewItem && loadingLikes ? (
            <>
              <Text
                className="font-inter font-medium"
                style={
                  isLikedByMe
                    ? {
                        color: "#ff4e4e",
                      }
                    : actualTheme && actualTheme.MainTxt
                      ? {
                          color: actualTheme.MainTxt,
                        }
                      : colorScheme === "dark"
                        ? {
                            color: "white",
                          }
                        : {
                            color: "#2f2d51",
                          }
                }
              >
                {likes.length}
              </Text>
              <Image
                className="w-7 h-7"
                style={
                  isLikedByMe
                    ? { tintColor: "#ff4e4e" }
                    : actualTheme && actualTheme.MainTxt
                      ? { tintColor: actualTheme.MainTxt }
                      : colorScheme === "dark"
                        ? { tintColor: "white" }
                        : { tintColor: "#2f2d51" }
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
                      }
                    : actualTheme && actualTheme.MainTxt
                      ? {
                          color: actualTheme.MainTxt,
                        }
                      : colorScheme === "dark"
                        ? {
                            color: "white",
                          }
                        : {
                            color: "#2f2d51",
                          }
                }
              >
                {likes.length}
              </Text>
              <Animated.View style={animatedStyle}>
                <Image
                  className="w-7 h-7"
                  style={
                    isLikedByMe
                      ? { tintColor: "#ff4e4e" }
                      : actualTheme && actualTheme.MainTxt
                        ? { tintColor: actualTheme.MainTxt }
                        : colorScheme === "dark"
                          ? { tintColor: "white" }
                          : { tintColor: "#2f2d51" }
                  }
                  source={{
                    uri: "https://cdn.glitch.global/1948cbef-f54d-41c2-acf7-6548a208aa97/Black%20and%20White%20Rectangle%20Sports%20Logo%20(1).png?v=1698692894367",
                  }}
                />
              </Animated.View>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCommentVisible(true)}
          className="flex-row items-center gap-2"
        >
          {isNewItem && loadingLikes ? (
            <>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter font-medium text-light-primary dark:text-[#d6d6d6]"
              >
                {commentsArray.length}
              </Text>
              <FontAwesome
                name="comment-o"
                size={28}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#c6c6df"
                }
              />
            </>
          ) : (
            <>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter font-medium text-light-primary dark:text-dark-primary"
              >
                {commentsArray.length}
              </Text>

              <FontAwesome
                name="comment-o"
                size={28}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#2f2d51"
                }
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PrayerItem;
