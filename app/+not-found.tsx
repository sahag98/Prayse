import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View className="flex flex-row items-center gap-2">
        <Text>Not found</Text>
      </View>
    </SafeAreaView>
  );
}
