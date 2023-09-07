import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import { client } from "../lib/client";
import { useState } from "react";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { TextInput } from "react-native";
import AnswerItem from "../components/AnswerItem";
import { MaterialIcons } from "@expo/vector-icons";
import { useSupabase } from "../context/useSupabase";
import Toast from "react-native-toast-message";
import { Divider } from "react-native-paper";

const Question = ({ navigation }) => {
  const { currentUser, supabase } = useSupabase();
  const theme = useSelector((state) => state.user.theme);
  const [weeklyQuestion, setWeeklyquestion] = useState([]);
  const [answersVisible, setAnswersVisible] = useState(true);
  const [answer, setAnswer] = useState("");
  const [answersArray, setAnswersArray] = useState([]);
  const isFocused = useIsFocused();
  const [inputHeight, setInputHeight] = useState(60);

  useEffect(() => {
    loadQuestion();
    fetchAnswers();
  }, [isFocused]);

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  async function fetchAnswers() {
    const { data: answers, error: answersError } = await supabase
      .from("answers")
      .select("*, profiles(*)")
      .order("id", { ascending: false });
    setAnswersArray(answers);

    if (answersError) {
      console.log(answersError);
    }
  }

  const loadQuestion = () => {
    const query = '*[_type=="question"]';
    client
      .fetch(query)
      .then((data) => {
        setWeeklyquestion(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const addAnswer = async () => {
    if (answer.length <= 0) {
      showToast("error", "The answer field can't be left empty.");
      return;
    } else {
      const { data, error } = await supabase.from("answers").insert({
        user_id: currentUser.id,
        answer,
      });
      showToast("success", "Answer submitted successfully. ✔️");
      setAnswer("");
      if (error) {
        showToast("error", "Something went wrong. Try again.");
      }
      fetchAnswers();
    }
  };

  function convertDigitIn(str) {
    if (str) {
      let newStr = str.replace(/-/g, "/");
      return newStr.split("/").reverse().join("/");
    }
  }

  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212", position: "relative" }
          : { backgroundColor: "#F2F7FF", position: "relative" }
      }
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
                      marginRight: 5,
                    }
                  : {
                      color: "#2f2d51",
                      fontFamily: "Inter-Medium",
                      marginRight: 5,
                    }
              }
            >
              Answer
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default Question;

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
    marginVertical: 10,
    height: 50,
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
    padding: 10,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "85%",
    borderColor: "#2f2d51",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});
