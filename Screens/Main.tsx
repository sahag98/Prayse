import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Folder from "../components/Folder";
import useIsReady from "../hooks/useIsReady";
import { Container } from "../styles/appStyles";
export default function Main({ navigation }: { navigation: any }) {
  const theme = useSelector((state: any) => state.user.theme);
  const [todos, setTodos] = useState([]);

  return (
    <>
      <StatusBar style={theme == "dark" ? "light" : "dark"} />
      <Container
        style={
          theme == "dark"
            ? { backgroundColor: "#121212" }
            : theme == "BlackWhite"
              ? { backgroundColor: "white" }
              : { backgroundColor: "#F2F7FF" }
        }
      >
        <Folder todos={todos} navigation={navigation} />
      </Container>
    </>
  );
}
