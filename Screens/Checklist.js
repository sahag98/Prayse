import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Container } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
const Checklist = ({ navigation }) => {
  const theme = useSelector((state) => state.user.theme);
  const prayers = useSelector((state) => state.prayer.prayer);

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
              alignItems: "center",
            }
      }
    >
      <View
        style={{ flexDirection: "row", width: "100%", alignItems: "center" }}
      >
        <TouchableOpacity
          style={{ marginRight: 10 }}
          onPress={() => navigation.navigate("Prayer")}
        >
          <Ionicons
            name="chevron-back"
            size={35}
            color={theme == "light" ? "#2f2d51" : "white"}
          />
        </TouchableOpacity>
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
        <TouchableOpacity
          style={{ backgroundColor: "#b7d3ff", padding: 10, borderRadius: 100 }}
        >
          <MaterialCommunityIcons name="arrow-left" size={40} color="#2f2d51" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("PrayerRoom")}
          style={{ backgroundColor: "#2f2d51", padding: 10, borderRadius: 100 }}
        >
          <MaterialCommunityIcons name="hands-pray" size={55} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: "#b7d3ff", padding: 10, borderRadius: 100 }}
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={40}
            color="#2f2d51"
          />
        </TouchableOpacity>
      </View>
      {/* <StatusBar hidden /> */}
    </Container>
  );
};

export default Checklist;

const styles = StyleSheet.create({});
