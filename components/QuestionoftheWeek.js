import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";

import { useSupabase } from "../context/useSupabase";

const QuestionoftheWeek = ({ theme }) => {
  const navigation = useNavigation();
  const { latestQuestion } = useSupabase();

  return (
    <View
      style={{
        backgroundColor: theme === "dark" ? "#212121" : "white",
        marginBottom: 15,
        width: "100%",
        padding: 15,
        borderRadius: 10,
        gap: 15,
      }}
    >
      {!latestQuestion ? (
        <View style={{ gap: 15 }}>
          <Text
            style={{
              color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
              fontFamily: "Inter-Medium",
            }}
          >
            Question of the Week
          </Text>
          <ActivityIndicator />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Question", {
              title: latestQuestion?.title,
              question_id: latestQuestion?.id,
            })
          }
          style={{
            backgroundColor: theme === "dark" ? "#212121" : "white",

            width: "100%",

            borderRadius: 10,
            gap: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: theme === "dark" ? "#d2d2d2" : "#2f2d51",
                fontFamily: "Inter-Medium",
              }}
            >
              Question of the Week
            </Text>
            <Text
              style={
                theme === "dark"
                  ? {
                      color: "#ff3333",
                      fontSize: 13,
                      fontFamily: "Inter-Regular",
                    }
                  : { color: "red", fontSize: 13, fontFamily: "Inter-Regular" }
              }
            >
              New
            </Text>
          </View>
          <Text
            style={{
              color: theme === "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Bold",
              lineHeight: 24,
              fontSize: 18,
            }}
          >
            {latestQuestion?.title}
          </Text>
          <Text
            style={{
              color: theme === "dark" ? "#a5c9ff" : "#2f2d51",
              fontFamily: "Inter-Medium",
              textDecorationLine: "underline",
              lineHeight: 24,
              fontSize: 13,
            }}
          >
            Click here to answer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default QuestionoftheWeek;
