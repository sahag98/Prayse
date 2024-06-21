// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Link, useIsFocused } from "@react-navigation/native";

import QuestionInfo from "../components/QuestionInfo";
import { useSupabase } from "../context/useSupabase";
import QuestionHelpModal from "../modals/QuestionHelpModal";
import { COMMUNITY_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

const QuestionListScreen = () => {
  const theme = useSelector((state) => state.user.theme);
  const [questionHelpModal, setQuestionHelpModal] = useState(false);
  const isFocused = useIsFocused();
  const { questions, answers, fetchQuestions, fetchAnswers } = useSupabase();

  useEffect(() => {
    fetchQuestions();
    fetchAnswers();
  }, [isFocused]);

  // questions.sort((a, b) => {
  //   const dateA = new Date(a.created_at);
  //   const dateB = new Date(b.created_at);
  //   return dateB - dateA;
  // });

  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212", position: "relative" }
          : { backgroundColor: "#F2F7FF", position: "relative" }
      }
    >
      <HeaderView
        style={{ marginTop: 10, marginBottom: 20, alignItems: "center" }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Link to={`/${COMMUNITY_SCREEN}`}>
            <AntDesign
              name="left"
              size={24}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </Link>
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
            size={25}
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
        keyExtractor={(e, i) => i.toString()}
        renderItem={({ item }) => (
          <QuestionInfo
            key={item.id}
            item={item}
            answers={answers}
            theme={theme}
          />
        )}
      />
    </Container>
  );
};

export default QuestionListScreen;

const styles = StyleSheet.create({});
