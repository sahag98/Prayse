import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import * as Clipboard from "expo-clipboard";
import { HeaderTitle, HeaderView, PrayerContainer } from "../styles/appStyles";
import { useDispatch, useSelector } from "react-redux";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Entypo,
  Octicons,
  Ionicons,
} from "@expo/vector-icons";
import { useSupabase } from "../context/useSupabase";
import Moment from "moment";
import { FlashList } from "@shopify/flash-list";
import axios from "axios";

import GroupInfoModal from "../components/GroupInfoModal";
import RemovedGroupModal from "../components/RemovedGroupModal";
import { useIsFocused } from "@react-navigation/native";
import AnnounceMeeting from "../components/AnnounceMeeting";
import Toast from "react-native-toast-message";
import GroupPrayerItem from "../components/GroupPrayerItem";
import ToolTip from "../components/ToolTip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotifyFirstMsg from "../components/NotifyFirstMsg";
import VideoCall from "../components/VideoCall";
import Chat from "../components/Chat";

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
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isNotifyVisible, setIsNotifyVisible] = useState(false);
  const [isShowingHeader, setIsShowingHeader] = useState(true);

  const dispatch = useDispatch();
  const {
    currentUser,
    isNewMessage,
    setIsNewMessage,
    setRefreshGroup,
    refreshGroup,
    setRefreshMsgLikes,
    refreshMsgLikes,
    supabase,
  } = useSupabase();

  const isFocused = useIsFocused();

  useEffect(() => {
    async function checkToolTip() {
      // await AsyncStorage.removeItem("isChecked");
      try {
        const isChecked = await AsyncStorage.getItem("isChecked");

        if (isChecked == null) {
          console.log("it is the first time");
          setTooltipVisible(true);
          await AsyncStorage.setItem("isChecked", "true");
        } else if (isChecked != null) {
          setTooltipVisible(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkToolTip();
  }, []);

  useEffect(() => {
    const headerTimeout = setTimeout(() => {
      if (groupMessages.length < 5 || groupMessages.length == 0) {
        setIsShowingHeader(true);
      } else {
        setIsShowingHeader(false);
      }
    }, 2000);

    return () => {
      clearTimeout(headerTimeout);
    };
  }, [isFocused]);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;

    // Check if the user is scrolling up
    if (offsetY > 0 && !isShowingHeader) {
      setIsShowingHeader(true);
    }

    if (offsetY < 0 && isShowingHeader) {
      setIsShowingHeader(false);
    }
  };

  async function getGroupMessagesForLikes() {
    try {
      let { data, error } = await supabase
        .from("messages")
        .select("*, profiles(full_name, avatar_url, expoToken)")
        .eq("group_id", currGroup.group_id)
        .order("id", { ascending: false });

      setGroupMessages(data);
    } catch (error) {
      console.log("fetching error: ", error);
    }
  }

  useEffect(() => {
    // setTimeout(() => {
    //   setIsShowingHeader(false);
    // }, 5000);
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
      console.log("this group has been removed");
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
        <ToolTip
          tooltipVisible={tooltipVisible}
          setTooltipVisible={setTooltipVisible}
          theme={theme}
        />

        <NotifyFirstMsg
          messagetoNotify={newMessage}
          allGroups={allGroups}
          currGroup={currGroup}
          currentUser={currentUser}
          showToast={showToast}
          supabase={supabase}
          messages={messages}
          isNotifyVisible={isNotifyVisible}
          setIsNotifyVisible={setIsNotifyVisible}
          theme={theme}
        />
        {isShowingHeader && (
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
              <TouchableOpacity
                onPress={() => navigation.navigate("Community")}
              >
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
                    fontSize: 13,
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
              disabled={hasAnnounced}
              onPress={() => setIsAnnouncingMeeting(true)}
              style={{
                borderRadius: 50,

                justifyContent: "center",
                alignItems: "center",
                padding: 8,
                backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
              }}
            >
              {hasAnnounced ? (
                <Text
                  style={{
                    color: theme == "dark" ? "white" : "#2f2d51",
                    fontFamily: "Inter-Regular",
                  }}
                >
                  {formatTime(countdown)}
                </Text>
              ) : (
                <Ionicons
                  name="megaphone-outline"
                  size={26}
                  color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
                />
              )}
            </TouchableOpacity>

            {isAnnouncingMeeting && (
              <AnnounceMeeting
                hasAnnounced={hasAnnounced}
                setHasAnnounced={setHasAnnounced}
                allGroups={allGroups}
                currGroup={currGroup}
                currentUser={currentUser}
                theme={theme}
                supabase={supabase}
                isAnnouncingMeeting={isAnnouncingMeeting}
                messages={messages}
                setIsAnnouncingMeeting={setIsAnnouncingMeeting}
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
        )}

        {/* <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Text
            onPress={() => setToggle("chat")}
            style={{
              textDecorationLine: "underline",
              fontFamily: toggle == "chat" ? "Inter-Bold" : "Inter-Medium",
            }}
          >
            Chat
          </Text>
          <Text
            onPress={() => setToggle("video")}
            style={{
              textDecorationLine: "underline",
              fontFamily: toggle == "video" ? "Inter-Bold" : "Inter-Medium",
            }}
          >
            Video
          </Text>
        </View> */}

        {/* {toggle == "chat" ? ( */}
        <Chat
          theme={theme}
          currentUser={currentUser}
          onlineUsers={onlineUsers}
          areMessagesLoading={areMessagesLoading}
          groupMessages={groupMessages}
          setGroupMessages={setGroupMessages}
          flatListRef={flatListRef}
          handleScroll={handleScroll}
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
        {/* ) : (
          <VideoCall />
        )} */}

        {/* <View
          style={{
            flexDirection: "row",
            backgroundColor: theme == "dark" ? "#121212" : "#f2f7ff",
            alignItems: "center",
            alignSelf: "center",
            paddingHorizontal: 2,
            paddingVertical: 4,
            justifyContent: "center",
            borderRadius: 50,
            marginBottom: 10,
            shadowColor: "#2bc035",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.17,
            shadowRadius: 3.05,
            elevation: 4,
            width: "35%",
            gap: 5,
          }}
        >
          <Octicons name="dot-fill" size={24} color="green" />
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Regular",
              fontSize: 13,
            }}
          >
            {onlineUsers.length} User{onlineUsers.length > 1 ? "'s " : " "}
            Online
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
            width: "100%",
            position: "relative",
          }}
        >
          {areMessagesLoading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
            </View>
          ) : (
            <>
              {groupMessages.length == 0 ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={
                      theme == "dark"
                        ? { fontFamily: "Inter-Regular", color: "#bebebe" }
                        : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                    }
                  >
                    No messages yet.
                  </Text>
                </View>
              ) : (
                <FlashList
                  showsVerticalScrollIndicator={false}
                  estimatedItemSize={120}
                  ref={flatListRef}
                  inverted
                  estimatedListSize={{ height: 800, width: 450 }}
                  data={groupMessages}
                  ListHeaderComponent={() => (
                    <View
                      style={
                        theme == "dark"
                          ? {
                              height: 30,
                            }
                          : {
                              height: 30,
                            }
                      }
                    />
                  )}
                  onScroll={handleScroll}
                  keyExtractor={(e, i) => i.toString()}
                  initialNumToRender={30}
                  renderItem={({ item, index }) => {
                    return (
                      <GroupPrayerItem
                        theme={theme}
                        currentUser={currentUser}
                        groupMessages={groupMessages}
                        setGroupMessages={setGroupMessages}
                        supabase={supabase}
                        currGroup={currGroup}
                        item={item}
                        setRefreshMsgLikes={setRefreshMsgLikes}
                        refreshMsgLikes={refreshMsgLikes}
                        allGroups={allGroups}
                        showToast={showToast}
                      />
                    );
                  }}
                />
              )}
            </>
          )}
        </View>
        <View
          style={[
            styles.inputField,
            {
              borderTopWidth: 1,
              borderTopColor: currGroup.groups.color.toLowerCase(),
            },
          ]}
        >
          <View
            style={{
              flex: 1,
              minHeight: 35,
              maxHeight: 200,
              width: "85%",
              backgroundColor: theme == "dark" ? "#212121" : "white",
              borderWidth: theme == "dark" ? 0 : 1,
              borderColor: "#2f2d51",
              borderRadius: 10,
              padding: 10,
              justifyContent: "center",
            }}
          >
            <TextInput
              style={
                theme == "dark"
                  ? [
                      styles.inputDark,
                      { paddingBottom: Platform.OS == "android" ? 0 : 5 },
                    ]
                  : [
                      styles.input,
                      { paddingBottom: Platform.OS == "android" ? 0 : 5 },
                    ]
              }
              placeholder="Write a prayer..."
              placeholderTextColor={theme == "dark" ? "#b8b8b8" : "#2f2d51"}
              selectionColor={theme == "dark" ? "white" : "#2f2d51"}
              value={newMessage}
              textAlignVertical="center"
              onChangeText={(text) => setNewMessage(text)}
              onContentSizeChange={handleContentSizeChange}
              onSubmitEditing={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              multiline={true}
            />
          </View>
          <TouchableOpacity
            disabled={newMessage.length == 0 ? true : false}
            style={{
              width: "15%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={sendMessage}
          >
            <FontAwesome
              name="send"
              size={28}
              color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
            />
          </TouchableOpacity>
        </View> */}
      </PrayerContainer>
    </KeyboardAvoidingView>
  );
};

export default PrayerGroup;
