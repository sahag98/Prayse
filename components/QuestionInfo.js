import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSupabase } from "../context/useSupabase";
import { FontAwesome5 } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
const QuestionInfo = ({ item, theme }) => {
  const navigation = useNavigation();
  console.log(item.question._createdAt.toLocaleString());
  const { currentUser, supabase, answers, setNewAnswer } = useSupabase();

  return (
    <TouchableOpacity
      style={theme == "dark" ? styles.questionDark : styles.question}
    >
      <Text
        style={
          theme == "dark"
            ? { fontSize: 16, color: "white", fontFamily: "Inter-Medium" }
            : { fontSize: 16, color: "#2f2d51", fontFamily: "Inter-Medium" }
        }
      >
        {item.question.title}
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
            theme == "dark"
              ? { fontSize: 13, color: "grey", fontFamily: "Inter-Regular" }
              : { fontSize: 13, color: "#2f2d51", fontFamily: "Inter-Regular" }
          }
        >
          Added on: {new Date(item.question._createdAt).toLocaleDateString()}
        </Text>
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
            color={theme == "dark" ? "#A5C9FF" : "#2f2d51"}
          />
          <Text
            style={
              theme == "dark"
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
            {item.answers.length} answers
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Question", {
            item: item,
          })
        }
        style={{
          backgroundColor: theme == "dark" ? "#212121" : "#2f2d51",
          padding: 12,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
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
