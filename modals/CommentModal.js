import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import { AntDesign, FontAwesome5 } from "@expo/vector-icons";

import CommentItem from "../components/CommentItem";
import { HeaderView, ModalContainer } from "../styles/appStyles";

const CommentModal = ({
  commentVisible,
  supabase,
  fetchComments,
  commentsArray,
  prayer,
  session,
  setCommentVisible,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [comment, setComment] = useState("");
  const [inputHeight, setInputHeight] = useState(60);
  const [isReplying, setIsReplying] = useState("");
  const insets = useSafeAreaInsets();
  useEffect(() => {
    fetchComments(prayer.id);
  }, []);

  const handleCloseModal = () => {
    setCommentVisible(false);
    setIsReplying("");
    setComment("");
  };

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
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

  const sendNotification = async (expoToken) => {
    const message = {
      to: expoToken,
      sound: "default",
      title: "New Response 💭",
      body: `${user.full_name} has responded to: ${prayer.prayer}.`,
      data: { screen: "PublicCommunity", prayerId: prayer.id },
    };

    await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });
  };

  const addComment = async (id, expoToken) => {
    if (comment.length <= 0) {
      showToast("error", "The response field can't be left empty.");
      setCommentVisible(false);
    } else {
      //prayer_id for production
      //prayertest_id for testing
      const { error } = await supabase.from("comments").insert({
        prayer_id: id,
        user_id: user.id,
        comment,
      });
      showToast("success", "Response shared successfully. ✔️");
      if (expoToken.length > 0) {
        sendNotification(expoToken, "New Response 💭");
      }
      if (error) {
        showToast("error", "Something went wrong. Try again.");
      }
      fetchComments(prayer.id);
      handleCloseModal();
    }
  };

  const onModalShow = () => {
    setIsReplying("");
    fetchComments(prayer.id);
  };

  return (
    <SafeAreaProvider>
      <Modal
        animationType="slide"
        onShow={onModalShow}
        transparent
        visible={commentVisible}
        onRequestClose={handleCloseModal}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ModalContainer
            style={
              theme === "dark"
                ? {
                    position: "relative",
                    backgroundColor: "#121212",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    paddingTop: Platform.OS === "ios" ? insets.top : 0,
                    paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
                  }
                : {
                    position: "relative",
                    backgroundColor: "#F2F7FF",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    paddingTop: Platform.OS === "ios" ? insets.top : 0,
                    paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
                  }
            }
          >
            <HeaderView
              style={{
                flexDirection: "row",
              }}
            >
              <TouchableOpacity onPress={handleCloseModal}>
                <AntDesign
                  name="left"
                  size={30}
                  color={theme === "dark" ? "white" : "#2f2d51"}
                />
              </TouchableOpacity>
              <Text
                style={
                  theme === "dark"
                    ? {
                        color: "white",
                        fontSize: 20,
                        marginLeft: 10,
                        fontFamily: "Inter-Bold",
                      }
                    : {
                        color: "#2f2d51",
                        fontSize: 20,
                        marginLeft: 10,
                        fontFamily: "Inter-Bold",
                      }
                }
              >
                Responses
              </Text>
            </HeaderView>
            <View
              style={{
                flex: 1,
                width: "100%",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1, width: "100%" }}>
                {commentsArray.length === 0 ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesome5
                      name="comment-dots"
                      size={60}
                      color={theme === "dark" ? "#A5C9FF" : "#2f2d51"}
                    />
                    <Text
                      style={
                        theme === "dark"
                          ? {
                              fontFamily: "Inter-Medium",
                              marginTop: 10,
                              color: "#A5C9FF",
                            }
                          : {
                              fontFamily: "Inter-Medium",
                              marginTop: 10,
                              color: "#2f2d51",
                            }
                      }
                    >
                      No responses at this moment.
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={commentsArray}
                    keyExtractor={(i) => i.toString()}
                    onEndReachedThreshold={0}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => (
                      <Divider
                        style={
                          theme === "dark"
                            ? { backgroundColor: "#525252", marginBottom: 10 }
                            : { backgroundColor: "#2f2d51", marginBottom: 10 }
                        }
                      />
                    )}
                    renderItem={({ item }) => (
                      <CommentItem
                        isReplying={isReplying}
                        setIsReplying={setIsReplying}
                        prayerId={prayer.id}
                        handleCloseModal={handleCloseModal}
                        user={user}
                        supabase={supabase}
                        session={session}
                        item={item}
                        theme={theme}
                      />
                    )}
                  />
                )}
              </View>
              {!isReplying && (
                <Animated.View
                  entering={FadeIn.duration(500)}
                  exiting={FadeOut.duration(500)}
                  style={styles.inputField}
                >
                  <TextInput
                    style={theme === "dark" ? styles.inputDark : styles.input}
                    placeholder="Add your response..."
                    placeholderTextColor={
                      theme === "dark" ? "#b8b8b8" : "#2f2d51"
                    }
                    selectionColor={theme === "dark" ? "white" : "#2f2d51"}
                    value={comment}
                    onChangeText={(text) => setComment(text)}
                    onContentSizeChange={handleContentSizeChange}
                    onSubmitEditing={(e) => {
                      e.key === "Enter" && e.preventDefault();
                    }}
                    // multiline={true}
                    // // ios fix for centering it at the top-left corner
                    // numberOfLines={5}
                  />
                  <TouchableOpacity
                    style={{
                      width: "20%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() =>
                      addComment(prayer.id, prayer.profiles?.expoToken)
                    }
                  >
                    <Text
                      style={
                        theme === "dark"
                          ? {
                              color: "#A5C9FF",
                              fontFamily: "Inter-Medium",
                              marginRight: 5,
                            }
                          : {
                              color: "#2f2d51",
                              fontFamily: "Inter-Medium",
                              marginRight: 5,
                            }
                      }
                    >
                      Share
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </ModalContainer>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaProvider>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
  inputField: {
    flexDirection: "row",
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
  logoutDark: {
    alignSelf: "flex-end",
    backgroundColor: "#212121",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logout: {
    alignSelf: "flex-end",
    backgroundColor: "#2f2d51",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  iconContainer: {
    position: "relative",
    alignSelf: "center",
    padding: 8,
  },
  featherIconDark: {
    position: "absolute",
    backgroundColor: "#3e3e3e",
    borderRadius: 50,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    bottom: 6,
    right: 12,
  },
  featherIcon: {
    position: "absolute",
    backgroundColor: "#93d8f8",
    borderRadius: 50,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    bottom: 6,
    right: 12,
  },
});
