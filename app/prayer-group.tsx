// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import * as Clipboard from "expo-clipboard";
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import * as Crypto from "expo-crypto";

import BottomModal from "@modals/BottomSheetModal";
import GroupInfoModal from "@modals/GroupInfoModal";

import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { cn } from "@lib/utils";

import Chat from "../components/Chat";
import { useSupabase } from "../context/useSupabase";
import { COMMUNITY_SCREEN, HOME_SCREEN, PRAYER_GROUP_SCREEN } from "../routes";
import { HeaderTitle, HeaderView, PrayerContainer } from "../styles/appStyles";
import VideoProvider from "@context/VideoProvider";

const PrayerGroupScreen = () => {
  const params = useLocalSearchParams();

  const [groupMessages, setGroupMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef(null);
  const [groupInfoVisible, setGroupInfoVisible] = useState(false);

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [areMessagesLoading, setAreMessagesLoading] = useState(false);

  const [channel, setChannel] = useState();
  const [reactionChannel, setReactionChannel] = useState();

  const [selectPrayerMethod, setselectPrayerMethod] = useState("");

  const groupId = params?.group_id;
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const [currentGroup, setCurrentGroup] = useState();
  const [groupUsers, setGroupUsers] = useState();

  const [prayerToReact, setPrayerToReact] = useState();

  const {
    currentUser,
    setRefreshMsgLikes,
    callGroup,
    refreshMsgLikes,
    supabase,
  } = useSupabase();

  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    async function fetchCurrGroup() {
      const { data } = await supabase
        .from("groups")
        .select("admin_id,code,description,id,name")
        .eq("id", groupId)
        .single();

      setCurrentGroup(data);
    }
    fetchCurrGroup();

    async function fetchCurrGroupUsers() {
      const { data } = await supabase
        .from("members")
        .select("*,profiles(id,full_name, avatar_url, expoToken)")
        .eq("group_id", groupId);

      setGroupUsers(data);
    }
    fetchCurrGroupUsers();
  }, [groupId]);

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.

      if (groupId && currentUser?.id) {
        // dispatch(clearMessages());

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
      // Return function is invoked whenever the route gets out of focus.
    }, [groupId, currentUser.id]),
  );

  async function getGroupMessages() {
    try {
      setAreMessagesLoading(true);
      const { data } = await supabase
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

  const copyToClipboard = async (code) => {
    await Clipboard.setStringAsync(code);
    showToast("success", "Copied to Clipboard.");
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  async function getSingleGroup() {
    const { data: groups } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId);
    return groups;
  }

  async function startPrayerVideoCall() {
    try {
      const { data, error } = await supabase
        .from("groups")
        .update({
          start_video_call: true,
          active_call_id: Crypto.randomUUID(),
        })
        .eq("id", groupId)
        .select();

      if (error) throw error;

      router.push(`prayer-video-call/${groupId}`);
    } catch (error) {
      console.log(error);
    }
  }

  const sendMessage = async () => {
    if (newMessage.length === 0) {
      return;
    }

    const groups = await getSingleGroup();
    if (groups.length === 0) {
      setNewMessage("");
      Keyboard.dismiss();
      return;
    }

    const currentDate = new Date();
    const isoDateString = currentDate.toISOString();
    const isoStringWithOffset = isoDateString.replace("Z", "+00:00");

    const { data } = await supabase
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

    const { data: members } = await supabase
      .from("members")
      .select("*, profiles(id, expoToken)")
      .eq("group_id", groupId)
      .order("id", { ascending: false });

    members.map(async (m) => {
      if (m.profiles.expoToken !== currentUser.expoToken) {
        const message = {
          to: m.profiles.expoToken,
          sound: "default",
          title: `${currentGroup.name} 📢`,
          body: `${currentUser?.full_name}: ${newMessage}`,
          data: {
            screen: PRAYER_GROUP_SCREEN,
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

    setNewMessage("");
  };

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleOpenBottomModal = () => {
    bottomSheetModalRef.current?.present();
  };

  const copyCode = async () => {
    const groups = await getSingleGroup();
    if (groups.length === 0) {
      console.log("this group has been removed");
      return;
    }
    copyToClipboard(currentUser.code.toString());
  };

  return (
    <VideoProvider>
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
            className={cn(
              "justify-between border-b border-b-light-primary dark:border-b-dark-secondary p-2 w-full transition-all",
              prayerToReact && "opacity-50",
            )}
          >
            <View className="flex-row flex-1">
              <Link href={`/${HOME_SCREEN}?active=community`}>
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
                onPress={() => setGroupInfoVisible(true)}
                className="pb-1 ml-3 gap-2"
              >
                <HeaderTitle
                  numberOfLines={1}
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-bold text-lg text-light-primary dark:text-dark-primary"
                >
                  {currentGroup?.name}
                </HeaderTitle>
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="text-sm underline font-inter-medium text-light-primary dark:text-dark-primary/50"
                >
                  Tap for more info
                </Text>
              </TouchableOpacity>
            </View>

            {groupInfoVisible && (
              <GroupInfoModal
                group={currentGroup}
                theme={colorScheme}
                actualTheme={actualTheme}
                supabase={supabase}
                groupUsers={groupUsers}
                currentUser={currentUser}
                groupInfoVisible={groupInfoVisible}
                setGroupInfoVisible={setGroupInfoVisible}
              />
            )}

            <TouchableOpacity
              onPress={copyCode}
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="p-2 ml-5 flex-row items-center bg-light-secondary dark:bg-dark-secondary rounded-lg gap-2"
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
                className="font-inter-bold text-sm text-light-primary dark:text-dark-primary"
              >
                {currentGroup?.code}
              </Text>
            </TouchableOpacity>
          </HeaderView>
          {callGroup && callGroup?.id === currentGroup?.id && (
            <Pressable
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              onPress={() => router.push(`prayer-video-call/${groupId}`)}
              className="dark:bg-dark-secondary relative dark:shadow-purple-400 flex-row items-center shadow-lg shadow-purple-200 justify-center gap-2 bg-white rounded-2xl self-center p-5"
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter-semibold text-light-primary dark:text-dark-primary"
              >
                Join Prayer Call
              </Text>
            </Pressable>
          )}
          {currentGroup?.start_video_call && (
            <Pressable
              onPress={() => router.push(`prayer-video-call/${groupId}`)}
              className="absolute top-20 z-10 bg-green-500 w-full p-4 flex-row justify-between items-center"
            >
              <Text className="text-white font-inter-bold">
                Prayer Call in Progress
              </Text>
              <Text className="text-white font-inter-medium">
                Tap to Join →
              </Text>
            </Pressable>
          )}

          {!selectPrayerMethod && (
            <>
              <View className="flex-1 p-4 w-full justify-center items-center">
                <View className="w-4/5 gap-3">
                  <Pressable
                    onPress={() =>
                      Alert.alert(
                        "Start Call",
                        "Make sure that everyone is on this group screen for them to receive the call.",
                        [
                          {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"),
                            style: "cancel",
                          },
                          {
                            text: "Start",
                            style: "default",
                            onPress: startPrayerVideoCall,
                          },
                        ],
                      )
                    }
                    disabled={currentGroup?.admin_id !== currentUser.id}
                    style={{
                      opacity:
                        currentGroup?.admin_id !== currentUser.id ? 0.5 : 1,
                    }}
                    className="bg-light-primary dark:bg-dark-accent p-3 rounded-xl items-center justify-center w-full"
                  >
                    <Feather
                      name="video"
                      size={40}
                      color={
                        actualTheme && actualTheme.MainTxt
                          ? actualTheme.MainTxt
                          : colorScheme === "dark"
                            ? "white"
                            : "white"
                      }
                    />
                    <Text className="font-inter-semibold mb-3 text-lg text-light-background dark:text-dark-background">
                      Start a Prayer Video Call
                    </Text>
                    <Text className="font-inter-regular  text-light-background dark:text-dark-background">
                      Only an admin can do this.
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setselectPrayerMethod("Chat")}
                    className="bg-light-primary dark:bg-dark-accent p-3 rounded-xl items-center justify-center w-full"
                  >
                    <FontAwesome
                      name="list-alt"
                      size={40}
                      color={
                        actualTheme && actualTheme.MainTxt
                          ? actualTheme.MainTxt
                          : colorScheme === "dark"
                            ? "white"
                            : "white"
                      }
                    />

                    <Text className="font-inter-semibold text-lg text-light-background dark:text-dark-background">
                      Add prayers to the group list
                    </Text>
                  </Pressable>
                </View>
              </View>
            </>
          )}
          {selectPrayerMethod === "Chat" && (
            <Chat
              theme={colorScheme}
              prayerToReact={prayerToReact}
              setPrayerToReact={setPrayerToReact}
              setReactionChannel={setReactionChannel}
              reactionChannel={reactionChannel}
              bottomSheetModalRef={bottomSheetModalRef}
              actualTheme={actualTheme}
              currentUser={currentUser}
              onlineUsers={onlineUsers}
              handleOpenBottomModal={handleOpenBottomModal}
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
              sendMessage={sendMessage}
            />
          )}
        </PrayerContainer>
      </KeyboardAvoidingView>
    </VideoProvider>
  );
};

export default PrayerGroupScreen;
