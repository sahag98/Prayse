import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSupabase } from "../context/useSupabase";
import { AntDesign } from "@expo/vector-icons";

const QuestionItem = ({ theme, question }) => {
  const [answersArray, setAnswersArray] = useState([]);
  const { supabase } = useSupabase();

  useEffect(() => {
    fetchAnswers();
  }, [question._id]);

  async function fetchAnswers() {
    const { data: answers, error: answersError } = await supabase
      .from("answers")
      .select("*, profiles(*)")
      .eq("question_id", question._id)
      .order("id", { ascending: false });
    setAnswersArray(answers);

    if (answersError) {
      console.log(answersError);
    }
  }

  function convertDigitIn(str) {
    if (str) {
      let newStr = str.replace(/-/g, "/");
      return newStr.split("/").reverse().join("/");
    }
  }
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          width: "80%",

          gap: 10,
        }}
      >
        <Text style={theme == "dark" ? styles.titleDark : styles.title}>
          {question.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text
            style={
              theme == "dark"
                ? {
                    color: "white",
                    fontFamily: "Inter-Regular",
                    backgroundColor: "#212121",
                    fontSize: 12,
                    padding: 5,
                    borderRadius: 10,
                  }
                : {
                    color: "#2f2d51",
                    padding: 5,
                    fontSize: 12,
                    borderRadius: 10,
                    fontFamily: "Inter-Regular",
                  }
            }
          >
            {answersArray?.length} answers
          </Text>
          <Text
            style={
              theme == "dark"
                ? {
                    color: "#d6d6d6",
                    backgroundColor: "#212121",
                    padding: 5,
                    borderRadius: 10,
                    fontSize: 12,
                    fontFamily: "Inter-Regular",
                    alignSelf: "flex-end",
                  }
                : {
                    color: "#2f2d51",
                    fontSize: 12,
                    padding: 5,
                    borderRadius: 10,
                    fontFamily: "Inter-Regular",
                    alignSelf: "flex-end",
                  }
            }
          >
            {convertDigitIn(question?.date)}
          </Text>
        </View>
      </View>
      <View style={{}}>
        <TouchableOpacity
          style={{
            padding: 15,
            backgroundColor: "#212121",
            borderRadius: 50,
          }}
        >
          <AntDesign name="arrowright" size={24} color="#A5C9FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuestionItem;

const styles = StyleSheet.create({
  titleDark: {
    color: "white",
    fontFamily: "Inter-Medium",
    fontSize: 15,
  },
  title: {
    color: "#2f2d51",
    fontFamily: "Inter-Medium",
    fontSize: 15,
  },
});
