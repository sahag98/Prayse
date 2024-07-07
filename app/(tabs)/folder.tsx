// @ts-nocheck
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { useSelector } from "react-redux";

import Folder from "../../components/Folder";
import useIsReady from "../../hooks/useIsReady";
import { Container } from "../../styles/appStyles";

export default function MainScreen() {
  const navigation = useNavigation();
  const theme = useSelector((state: any) => state.user.theme);
  const isReady = useIsReady();
  const [todos, setTodos] = useState([]);
  const { colorScheme } = useColorScheme();
  console.log(colorScheme);
  return (
    <>
      <Container
        style={
          colorScheme == "dark"
            ? { backgroundColor: "#121212" }
            : { backgroundColor: "#F2F7FF" }
        }
      >
        <Folder
          colorScheme={colorScheme}
          todos={todos}
          navigation={navigation}
        />
      </Container>
    </>
  );
}
