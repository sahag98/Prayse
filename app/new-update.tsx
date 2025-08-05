import { Pressable, ScrollView, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Image } from "expo-image";
import useStore from "@hooks/store";
import { router } from "expo-router";
import { FOLDER_SCREEN } from "@routes";

const NewUpdate = () => {
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
      <View className="gap-4 mt-10 mb-4">
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
        <Text className="font-inter-bold text-center text-3xl text-light-primary dark:text-dark-primary">
          v11 🙌
        </Text>
        <Text className="font-inter-semibold text-2xl text-light-primary dark:text-dark-primary">
          What's new:
        </Text>
      </View>
      <ScrollView
        className="gap-4"
        contentContainerClassName="gap-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
          Dear Prayse users, we’re excited to introduce Version 11! In this
          update, we took a step back and focused on the core features that make
          Prayse meaningful and enjoyable to use.
        </Text>
        <Text className="font-inter-medium text-light-primary dark:text-dark-primary">
          The app will look a bit different, but it's now much simpler and
          easier to use in your daily life.
        </Text>
        <Text className="font-inter-medium bg-white dark:bg-dark-secondary p-2 rounded-xl text-light-primary dark:text-dark-primary">
          "I truly hope you enjoy this simpler version of Prayse. Praying for
          you!" – Sahag
        </Text>
      </ScrollView>
      {/* <FlatList
        data={update}
        contentContainerStyle={{ flexGrow: 1, gap: 10 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: any) => item.title}
        renderItem={({ item }: { item: UpdateItemType }) => (
          <UpdateItem item={item} />
        )}
      /> */}

      <Pressable
        onPress={() => {
          handleShowUpdate();
          router.push(FOLDER_SCREEN);
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
