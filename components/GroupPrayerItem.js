import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Moment from "moment";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import ChatBubble from "react-native-chat-bubble";
import { useIsFocused } from "@react-navigation/native";

const GroupPrayerItem = ({
  setRefreshMsgLikes,
  allGroups,
  refreshMsgLikes,
  item,
  currentUser,
  showToast,
  currGroup,
  supabase,
  theme,
}) => {
  const [likes, setLikes] = useState([]);
  const [channel, setChannel] = useState();

  const isFocused = useIsFocused();
  useEffect(() => {
    fetchLikes(item.id);
  }, [item.id, refreshMsgLikes]);

  useEffect(() => {
    // setTimeout(() => {
    //   setIsShowingHeader(false);
    // }, 5000);
    /** only create the channel if we have a roomCode and username */
    if (currGroup.group_id && currentUser.id) {
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
        console.log("payload");
        fetchLikes(item.id);
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
  }, [currGroup.group_id, currentUser.id, isFocused]);

  const notifyLike = async (expoToken, item) => {
    const message = {
      to: expoToken,
      sound: "default",
      title: `${currGroup.groups.name} 📢`,
      body: `${currentUser.full_name} is praying for ${item}`,
      data: {
        screen: "Community",
        currGroup: currGroup,
        allGroups: allGroups,
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

  async function toggleLike(id, expoToken, message) {
    if (isLikedByMe) {
      const { data, error } = await supabase
        .from("message_likes")
        .delete()
        .eq("prayer_id", id)
        .eq("user_id", currentUser.id);
      channel.send({
        type: "broadcast",
        event: "message",
        payload: {
          prayer_id: id,
          user_id: currentUser.id,
        },
      });
      return;
    }
    //prayer_id for production
    //prayertest_id for testing
    console.log("here in toggle");
    channel.send({
      type: "broadcast",
      event: "message",
      payload: {
        prayer_id: id,
        user_id: currentUser.id,
      },
    });
    const { data, error } = await supabase.from("message_likes").insert({
      prayer_id: id,
      user_id: currentUser.id,
    });
    notifyLike(expoToken, message);
    if (error) {
      console.log(error);
    }
  }

  async function fetchLikes(prayerId) {
    //prayer_id for production
    //prayertest_id for testing
    const { data: likes, error: likesError } = await supabase
      .from("message_likes")
      .select()
      .eq("prayer_id", prayerId);
    setLikes(likes);

    if (likesError) {
      console.log(likesError);
    }
  }
  const sendUrgentAnnouncement = async (urgentMessage, user) => {
    console.log(urgentMessage);
    console.log(user);

    console.log(currentUser.expoToken);
    let { data: members, error } = await supabase
      .from("members")
      .select("*, profiles(id, expoToken)")
      .eq("group_id", currGroup.groups?.id)
      .order("id", { ascending: false });

    members.map(async (m) => {
      if (m.profiles.expoToken != currentUser.expoToken) {
        const message = {
          to: m.profiles.expoToken,
          sound: "default",
          title: `${currGroup.groups.name} 📢`,
          body: `${user}: ${urgentMessage}`,
          data: {
            screen: "Community",
            currGroup: currGroup,
            allGroups: allGroups,
          },
        };
        await axios.post("https://exp.host/--/api/v2/push/send", message, {
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        });
      }
    });
    showToast("success", "Members are notified.");
    // setHasAnnounced(true);
    // setIsAnnouncingMeeting(false);
  };
  const isLikedByMe = !!likes?.find((like) => like.user_id == currentUser.id);
  return (
    <>
      <ChatBubble
        isOwnMessage={item.user_id == currentUser.id ? true : false}
        bubbleColor={
          item.user_id == currentUser.id
            ? theme == "dark"
              ? "#353535"
              : "#abe1fa"
            : theme == "light"
            ? "#dee4e7"
            : "#212121"
        }
        style={
          theme == "dark"
            ? [
                {
                  borderRadius: 10,
                  marginBottom: 10,
                  padding: 10,
                  gap: 10,
                  minWidth: 100,
                  maxWidth: 300,
                },
              ]
            : {
                borderRadius: 10,
                marginBottom: 10,
                padding: 10,
                gap: 15,
                minWidth: 100,
                maxWidth: 300,
              }
        }
      >
        {item.user_id != currentUser.id && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
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
            theme == "dark"
              ? {
                  color: "white",
                  fontFamily: "Inter-Regular",
                  fontSize: 15,
                  lineHeight: 23,
                  marginBottom: 10,
                }
              : {
                  color: "#2f2d51",
                  fontFamily: "Inter-Regular",
                  fontSize: 15,
                  marginBottom: 10,
                }
          }
        >
          {item.message}
        </Text>
        {item.user_id == currentUser.id ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              style={{ padding: 2 }}
              onPress={() =>
                sendUrgentAnnouncement(item.message, item.profiles.full_name)
              }
            >
              <Ionicons
                name="megaphone-outline"
                size={24}
                color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
              />
            </TouchableOpacity>
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "#d6d6d6",
                      alignSelf: "flex-end",
                      fontFamily: "Inter-Light",
                      fontSize: 12,
                    }
                  : {
                      color: "#2f2d51",
                      alignSelf: "flex-end",
                      fontFamily: "Inter-Light",
                      fontSize: 12,
                    }
              }
            >
              {Moment(item.created_at).fromNow()}
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                toggleLike(item.id, item.profiles.expoToken, item.message)
              }
            >
              <Image
                style={
                  theme == "dark"
                    ? {
                        width: 27,
                        height: 27,
                        tintColor: isLikedByMe ? "#ff4e4e" : "white",
                      }
                    : {
                        width: 27,
                        height: 27,
                        tintColor: isLikedByMe ? "#ff4e4e" : "#2f2d51",
                      }
                }
                source={{
                  uri: "https://cdn.glitch.global/1948cbef-f54d-41c2-acf7-6548a208aa97/Black%20and%20White%20Rectangle%20Sports%20Logo%20(1).png?v=1698692894367",
                }}
              />
            </TouchableOpacity>
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "#d6d6d6",
                      alignSelf: "flex-end",
                      fontFamily: "Inter-Light",
                      fontSize: 12,
                    }
                  : {
                      color: "#2f2d51",
                      alignSelf: "flex-end",
                      fontFamily: "Inter-Light",
                      fontSize: 12,
                    }
              }
            >
              {Moment(item.created_at).fromNow()}
            </Text>
          </View>
        )}
        {likes?.length > 0 && (
          <View
            style={{
              backgroundColor: theme == "dark" ? "white" : "#2f2d51",
              position: "absolute",
              borderRadius: 100,
              padding: 5,
              bottom: -18,
              right: item.user_id == currentUser.id ? null : -5,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Medium",
                color: theme == "dark" ? "#121212" : "white",
              }}
            >
              🙏 {likes?.length}
            </Text>
          </View>
        )}
      </ChatBubble>
      <View style={{ marginBottom: likes?.length > 0 ? 10 : 5 }} />
    </>
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
});
