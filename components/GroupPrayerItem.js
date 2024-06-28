import React, { useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ChatBubble from "react-native-chat-bubble";
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { useIsFocused } from "@react-navigation/native";

import ReactionModal from "../modals/ReactionModal";

const GroupPrayerItem = ({
  allGroups,
  item,
  currentUser,
  currGroup,
  supabase,
  theme,
}) => {
  const [likes, setLikes] = useState([]);
  const [praises, setPraises] = useState([]);
  const [channel, setChannel] = useState();
  const isFocused = useIsFocused();
  const [reactionModalVisibile, setReactionModalVisibile] = useState(false);
  const [isPressedLong, setIsPressedLong] = useState();
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingPraises, setLoadingPraises] = useState(false);
  useEffect(() => {
    fetchLikes(item.id);
    fetchPraises(item.id);
  }, [item.id]);

  useEffect(() => {
    // setTimeout(() => {
    //   setIsShowingHeader(false);
    // }, 5000);
    /** only create the channel if we have a roomCode and username */
    if (currGroup?.group_id && currentUser.id) {
      // dispatch(clearMessages());
      /**
       * Step 1:
       *
       * Create the supabase channel for the roomCode, configured
       * so the channel receives its own messages
       */
      const channel = supabase.channel(`room:${item.id}`, {
        config: {
          broadcast: {
            self: true,
          },
          presence: {
            key: currentUser.id,
          },
        },
      });

      /**
       * Step 2:
       *
       * Listen to broadcast messages with a `message` event
       */
      channel.on("broadcast", { event: "message" }, ({ payload }) => {
        if (payload.type === "like") {
          fetchLikes(payload.prayer_id);
        } else if (payload.type === "praise") {
          fetchPraises(payload.prayer_id);
        }
      });

      /**
       * Step 3:
       *
       * Subscribe to the channel
       */
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.track({ currentUser });
        }
      });

      /**
       * Step 4:
       *
       * Set the channel in the state
       */
      setChannel(channel);

      /**
       * * Step 5:
       *
       * Return a clean-up function that unsubscribes from the channel
       * and clears the channel state
       */
      return () => {
        channel.unsubscribe();
        setChannel(undefined);
      };
    }
  }, [currGroup?.group_id, currentUser.id, isFocused]);

  const notifyLike = async (expoToken, item) => {
    const message = {
      to: expoToken,
      sound: "default",
      title: `${currGroup.groups.name} 📢`,
      body: `${currentUser.full_name} has reacted on ${item} with a prayer 🙏`,
      data: {
        screen: "Community",
        currGroup,
        allGroups,
      },
    };
    await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });
  };

  const notifyPraise = async (expoToken, item) => {
    const message = {
      to: expoToken,
      sound: "default",
      title: `${currGroup.groups.name} 📢`,
      body: `${currentUser.full_name} has reacted on ${item} with a praise 🙌`,
      data: {
        screen: "Community",
        currGroup,
        allGroups,
      },
    };
    await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });
  };
  const scale = useSharedValue(1);

  async function toggleLike(id, expoToken, message) {
    if (isLikedByMe) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 2, stiffness: 80 }),
        withSpring(1, { damping: 2, stiffness: 80 }),
      );
      await supabase
        .from("message_likes")
        .delete()
        .eq("prayer_id", id)
        .eq("user_id", currentUser.id);

      channel.send({
        type: "broadcast",
        event: "message",
        payload: {
          type: "like",
          prayer_id: id,
          user_id: currentUser.id,
        },
      });
      setReactionModalVisibile(false);
      return;
    }

    channel.send({
      type: "broadcast",
      event: "message",
      payload: {
        type: "like",
        prayer_id: id,
        user_id: currentUser.id,
      },
    });

    scale.value = withSequence(
      withSpring(1.2, { damping: 2, stiffness: 80 }),
      withSpring(1, { damping: 2, stiffness: 80 }),
    );
    const { error } = await supabase.from("message_likes").insert({
      prayer_id: id,
      user_id: currentUser.id,
    });

    notifyLike(expoToken, message);
    setReactionModalVisibile(false);
    if (error) {
      console.log("insert like err: ", error);
    }
  }

  async function fetchLikes(prayerId) {
    //prayer_id for production
    //prayertest_id for testing
    try {
      setLoadingLikes(true);
      const { data: likes, error: likesError } = await supabase
        .from("message_likes")
        .select()
        .eq("prayer_id", prayerId);
      setLikes(likes);

      if (likesError) {
        console.log("likesError: ", likesError);
      }
    } catch (error) {
      console.log("fetchLikes" + error);
    }
    setLoadingLikes(false);
  }

  async function togglePraise(id, expoToken, message) {
    if (isPraisedByMe) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 2, stiffness: 80 }),
        withSpring(1, { damping: 2, stiffness: 80 }),
      );
      await supabase
        .from("message_praises")
        .delete()
        .eq("prayer_id", id)
        .eq("user_id", currentUser.id);

      channel.send({
        type: "broadcast",
        event: "message",
        payload: {
          type: "praise",
          prayer_id: id,
          user_id: currentUser.id,
        },
      });
      setReactionModalVisibile(false);
      return;
    }
    channel.send({
      type: "broadcast",
      event: "message",
      payload: {
        type: "praise",
        prayer_id: id,
        user_id: currentUser.id,
      },
    });

    scale.value = withSequence(
      withSpring(1.2, { damping: 2, stiffness: 80 }),
      withSpring(1, { damping: 2, stiffness: 80 }),
    );
    const { error } = await supabase.from("message_praises").insert({
      prayer_id: id,
      user_id: currentUser.id,
    });
    notifyPraise(expoToken, message);
    setReactionModalVisibile(false);
    if (error) {
      console.log("insert like err: ", error);
    }
  }

  async function fetchPraises(prayerId) {
    try {
      setLoadingPraises(true);
      const { data: praises, error: praisesError } = await supabase
        .from("message_praises")
        .select()
        .eq("prayer_id", prayerId);
      setPraises(praises);

      if (praisesError) {
        console.log("likesError: ", praisesError);
      }
    } catch (error) {
      console.log("fetchPraise", error);
    }
    setLoadingPraises(false);
  }

  const openReactionModal = (item) => {
    setIsPressedLong(item);
    setReactionModalVisibile(true);
  };

  const isLikedByMe = !!likes?.find((like) => like.user_id == currentUser.id);
  const isPraisedByMe = !!praises?.find(
    (praise) => praise.user_id == currentUser.id,
  );
  const isPrayerLiked = !!likes?.find((like) => like.prayer_id == item.id);
  const isPrayerPraised = !!praises?.find(
    (praise) => praise.prayer_id == item.id,
  );
  return (
    <TouchableOpacity
      style={{ marginVertical: 5 }}
      onLongPress={() => openReactionModal(item)}
    >
      <ReactionModal
        currentUser={currentUser}
        likes={likes}
        praises={praises}
        toggleLike={toggleLike}
        togglePraise={togglePraise}
        reactionModalVisibile={reactionModalVisibile}
        setReactionModalVisibile={setReactionModalVisibile}
        isPressedLong={isPressedLong}
        theme={theme}
      />
      <ChatBubble
        isOwnMessage={item.user_id === currentUser.id}
        bubbleColor={
          item.user_id === currentUser.id
            ? theme === "dark"
              ? "#353535"
              : "#b7d3ff"
            : theme === "light"
              ? "#d9e7ff"
              : "#212121"
        }
        style={
          theme === "dark"
            ? [
                {
                  borderRadius: 10,
                  marginBottom: 10,

                  gap: 10,
                  minWidth: 170,
                  maxWidth: 300,
                },
              ]
            : {
                borderRadius: 10,
                marginBottom: 10,

                gap: 10,
                minWidth: 170,
                maxWidth: 300,
              }
        }
      >
        {item.user_id !== currentUser.id && (
          <View
            style={{
              flexDirection: "row",
              paddingVertical: 5,
              alignItems: "center",
              gap: 10,
            }}
          >
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
              {item.profiles.full_name}
            </Text>
          </View>
        )}
        <Text
          style={
            theme === "dark"
              ? {
                  color: "white",
                  fontFamily: "Inter-Regular",
                  fontSize: 15,
                  paddingVertical: 5,
                  lineHeight: 23,
                  marginBottom: 10,
                }
              : {
                  color: "#2f2d51",
                  paddingVertical: 5,
                  fontFamily: "Inter-Regular",
                  fontSize: 15,
                  marginBottom: 10,
                }
          }
        >
          {item.message}
        </Text>
        {item.user_id === currentUser.id ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",

              padding: 3,
              gap: 10,
            }}
          >
            <Text
              style={
                theme === "dark"
                  ? {
                      color: "#d6d6d6",
                      alignSelf: "flex-end",
                      fontFamily: "Inter-Light",
                      fontSize: 11,
                    }
                  : {
                      color: "#2f2d51",
                      alignSelf: "flex-end",
                      fontFamily: "Inter-Light",
                      fontSize: 11,
                    }
              }
            >
              {Moment(item.created_at).fromNow()}
            </Text>

            {!loadingLikes && likes?.length > 0 && (
              <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(500)}
                style={{
                  display: isPrayerLiked ? "flex" : "none",
                  backgroundColor: theme === "dark" ? "white" : "#2f2d51",
                  position: "absolute",
                  borderRadius: 100,
                  zIndex: 20,
                  padding: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: -25,
                  left: item.user_id === currentUser.id ? -30 : -40,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 13,
                    color: theme === "dark" ? "#121212" : "white",
                  }}
                >
                  🙏 {likes?.length}
                </Text>
              </Animated.View>
            )}
            {!loadingPraises && praises?.length > 0 && (
              <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(500)}
                style={{
                  display: isPrayerPraised ? "flex" : "none",
                  backgroundColor: theme === "dark" ? "white" : "#2f2d51",
                  position: "absolute",
                  borderRadius: 100,
                  zIndex: 20,
                  padding: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: -25,
                  left: item.user_id === currentUser.id ? 8 : -10,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 13,
                    color: theme === "dark" ? "#121212" : "white",
                  }}
                >
                  🙌 {praises?.length}
                </Text>
              </Animated.View>
            )}
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 3,
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={
                theme === "dark"
                  ? {
                      color: "#d6d6d6",
                      alignSelf: "flex-end",
                      fontFamily: "Inter-Light",
                      fontSize: 11,
                    }
                  : {
                      color: "#2f2d51",
                      alignSelf: "flex-end",
                      fontFamily: "Inter-Light",
                      fontSize: 11,
                    }
              }
            >
              {Moment(item.created_at).fromNow()}
            </Text>

            {!loadingLikes && likes?.length > 0 && (
              <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(500)}
                style={{
                  display: isPrayerLiked ? "flex" : "none",
                  backgroundColor: theme === "dark" ? "white" : "#2f2d51",
                  position: "absolute",
                  borderRadius: 100,
                  zIndex: 20,
                  padding: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: -25,
                  right: item.user_id === currentUser.id ? -30 : -25,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 13,
                    color: theme === "dark" ? "#121212" : "white",
                  }}
                >
                  🙏 {likes?.length}
                </Text>
              </Animated.View>
            )}
            {!loadingPraises && praises?.length > 0 && (
              <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(500)}
                style={{
                  display: isPrayerPraised ? "flex" : "none",
                  backgroundColor: theme === "dark" ? "white" : "#2f2d51",
                  position: "absolute",
                  borderRadius: 100,
                  zIndex: 20,
                  padding: 4,
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: -25,
                  right: item.user_id === currentUser.id ? -10 : 14,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Inter-Medium",
                    fontSize: 13,
                    color: theme === "dark" ? "#121212" : "white",
                  }}
                >
                  🙌 {praises?.length}
                </Text>
              </Animated.View>
            )}
          </View>
        )}
      </ChatBubble>
    </TouchableOpacity>
  );
};

export default GroupPrayerItem;

const styles = StyleSheet.create({
  profileImg: {
    borderColor: "#2F2D51",
    borderWidth: 0.2,
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  profileImgDark: {
    borderColor: "#A5C9FF",
    borderWidth: 0.2,
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  animation: {
    width: 40,
    height: 40,
    alignSelf: "center",
    textAlign: "center",
    justifyContent: "center",
  },
});
