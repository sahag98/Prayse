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
import { PRAYER_GROUP_SCREEN } from "@routes";
import { getSecondaryTextColorStyle } from "@lib/customStyles";

const GroupPrayerItem = ({
  prayerToReact,
  setPrayerToReact,
  handleOpenBottomModal,
  actualTheme,
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
  // const [isPressedLong, setIsPressedLong] = useState();
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
    if (currGroup?.id && currentUser.id) {
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
  }, [currGroup?.id, currentUser.id, isFocused]);

  const notifyLike = async (expoToken, item) => {
    const message = {
      to: expoToken,
      sound: "default",
      title: `${currGroup.name} 📢`,
      body: `${currentUser.full_name} has reacted on ${item} with a prayer 🙏`,
      data: {
        screen: PRAYER_GROUP_SCREEN,
        group_id: currGroup.id,
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
      title: `${currGroup.name} 📢`,
      body: `${currentUser.full_name} has reacted on ${item} with a praise 🙌`,
      data: {
        screen: PRAYER_GROUP_SCREEN,
        group_id: currGroup.id,
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
        withSpring(1, { damping: 2, stiffness: 80 })
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
      withSpring(1, { damping: 2, stiffness: 80 })
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
        withSpring(1, { damping: 2, stiffness: 80 })
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
      withSpring(1, { damping: 2, stiffness: 80 })
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
    console.log("Item: ", item);
    setPrayerToReact(item);
    handleOpenBottomModal();
  };

  const isLikedByMe = !!likes?.find((like) => like.user_id == currentUser.id);
  const isPraisedByMe = !!praises?.find(
    (praise) => praise.user_id == currentUser.id
  );
  const isPrayerLiked = !!likes?.find((like) => like.prayer_id == item.id);
  const isPrayerPraised = !!praises?.find(
    (praise) => praise.prayer_id == item.id
  );
  return (
    <TouchableOpacity onLongPress={() => openReactionModal(item)}>
      {/* <ReactionModal
        currentUser={currentUser}
        likes={likes}
        praises={praises}
        toggleLike={toggleLike}
        togglePraise={togglePraise}
        reactionModalVisibile={reactionModalVisibile}
        setReactionModalVisibile={setReactionModalVisibile}
        isPressedLong={isPressedLong}
        theme={theme}
        actualTheme={actualTheme}
      /> */}
      <ChatBubble
        isOwnMessage={item.user_id === currentUser.id}
        bubbleColor={
          item.user_id === currentUser.id
            ? actualTheme && actualTheme.Secondary
              ? actualTheme.Secondary
              : theme === "dark"
                ? "#353535"
                : "#b7d3ff"
            : actualTheme && actualTheme.Secondary
              ? "grey"
              : theme === "light"
                ? "#d9e7ff"
                : "#212121"
        }
      >
        {item.user_id !== currentUser.id && (
          <View className="flex-row py-2 items-center gap-3">
            <Image
              style={
                actualTheme &&
                actualTheme.Secondary && { borderColor: actualTheme.Secondary }
              }
              className="size-10 rounded-full border border-light-primary dark:border-dark-accent"
              source={{
                uri: item.profiles?.avatar_url
                  ? item.profiles?.avatar_url
                  : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
              }}
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter font-medium text-lg text-light-primary dark:text-dark-primary"
            >
              {item.profiles.full_name}
            </Text>
          </View>
        )}
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter text-light-primary dark:text-dark-primary py-2 leading-6 mb-3"
        >
          {item.message}
        </Text>
        <View className="flex-row justify-between p-1 gap-3">
          <View className="flex-row items-center gap-2">
            {likes.length > 0 && (
              <TouchableOpacity className="bg-white px-2 py-1 rounded-full">
                <Text className="text-sm font-inter">{likes.length} 🙏</Text>
              </TouchableOpacity>
            )}
            {praises.length > 0 && (
              <TouchableOpacity className="bg-white px-2 py-1 rounded-full">
                <Text className="text-sm font-inter">{praises.length} 🙌</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="self-end font-inter font-light text-sm text-light-primary dark:text-gray-500"
          >
            {Moment(item.created_at).fromNow()}
          </Text>
        </View>
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
