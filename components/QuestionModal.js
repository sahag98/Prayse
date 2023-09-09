import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";
import { AntDesign } from "@expo/vector-icons";

import { TextInput } from "react-native";
import AnswerItem from "../components/AnswerItem";
import { MaterialIcons } from "@expo/vector-icons";
import { useSupabase } from "../context/useSupabase";
import Toast from "react-native-toast-message";
import { Divider } from "react-native-paper";

const QuestionModal = () => {
  const { currentUser, supabase } = useSupabase();
  const theme = useSelector((state) => state.user.theme);
  const [weeklyQuestion, setWeeklyquestion] = useState([]);
  const [answersVisible, setAnswersVisible] = useState(true);
  const [answer, setAnswer] = useState("");
  const [answersArray, setAnswersArray] = useState([]);
  const [inputHeight, setInputHeight] = useState(60);
  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212", position: "relative" }
          : { backgroundColor: "#F2F7FF", position: "relative" }
      }
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -inputHeight - 20}
      >
        <HeaderView>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Community")}>
              <AntDesign
                name="left"
                size={24}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
            </TouchableOpacity>
            <HeaderTitle
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Bold", color: "white" }
                  : {
                      fontFamily: "Inter-Bold",
                      color: "#2F2D51",
                    }
              }
            >
              <Text>Question of the Week</Text>
            </HeaderTitle>
          </View>
        </HeaderView>
        <View style={theme == "dark" ? styles.questionDark : styles.question}>
          <Text
            style={
              theme == "dark"
                ? { fontSize: 20, color: "white", fontFamily: "Inter-Bold" }
                : { fontSize: 20, color: "#2f2d51", fontFamily: "Inter-Bold" }
            }
          >
            {weeklyQuestion[0]?.title}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "white",
                      fontFamily: "Inter-Regular",
                    }
                  : {
                      color: "#2f2d51",
                      fontFamily: "Inter-Regular",
                    }
              }
            >
              {answersArray.length} answers
            </Text>
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "#d6d6d6",
                      fontSize: 13,
                      fontFamily: "Inter-Regular",
                      alignSelf: "flex-end",
                    }
                  : {
                      color: "#2f2d51",
                      fontSize: 13,
                      fontFamily: "Inter-Regular",
                      alignSelf: "flex-end",
                    }
              }
            >
              {convertDigitIn(weeklyQuestion[0]?.date)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, width: "100%" }}>
            {answersArray.length == 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialIcons
                  name="question-answer"
                  size={50}
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
                  No answers at this moment.
                </Text>
              </View>
            ) : (
              <FlatList
                data={answersArray}
                keyExtractor={(e, i) => i.toString()}
                onEndReachedThreshold={0}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <Divider
                    style={
                      theme == "dark"
                        ? { backgroundColor: "#525252", marginBottom: 10 }
                        : { backgroundColor: "#2f2d51", marginBottom: 10 }
                    }
                  />
                )}
                renderItem={({ item }) => (
                  <AnswerItem item={item} theme={theme} />
                )}
              />
            )}
          </View>

          <View style={styles.inputField}>
            <TextInput
              // onPressIn={() => setAnswersVisible(false)}
              style={theme == "dark" ? styles.inputDark : styles.input}
              placeholder="Add your answer..."
              placeholderTextColor={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
              selectionColor={theme == "dark" ? "white" : "#2f2d51"}
              value={answer}
              onChangeText={(text) => setAnswer(text)}
              onContentSizeChange={handleContentSizeChange}
              onSubmitEditing={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              multiline={true}
            />
            <TouchableOpacity
              style={{
                width: "20%",

                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={addAnswer}
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
                Answer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default QuestionModal;

const styles = StyleSheet.create({
  questionDark: {
    borderRadius: 15,
    padding: 10,
    borderBottomColor: "#3e3e3e",
    borderBottomWidth: 2,
    marginBottom: 10,
  },
  question: {
    // backgroundColor: "#93d8f8",
    borderRadius: 15,
    padding: 10,
    borderBottomColor: "#93d8f8",
    borderBottomWidth: 2,
    marginBottom: 10,
  },
  inputField: {
    marginVertical: 0,
    minHeight: 50,
    maxHeight: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
  },
  inputDark: {
    color: "white",
    fontFamily: "Inter-Regular",
    width: "80%",
    borderColor: "#212121",
    backgroundColor: "#212121",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "80%",
    borderColor: "#2f2d51",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
