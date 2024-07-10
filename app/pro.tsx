import React from "react";
import { useColorScheme } from "nativewind";
import { StyleSheet, Text, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Container, HeaderView } from "@styles/appStyles";
const ProScreen = () => {
  const { colorScheme } = useColorScheme();
  return (
    <Container
      style={
        colorScheme == "dark"
          ? { backgroundColor: "#121212" }
          : { backgroundColor: "#F2F7FF" }
      }
    >
      <HeaderView>
        <View className="flex-row items-center gap-2">
          <AntDesign name="left" size={24} color="black" />
          <Text className="font-bold font-inter dark:text-white text-[#2f2d51] text-2xl">
            Pro Features
          </Text>
        </View>
      </HeaderView>

      <Text className="font-inter font-medium text-lg">
        Design Customization
      </Text>
    </Container>
  );
};

export default ProScreen;

const styles = StyleSheet.create({});
