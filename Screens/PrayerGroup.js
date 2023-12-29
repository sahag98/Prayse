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
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import * as Clipboard from "expo-clipboard";
import { HeaderTitle, HeaderView, PrayerContainer } from "../styles/appStyles";
import { useSelector } from "react-redux";
import {
  AntDesign,
  Feather,
  FontAwesome,
  Entypo,
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

const PrayerGroup = ({ route, navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(60);
  const flatListRef = useRef(null);
  const [groupInfoVisible, setGroupInfoVisible] = useState(false);
  const currGroup = route.params.group;
  const allGroups = route.params.allGroups;
  const [isGroupRemoved, setIsGroupRemoved] = useState(false);
  const [countdown, setCountdown] = useState(300);
  const [hasAnnounced, setHasAnnounced] = useState(false);
  const [isAnnouncingMeeting, setIsAnnouncingMeeting] = useState(false);
  const [areMessagesLoading, setAreMessagesLoading] = useState(false);
  const {
    currentUser,
    isNewMessage,
    setIsNewMessage,
    setRefreshGroup,
    refreshGroup,
    supabase,
  } = useSupabase();

  const copyToClipboard = async (code) => {
    await Clipboard.setStringAsync(code);
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

  useEffect(() => {
    if (countdown === 0) {
      setHasAnnounced(null);
      setCountdown(600);
    }
  }, [countdown]);

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const isFocused = useIsFocused();

  async function sendGroupNotification() {
    const notificationPromises = allGroups.map(async (g) => {
      if (g.profiles.expoToken != currentUser.expoToken) {
        const message = {
          to: g.profiles.expoToken,
          sound: "default",
          title: `${currentUser.full_name} in ${currGroup.groups.name}`,
          body: `${newMessage}`,
          data: { screen: "PublicCommunity" },
        };

        return axios.post("https://exp.host/--/api/v2/push/send", message, {
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        });
      }
    });

    // Wait for all promises to resolve
    await Promise.all(notificationPromises);
  }

  useEffect(() => {
    async function getGroupMessages() {
      try {
        setAreMessagesLoading(true);
        let { data: groupMessages, error } = await supabase
          .from("messages")
          .select("*,groups(*), profiles(*)")
          .eq("group_id", currGroup.group_id)
          .order("id", { ascending: false });
        setMessages(groupMessages);
      } catch (error) {
        console.log(error);
      }

      setAreMessagesLoading(false);
      setIsNewMessage(false);
    }
    getGroupMessages();
  }, []);

  useEffect(() => {
    async function getGroupMessages() {
      try {
        // setAreMessagesLoading(true);
        let { data: groupMessages, error } = await supabase
          .from("messages")
          .select("*,groups(*), profiles(*)")
          .eq("group_id", currGroup.group_id)
          .order("id", { ascending: false });

        setMessages(groupMessages);
      } catch (error) {
        console.log(error);
      }

      // setAreMessagesLoading(false);
      setIsNewMessage(false);
    }
    getGroupMessages();
  }, [isFocused]);

  useEffect(() => {
    async function getGroupMessages() {
      try {
        setAreMessagesLoading(true);
        let { data: groupMessages, error } = await supabase
          .from("messages")
          .select("*,groups(*), profiles(*)")
          .eq("group_id", currGroup.group_id)
          .order("id", { ascending: false });

        setMessages(groupMessages);
      } catch (error) {
        console.log(error);
      }

      setAreMessagesLoading(false);
      setIsNewMessage(false);
    }
    getGroupMessages();
  }, [currGroup.group_id]);

  async function getSingleGroup() {
    let { data: groups, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", currGroup?.group_id);
    return groups;
  }

  const sendMessage = async () => {
    if (newMessage.length == 0) {
      return;
    }

    const groups = await getSingleGroup();
    if (groups.length == 0) {
      console.log("this group has been removed");
      setNewMessage("");
      Keyboard.dismiss();
      setIsGroupRemoved(true);
      return;
    }
    const optimisticMessage = {
      group_id: currGroup.group_id,
      user_id: currentUser.id,
      // avatar_url: currentUser.avatar_url,
      message: newMessage,
    };

    setMessages([optimisticMessage, ...messages]);

    const { data, error } = await supabase.from("messages").insert({
      group_id: currGroup.group_id,
      user_id: currentUser.id,
      message: newMessage,
    });

    if (error) {
      throw new Error(error);
    } else {
      setNewMessage("");
    }

    // sendGroupNotification();
  };

  useEffect(() => {
    async function getGroupMessages() {
      try {
        // setAreMessagesLoading(true);
        let { data: groupMessages, error } = await supabase
          .from("messages")
          .select("*,groups(*), profiles(*)")
          .eq("group_id", currGroup.group_id)
          .order("id", { ascending: false });

        setMessages(groupMessages);
      } catch (error) {
        console.log(error);
      }

      // setAreMessagesLoading(false);
      setIsNewMessage(false);
    }
    getGroupMessages();
  }, [isNewMessage]);

  const isSameDate = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -100}
    >
      <PrayerContainer
        style={
          theme == "dark"
            ? {
                backgroundColor: "#121212",

                gap: 10,
                position: "relative",
              }
            : {
                backgroundColor: "#F2F7FF",

                gap: 10,
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
            width: "100%",
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 5 }}
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
              // width: 45,
              // height: 45,
              justifyContent: "center",
              alignItems: "center",
              padding: 8,
              backgroundColor: theme == "dark" ? "#212121" : "#abe1fa",
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
              currGroup={currGroup}
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
                    padding: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#212121",
                    borderRadius: 10,
                    gap: 8,
                  }
                : {
                    padding: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#2f2d51",
                    borderRadius: 10,
                    gap: 8,
                  }
            }
          >
            <Feather name="copy" size={15} color="white" />
            <Text
              style={{
                color: "white",
                fontSize: 13,
                fontFamily: "Inter-Medium",
              }}
            >
              {currGroup.groups.code}
            </Text>
          </TouchableOpacity>
        </HeaderView>
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
              {messages.length == 0 ? (
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
                        ? { fontFamily: "Inter-Medium", color: "white" }
                        : { fontFamily: "Inter-Medium", color: "#2f2d51" }
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
                  data={messages}
                  keyExtractor={(e, i) => i.toString()}
                  initialNumToRender={30}
                  renderItem={({ item, index }) => {
                    const currentDate = new Date(item.created_at);
                    const nextItem =
                      index < messages.length - 1 ? messages[index + 1] : null;
                    const nextDate = nextItem
                      ? new Date(nextItem.created_at)
                      : null;

                    const isLastMessageForDay =
                      !nextDate || !isSameDate(currentDate, nextDate);
                    const isLastMessageInList = index === messages.length - 1;
                    return (
                      <View>
                        {isLastMessageForDay && isLastMessageInList && (
                          <Text
                            style={{
                              textAlign: "center",
                              color: theme == "dark" ? "white" : "#2f2d51",
                              fontFamily: "Inter-Medium",
                              marginVertical: 10,
                            }}
                          >
                            {Moment(item.created_at).format("MMMM D, YYYY")}
                          </Text>
                        )}
                        <View
                          style={
                            theme == "dark"
                              ? [
                                  {
                                    alignSelf:
                                      item.user_id == currentUser.id
                                        ? "flex-end"
                                        : "flex-start",
                                    backgroundColor:
                                      item.user_id == currentUser.id
                                        ? "#353535"
                                        : "#212121",
                                    borderRadius: 10,
                                    marginBottom: 10,
                                    padding: 10,
                                    gap: 15,
                                    minWidth: 100,
                                    maxWidth: 300,
                                  },
                                ]
                              : {
                                  alignSelf:
                                    item.user_id == currentUser.id
                                      ? "flex-end"
                                      : "flex-start",
                                  backgroundColor:
                                    item.user_id == currentUser.id
                                      ? "#abe1fa"
                                      : "#93d8f8",
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
                                  theme == "dark"
                                    ? styles.profileImgDark
                                    : styles.profileImg
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
                                      }
                                    : {
                                        color: "#2f2d51",
                                        fontFamily: "Inter-Medium",
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
                                  }
                                : {
                                    color: "#2f2d51",
                                    fontFamily: "Inter-Regular",
                                    fontSize: 15,
                                  }
                            }
                          >
                            {item.message}
                          </Text>
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
                      </View>
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
          <TextInput
            style={theme == "dark" ? styles.inputDark : styles.input}
            placeholder="Write a prayer..."
            placeholderTextColor={theme == "dark" ? "#b8b8b8" : "#2f2d51"}
            selectionColor={theme == "dark" ? "white" : "#2f2d51"}
            value={newMessage}
            onChangeText={(text) => setNewMessage(text)}
            onContentSizeChange={handleContentSizeChange}
            onSubmitEditing={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            // multiline={true}
            // // ios fix for centering it at the top-left corner
            // numberOfLines={5}
          />
          <TouchableOpacity
            disabled={newMessage.length == 0 ? true : false}
            style={{
              width: "20%",
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
        </View>
      </PrayerContainer>
    </KeyboardAvoidingView>
  );
};

export default PrayerGroup;

const styles = StyleSheet.create({
  inputField: {
    flexDirection: "row",

    padding: 15,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  inputDark: {
    color: "white",
    fontFamily: "Inter-Regular",
    width: "85%",
    borderColor: "#212121",
    backgroundColor: "#212121",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "85%",
    borderColor: "#2f2d51",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
  },
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
