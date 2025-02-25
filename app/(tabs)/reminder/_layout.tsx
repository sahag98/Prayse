import React from "react";
import { Stack } from "expo-router";

export default function ReminderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="[id]" />
      <Stack.Screen name="index" options={{ animation: "ios_from_left" }} />
    </Stack>
  );
}
