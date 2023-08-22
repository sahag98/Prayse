import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Modal } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { HeaderView, ModalContainer } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { useState } from "react";

import { TextInput } from "react-native";
import CommentItem from "./CommentItem";

const CommentModal = ({
  commentVisible,
  supabase,
  fetchComments,
  commentsArray,
  prayer,
  setCommentVisible,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [comment, setComment] = useState("");
  const [inputHeight, setInputHeight] = useState(60);

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCloseModal = () => {
    setCommentVisible(false);
    setComment("");
  };

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const addComment = async (id) => {
    const { data, error } = await supabase.from("comments").insert({
      prayer_id: id,
      user_id: user.id,
      comment: comment,
    });
    if (error) {
      alert(error);
    }
    fetchComments();
    handleCloseModal();
  };

  return (
    <Modal
      animationType="slide"
      onShow={() => fetchComments()}
      transparent={true}
      visible={commentVisible}
      onRequestClose={handleCloseModal}
    >
      <ModalContainer
        style={
          theme == "dark"
            ? {
                position: "relative",
                backgroundColor: "#121212",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }
            : {
                position: "relative",
                backgroundColor: "#F2F7FF",
                justifyContent: "flex-start",
                alignItems: "flex-start",
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
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
          <Text
            style={
              theme == "dark"
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
        <View style={{ flex: 1, width: "100%", marginBottom: 20 }}>
          {commentsArray.length == 0 ? (
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
                color={theme == "dark" ? "#A5C9FF" : "#2f2d51"}
              />
              <Text
                style={
                  theme == "dark"
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
              keyExtractor={(e, i) => i.toString()}
              onEndReachedThreshold={0}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <CommentItem item={item} theme={theme} />
              )}
            />
          )}
        </View>
        <View style={styles.inputField}>
          <TextInput
            style={theme == "dark" ? styles.inputDark : styles.input}
            autoFocus
            placeholder="Add a comment"
            placeholderTextColor={theme == "dark" ? "white" : "#2f2d51"}
            selectionColor={theme == "dark" ? "white" : "#2f2d51"}
            value={comment}
            onChangeText={(text) => setComment(text)}
            onContentSizeChange={handleContentSizeChange}
            onSubmitEditing={(e) => {
              e.key === "Enter" && e.preventDefault();
            }}
            multiline={true}
          />
          <TouchableOpacity
            style={{
              width: "20%",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => addComment(prayer.id)}
          >
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "#A5C9FF",
                      fontFamily: "Inter-Medium",
                    }
                  : {
                      color: "#2f2d51",
                      fontFamily: "Inter-Medium",
                    }
              }
            >
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default CommentModal;

const styles = StyleSheet.create({
  inputField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
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
    padding: 10,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "90%",
    borderColor: "#2f2d51",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
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
