// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
} from "@lib/customStyles";
import { useIsFocused } from "@react-navigation/native";

import QuestionInfo from "../components/QuestionInfo";
import { useSupabase } from "../context/useSupabase";
import { COMMUNITY_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

const QuestionListScreen = () => {
  const theme = useSelector((state) => state.user.theme);
  const [questionHelpModal, setQuestionHelpModal] = useState(false);
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

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <HeaderView>
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
      </HeaderView>

      <FlatList
        className="mt-3"
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
    </Container>
  );
};

export default QuestionListScreen;

const styles = StyleSheet.create({});
