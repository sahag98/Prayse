// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import { Link, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import BottomModal from "@modals/BottomSheetModal";

import { AntDesign, Feather } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";

import Chat from "../components/Chat";
import GroupPrayerList from "../components/GroupPrayerList";
import { useSupabase } from "../context/useSupabase";
import { COMMUNITY_SCREEN } from "../routes";
import { HeaderTitle, HeaderView, PrayerContainer } from "../styles/appStyles";

const PrayerGroupScreen = () => {
  const params = useLocalSearchParams();

  const theme = useSelector((state) => state.user.theme);
  const msgs = useSelector((state) => state.message.messages);
  const [toggle, setToggle] = useState("chat");
  const [messages, setMessages] = useState([]);
  const [groupMessages, setGroupMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(45);
  const flatListRef = useRef(null);
  const [groupInfoVisible, setGroupInfoVisible] = useState(false);
  const currGroup = params?.group;
  const allGroups = params?.allGroups;
  const [isGroupRemoved, setIsGroupRemoved] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [hasAnnounced, setHasAnnounced] = useState(false);
  const [isAnnouncingMeeting, setIsAnnouncingMeeting] = useState(false);
  const [areMessagesLoading, setAreMessagesLoading] = useState(false);
  const [channel, setChannel] = useState();
  const [isNotifyVisible, setIsNotifyVisible] = useState(false);
  const groupId = params?.group_id;
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const [currentGroup, setCurrentGroup] = useState();

  const {
    currentUser,

    setRefreshGroup,

    setRefreshMsgLikes,
    refreshMsgLikes,
    supabase,
  } = useSupabase();

  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchCurrGroup() {
      const { data, error } = await supabase
        .from("groups")
        .select("admin_id,code,description,id,name")
        .eq("id", groupId)
        .single();
      setCurrentGroup(data);
    }
    fetchCurrGroup();
  }, [groupId]);

  useEffect(() => {
    /** only create the channel if we have a roomCode and username */
    if (groupId && currentUser?.id) {
      // dispatch(clearMessages());
      async function getGroupMessages() {
        try {
          setAreMessagesLoading(true);
          const { data, error } = await supabase
            .from("messages")
            .select("*, profiles(full_name, avatar_url, expoToken)")
            .eq("group_id", groupId)
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
      const channel = supabase.channel(`room:${groupId}`, {
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
  }, [groupId, currentUser?.id, isFocused]);

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
    const { data: groups, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId);
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
        group_id: groupId,
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

    const { data: members, error: membersError } = await supabase
      .from("members")
      .select("*, profiles(id, expoToken)")
      .eq("group_id", groupId)
      .order("id", { ascending: false });

    members.map(async (m) => {
      if (m.profiles.expoToken != currentUser.expoToken) {
        const message = {
          to: m.profiles.expoToken,
          sound: "default",
          title: `${currentGroup.name} 📢`,
          body: `${currentUser?.full_name}: ${newMessage}`,
          data: {
            group_id: groupId,
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

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

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
    copyToClipboard(currentUser.code.toString());
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
    >
      <PrayerContainer
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background dark:bg-dark-background relative"
      >
        <HeaderView
          style={
            actualTheme &&
            actualTheme.Secondary && {
              borderBottomColor: actualTheme.Secondary,
            }
          }
          className="justify-between border-b border-b-light-primary dark:border-b-dark-secondary p-2 w-full"
        >
          <View className="flex-row">
            <Link href={`/${COMMUNITY_SCREEN}`}>
              <AntDesign
                name="left"
                size={24}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </Link>

            <TouchableOpacity
              onPress={openGroupInfo}
              className="pb-1 ml-3 gap-2"
            >
              <HeaderTitle
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter font-bold text-lg text-light-primary dark:text-dark-primary"
              >
                {currentGroup?.name}
              </HeaderTitle>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="text-sm underline font-inter font-medium text-light-primary dark:text-dark-primary/50"
              >
                Tap for group info
              </Text>
            </TouchableOpacity>
          </View>
          {/* {groupInfoVisible && (
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
          )} */}

          <TouchableOpacity
            onPress={copyCode}
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="p-2 flex-row items-center bg-light-secondary dark:bg-dark-secondary rounded-lg gap-2"
          >
            <Feather
              name="copy"
              size={15}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter font-medium text-sm text-light-primary dark:text-dark-primary"
            >
              {currentGroup?.code}
            </Text>
          </TouchableOpacity>
        </HeaderView>

        {toggle == "chat" ? (
          <Chat
            theme={colorScheme}
            actualTheme={actualTheme}
            currentUser={currentUser}
            onlineUsers={onlineUsers}
            areMessagesLoading={areMessagesLoading}
            groupMessages={groupMessages}
            setGroupMessages={setGroupMessages}
            flatListRef={flatListRef}
            supabase={supabase}
            currGroup={currentGroup}
            setRefreshMsgLikes={setRefreshMsgLikes}
            refreshMsgLikes={refreshMsgLikes}
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
        <BottomModal
          handlePresentModalPress={handleOpenBottomModal}
          bottomSheetModalRef={bottomSheetModalRef}
        />
      </PrayerContainer>
    </KeyboardAvoidingView>
  );
};

export default PrayerGroupScreen;
