import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Container } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const Checklist = () => {
  const theme = useSelector((state) => state.user.theme);
  const prayers = useSelector((state) => state.prayer.prayer);

  return (
    <Container
      style={
        theme == "dark"
          ? {
              backgroundColor: "#121212",
              // justifyContent: "center",
              alignItems: "center",
            }
          : {
              backgroundColor: "#F2F7FF",
              // justifyContent: "center",
              alignItems: "center",
            }
      }
    >
      <View>
        <Text
          style={{ fontFamily: "Inter-Bold", fontSize: 20, color: "#2f2d51" }}
        >
          Prayer Checklist
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          bottom: 40,
          width: "100%",
        }}
      >
        <View
          style={{ backgroundColor: "#b7d3ff", padding: 10, borderRadius: 100 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={40} color="#2f2d51" />
        </View>
        <View
          style={{ backgroundColor: "#2f2d51", padding: 10, borderRadius: 100 }}
        >
          <MaterialCommunityIcons name="hands-pray" size={55} color="white" />
        </View>
        <View
          style={{ backgroundColor: "#b7d3ff", padding: 10, borderRadius: 100 }}
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={40}
            color="#2f2d51"
          />
        </View>
      </View>
      {/* <StatusBar hidden /> */}
    </Container>
  );
};

export default Checklist;

const styles = StyleSheet.create({});
