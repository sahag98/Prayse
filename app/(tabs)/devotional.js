import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSelector } from "react-redux";

import NetInfo from "@react-native-community/netinfo";
import { Link, useIsFocused } from "@react-navigation/native";

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
        style={
          theme == "dark"
            ? { backgroundColor: "#121212", flex: 1, justifyContent: "center" }
            : { backgroundColor: "#F2F7FF", flex: 1, justifyContent: "center" }
        }
      >
        <ActivityIndicator
          size="large"
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </View>
    );
  };

  if (!isReady || !connected) {
    return <BusyIndicator />;
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme == "dark" ? "#121212" : "#f2f7ff" }}
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={loadDevotionals} />
      }
      showsVerticalScrollIndicator={false}
    >
      {refresh ? (
        <ActivityIndicator
          size="large"
          color={theme == "dark" ? "white" : "red"}
        />
      ) : null}
      <Container
        style={
          theme == "dark"
            ? {
                backgroundColor: "",
                justifyContent: "center",
                alignItems: "center",
              }
            : {
                backgroundColor: "#F2F7FF",
                justifyContent: "center",
                alignItems: "center",
              }
        }
      >
        <View
          style={{
            backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",

            padding: 10,
            borderRadius: 10,
            gap: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              gap: 10,
            }}
          >
            <Image style={styles.img} source={tbf} />
            <Text
              style={{
                color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                fontFamily: "Inter-Medium",
              }}
            >
              triedbyfire
            </Text>

            <Text
              style={{
                marginLeft: "auto",
                color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
                fontFamily: "Inter-Medium",
              }}
            >
              {convertDate(devotionals[0]?.date)}
            </Text>
          </View>
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Black",
              letterSpacing: 1,
              fontSize: 23,
            }}
          >
            {devotionals[0]?.title}
          </Text>
          <Text
            style={{
              color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
              fontFamily: "Inter-Regular",
              textAlign: "left",
              fontSize: 15,
              marginBottom: 10,
            }}
          >
            {devotionals[0]?.description}
          </Text>
          <Link to={`/${DEVO_LIST_SCREEN}`}>
            <View
              style={{
                width: "100%",
                marginTop: 10,
                padding: 15,
                borderRadius: 10,
                backgroundColor: theme == "dark" ? "#121212" : "#2f2d51",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Inter-Bold",
                  fontSize: 15,
                  color: theme == "dark" ? "#a5c9ff" : "white",
                }}
              >
                View
              </Text>
            </View>
          </Link>
        </View>
        <Text
          onPress={loadDevotionals}
          style={{
            marginTop: 20,
            fontFamily: "Inter-Medium",
            fontSize: 12,
            color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
          }}
        >
          Pull page down or press here to refresh!
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
