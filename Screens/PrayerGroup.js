import {
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import * as Clipboard from "expo-clipboard";
import { HeaderTitle, HeaderView, PrayerContainer } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useSupabase } from "../context/useSupabase";
import axios from "axios";
import GroupInfoModal from "../components/GroupInfoModal";
import RemovedGroupModal from "../components/RemovedGroupModal";
import { useIsFocused } from "@react-navigation/native";

import Toast from "react-native-toast-message";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Chat from "../components/Chat";
import GroupPrayerList from "../components/GroupPrayerList";

const PrayerGroup = ({ route, navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const msgs = useSelector((state) => state.message.messages);
  const [toggle, setToggle] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(45);
  const flatListRef = useRef(null);
  const [groupInfoVisible, setGroupInfoVisible] = useState(false);
  const currGroup = route.params.group;
  const allGroups = route.params.allGroups;
  const [isGroupRemoved, setIsGroupRemoved] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [hasAnnounced, setHasAnnounced] = useState(false);
  const [isAnnouncingMeeting, setIsAnnouncingMeeting] = useState(false);
  const [areMessagesLoading, setAreMessagesLoading] = useState(false);
  const [channel, setChannel] = useState();
  const [isNotifyVisible, setIsNotifyVisible] = useState(false);

  const {
    currentUser,

    setRefreshGroup,

    setRefreshMsgLikes,
    refreshMsgLikes,
    supabase,
  } = useSupabase();

  const isFocused = useIsFocused();

  useEffect(() => {
    /** only create the channel if we have a roomCode and username */
    if (currGroup.group_id && currentUser?.id) {
      // dispatch(clearMessages());
      async function getGroupMessages() {
        try {
          setAreMessagesLoading(true);
          let { data, error } = await supabase
            .from("messages")
            .select("*, profiles(full_name, avatar_url, expoToken)")
            .eq("group_id", currGroup.group_id)
            .order("id", { ascending: false });

          setGroupMessages(data);
        } catch (error) {
          console.log("fetching error: ", error);
        }
        setAreMessagesLoading(false);
      }
      getGroupMessages();

      /**
       * Step 1:
       *
       * Create the supabase channel for the roomCode, configured
       * so the channel receives its own messages
       */
      const channel = supabase.channel(`room:${currGroup.group_id}`, {
        config: {
          broadcast: {
            self: true,
          },
          presence: {
            key: currentUser?.id,
          },
        },
      });

      /**
       * Step 2:
       *
       * Listen to broadcast messages with a `message` event
       */
      channel.on("broadcast", { event: "message" }, ({ payload }) => {
        setGroupMessages((messages) => [payload, ...messages]);
      });

      channel.on("presence", { event: "sync" }, () => {
        /** Get the presence state from the channel, keyed by realtime identifier */
        const presenceState = channel.presenceState();

        /** transform the presence */
        const users = Object.keys(presenceState)
          .map((presenceId) => {
            const presences = presenceState[presenceId];
            return presences.map((presence) => presence.currentUser);
          })
          .flat();

        setOnlineUsers(users);
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
  }, [currGroup?.group_id, currentUser?.id, isFocused]);

  const copyToClipboard = async (code) => {
    await Clipboard.setStringAsync(code);
    showToast("success", "Copied to Clipboard.");
  };

  useEffect(() => {
    let interval;

    if (hasAnnounced) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [hasAnnounced]);

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 45) {
      setInputHeight(45);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  async function getSingleGroup() {
    let { data: groups, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", currGroup?.group_id);
    return groups;
  }

  async function notifyOnFirstMsg() {
    // await AsyncStorage.removeItem("isNotify");
    try {
      const isChecked = await AsyncStorage.getItem("isNotify");
      console.log(isChecked);
      if (isChecked == null) {
        console.log("it is the first time to send noti");
        setIsNotifyVisible(true);
        await AsyncStorage.setItem("isNotify", "true");
      } else if (isChecked != null) {
        setIsNotifyVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const sendMessage = async () => {
    if (newMessage.length == 0) {
      return;
    }

    await notifyOnFirstMsg();

    const groups = await getSingleGroup();
    if (groups.length == 0) {
      setNewMessage("");
      Keyboard.dismiss();
      setIsGroupRemoved(true);
      return;
    }

    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();
    const isoStringWithOffset = isoDateString.replace("Z", "+00:00");

    const { data, error } = await supabase
      .from("messages")
      .insert({
        group_id: currGroup.group_id,
        user_id: currentUser.id,
        message: newMessage,
      })
      .select();

    channel.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: data[0].id,
        message: newMessage,
        created_at: isoStringWithOffset,
        user_id: currentUser.id,
        profiles: currentUser,
      },
    });

    let { data: members, error: membersError } = await supabase
      .from("members")
      .select("*, profiles(id, expoToken)")
      .eq("group_id", currGroup.groups?.id)
      .order("id", { ascending: false });

    members.map(async (m) => {
      if (m.profiles.expoToken != currentUser.expoToken) {
        const message = {
          to: m.profiles.expoToken,
          sound: "default",
          title: `${currGroup?.groups.name} 📢`,
          body: `${currentUser?.full_name}: ${newMessage}`,
          data: {
            screen: "PrayerGroup",
            group: currGroup,
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

    if (error) {
      throw new Error(error);
    } else {
      setNewMessage("");
    }
  };

  const openGroupInfo = async () => {
    const groups = await getSingleGroup();
    if (groups.length == 0) {
      console.log("this group has been removed");
      setIsGroupRemoved(true);
      return;
    }
    setGroupInfoVisible(true);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const copyCode = async () => {
    const groups = await getSingleGroup();
    if (groups.length == 0) {
      console.log("this group has been removed");
      setIsGroupRemoved(true);
      return;
    }
    copyToClipboard(currGroup.groups.code.toString());
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
    >
      <PrayerContainer
        style={
          theme == "dark"
            ? {
                backgroundColor: "#121212",

                position: "relative",
              }
            : {
                backgroundColor: "#F2F7FF",

                position: "relative",
              }
        }
      >
        <HeaderView
          style={{
            justifyContent: "space-between",
            borderBottomWidth: 1,

            borderBottomColor: currGroup.groups.color.toLowerCase(),
            padding: 5,
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 0 }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Community")}>
              <AntDesign
                name="left"
                size={24}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openGroupInfo}
              style={{ paddingBottom: 2, marginLeft: 10, gap: 5 }}
            >
              <HeaderTitle
                style={
                  theme == "dark"
                    ? { color: "white", fontFamily: "Inter-Bold" }
                    : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                }
              >
                {currGroup.groups.name}
              </HeaderTitle>
              <Text
                style={{
                  color: theme == "dark" ? "#bebebe" : "#9a9a9a",
                  fontSize: 12,
                  textDecorationLine: "underline",
                  fontFamily: "Inter-Medium",
                }}
              >
                Click here for group info
              </Text>
            </TouchableOpacity>
          </View>
          {groupInfoVisible && (
            <GroupInfoModal
              group={currGroup}
              theme={theme}
              supabase={supabase}
              allUsers={allGroups}
              currentUser={currentUser}
              groupInfoVisible={groupInfoVisible}
              setGroupInfoVisible={setGroupInfoVisible}
            />
          )}
          {isGroupRemoved && (
            <RemovedGroupModal
              isGroupRemoved={isGroupRemoved}
              setRefreshGroup={setRefreshGroup}
              setIsGroupRemoved={setIsGroupRemoved}
              theme={theme}
            />
          )}

          <TouchableOpacity
            onPress={copyCode}
            style={
              theme == "dark"
                ? {
                    padding: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "center",
                    backgroundColor: "#212121",
                    borderRadius: 10,
                    gap: 8,
                  }
                : {
                    padding: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "center",
                    backgroundColor: "#b7d3ff",
                    borderRadius: 10,
                    gap: 8,
                  }
            }
          >
            <Feather
              name="copy"
              size={15}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
            <Text
              style={{
                color: theme == "dark" ? "white" : "#2f2d51",
                fontSize: 13,
                fontFamily: "Inter-Medium",
              }}
            >
              {currGroup.groups.code}
            </Text>
          </TouchableOpacity>
        </HeaderView>

        {/* <View
          style={{
            flexDirection: "row",
            paddingBottom: 10,
            justifyContent: "space-evenly",
          }}
        >
          <Text
            onPress={() => setToggle("chat")}
            style={{
              color:
                theme == "dark"
                  ? toggle == "chat"
                    ? "white"
                    : "#d2d2d2"
                  : toggle == "chat"
                  ? "#2f2d51"
                  : "#d2d2d2",
              textDecorationLine: "underline",
              fontFamily: toggle == "chat" ? "Inter-Bold" : "Inter-Medium",
            }}
          >
            Chat
          </Text>
          <Text
            onPress={() => setToggle("prayerlist")}
            style={{
              color:
                theme == "dark"
                  ? toggle == "prayerlist"
                    ? "white"
                    : "#9a9a9a"
                  : toggle == "prayerlist"
                  ? "#2f2d51"
                  : "#9a9a9a",
              textDecorationLine: "underline",
              fontFamily:
                toggle == "prayerlist" ? "Inter-Bold" : "Inter-Medium",
            }}
          >
            Prayer List
          </Text>
        </View> */}

        {toggle == "chat" ? (
          <Chat
            theme={theme}
            currentUser={currentUser}
            onlineUsers={onlineUsers}
            areMessagesLoading={areMessagesLoading}
            groupMessages={groupMessages}
            setGroupMessages={setGroupMessages}
            flatListRef={flatListRef}
            supabase={supabase}
            currGroup={currGroup}
            setRefreshMsgLikes={setRefreshMsgLikes}
            refreshMsgLikes={refreshMsgLikes}
            allGroups={allGroups}
            showToast={showToast}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleContentSizeChange={handleContentSizeChange}
            sendMessage={sendMessage}
          />
        ) : (
          <GroupPrayerList
            theme={theme}
            currentUser={currentUser}
            onlineUsers={onlineUsers}
            supabase={supabase}
            currGroup={currGroup}
            allGroups={allGroups}
          />
        )}
      </PrayerContainer>
    </KeyboardAvoidingView>
  );
};

export default PrayerGroup;
