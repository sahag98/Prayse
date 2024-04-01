import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Container, RoomContainer } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { Video, ResizeMode, Audio } from "expo-av";
import gradient from "../assets/video/gradient.mp4";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Gpad from "../assets/audio/Gpad.mp3";
import Bpad from "../assets/audio/Bpad.mp3";
import Cpad from "../assets/audio/Cpad.mp3";
import Ebpad from "../assets/audio/Ebpad.mp3";
import Constants from "expo-constants";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const PrayerRoom = ({ navigation }) => {
  const statusBarHeight = Constants.statusBarHeight;
  const theme = useSelector((state) => state.user.theme);
  const prayers = useSelector((state) => state.prayer.prayer);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const isFocused = useIsFocused();
  const [sound, setSound] = useState();
  const [isPlayingSound, setIsPlayingSound] = useState(true);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const insets = useSafeAreaInsets();

  async function playSound(soundFile) {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    setSound(sound);

    await sound.playAsync();
  }

  async function pauseSound() {
    if (isPlayingSound) {
      await sound.pauseAsync();
      setIsPlayingSound(false);
    } else {
      await sound.playAsync();
      setIsPlayingSound(true);
    }
  }

  const loadAndPlayRandomAudio = () => {
    const audioFiles = [Gpad, Bpad, Cpad, Ebpad];
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const randomAudioFile = audioFiles[randomIndex];

    console.log(randomAudioFile);
    playSound(randomAudioFile);
  };

  async function checkAudioPermission() {
    const { status, granted } = await requestPermission();
    console.log(status, granted);
  }

  useEffect(() => {
    console.log("sound");
    checkAudioPermission();
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound, isFocused]);

  useEffect(() => {
    console.log("in use effect");
    if (video.current) {
      video.current.playAsync();
      loadAndPlayRandomAudio();
    }
  }, [isFocused]);

  return (
    <RoomContainer
      style={
        theme == "dark"
          ? {
              backgroundColor: "#121212",
              // justifyContent: "center",
              alignItems: "center",
            }
          : {
              backgroundColor: "#F2F7FF",
              paddingTop: 0,
              // justifyContent: "center",
              alignItems: "center",
            }
      }
    >
      {/* <Text onPress={pauseSound}>Pause Sound</Text> */}
      <Video
        ref={video}
        style={styles.video}
        source={gradient}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 15,
            zIndex: 88,
            width: "100%",
            paddingTop: statusBarHeight,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ marginRight: 10 }}
              onPress={() => {
                navigation.navigate("Checklist");
                pauseSound();
              }}
            >
              <Ionicons
                name="chevron-back"
                size={35}
                color={theme == "light" ? "#2f2d51" : "white"}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: 20,
                color: "#2f2d51",
              }}
            >
              Prayer Room
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={pauseSound}
              style={{
                backgroundColor: "#b7d3ff",
                padding: 5,
                borderRadius: 100,
              }}
            >
              <MaterialCommunityIcons name="music" size={50} color="#2f2d51" />
            </TouchableOpacity>
            <MaterialCommunityIcons
              // style={{ paddingTop: 10 }}
              name={isPlayingSound ? "volume-high" : "volume-off"}
              size={24}
              color="black"
            />
          </View>
        </View>
      </Video>
      <StatusBar hidden />
    </RoomContainer>
  );
};

export default PrayerRoom;

const styles = StyleSheet.create({
  video: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
});
