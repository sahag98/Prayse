import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import {
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { PRAYSE_MESSAGE } from "@env";
import { useSupabase } from "../context/useSupabase";

const QuestionModal = ({
  item,
  theme,
  fetchQuestions,
  question,
  setQuestions,
  user,
  answersArray,
  supabase,
  setAnswersVisible,
  answersVisible,
}) => {
  const [answer, setAnswer] = useState("");
  const [inputHeight, setInputHeight] = useState(100);
  const { questions, currentUser } = useSupabase();
  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 100) {
      setInputHeight(100);
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

  // async function updateAnswers() {
  //   const copyofQuestions = [...questions];
  //   const foundQuestion = copyofQuestions.find((q) => q.id === question.id);

  //   foundQuestion.answers.push({
  //     answer: answer,
  //     created_at: new Date(),
  //     profiles: {
  //       avatar_url: currentUser.avatar_url,
  //       full_name: currentUser.full_name,
  //     },
  //   });
  //   setQuestions(copyofQuestions);
  // }

  const addAnswer = async () => {
    // updateAnswers();
    if (answer.length <= 0) {
      showToast("error", "The answer field can't be left empty.");
      setAnswersVisible(false);
      return;
    } else {
      const { data, error } = await supabase.from("answers_test").insert({
        user_id: user.id,
        answer,
        question_id: item.id,
      });
      handleCloseModal();
      // updateAnswers();
      // fetchAnswerforQuestion(question._id);
      // fetchAnswers();
      function truncateWords(str, numWords) {
        let words = str.split(" ");
        if (words.length > numWords) {
          return words.slice(0, numWords).join(" ") + " ...";
        } else {
          return str;
        }
      }

      let truncatedString = truncateWords(answer, 8);
      console.log(truncatedString);
      const message = {
        title: "Question of the Week",
        message: `${user?.full_name} has posted a answer: ${truncatedString}`,
        data: {
          screen: "Question",
          question: item.title,
          verseTitle: "",
          item: item,
        },
      };

      // fetch(PRAYSE_MESSAGE.toString(), {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Accept-encoding": "gzip, deflate",
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(message),
      // });
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
                : { backgroundColor: "#b7d3ff" }
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
