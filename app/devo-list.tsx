// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import { useSelector } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from "@react-navigation/native";
import { ActualTheme } from "@types/reduxTypes";

import tbf from "../assets/tbf-logo.jpg";
import DevoItem from "../components/DevoItem";
import config from "../config";
import { useSupabase } from "../context/useSupabase";
import useIsReady from "../hooks/useIsReady";
import { client } from "../lib/client";
import { COMMUNITY_SCREEN, MORE_SCREEN } from "../routes";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

import "react-native-url-polyfill/auto";
const DevoListScreen = () => {
  const navigation = useNavigation();
  const routeParams = useLocalSearchParams();
  const isFocused = useIsFocused();
  const theme = useSelector((state) => state.user.theme);
  const isReady = useIsReady();
  const [devotionals, setDevotionals] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [connected, setConnected] = useState(false);
  const [thought, setThought] = useState("");
  const {
    isLoggedIn,
    currentUser,
    refreshReflections,
    setRefreshReflections,
    supabase,
  } = useSupabase();
  const [likesArray, setLikesArray] = useState([]);
  const [reflectionsArray, setReflectionsArray] = useState([]);
  const [channel, setChannel] = useState([]);

  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();
  useEffect(() => {
    loadDevotionals();
  }, [isFocused]);

  const createTwoButtonAlert = () =>
    Alert.alert("Not Signed In", "You need to be signed in order to like.", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Sign in",
        onPress: () => navigation.navigate(COMMUNITY_SCREEN),
      },
    ]);

  const fetchReflections = async (title) => {
    const { data, error } = await supabase
      .from("reflections")
      .select("*, profiles(full_name,avatar_url)")
      .eq("devo_title", title);
    setReflectionsArray(data);
    setRefreshReflections(false);
  };

  const loadDevotionals = () => {
    const query = '*[_type=="devotional"]';
    client
      .fetch(query)
      .then((data) => {
        setRefresh(false);
        setDevotionals(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  NetInfo.fetch().then((state) => {
    setConnected(state.isConnected);
  });

  async function insertLike(title) {
    if (!isLoggedIn) {
      createTwoButtonAlert();
      return;
    }

    if (isLikedByMe) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 2, stiffness: 80 }),
        withSpring(1, { damping: 2, stiffness: 80 }),
      );
      const { data, error } = await supabase
        .from("devo_likes")
        .delete()
        .eq("devo_title", title)
        .eq("user_id", currentUser?.id);

      channel.send({
        type: "broadcast",
        event: "message",
        payload: {
          user_id: currentUser?.id,
          devo_title: title,
        },
      });
      return;
    }
    scale.value = withSequence(
      withSpring(1.2, { damping: 2, stiffness: 80 }),
      withSpring(1, { damping: 2, stiffness: 80 }),
    );

    const { data, error } = await supabase.from("devo_likes").insert({
      user_id: currentUser?.id,
      devo_title: title,
    });

    const message = {
      title,
      message: `${currentUser?.full_name} has liked the devotional!`,
      data: { screen: "DevoList", verseTitle: "" },
    };

    fetch(config.prayseMessage, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    channel.send({
      type: "broadcast",
      event: "message",
      payload: {
        user_id: currentUser?.id,
        devo_title: title,
      },
    });
  }

  async function fetchLikes(devoTitle) {
    //prayer_id for production
    //prayertest_id for testing
    const { data: likes, error: likesError } = await supabase
      .from("devo_likes")
      .select()
      .eq("devo_title", devoTitle);
    setLikesArray(likes);

    if (likesError) {
      console.log(likesError);
    }
  }

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const onShare = async (title, description, day, content) => {
    if (title) {
      try {
        await Share.share({
          message:
            title + "\n" + description + "\n" + "\n" + day + "\n" + content,
        });
      } catch (error) {
        Alert.alert(error.message);
      }
    }
  };

  function convertDigitIn(str) {
    const newStr = str.replace(/-/g, "/");
    return newStr.split("/").reverse().join("/");
  }

  const isLikedByMe = !!likesArray?.find(
    (like) => like.user_id == currentUser?.id,
  );

  const BusyIndicator = () => {
    return (
      <View
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background dark:bg-dark-background flex-1 justify-center"
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
      </View>
    );
  };

  if (!isReady || !connected) {
    return <BusyIndicator />;
  }

  return (
    <>
      {refresh ? <ActivityIndicator /> : null}
      <Container
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background dark:bg-dark-background"
      >
        <HeaderView className="flex-row self-start">
          <TouchableOpacity
            onPress={() => {
              if (routeParams?.previousScreen) {
                navigation.goBack();
              } else {
                navigation.navigate(MORE_SCREEN);
              }
            }}
          >
            <AntDesign
              name="left"
              size={30}
              color={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme == "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
          <HeaderTitle
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter ml-2 font-bold text-light-primary dark:text-dark-primary"
          >
            Devotional
          </HeaderTitle>
        </HeaderView>
        <View className=" flex-1 justify-center items-center">
          <View
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary rounded-lg w-3/4 dark:bg-dark-secondary p-3"
          >
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-medium leading-6 text-light-primary dark:text-dark-primary"
            >
              This page is being removed from the app, but you can find
              devotionals and more on our Instagram{" "}
              <Text className="font-inter-semibold">@prayse.app</Text>.
            </Text>
          </View>
        </View>
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#93D8F8",
    borderRadius: 10,
    color: "#2f2d51",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  imgContainer: {
    backgroundColor: "white",
    height: 180,
    width: 180,
    borderRadius: 100,
    marginVertical: 15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  refreshDark: {
    paddingVertical: 7,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  refresh: {
    paddingVertical: 7,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionDark: {
    color: "#d6d6d6",
    fontFamily: "Inter-Medium",
    fontSize: 16,
  },
  description: {
    color: "#2F2D51",
    fontFamily: "Inter-Medium",
    fontSize: 16,
  },
  ownerDark: {
    color: "#d6d6d6",
    fontFamily: "Inter-Bold",
  },
  owner: {
    color: "#2F2D51",
    fontFamily: "Inter-Bold",
  },
  dayDark: {
    color: "#d6d6d6",
    letterSpacing: 1,
    fontSize: 20,
    fontFamily: "Inter-Bold",
  },
  day: {
    color: "#2F2D51",
    letterSpacing: 1,
    fontSize: 20,
    fontFamily: "Inter-Bold",
  },
  contentDark: {
    color: "#d6d6d6",
    fontSize: 15,
    lineHeight: 35,
    fontFamily: "Inter-Regular",
    marginBottom: 70,
  },
  content: {
    color: "#2F2D51",
    fontSize: 15,
    fontFamily: "Inter-Regular",
    lineHeight: 35,
    marginBottom: 70,
  },
});

export default DevoListScreen;
