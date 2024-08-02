// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSelector } from "react-redux";

import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from "@react-navigation/native";
import { ActualTheme } from "@types/reduxTypes";

import tbf from "../../assets/tbf-logo.jpg";
import useIsReady from "../../hooks/useIsReady";
import { client } from "../../lib/client";
import { DEVO_LIST_SCREEN } from "../../routes";
import { Container } from "../../styles/appStyles";

import "react-native-url-polyfill/auto";

const DevotionalScreen = () => {
  const isFocused = useIsFocused();
  const theme = useSelector((state) => state.user.theme);
  const isReady = useIsReady();
  const [devotionals, setDevotionals] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [connected, setConnected] = useState(false);
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();
  useEffect(() => {
    loadDevotionals();
  }, [isFocused]);

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

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  function convertDate(str) {
    const inputDate = new Date(str);
    inputDate.setDate(inputDate.getDate() + 1); // Add 1 day

    const options = { month: "short", day: "numeric" };

    const formattedDate = inputDate.toLocaleDateString("en-US", options);

    return formattedDate;
  }

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
              : colorScheme === "dark"
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
    <ScrollView
      className="bg-light-background dark:bg-dark-background"
      style={getMainBackgroundColorStyle(actualTheme)}
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={loadDevotionals} />
      }
      showsVerticalScrollIndicator={false}
    >
      {refresh ? (
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
      ) : null}
      <Container
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background dark:bg-dark-background justify-center items-center"
      >
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="w-full justify-center items-center p-3 rounded-lg gap-2 bg-light-secondary dark:bg-dark-secondary"
        >
          <View className="flex-row items-center w-full gap-3">
            <Image className="w-14 h-14 rounded-full" source={tbf} />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter text-lg font-medium text-light-primary dark:text-[#d2d2d2]"
            >
              triedbyfire
            </Text>

            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="ml-auto font-inter text-light-primary dark:text-dark-[#d2d2d2]"
            >
              {convertDate(devotionals[0]?.date)}
            </Text>
          </View>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter text-light-primary dark:text-dark-primary font-bold tracking-widest text-2xl"
          >
            {devotionals[0]?.title}
          </Text>
          <Text
            className="font-inter text-left mb-3"
            style={getSecondaryTextColorStyle(actualTheme)}
          >
            {devotionals[0]?.description}
          </Text>
          <Link asChild className="w-full" href={`/${DEVO_LIST_SCREEN}`}>
            <TouchableOpacity
              href={`/${DEVO_LIST_SCREEN}`}
              className="w-full mt-3 p-4 justify-center items-center rounded-lg bg-light-primary dark:bg-dark-background"
              style={getPrimaryBackgroundColorStyle(actualTheme)}
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter text-lg font-bold text-light-background dark:text-dark-accent"
              >
                View
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
        <Text
          onPress={loadDevotionals}
          style={getMainTextColorStyle(actualTheme)}
          className="underline mt-5 text-sm text-light-primary dark:text-dark-primary"
        >
          Pull page down or press here to refresh.
        </Text>
      </Container>
    </ScrollView>
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
    borderWidth: 0.5,
    borderColor: "#d2d2d2",
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

export default DevotionalScreen;
