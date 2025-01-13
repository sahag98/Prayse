import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Moment from "moment";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { PRAYER_GROUP_SCREEN } from "@routes";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { fetchLikes, fetchPraises } from "@functions/reactions/FetchReactions";
import { cn } from "@lib/utils";
import { useFocusEffect } from "expo-router";

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

  useEffect(() => {
    async function Load() {
      if (item) {
        try {
          setIsLoadingLikes(true);
          const likesArray = await fetchLikes(item.id, supabase);
          const praisesArray = await fetchPraises(item.id, supabase);

          setLikes(likesArray);
          setPraises(praisesArray);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingLikes(false);
        }
      }
    }

    Load();
  }, [item.id]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.

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
            console.log("in like payload");

            setLikes((likes) => [payload, ...likes]);
          } else if (payload.type === "praise") {
            console.log("in praise prayload");
            setPraises((praises) => [payload, ...praises]);
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
      // Return function is invoked whenever the route gets out of focus.
    }, [item.id, currentUser.id])
  );

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

  const openReactionModal = (item) => {
    console.log("Item: ", item);
    setPrayerToReact(item);
    handleOpenBottomModal();
  };

  const isPrayerLiked = !!likes?.find((like) => like.prayer_id == item.id);
  const isPrayerPraised = !!praises?.find(
    (praise) => praise.prayer_id == item.id
  );

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
          className="size-14 rounded-full border border-light-primary dark:border-dark-accent"
          source={{
            uri: item.profiles?.avatar_url
              ? item.profiles?.avatar_url
              : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
          }}
        />
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
        >
          {item.profiles.full_name}
        </Text>
      </View>

      <Text
        style={getSecondaryTextColorStyle(actualTheme)}
        className="font-inter-regular text-light-primary text-lg dark:text-dark-primary py-2 leading-6 mb-3"
      >
        {item.message}
      </Text>
      <View className={cn("flex-row p-1 items-center gap-2")}>
        {isLoadingLikes && likes?.length === 0 && praises?.length === 0 && (
          <ActivityIndicator />
        )}
        {likes?.length === 0 && praises?.length === 0 && !isLoadingLikes ? (
          <View
            className={cn(
              "flex-row items-center gap-1",
              isPrayerLiked ? "hidden" : "flex"
            )}
          >
            <MaterialIcons
              name="touch-app"
              size={20}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : theme === "dark"
                    ? "#d2d2d2"
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="text-sm text-light-primary dark:text-[#d2d2d2] font-inter-medium"
            >
              Tap and hold to react
            </Text>
          </View>
        ) : null}

        {likes && likes?.length > 0 && (
          <TouchableOpacity
            className={cn(
              "bg-white px-2 py-1 flex-row items-center gap-1 rounded-full",
              isPrayerLiked ? "flex" : "hidden"
            )}
          >
            <Text className="text-sm font-inter-medium">{likes.length}</Text>
            <Text className="text-sm font-inter-medium">🙏</Text>
          </TouchableOpacity>
        )}
        {praises && praises.length > 0 && (
          <TouchableOpacity
            className={cn(
              "bg-white px-2 py-1 flex-row items-center gap-1 rounded-full",
              isPrayerPraised ? "flex" : "hidden"
            )}
          >
            <Text className="text-sm font-inter-medium">{praises.length}</Text>
            <Text className="text-sm font-inter-medium">🙌</Text>
          </TouchableOpacity>
        )}
        <Text
          style={getSecondaryTextColorStyle(actualTheme)}
          className="ml-auto font-inter-regular text-xs text-light-primary/60 dark:text-[#d2d2d2]"
        >
          {Moment(item.created_at).fromNow()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GroupPrayerItem;
