import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";

import AsyncStorage from "@react-native-async-storage/async-storage";

import Folder from "../components/Folder";
import useIsReady from "../hooks/useIsReady";
import { Container } from "../styles/appStyles";

export default function MainScreen() {
  const navigation = useNavigation();
  const theme = useSelector((state) => state.user.theme);
  const isReady = useIsReady();
  const [todos, setTodos] = useState([]);

  const BusyIndicator = () => {
    return (
      <View
        style={
          theme == "dark"
            ? { backgroundColor: "#121212", flex: 1, justifyContent: "center" }
            : { backgroundColor: "#F2F7FF", flex: 1, justifyContent: "center" }
        }
      >
        <ActivityIndicator
          size="large"
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </View>
    );
  };

  const loadTodos = () => {
    AsyncStorage.getItem("storedTodos")
      .then((data) => {
        if (data !== null) {
          setTodos(JSON.parse(data));
        }
      })
      .catch((error) => console.log(error));
  };

  if (!isReady) {
    loadTodos();
    return <BusyIndicator />;
  }

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
        <Folder todos={todos} setTodos={setTodos} navigation={navigation} />
      </Container>
    </>
  );
}
