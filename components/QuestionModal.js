import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import {
  HeaderTitle,
  HeaderView,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

const QuestionModal = ({
  theme,
  fetchAnswers,
  question,
  user,
  supabase,
  showToast,
  setAnswersVisible,
  answersVisible,
}) => {
  const [answer, setAnswer] = useState("");
  const [inputHeight, setInputHeight] = useState(100);

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 100) {
      setInputHeight(100);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const sendNotification = async (expoToken) => {
    const message = {
      to: expoToken,
      sound: "default",
      title: "Question of the Week",
      body: `${user.full_name} has answered the weekly question.`,
      data: { screen: "Question" },
    };

    await axios.post("https://exp.host/--/api/v2/push/send", message, {
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
    });
  };

  const addAnswer = async () => {
    console.log(user.expoToken);
    if (answer.length <= 0) {
      showToast("error", "The answer field can't be left empty.");
      setAnswersVisible(false);
      return;
    } else {
      const { data, error } = await supabase.from("answers").insert({
        user_id: user.id,
        answer,
        question_id: question._id,
      });
      handleCloseModal();
      fetchAnswers();
      sendNotification();
      if (user.expoToken.length > 0) {
        console.log("expo");
        sendNotification(user.expoToken);
      }
      // showToast("success", "Answer submitted successfully. ✔️");
      if (error) {
        showToast("error", "Something went wrong. Try again.");
      }
    }
  };

  const handleCloseModal = () => {
    setAnswersVisible(false);
    setAnswer("");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={answersVisible}
      onRequestClose={handleCloseModal}
      statusBarTranslucent={true}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={-130}
      >
        <ModalContainer
          style={
            theme == "dark"
              ? { backgroundColor: "rgba(0, 0, 0, 0.4)" }
              : { backgroundColor: "rgba(0, 0, 0, 0.4)" }
          }
        >
          <ModalView
            style={
              theme == "dark"
                ? { backgroundColor: "#212121" }
                : { backgroundColor: "#93D8F8" }
            }
          >
            <StyledInput
              style={
                theme == "dark"
                  ? {
                      height: inputHeight < 100 ? 100 : inputHeight,
                      verticalAlign: "top",
                      fontFamily: "Inter-Regular",
                      marginBottom: 5,
                      backgroundColor: "#121212",
                    }
                  : {
                      height: inputHeight < 100 ? 100 : inputHeight,
                      verticalAlign: "top",
                      fontFamily: "Inter-Regular",
                      marginBottom: 5,
                      backgroundColor: "#2F2D51",
                    }
              }
              placeholder="Add answer"
              placeholderTextColor={"#e0e0e0"}
              selectionColor={"white"}
              autoFocus={true}
              onChangeText={(text) => setAnswer(text)}
              value={answer}
              onContentSizeChange={handleContentSizeChange}
              onSubmitEditing={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              multiline={true}
            />
            <TouchableOpacity
              style={styles.dismiss}
              onPress={() => Keyboard.dismiss()}
            >
              <Text
                style={{
                  color: "#ff4e4e",
                  fontFamily: "Inter-Regular",
                  fontSize: 13,
                }}
              >
                Dismiss Keyboard
              </Text>
            </TouchableOpacity>
            <ModalActionGroup>
              <ModalAction color={"white"} onPress={handleCloseModal}>
                <AntDesign
                  name="close"
                  size={28}
                  color={theme == "dark" ? "#121212" : "#2F2D51"}
                />
              </ModalAction>
              <ModalAction
                color={theme == "dark" ? "#121212" : "#2F2D51"}
                onPress={addAnswer}
              >
                <AntDesign name="check" size={28} color={"white"} />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </ModalContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default QuestionModal;

const styles = StyleSheet.create({});
