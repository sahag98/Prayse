import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useSupabase } from "../context/useSupabase";
import { QUESTION_SCREEN } from "../routes";

const QuestionInfo = ({ item, theme }) => {
  const navigation = useNavigation();

  const { answers } = useSupabase();

  const existingAnswers = answers.filter(
    (answer) => answer.question_id === item.id,
  );

  return (
    <TouchableOpacity
      style={theme === "dark" ? styles.questionDark : styles.question}
    >
      {item.isNew && (
        <Text
          style={
            theme === "dark"
              ? {
                  color: "#ff3333",
                  alignSelf: "flex-end",
                  fontSize: 13,
                  fontFamily: "Inter-Regular",
                }
              : {
                  color: "red",
                  alignSelf: "flex-end",
                  fontSize: 13,
                  fontFamily: "Inter-Regular",
                }
          }
        >
          {item.isNew === true ? "New" : null}
        </Text>
      )}
      <Text
        style={
          theme === "dark"
            ? { fontSize: 16, color: "white", fontFamily: "Inter-Medium" }
            : { fontSize: 16, color: "#2f2d51", fontFamily: "Inter-Medium" }
        }
      >
        {item.title}
      </Text>
      <View
        style={{
          flexDirection: "row",
          // alignSelf: "flex-end",
          alignItems: "center",
          gap: 5,
          justifyContent: "space-between",
        }}
      >
        <Text
          style={
            theme === "dark"
              ? { fontSize: 12, color: "grey", fontFamily: "Inter-Regular" }
              : { fontSize: 12, color: "#2f2d51", fontFamily: "Inter-Regular" }
          }
        >
          Added on: {new Date(item.created_at).toLocaleDateString()}
        </Text>
        <Text
          style={
            theme === "dark"
              ? { fontSize: 13, color: "grey", fontFamily: "Inter-Regular" }
              : { fontSize: 13, color: "#2f2d51", fontFamily: "Inter-Regular" }
          }
        />
        <View
          style={{
            flexDirection: "row",

            alignItems: "center",
            gap: 5,
            // justifyContent: "space-between",
          }}
        >
          <FontAwesome5
            name="check-circle"
            size={20}
            color={theme === "dark" ? "#A5C9FF" : "#2f2d51"}
          />
          <Text
            style={
              theme === "dark"
                ? {
                    color: "#A5C9FF",
                    fontSize: 13,
                    fontFamily: "Inter-Regular",
                  }
                : {
                    color: "#2f2d51",
                    fontSize: 13,
                    fontFamily: "Inter-Regular",
                  }
            }
          >
            {existingAnswers.length} answers
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(QUESTION_SCREEN, {
            title: item.title,
            question_id: item.id,
          })
        }
        style={{
          backgroundColor: theme === "dark" ? "#212121" : "#2f2d51",
          padding: 12,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={
            theme === "dark"
              ? {
                  color: "#A5C9FF",
                  fontSize: 14,
                  fontFamily: "Inter-Medium",
                }
              : {
                  color: "white",
                  fontSize: 14,
                  fontFamily: "Inter-Bold",
                }
          }
        >
          View
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default QuestionInfo;

const styles = StyleSheet.create({
  questionDark: {
    borderRadius: 15,
    padding: 10,
    borderColor: "grey",
    borderWidth: 1,
    gap: 10,
    marginBottom: 15,
  },
  question: {
    backgroundColor: "#ffcd8b",
    borderRadius: 15,
    padding: 10,
    gap: 10,
    marginBottom: 15,
  },
});
