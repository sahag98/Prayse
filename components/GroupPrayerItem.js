import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import Moment from "moment";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

const GroupPrayerItem = ({
  item,
  currentUser,
  showToast,
  currGroup,
  supabase,
  theme,
}) => {
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    fetchLikes(item.id);
  }, [item.id]);

  async function toggleLike(id) {
    if (isLikedByMe) {
      const { data, error } = await supabase
        .from("message_likes")
        .delete()
        .eq("prayer_id", id)
        .eq("user_id", currentUser.id);
      fetchLikes(id);
      return;
    }
    //prayer_id for production
    //prayertest_id for testing
    const { data, error } = await supabase.from("message_likes").insert({
      prayer_id: id,
      user_id: currentUser.id,
    });
    fetchLikes(id);
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
    showToast();
    // setHasAnnounced(true);
    // setIsAnnouncingMeeting(false);
  };
  const isLikedByMe = !!likes?.find((like) => like.user_id == currentUser.id);

  console.log(isLikedByMe);
  return (
    <>
      <View
        style={
          theme == "dark"
            ? [
                {
                  alignSelf:
                    item.user_id == currentUser.id ? "flex-end" : "flex-start",
                  backgroundColor:
                    item.user_id == currentUser.id ? "#353535" : "#212121",
                  borderRadius: 10,
                  marginBottom: 10,
                  padding: 10,
                  gap: 10,
                  minWidth: 100,
                  maxWidth: 300,
                },
              ]
            : {
                alignSelf:
                  item.user_id == currentUser.id ? "flex-end" : "flex-start",
                backgroundColor:
                  item.user_id == currentUser.id ? "#abe1fa" : "#93d8f8",
                borderRadius: 10,
                marginBottom: 10,
                padding: 10,
                gap: 15,
                maxWidth: 200,
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
            <TouchableOpacity onPress={() => toggleLike(item.id)}>
              <Image
                style={{
                  width: 27,
                  height: 27,
                  tintColor: isLikedByMe ? "#ff4e4e" : "white",
                }}
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
        {likes.length > 0 && (
          <View
            style={{
              backgroundColor: "white",
              position: "absolute",
              borderRadius: 100,
              padding: 5,
              bottom: -15,
              right: -5,
            }}
          >
            <Text style={{ fontFamily: "Inter-Medium", color: "#121212" }}>
              🙏 {likes?.length}
            </Text>
          </View>
        )}
      </View>
      <View style={{ marginBottom: likes.length > 0 ? 15 : 5 }} />
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
