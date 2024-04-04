import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Container } from "../styles/appStyles";
import { useSelector } from "react-redux";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";

const Checklist = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  return (
    <Container
      style={
        theme == "dark"
          ? {
              backgroundColor: "#121212",

              // justifyContent: "center",
              // alignItems: "center",
            }
          : {
              backgroundColor: "#F2F7FF",

              // justifyContent: "center",
              // alignItems: "center",
            }
      }
    >
      <View
        style={{
          flexDirection: "row",

          width: "100%",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => {
            navigation.navigate("Folder");
          }}
        >
          <Ionicons
            name="chevron-back"
            size={35}
            color={theme == "light" ? "#2f2d51" : "white"}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: "Inter-Bold",
            fontSize: 20,
            color: theme == "dark" ? "white" : "#2f2d51",
          }}
        >
          Prayer Checklist
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: theme == "dark" ? "white" : "#2f2d51" }}>
          This is where the user will be able to see all his prayers and be able
          to delete some or mark some as answered.
        </Text>
      </View>
    </Container>
  );
};

export default Checklist;

const styles = StyleSheet.create({});
