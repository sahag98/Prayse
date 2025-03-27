import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "@node_modules/react-redux/es";
import { ActualTheme } from "../types/reduxTypes";
import { useColorScheme } from "nativewind";
import { Image } from "expo-image";
import useStore from "@hooks/store";
import { update } from "@constants/update";
import UpdateItem from "@components/update-item";
import { UpdateItemType } from "../types/appTypes";
import { router } from "@node_modules/expo-router/build";
import { WELCOME_SCREEN } from "@routes";

const NewUpdate = () => {
  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );

  const { handleShowUpdate } = useStore();

  const { colorScheme } = useColorScheme();
  return (
    <SafeAreaView
      style={[
        {
          backgroundColor: colorScheme === "dark" ? "#121212" : "#f2f7ff",
          flex: 1,
          padding: 10,
          position: "relative",
        },
      ]}
    >
      <View className="gap-3 mt-10 mb-3">
        <Image
          source={require("../assets/prayse-logo.png")}
          style={{
            width: 100,
            borderRadius: 20,
            alignSelf: "center",
            aspectRatio: 1 / 1,
            marginBottom: 20,
          }}
        />
        <Text className="font-inter-bold text-3xl text-light-primary dark:text-dark-primary">
          New Update v10.3.0
        </Text>
        <Text className="font-inter-semibold text-2xl text-light-primary dark:text-dark-primary">
          What's New 🙌
        </Text>
      </View>
      <FlatList
        data={update}
        contentContainerStyle={{ flexGrow: 1, gap: 10 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: any) => item.title}
        renderItem={({ item }: { item: UpdateItemType }) => (
          <UpdateItem item={item} />
        )}
      />

      <Pressable
        onPress={() => {
          handleShowUpdate();
          router.push(WELCOME_SCREEN);
        }}
        className="mt-auto self-center w-full items-center justify-center bg-light-primary dark:bg-dark-accent p-4 rounded-lg"
      >
        <Text className="font-inter-semibold text-light-background text-lg dark:text-dark-background">
          Got it!
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default NewUpdate;

const styles = StyleSheet.create({});
