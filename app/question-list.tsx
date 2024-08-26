// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import AddQuestionModal from "@modals/AddQuestionModal";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
} from "@lib/customStyles";
import { cn } from "@lib/utils";
import { useIsFocused } from "@react-navigation/native";

import QuestionInfo from "../components/QuestionInfo";
import { useSupabase } from "../context/useSupabase";
import { COMMUNITY_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

const QuestionListScreen = () => {
  const theme = useSelector((state) => state.user.theme);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const questionBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const questionsEnabled = useSelector((state) => state.pro.prayer_questions);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const { questions, answers, fetchQuestions, fetchAnswers } = useSupabase();
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  useEffect(() => {
    fetchQuestions();
    fetchAnswers();
  }, [isFocused]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQuestions();
    setRefreshing(false);
  }, []);

  // console.log(questionBottomSheetModalRef.current);

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background flex-1"
    >
      <HeaderView
        className={cn(
          isAddingQuestion ? "opacity-50" : "opacity-100 transition-opacity",
        )}
      >
        <View className="flex-row items-center gap-3">
          <Link href={`/${COMMUNITY_SCREEN}`}>
            <AntDesign
              name="left"
              size={24}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </Link>
          <HeaderTitle
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-bold text-light-primary dark:text-dark-primary"
          >
            Questions
          </HeaderTitle>
        </View>
        <View className="flex-row items-center gap-3">
          {questionsEnabled && (
            <TouchableOpacity
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="bg-light-primary dark:bg-dark-primary p-2 rounded-lg"
              onPress={() => {
                setIsAddingQuestion(true);
                questionBottomSheetModalRef.current?.present();
              }}
            >
              <AntDesign
                name="plus"
                size={25}
                color={
                  actualTheme && actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : colorScheme === "dark"
                      ? "#c8c8c8"
                      : "white"
                }
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={fetchQuestions}>
            <Ionicons
              name="refresh"
              size={25}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "#c8c8c8"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
        </View>
      </HeaderView>

      <FlatList
        className={cn(
          isAddingQuestion
            ? "opacity-50 mt-3"
            : "opacity-100 mt-3 transition-opacity",
        )}
        data={questions}
        onRefresh={onRefresh}
        refreshing={refreshing}
        // onRefresh={() => console.log("refresh list")}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-4"
        keyExtractor={(e, i) => i.toString()}
        renderItem={({ item }) => (
          <QuestionInfo
            key={item.id}
            item={item}
            answers={answers}
            actualTheme={actualTheme}
            theme={colorScheme}
          />
        )}
      />
      <AddQuestionModal
        actualTheme={actualTheme}
        colorScheme={colorScheme}
        setIsAddingQuestion={setIsAddingQuestion}
        questionBottomSheetModalRef={questionBottomSheetModalRef}
      />
    </Container>
  );
};

export default QuestionListScreen;

const styles = StyleSheet.create({});
