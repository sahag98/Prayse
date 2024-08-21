import React, { useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import { Image, Text, TouchableOpacity, View } from "react-native";
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
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { fetchLikes, fetchPraises } from "@functions/reactions/FetchReactions";
import { cn } from "@lib/utils";

const GroupPrayerItem = ({
  prayerToReact,
  setPrayerToReact,
  setReactionChannel,
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
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function Load() {
      if (item) {
        const likesArray = await fetchLikes(item.id, supabase);
        const praisesArray = await fetchPraises(item.id, supabase);

        setLikes(likesArray);
        setPraises(praisesArray);
      }
    }

    Load();
  }, [item.id]);

  useEffect(() => {
    if (currGroup?.id && currentUser.id) {
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

      channel.on("broadcast", { event: "message" }, async ({ payload }) => {
        if (payload.type === "like") {
          console.log("in like payload:", payload);
          const likesArray = await fetchLikes(item.id, supabase);
          setLikes(likesArray);
        } else if (payload.type === "praise") {
          const praisesArray = await fetchPraises(item.id, supabase);
          setPraises(praisesArray);
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
      setReactionChannel(channel);

      /**
       * * Step 5:
       *
       * Return a clean-up function that unsubscribes from the channel
       * and clears the channel state
       */
      return () => {
        channel.unsubscribe();
        setReactionChannel(undefined);
      };
    }
  }, [currGroup?.id, currentUser.id, isFocused]);

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

  // async function fetchLikes(prayerId) {
  //   //prayer_id for production
  //   //prayertest_id for testing
  //   try {
  //     setLoadingLikes(true);
  //     const { data: likes, error: likesError } = await supabase
  //       .from("message_likes")
  //       .select()
  //       .eq("prayer_id", prayerId);
  //     setLikes(likes);

  //     if (likesError) {
  //       console.log("likesError: ", likesError);
  //     }
  //   } catch (error) {
  //     console.log("fetchLikes" + error);
  //   }
  //   setLoadingLikes(false);
  // }

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

  const openReactionModal = (item) => {
    console.log("Item: ", item);
    setPrayerToReact(item);
    handleOpenBottomModal();
  };

  const isPrayerLiked = !!likes?.find((like) => like.prayer_id == item.id);

  return (
    <TouchableOpacity
      style={getSecondaryBackgroundColorStyle(actualTheme)}
      className="bg-light-secondary mb-4 px-3 py-2 rounded-lg dark:bg-dark-secondary"
      onLongPress={() => openReactionModal(item)}
    >
      <View className="flex-row py-2 items-center gap-3">
        <Image
          style={
            actualTheme &&
            actualTheme.Secondary && { borderColor: actualTheme.Secondary }
          }
          className="size-12 rounded-full border border-light-primary dark:border-dark-accent"
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
          {item.profiles.full_name}
        </Text>
      </View>

      <Text
        style={getSecondaryTextColorStyle(actualTheme)}
        className="font-inter text-light-primary text-lg dark:text-dark-primary py-2 leading-6 mb-3"
      >
        {item.message}
      </Text>
      <View className="flex-row justify-between p-1 gap-5">
        <View className="flex-row items-center gap-2">
          {likes?.length > 0 && (
            <TouchableOpacity
              className={cn(
                "bg-white px-2 py-1 rounded-full",
                isPrayerLiked ? "flex" : "hidden"
              )}
            >
              <Text className="text-sm font-inter">{likes.length} 🙏</Text>
            </TouchableOpacity>
          )}
          {/* {praises && praises.length > 0 && (
              <TouchableOpacity className="bg-white px-2 py-1 rounded-full">
                <Text className="text-sm font-inter">{praises.length} 🙌</Text>
              </TouchableOpacity>
            )} */}
        </View>
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="self-end font-inter text-sm text-light-primary dark:text-gray-500"
        >
          {Moment(item.created_at).fromNow()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GroupPrayerItem;
