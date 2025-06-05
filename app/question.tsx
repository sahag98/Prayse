// @ts-nocheck
import { useCallback, useEffect, useState } from "react";
import {
  Link,
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useColorScheme } from "nativewind";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
} from "@lib/customStyles";

import AnswerItem from "../components/AnswerItem";
import { useSupabase } from "../context/useSupabase";
import QuestionModal from "../modals/QuestionModal";
import { EXPLORE_SCREEN, QUESTION_LIST_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

const QuestionScreen = () => {
  const { answers, currentUser, setQuestions, fetchAnswers, supabase } =
    useSupabase();
  const [answersVisible, setAnswersVisible] = useState(false);
  const routeParams = useLocalSearchParams();
  const [answersArray, setAnswersArray] = useState([]);
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector((state) => state.theme.actualTheme);

  const itemTitle = routeParams?.title;
  const itemId = routeParams?.question_id;

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.

      fetchQuestionAnswers();
    }, []),
  );

  async function fetchQuestionAnswers() {
    const { data: answers, error: answersError } = await supabase
      .from("answers")
      .select("*, profiles(avatar_url,full_name)")
      .eq("question_id", itemId)
      .order("id", { ascending: false });

    if (answersError) {
      console.log(answersError);
    }

    setAnswersArray(answers);
  }

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="dark:bg-dark-background relative bg-light-background"
    >
      <HeaderView style={{ marginTop: 10, alignItems: "center" }}>
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() =>
              router.canGoBack()
                ? router.back()
                : router.replace(EXPLORE_SCREEN)
            }
          >
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
          </Pressable>
          <HeaderTitle
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-bold dark:text-dark-primary text-light-primary"
          >
            Question
          </HeaderTitle>
        </View>
      </HeaderView>
      <View
        style={
          actualTheme &&
          actualTheme.MainTxt && {
            borderBottomWidth: 1,
            borderBottomColor: actualTheme.MainTxt,
          }
        }
        className="mb-5 border-b dark:border-b-gray-400 border-b-light-primary"
      >
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-bold text-2xl dark:text-dark-primary text-light-primary mb-4"
        >
          {itemTitle}
        </Text>
      </View>

      <View className="flex-1 w-full">
        <FlatList
          data={answersArray}
          keyExtractor={(item) => item.id.toString()}
          onEndReachedThreshold={0}
          scrollEventThrottle={16}
          contentContainerStyle={{ gap: 5, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View className="h-24" />}
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center">
              <MaterialIcons
                name="question-answer"
                size={80}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "#A5C9FF"
                      : "#2f2d51"
                }
              />
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter-medium w-3/4 text-center mt-3 dark:text-dark-accent text-light-primary"
              >
                Looks like there are no answers yet! Be the first to share your
                thoughts and start the conversation.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <AnswerItem
              actualTheme={actualTheme}
              item={item}
              theme={colorScheme}
            />
          )}
        />
      </View>
      <View className="absolute flex right-4 bottom-8 ">
        <TouchableOpacity
          style={getPrimaryBackgroundColorStyle(actualTheme)}
          onPress={() => setAnswersVisible(true)}
          className="dark:bg-dark-accent flex-row items-center justify-center gap-2 bg-light-primary size-16 rounded-full shadow-gray-300 dark:shadow-none"
        >
          <AntDesign
            name="plus"
            size={24}
            color={
              actualTheme && actualTheme.PrimaryTxt
                ? actualTheme.PrimaryTxt
                : colorScheme === "dark"
                  ? "#121212"
                  : "white"
            }
          />
          {/* <Text
            style={getPrimaryTextColorStyle(actualTheme)}
            className="font-inter-bold text-lg text-light-background dark:text-dark-background"
          >
            Answer
          </Text> */}
        </TouchableOpacity>
      </View>
      <QuestionModal
        answersLength={answersArray.length}
        user={currentUser}
        // question={item}
        setQuestions={setQuestions}
        fetchQuestionAnswers={fetchQuestionAnswers}
        // fetchAnswers={fetchAnswers}
        itemTitle={itemTitle}
        itemId={itemId}
        answersArray={answersArray}
        setAnswersArray={setAnswersArray}
        colorScheme={colorScheme}
        actualTheme={actualTheme}
        supabase={supabase}
        setAnswersVisible={setAnswersVisible}
        answersVisible={answersVisible}
      />
    </Container>
  );
};

export default QuestionScreen;
