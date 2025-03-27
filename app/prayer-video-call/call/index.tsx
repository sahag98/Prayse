import { useSupabase } from "@context/useSupabase";
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

  const { callGroup, setCallGroup } = useSupabase();

  useEffect(() => {
    if (!call) {
      router.push(COMMUNITY_SCREEN);
      if (callGroup) {
        setCallGroup(null);
      }
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
