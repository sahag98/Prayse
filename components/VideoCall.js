import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
const VideoCall = () => {
  const [sound, setSound] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  console.log("response: ", permissionResponse);
  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/audio/pad1.mp3")
    );
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    setSound(sound);
    console.log("Playing Sound");
    await sound.playAsync();
  }

  async function pauseSound() {
    await sound.pauseAsync();
  }

  async function checkAudioPermission() {
    const { status, granted } = await requestPermission();
    console.log(status, granted);
  }

  useEffect(() => {
    checkAudioPermission();
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View
      style={{
        flex: 1,

        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        onPress={playSound}
        style={{
          borderWidth: 1,
          borderColor: "#2f2d51",
          alignItems: "center",
          padding: 10,
          gap: 10,
          width: "75%",
          borderRadius: 10,
        }}
      >
        <AntDesign name="pluscircle" size={60} color="#2f2d51" />
        <Text
          style={{
            fontFamily: "Inter-Bold",
            textAlign: "center",
            color: "#2f2d51",
          }}
        >
          Play Pad
        </Text>
      </TouchableOpacity>
      <Text onPress={pauseSound}>Pause</Text>
    </View>
  );
};

export default VideoCall;

const styles = StyleSheet.create({});
