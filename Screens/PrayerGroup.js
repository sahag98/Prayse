import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import * as Clipboard from "expo-clipboard";
import {
  Container,
  HeaderTitle,
  HeaderView,
  PrayerContainer,
} from "../styles/appStyles";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { AntDesign, Feather, FontAwesome, Entypo } from "@expo/vector-icons";
import { useSupabase } from "../context/useSupabase";
import Moment from "moment";
import { FlashList } from "@shopify/flash-list";
import communityReady from "../hooks/communityReady";
import { useCallback } from "react";
import axios from "axios";

const PrayerGroup = ({ route, navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const [messages, setMessages] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const isReady = communityReady();
  const [newMessage, setNewMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(60);
  const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false);
  const currGroup = route.params.group;
  const flatListRef = useRef(null);
  const allGroups = route.params.allGroups;
  const {
    currentUser,
    setCurrentUser,
    session,
    newPost,
    isNewMessage,
    setIsNewMessage,
    setNewPost,
    logout,
    supabase,
  } = useSupabase();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      // Code to execute when the screen is blurred (navigated away from)
      console.log("Screen is focused");

      // You can perform actions or set state based on screen blur
    }

    return () => {
      console.log("screen is not focused");
      // Cleanup or additional actions when the component unmounts
    };
  }, [isFocused]);

  const copyToClipboard = async (code) => {
    await Clipboard.setStringAsync(code);
  };

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  // async function sendGroupNotification() {
  //   allGroups.map((g) => {
  //     console.log(
  //       "sending: ",
  //       g.profiles.full_name + ", " + g.profiles.expoToken
  //     );
  //     const message = {
  //       to: g.profiles.expoToken,
  //       sound: "default",
  //       title: "New Response 💭",
  //       body: `${currentUser.full_name} has responded to: ${prayer.prayer}.`,
  //       data: { screen: "PublicCommunity", prayerId: prayer.id },
  //     };

  //     await axios.post("https://exp.host/--/api/v2/push/send", message, {
  //       headers: {
  //         Accept: "application/json",
  //         "Accept-encoding": "gzip, deflate",
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   });
  // }

  useEffect(() => {
    getGroupMessages();
    setIsOnline(true);
  }, []);

  const sendMessage = async () => {
    if (newMessage.length == 0) {
      return;
    }
    const { data, error } = await supabase.from("messages").insert({
      group_id: currGroup.group_id,
      user_id: currentUser.id,
      message: newMessage,
    });
    setNewMessage("");
  };

  useEffect(() => {
    getGroupMessages();
  }, [isNewMessage]);

  async function getGroupMessages() {
    let { data: groupMessages, error } = await supabase
      .from("messages")
      .select("*,groups(*), profiles(*)")
      .eq("group_id", currGroup.group_id)
      .order("id", { ascending: true });
    setMessages(groupMessages);

    console.log("length: ", groupMessages.length);
    flatListRef.current.scrollToIndex({
      index: messages.length - 1,
      animated: true,
    });
    setIsNewMessage(false);
  }

  const onScrollToIndexFailed = (info) => {
    console.warn("onScrollToIndexFailed:", info);
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
            <View style={{ paddingBottom: 5, gap: 5 }}>
              <HeaderTitle
                style={
                  theme == "dark"
                    ? { color: "white", fontFamily: "Inter-Bold" }
                    : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                }
              >
                {currGroup.groups.name}
              </HeaderTitle>
              <Text style={{ color: "white" }}>
                {isFocused ? "on screen" : "off screen"}
              </Text>
              <View style={{ flexDirection: "row" }}>
                {allGroups.slice(0, 3).map((g, index) => (
                  <Text
                    key={index}
                    style={
                      theme == "dark"
                        ? {
                            color: "#b4b4b4",
                            fontFamily: "Inter-Regular",
                            fontSize: 13,
                          }
                        : {
                            color: "#2f2d51",
                            fontFamily: "Inter-Regular",
                            fontSize: 13,
                          }
                    }
                  >
                    {g.profiles.full_name}
                    {index < allGroups.length - 1 && <Text>, </Text>}
                  </Text>
                ))}
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => copyToClipboard(currGroup.groups.code.toString())}
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
          {messages.length == 0 ? (
            <Text style={{ color: "white" }}>No messages yet.</Text>
          ) : (
            <FlashList
              ref={flatListRef}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={200}
              estimatedListSize={{ height: 800, width: 450 }}
              data={messages}
              onLoad={() => {
                flatListRef.current.scrollToIndex({
                  index: messages.length - 1,
                  animated: true,
                });
              }}
              onLayout={() => {
                flatListRef.current.scrollToIndex({
                  index: messages.length - 1,
                  animated: true,
                });
              }}
              getItemLayout={(data, index) => ({
                length: 200, // Specify the height of your items here (adjust as needed)
                offset: 100 * index,
                index,
              })}
              // onScrollToIndexFailed={onScrollToIndexFailed}
              keyExtractor={(e, i) => i.toString()}
              // initialNumToRender={5}
              initialScrollIndex={messages.length - 1}
              renderItem={({ item }) => {
                return (
                  <View
                    style={
                      theme == "dark"
                        ? {
                            alignSelf:
                              item.profiles.id == currentUser.id
                                ? "flex-end"
                                : "flex-start",
                            backgroundColor: "#353535",
                            borderRadius: 10,
                            marginBottom: 10,
                            padding: 10,
                            gap: 15,
                            maxWidth: 200,
                          }
                        : {
                            alignSelf:
                              item.profiles.id == currentUser.id
                                ? "flex-end"
                                : "flex-start",
                            backgroundColor: "#93d8f8",
                            borderRadius: 10,
                            marginBottom: 10,
                            padding: 10,
                            gap: 15,
                            maxWidth: 200,
                          }
                    }
                  >
                    {item.profiles.id != currentUser.id && (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
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
                              ? { color: "white", fontFamily: "Inter-Medium" }
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
                          ? { color: "white", fontFamily: "Inter-Regular" }
                          : { color: "#2f2d51", fontFamily: "Inter-Regular" }
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
                );
              }}
            />
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
