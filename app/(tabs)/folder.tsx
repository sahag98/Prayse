import React from "react";
import { useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";

import Folder from "../../components/Folder";

import { SafeAreaView } from "react-native-safe-area-context";

export default function MainScreen() {
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
      }}
    >
      {/* <Text>Hey</Text> */}
      <Folder colorScheme={colorScheme!} navigation={navigation} />
    </SafeAreaView>
  );
}
