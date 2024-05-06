import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { ModalContainer, ReactionModalContainer } from "../styles/appStyles";
import { AntDesign } from "@expo/vector-icons";
import ChatBubble from "react-native-chat-bubble";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import praise from "../assets/praise.png";
const ReactionModal = ({
  toggleLike,
  togglePraise,
  praises,
  likes,
  reactionModalVisibile,
  currentUser,
  setReactionModalVisibile,
  isPressedLong,
  theme,
}) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const isLikedByMe = !!likes?.find((like) => like.user_id == currentUser.id);
  const isPraisedByMe = !!praises?.find(
    (praise) => praise.user_id == currentUser.id
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={reactionModalVisibile}
      onRequestClose={() => setReactionModalVisibile(false)}
      statusBarTranslucent={true}
    >
      <TouchableWithoutFeedback onPress={() => setReactionModalVisibile(false)}>
        <View
          style={
            theme == "dark"
              ? {
                  padding: 30,
                  alignItems:
                    isPressedLong?.user_id == currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                }
              : {
                  padding: 30,
                  alignItems:
                    isPressedLong?.user_id == currentUser.id
                      ? "flex-end"
                      : "flex-start",
                  justifyContent: "center",
                  flex: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                }
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 50,

                backgroundColor:
                  isPressedLong?.user_id == currentUser.id
                    ? theme == "dark"
                      ? "#353535"
                      : "#b7d3ff"
                    : theme == "dark"
                    ? "#212121"
                    : "#dee4e7",
              }}
              onPress={() =>
                toggleLike(
                  isPressedLong.id,
                  isPressedLong.profiles.expoToken,
                  isPressedLong.message
                )
              }
            >
              <Animated.View style={animatedStyle}>
                <Image
                  style={
                    isLikedByMe
                      ? { width: 25, height: 25, tintColor: "#ff4e4e" }
                      : theme == "dark"
                      ? { width: 25, height: 25, tintColor: "#a5c9ff" }
                      : { width: 25, height: 25, tintColor: "#2f2d51" }
                  }
                  source={{
                    uri: "https://cdn.glitch.global/1948cbef-f54d-41c2-acf7-6548a208aa97/Black%20and%20White%20Rectangle%20Sports%20Logo%20(1).png?v=1698692894367",
                  }}
                />
              </Animated.View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                borderRadius: 50,

                backgroundColor:
                  isPressedLong?.user_id == currentUser.id
                    ? theme == "dark"
                      ? "#353535"
                      : "#b7d3ff"
                    : theme == "dark"
                    ? "#212121"
                    : "#dee4e7",
              }}
              onPress={() =>
                togglePraise(
                  isPressedLong.id,
                  isPressedLong.profiles.expoToken,
                  isPressedLong.message
                )
              }
            >
              <Animated.View style={animatedStyle}>
                <Image
                  style={
                    isPraisedByMe
                      ? { width: 25, height: 25, tintColor: "#ff4e4e" }
                      : theme == "dark"
                      ? { width: 25, height: 25, tintColor: "#a5c9ff" }
                      : { width: 25, height: 25, tintColor: "#2f2d51" }
                  }
                  source={praise}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
          <ChatBubble
            isOwnMessage={
              isPressedLong?.user_id == currentUser.id ? true : false
            }
            bubbleColor={
              isPressedLong?.user_id == currentUser.id
                ? theme == "dark"
                  ? "#353535"
                  : "#b7d3ff"
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
                      gap: 5,
                      minWidth: 160,
                      height: 90,
                      maxWidth: 300,
                    },
                  ]
                : {
                    borderRadius: 10,
                    marginBottom: 10,
                    padding: 10,
                    gap: 15,
                    minWidth: 160,
                    height: 90,
                    maxWidth: 300,
                  }
            }
          >
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
              {isPressedLong?.message}
            </Text>
          </ChatBubble>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReactionModal;

const styles = StyleSheet.create({});
