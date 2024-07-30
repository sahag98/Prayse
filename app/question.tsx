// @ts-nocheck
import { useEffect, useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  FlatList,
  StyleSheet,
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
import { useIsFocused } from "@react-navigation/native";

import AnswerItem from "../components/AnswerItem";
import { useSupabase } from "../context/useSupabase";
import QuestionModal from "../modals/QuestionModal";
import { QUESTION_LIST_SCREEN } from "../routes";
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
  const isFocused = useIsFocused();
  useEffect(() => {
    fetchAnswers();

    if (itemId) {
      setAnswersArray(answers.filter((answer) => answer.question_id === 15));
    }
  }, [isFocused]);

  const theme = useSelector((state) => state.user.theme);

  const [inputHeight, setInputHeight] = useState(60);
  const [questionHelpModal, setQuestionHelpModal] = useState(false);

  const handleContentSizeChange = (event) => {
    if (event.nativeEvent.contentSize.height < 60) {
      setInputHeight(60);
    } else {
      setInputHeight(event.nativeEvent.contentSize.height);
    }
  };

  const existingAnswers = answers.filter(
    (answer) => answer.question_id === itemId,
  );

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="dark:bg-dark-background relative bg-light-background"
    >
      <HeaderView style={{ marginTop: 10, alignItems: "center" }}>
        <View className="flex-row items-center gap-3">
          <Link href={`/${QUESTION_LIST_SCREEN}`}>
            <AntDesign
              name="left"
              size={24}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme == "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </Link>
          <HeaderTitle
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-bold dark:text-dark-primary text-light-primary"
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
          className="font-inter font-semibold text-2xl dark:text-dark-primary text-light-primary mb-4"
        >
          {itemTitle}
        </Text>
      </View>

      <View className="flex-1 w-full">
        {answersArray.length == 0 ? (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons
              name="question-answer"
              size={50}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme == "dark"
                    ? "#A5C9FF"
                    : "#2f2d51"
              }
            />
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter font-medium mt-3 dark:text-dark-accent text-light-primary"
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
            contentContainerStyle={{ gap: 5 }}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={() => <View className="h-24" />}
            renderItem={({ item }) => (
              <AnswerItem
                actualTheme={actualTheme}
                item={item}
                theme={colorScheme}
              />
            )}
          />
        )}
      </View>
      <View className="absolute flex right-4 bottom-4 ">
        <TouchableOpacity
          style={getPrimaryBackgroundColorStyle(actualTheme)}
          onPress={() => setAnswersVisible(true)}
          className="dark:bg-dark-accent flex-row items-center justify-center gap-2 bg-light-primary p-5 rounded-xl shadow-md shadow-gray-300 dark:shadow-none"
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
          <Text
            style={getPrimaryTextColorStyle(actualTheme)}
            className="font-inter font-bold text-lg text-light-background dark:text-dark-background"
          >
            Add answer
          </Text>
        </TouchableOpacity>
      </View>
      <QuestionModal
        answersLength={answersArray.length}
        user={currentUser}
        // question={item}
        setQuestions={setQuestions}
        // fetchAnswers={fetchAnswers}
        itemTitle={itemTitle}
        itemId={itemId}
        answersArray={answersArray}
        colorScheme={colorScheme}
        actualTheme={actualTheme}
        theme={theme}
        supabase={supabase}
        setAnswersVisible={setAnswersVisible}
        answersVisible={answersVisible}
      />
    </Container>
  );
};

export default QuestionScreen;

const styles = StyleSheet.create({
  questionDark: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
  },
  question: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2f2d51",
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

  fabStyleCustom: {
    position: "relative",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "#2f2d51",
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
