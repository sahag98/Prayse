import React from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View className="flex flex-row items-center gap-2 text-slate-500">
        <Text>Index</Text>
        <Link href="welcome">
          <Text>Welcome</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}
