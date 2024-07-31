// @ts-nocheck
import React from "react";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import { useSelector } from "react-redux";

import { getMainBackgroundColorStyle } from "@lib/customStyles";

import Folder from "../../components/Folder";
import { Container } from "../../styles/appStyles";

export default function MainScreen() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  return (
    <>
      <Container
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background dark:bg-dark-background"
      >
        <Folder colorScheme={colorScheme} navigation={navigation} />
      </Container>
    </>
  );
}
