import {
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

import { HeaderTitle, HeaderView, ModalContainer } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { useState } from "react";

import { TextInput } from "react-native";

const CommentModal = ({
  commentVisible,
  supabase,
  prayer,
  setCommentVisible,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [comment, setComment] = useState("");
  const [inputHeight, setInputHeight] = useState(60);
  const [commentsArray, setCommentsArray] = useState([]);
  const handleCloseModal = () => {
    setCommentVisible(false);
    setComment("");
  };

  useEffect(() => {
    fetchComments();
  }, []);

  async function fetchComments() {
    const { data: comments, error: commentsError } = await supabase
      .from("comments")
      .select("*, profiles(*)")
      .eq("prayer_id", prayer.id);
    setCommentsArray(comments);
    if (commentsError) {
      console.log(commentsError);
    }
  }

  console.log("list of comments :", commentsArray);

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
    // getPrayers();
    handleCloseModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={commentVisible}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
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
                name="close"
                size={30}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
            </TouchableOpacity>
          </HeaderView>
          <View>
            {commentsArray.map((c) => (
              <View key={c.id}>
                <Text>{c.profiles.full_name}</Text>
                <Text>{c.comment}</Text>
              </View>
            ))}
          </View>
          <View style={styles.inputField}>
            <TextInput
              style={theme == "dark" ? styles.inputDark : styles.input}
              autoFocus
              placeholder="Add a comment"
              selectionColor={theme == "dark" ? "white" : "#2f2d51"}
              value={comment}
              onChangeText={(text) => setComment(text)}
              onContentSizeChange={handleContentSizeChange}
              onSubmitEditing={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              multiline={true}
            />
            <TouchableOpacity onPress={() => addComment(prayer.id)}>
              <Text
                style={{
                  color: "#2f2d51",
                  fontFamily: "Inter-Medium",
                }}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>
        </ModalContainer>
      </KeyboardAvoidingView>
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
    width: "90%",
    // backgroundColor: "white",
    borderBottomColor: "white",
    borderBottomWidth: 1,
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
