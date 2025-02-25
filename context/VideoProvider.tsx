import {
  StreamVideoClient,
  StreamVideo,
} from "@stream-io/video-react-native-sdk";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { tokenProvider } from "@lib/utils";
import { useSupabase } from "./useSupabase";

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;

export default function VideoProvider({ children }: PropsWithChildren) {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null,
  );
  //@ts-expect-error
  const { currentUser, supabase } = useSupabase();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const initVideoClient = async () => {
      const user = {
        id: currentUser.id,
        name: currentUser.full_name,
        image: supabase.storage
          .from("avatars")
          .getPublicUrl(currentUser.avatar_url).data.publicUrl,
      };

      console.log("user: ", user);

      const client = new StreamVideoClient({
        apiKey,
        user,
        tokenProvider: () => tokenProvider(supabase),
      });
      setVideoClient(client);
    };

    initVideoClient();

    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [currentUser?.id]);

  if (!videoClient) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
