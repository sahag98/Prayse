import {
  CallContent,
  CallControls,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
  useStreamVideoClient,
} from "@stream-io/video-react-native-sdk";
import React, { useEffect, useState } from "react";

import { StyleSheet, Text, View } from "react-native";
import { useSupabase } from "@context/useSupabase";
import VideoProvider from "@context/VideoProvider";
import CallProvider from "@context/CallProvider";
import PrayerCall from "@components/prayer-call";

const PrayerVideoCall = () => {
  return (
    <VideoProvider>
      <CallProvider>
        <PrayerCall />
      </CallProvider>
    </VideoProvider>
  );
};

export default PrayerVideoCall;

const styles = StyleSheet.create({});
