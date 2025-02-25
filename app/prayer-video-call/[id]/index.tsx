import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Container } from "@styles/appStyles";
import { getMainBackgroundColorStyle } from "@lib/customStyles";
import { useSelector } from "react-redux";
import { ActualTheme } from "../../../types/reduxTypes";
import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import { useLocalSearchParams } from "expo-router";
import { useSupabase } from "@context/useSupabase";
import * as Crypto from "expo-crypto";
import { useColorScheme } from "nativewind";
const GroupVideoCall = () => {
  const { colorScheme } = useColorScheme();
  //@ts-ignore
  const { supabase } = useSupabase();

  const { id } = useLocalSearchParams();

  console.log("id: ", id);

  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const videoClient = useStreamVideoClient();

  useEffect(() => {
    if (!videoClient) return;

    async function setupCall() {
      const { data } = await supabase
        .from("members")
        .select("*,profiles(id,full_name, avatar_url, expoToken)")
        .eq("group_id", id);

      const members = Object.values(data).map((member: any) => ({
        user_id: member.user_id,
      }));

      if (videoClient) {
        const call = videoClient.call("default", id as string); // Use group ID as call ID
        call.join({ create: true });
        // await call.getOrCreate({
        //   ring: false, // Don't ring others
        //   data: { members },
        // });
      }
    }

    setupCall();
  }, [id]);

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      //@ts-ignore
      className="dark:bg-[#121212] justify-center items-center bg-[#f2f7ff] flex-1"
    >
      <ActivityIndicator
        size="large"
        color={
          actualTheme && actualTheme.MainTxt
            ? actualTheme.MainTxt
            : colorScheme == "dark"
              ? "white"
              : "#2f2d51"
        }
      />
    </Container>
  );
};

export default GroupVideoCall;

const styles = StyleSheet.create({});
