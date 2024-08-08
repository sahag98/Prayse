// @ts-nocheck
import React, { useEffect, useState } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { withSequence, withSpring } from "react-native-reanimated";
import { useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
} from "@lib/customStyles";
import { useIsFocused } from "@react-navigation/native";

import CommunityPrayers from "../components/CommunityPrayers";
import config from "../config";
import { useSupabase } from "../context/useSupabase";
import CommunityModal from "../modals/ComunityModal";
import { COMMUNITY_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

const PublicCommunityScreen = () => {
  const { currentUser, session, setNewPost, logout, supabase } = useSupabase();
  const { colorScheme } = useColorScheme();

  const actualTheme = useSelector(
    (state: { theme: { actualTheme: ActualTheme } }) => state.theme.actualTheme,
  );
  const [extended, setExtended] = useState(true);
  const [prayerModal, setPrayerModal] = useState(false);
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(true);
  const [prayers, setPrayers] = useState([]);
  const isIOS = Platform.OS === "ios";

  useEffect(() => {
    if (!isIOS) {
      setExtended(true);
    } else setExtended(extended);
  }, [extended, isIOS]);

  useEffect(() => {
    const wavingAnimation = withSpring(15, { damping: 2, stiffness: 80 });

    rotation.value = withSequence(wavingAnimation);
    getUserPrayers();
    getPermission();
    getPrayers();
  }, [isFocused]);

  async function getPrayers() {
    //prayers for production
    //prayers_test for testing
    const { data: prayers } = await supabase
      .from("prayers")
      .select("*, profiles(*)")
      .order("id", { ascending: false });
    setPrayers(prayers);
  }

  async function getUserPrayers() {
    //prayers for production
    //prayers_test for testing
    const { data: prayers } = await supabase
      .from("prayers")
      .select("*")
      .eq("user_id", currentUser?.id)
      .order("id", { ascending: false });
    setUserPrayers(prayers);
  }

  async function sendToken(expoPushToken) {
    await supabase
      .from("profiles")
      .update({ expoToken: expoPushToken })
      .eq("id", currentUser?.id)
      .select();
  }

  async function getPermission() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();

        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("not granted");
        return;
      }
      console.log("permission granted");
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: config.projectId,
        })
      ).data;
    } else {
      console.log("Must use physical device for Push Notifications");
    }
    sendToken(token);
  }
  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background"
    >
      <HeaderView>
        <View className="flex-row items-center gap-3">
          <Link href={`/${COMMUNITY_SCREEN}`}>
            <AntDesign
              name="left"
              size={24}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </Link>
          <HeaderTitle className="font-inter font-bold text-light-primary dark:text-dark-primary">
            Public Prayers
          </HeaderTitle>
        </View>
      </HeaderView>

      <View className="flex-1 mt-3 relative">
        <CommunityModal
          getUserPrayers={getUserPrayers}
          actualTheme={actualTheme}
          colorScheme={colorScheme}
          getPrayers={getPrayers}
          logout={logout}
          supabase={supabase}
          session={session}
          modalVisible={prayerModal}
          user={currentUser}
          setModalVisible={setPrayerModal}
        />
        <CommunityPrayers
          session={session}
          getPrayers={getPrayers}
          colorScheme={colorScheme}
          setNewPost={setNewPost}
          visible={visible}
          setVisible={setVisible}
          prayers={prayers}
          setPrayers={setPrayers}
          actualTheme={actualTheme}
          supabase={supabase}
          currentUser={currentUser}
        />
      </View>
      <TouchableOpacity
        style={getPrimaryBackgroundColorStyle(actualTheme)}
        onPress={() => setPrayerModal(true)}
        className="dark:bg-dark-accent flex-row items-center justify-center gap-2 bg-light-primary p-5 absolute bottom-5 right-5 rounded-xl shadow-md shadow-gray-300 dark:shadow-none"
      >
        <AntDesign
          name="plus"
          size={24}
          color={
            actualTheme && actualTheme.PrimaryTxt
              ? actualTheme.PrimaryTxt
              : colorScheme === "dark"
                ? "#121212"
                : "white"
          }
        />
        <Text
          style={getPrimaryTextColorStyle(actualTheme)}
          className="font-inter font-bold text-lg text-light-background dark:text-dark-background"
        >
          Prayer
        </Text>
      </TouchableOpacity>
    </Container>
  );
};

export default PublicCommunityScreen;
