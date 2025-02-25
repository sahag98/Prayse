import React from "react";
import { Stack } from "expo-router";
import VideoProvider from "@context/VideoProvider";
import CallProvider from "@context/CallProvider";

export default function VideoLayout() {
  return (
    <VideoProvider>
      <CallProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ animation: "ios_from_left" }} />
        </Stack>
      </CallProvider>
    </VideoProvider>
  );
}
