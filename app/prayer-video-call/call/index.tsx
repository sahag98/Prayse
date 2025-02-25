import { COMMUNITY_SCREEN, WELCOME_SCREEN } from "@routes";
import {
  StreamCall,
  RingingCallContent,
  useCalls,
  CallContent,
} from "@stream-io/video-react-native-sdk";
import { router } from "expo-router";
import React, { useEffect } from "react";

export default function CallScreen() {
  const calls = useCalls();
  const call = calls[0];

  useEffect(() => {
    if (!call) {
      router.push(COMMUNITY_SCREEN);
    }
  }, [call]);

  if (!call) {
    return null;
  }

  return (
    <StreamCall call={call}>
      <CallContent onHangupCallHandler={() => call.leave()} />
    </StreamCall>
  );
}
