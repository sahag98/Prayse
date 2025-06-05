// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, TouchableOpacity, View } from "react-native";
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

import QuestionInfo from "../components/QuestionInfo";
import { useSupabase } from "../context/useSupabase";
import { EXPLORE_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

const QuestionListScreen = () => {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const questionBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const questionsEnabled = useSelector((state) => state.pro.prayer_questions);

  const [refreshing, setRefreshing] = useState(false);
  const {
    questions,
    answers,
    currentUser,
    fetchQuestions,
    supabase,
    // fetchAnswers,
  } = useSupabase();
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.

      fetchQuestions();
      // fetchAnswers();
      // Return function is invoked whenever the route gets out of focus.
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchQuestions();
    setRefreshing(false);
  }, []);

  console.log("questions enabled: ", questionsEnabled);
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
          <Link href={`/${EXPLORE_SCREEN}`}>
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
            className="font-inter-bold text-light-primary dark:text-dark-primary"
          >
            Questions
          </HeaderTitle>
        </View>
        <View className="flex-row items-center gap-3">
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
        contentContainerClassName="gap-3"
        keyExtractor={(item) => item.id.toString()}
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
    </Container>
  );
};

export default QuestionListScreen;
