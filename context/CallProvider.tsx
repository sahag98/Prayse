import { useCalls } from "@stream-io/video-react-native-sdk";
import { router, useSegments } from "expo-router";
import React, { PropsWithChildren, useEffect } from "react";
import { Pressable, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CallProvider({ children }: PropsWithChildren) {
  const calls = useCalls();
  const call = calls[0];

  const { top } = useSafeAreaInsets();
  const segments = useSegments();
  //@ts-expect-error
  const isOnCallScreen = segments[1] === "call";

  useEffect(() => {
    if (!call) {
      return;
    }

    console.log("isoncallscreen: ", isOnCallScreen);
    console.log("Custom Data: ", call.state.custom);
    if (!isOnCallScreen) {
      console.log("HEREEE");
      router.push(`prayer-video-call/call`);
    }
  }, [call, isOnCallScreen]);

  return <>{children}</>;
}
