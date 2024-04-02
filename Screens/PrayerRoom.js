import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Container, RoomContainer } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { Video, ResizeMode, Audio } from "expo-av";
import gradient from "../assets/video/gradient.mp4";

import Gpad from "../assets/audio/Gpad.mp3";
import Bpad from "../assets/audio/Bpad.mp3";
import Cpad from "../assets/audio/Cpad.mp3";
import Ebpad from "../assets/audio/Ebpad.mp3";
import Constants from "expo-constants";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const PrayerRoom = ({ navigation, route }) => {
  const statusBarHeight = Constants.statusBarHeight;
  const theme = useSelector((state) => state.user.theme);
  const prayers = useSelector((state) => state.prayer.prayer);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const isFocused = useIsFocused();
  const [sound, setSound] = useState();
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function playSound(soundFile) {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    setSound(sound);
    setIsPlayingSound(true);
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
  }

  useEffect(() => {
    checkAudioPermission();

    return sound
      ? () => {
          console.log("unloading sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function loadVideo() {
    await video.current.loadAsync(gradient);
    await video.current.playAsync();
  }

  useEffect(() => {
    video.current.playAsync();
    // loadAndPlayRandomAudio();
  }, [isFocused]);

  if (!route.params.prayer) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "Inter-Medium",
            color: theme == "dark" ? "white" : "#2f2d51",
          }}
        >
          Something went wrong...
        </Text>
        <Text
          style={{
            fontFamily: "Inter-Medium",
            color: theme == "dark" ? "white" : "#2f2d51",
          }}
        >
          Restart your app.
        </Text>
      </View>
    );
  }

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
        isLooping={true}
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
                sound?.pauseAsync();
                setIsPlayingSound(false);
                // video.current.pauseAsync();
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
          <View style={{ alignItems: "center", gap: 5 }}>
            <TouchableOpacity
              onPress={isPlayingSound ? pauseSound : loadAndPlayRandomAudio}
              style={{
                backgroundColor: "#2f2d51",
                padding: 10,
                borderRadius: 100,
              }}
            >
              <MaterialCommunityIcons
                name={isPlayingSound ? "volume-high" : "volume-off"}
                size={40}
                color="#b7d3ff"
              />
            </TouchableOpacity>
            <Text style={{ fontFamily: "Inter-Bold", color: "#2f2d51" }}>
              {isPlayingSound ? "Disable" : "Enable"} sound
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            padding: 15,
            justifyContent: "center",
            gap: 20,

            zIndex: 99,
            alignItems: "center",
          }}
        >
          <Text
            style={
              theme == "dark"
                ? [styles.title, { color: "white", fontFamily: "Inter-Bold" }]
                : [styles.title, { fontFamily: "Inter-Bold" }]
            }
          >
            Get Ready to Pray
          </Text>
          <Text
            style={
              theme == "dark"
                ? [styles.title, { color: "white" }]
                : styles.title
            }
          >
            {route?.params?.prayer?.prayer}
          </Text>

          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#2f2d51",
              borderRadius: 10,
              flexDirection: "row",
              gap: 10,
              padding: 15,
            }}
          >
            <Text
              style={{ color: "white", fontFamily: "Inter-Bold", fontSize: 17 }}
            >
              Amen
            </Text>
            <MaterialCommunityIcons name="hands-pray" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Video>
      <StatusBar hidden />
    </RoomContainer>
  );
};

export default PrayerRoom;

const styles = StyleSheet.create({
  title: {
    color: "#2f2d51",
    fontSize: 20,
    fontFamily: "Inter-Medium",
    letterSpacing: 1.3,
    marginVertical: 5,
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
  },
});
