import React from "react";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { useSelector } from "react-redux";

import { getMainBackgroundColorStyle } from "@lib/customStyles";

import Folder from "../../components/Folder";
import { Container } from "../../styles/appStyles";
import { ActualTheme } from "../../types/reduxTypes";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MainScreen() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  return (
    <SafeAreaView
      edges={["top"]}
      // style={getMainBackgroundColorStyle(actualTheme)}
      style={{
        backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
      }}
    >
      {/* <Text>Hey</Text> */}
      <Folder colorScheme={colorScheme!} navigation={navigation} />
    </SafeAreaView>
  );
}
