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
import { AnimatedFAB, Divider } from "react-native-paper";
import { Touchable } from "react-native";
import QuestionModal from "../components/QuestionModal";
import moment from "moment";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import QuestionHelpModal from "../components/QuestionHelpModal";

const Question = ({ navigation }) => {
  const { currentUser, supabase } = useSupabase();
  const theme = useSelector((state) => state.user.theme);
  const [weeklyQuestion, setWeeklyquestion] = useState([]);
  const [answersVisible, setAnswersVisible] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answersArray, setAnswersArray] = useState([]);
  const isFocused = useIsFocused();
  const [inputHeight, setInputHeight] = useState(60);
  const [questionHelpModal, setQuestionHelpModal] = useState(false);
  useEffect(() => {
    console.log("in question effect");
    AsyncStorage.removeItem("modalShown");
    // AsyncStorage.getItem("modalShown").then((value) => {
    //   console.log(value);

    //   // if (value === true) {
    //   //   console.log("setting null");
    //   //   AsyncStorage.setItem("modalShown", null);
    //   //   return;
    //   // }

    //   // if (value === null) {
    //   //   // If the modal hasn't been shown before, show it and set the flag
    //   //   setQuestionHelpModal(true);
    //   //   AsyncStorage.setItem("modalShown", "true");
    //   // }
    // });
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
        console.log("data ", data);
        setWeeklyquestion(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const dateObject = new Date(weeklyQuestion[0]?.date);

  const endDate = moment(dateObject).add(7, "days").toDate();

  function convertDigitIn(str) {
    let newDate;
    if (str) {
      let newStr = str.replace(/-/g, "/");
      newDate = newStr.split("/").reverse().join("/");
    }
    const parsedDate = moment(newDate, "MM/DD/YYYY");
    const formattedDate = parsedDate.format("M/D/YYYY");
    return formattedDate;
  }

  const BusyIndicator = () => {
    return (
      <View
        style={
          theme == "dark"
            ? { backgroundColor: "#121212", flex: 1, justifyContent: "center" }
            : { backgroundColor: "#F2F7FF", flex: 1, justifyContent: "center" }
        }
      >
        <ActivityIndicator
          size="large"
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </View>
    );
  };

  if (weeklyQuestion.length == 0) {
    return <BusyIndicator />;
  }

  async function removeAnswers(admin) {
    if (admin === true) {
      console.log("deleting");
      const { error } = await supabase
        .from("answers")
        .delete()
        .neq("question_id", "342");
    }
    setAnswersArray([]);
    fetchAnswers();
    loadQuestion();
  }

  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212", position: "relative" }
          : { backgroundColor: "#F2F7FF", position: "relative" }
      }
    >
      <HeaderView style={{ marginTop: 10, alignItems: "center" }}>
        <View
          style={{
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
        {currentUser.admin === true ? (
          <TouchableOpacity onPress={() => removeAnswers(currentUser.admin)}>
            <Text style={{ fontFamily: "Inter-Regular", color: "#ff8989" }}>
              Clear
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => loadQuestion()}>
            <Ionicons name="refresh" size={24} color="#ff8989" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setQuestionHelpModal(true)}>
          <FontAwesome5
            name="question-circle"
            size={28}
            color={theme == "dark" ? "#c8c8c8" : "#2f2d51"}
          />
        </TouchableOpacity>

        <QuestionHelpModal
          theme={theme}
          questionHelpModal={questionHelpModal}
          setQuestionHelpModal={setQuestionHelpModal}
        />
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
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={
              theme == "dark"
                ? {
                    color: "#A5C9FF",
                    fontSize: 14,
                    fontFamily: "Inter-Medium",
                  }
                : {
                    color: "#2f2d51",
                    fontSize: 14,
                    fontFamily: "Inter-Medium",
                  }
            }
          >
            {answersArray.length} answers
          </Text>

          <View
            style={{
              flexDirection: "row",

              justifyContent: "center",
              alignItems: "center",
              gap: 5,
            }}
          >
            <Ionicons
              name="time-outline"
              size={24}
              color={theme == "dark" ? "#d6d6d6" : "#2f2d51"}
            />
            <Text
              style={
                theme == "dark"
                  ? {
                      color: "#d6d6d6",
                      fontSize: 13,
                      fontFamily: "Inter-Medium",
                    }
                  : {
                      color: "#2f2d51",
                      fontSize: 13,
                      fontFamily: "Inter-Medium",
                    }
              }
            >
              Ends on {endDate?.toLocaleDateString()}
            </Text>
          </View>
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
              ListFooterComponent={() => (
                <View
                  style={
                    theme == "dark"
                      ? {
                          height: 100,
                        }
                      : {
                          height: 100,
                        }
                  }
                />
              )}
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
      </View>
      <View style={styles.actionButtons}>
        <AnimatedFAB
          icon={"plus"}
          label={"Add answer"}
          extended={true}
          onPress={() => setAnswersVisible(true)}
          visible={true}
          animateFrom={"right"}
          iconMode={"dynamic"}
          color={theme == "dark" ? "#212121" : "white"}
          style={theme == "dark" ? styles.fabStyleDark : styles.fabStyle}
        />
      </View>
      <QuestionModal
        user={currentUser}
        question={weeklyQuestion[0]}
        fetchAnswers={fetchAnswers}
        showToast
        theme={theme}
        supabase={supabase}
        setAnswersVisible={setAnswersVisible}
        answersVisible={answersVisible}
      />
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
  actionButtons: {
    position: "absolute",
    right: 15,
    bottom: 15,
    display: "flex",
  },
  fabStyleDark: {
    position: "relative",
    alignSelf: "flex-end",
    justifyContent: "center",
    backgroundColor: "#A5C9FF",
  },
  fabStyle: {
    position: "relative",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "#2f2d51",
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
