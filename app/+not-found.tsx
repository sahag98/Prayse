import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View className="flex justify-center items-center gap-2">
        <Text>Something went wrong.</Text>
        <Text>Try relaunching the app.</Text>
      </View>
    </SafeAreaView>
  );
}
