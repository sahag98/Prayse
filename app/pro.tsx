import React from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import {
  AntDesign,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { CREATE_THEME_SCREEN, YOUR_THEMES_SCREEN } from "@routes";
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
        <Link href="/">
          <View className="flex-row items-center justify-between gap-2">
            <AntDesign
              name="left"
              size={24}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
            <Text className="font-bold font-inter dark:text-white text-light-primary text-center text-3xl">
              Pro Features
            </Text>
          </View>
        </Link>
      </HeaderView>
      <View className="flex-row items-center gap-3">
        <Text className="font-inter text-primary dark:text-white font-medium text-lg">
          Design Customization
        </Text>
        <FontAwesome6
          name="brush"
          size={20}
          color={colorScheme === "dark" ? "white" : "#2f2d51"}
        />
      </View>
      <View className="flex-row justify-between mt-2 w-full gap-3">
        <Link asChild href={`/${CREATE_THEME_SCREEN}`}>
          <TouchableOpacity className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary">
            <AntDesign
              name="pluscircleo"
              size={24}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
            <Text className="font-inter font-medium text-lg text-light-primary dark:text-dark-primary">
              Create Theme
            </Text>
          </TouchableOpacity>
        </Link>
        <Link asChild href={`/${YOUR_THEMES_SCREEN}`}>
          <TouchableOpacity className="flex-1 p-5 gap-2 rounded-lg justify-center items-center bg-light-secondary">
            <MaterialCommunityIcons
              name="brush-variant"
              size={24}
              color={colorScheme === "dark" ? "white" : "#2f2d51"}
            />
            <Text className="font-inter font-medium text-lg text-light-primaryprimary dark:text-dark-primary">
              Your Themes
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View className="flex-row items-center mt-3 gap-3">
        <Text className="font-inter text-primary dark:text-white font-medium text-lg">
          Font Customization
        </Text>
        <FontAwesome6
          name="font"
          size={20}
          color={colorScheme === "dark" ? "white" : "#2f2d51"}
        />
      </View>
      <View className="flex-row justify-between mt-2 w-full gap-3">
        <TouchableOpacity className="flex-1 p-5 gap-2 rounded-lg justify-center items-center dark:bg-dark-secondary bg-light-secondary">
          <AntDesign
            name="pluscircleo"
            size={24}
            color={colorScheme === "dark" ? "white" : "#2f2d51"}
          />
          <Text className="font-inter font-medium text-lg text-light-primary dark:bg-dark-secondary dark:text-dark-primary">
            Create Theme
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-1 p-5 gap-2 rounded-lg justify-center items-center dark:bg-dark-secondary bg-light-secondary">
          <MaterialCommunityIcons
            name="brush-variant"
            size={24}
            color={colorScheme === "dark" ? "white" : "#2f2d51"}
          />
          <Text className="font-inter font-medium text-lg text-light-primary-primary dark:text-dark-primary">
            View Themes
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default ProScreen;

const styles = StyleSheet.create({});
