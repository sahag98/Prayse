import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";
import { useSelector } from "react-redux";
import QuestionHelpModal from "../components/QuestionHelpModal";
import QuestionInfo from "../components/QuestionInfo";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { client } from "../lib/client";
import { useSupabase } from "../context/useSupabase";
const QuestionList = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const [questionHelpModal, setQuestionHelpModal] = useState(false);
  // const [questions, setQuestions] = useState([]);
  const isFocused = useIsFocused();
  const { questions, supabase } = useSupabase();
  console.log("all questions: ", questions);
  // useEffect(() => {
  //   fetchQuestions();
  // }, [isFocused]);

  // const fetchQuestions = () => {
  //   const query = '*[_type=="question"]';
  //   client
  //     .fetch(query)
  //     .then((data) => {
  //       setQuestions(data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  //   // fetchAnswers();
  //   // setNewAnswer(false);
  // };

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
            <Text>Questions</Text>
          </HeaderTitle>
        </View>
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

      <FlatList
        data={questions}
        keyExtractor={(item) => item.question._id}
        renderItem={({ item }) => <QuestionInfo item={item} theme={theme} />}
      />
    </Container>
  );
};

export default QuestionList;

const styles = StyleSheet.create({});
