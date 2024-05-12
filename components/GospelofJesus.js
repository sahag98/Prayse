import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const GospelofJesus = ({ theme }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Gospel")}
      style={{
        backgroundColor: theme == "dark" ? "#212121" : "white",
        marginBottom: 15,
        width: "100%",
        padding: 15,
        borderRadius: 10,
        gap: 15,
      }}
    >
      <Text
        style={{
          color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
          fontFamily: "Inter-Medium",
        }}
      >
        Gospel of Jesus
      </Text>
      <Text
        style={{
          color: theme == "dark" ? "white" : "#2f2d51",
          fontFamily: "Inter-Bold",
          lineHeight: 24,
          fontSize: 18,
        }}
      >
        How can someone receive Jesus and get saved?
      </Text>
      <Text
        style={{
          color: theme == "dark" ? "#a5c9ff" : "#2f2d51",
          fontFamily: "Inter-Bold",
          textDecorationLine: "underline",
          lineHeight: 24,
          fontSize: 14,
        }}
      >
        Click here to learn more
      </Text>

      {/* <Text
        style={{
          alignSelf: "flex-end",
          textDecorationLine: "underline",
          color: theme == "dark" ? "#a5c9ff" : "#4c4882",
          fontFamily: "Inter-Bold",
          fontSize: 14,
        }}
      >
        Check it out!
      </Text> */}
    </TouchableOpacity>
  );
};

export default GospelofJesus;

const styles = StyleSheet.create({});