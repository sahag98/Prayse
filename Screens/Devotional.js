import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  RefreshControl,
  Linking,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { client } from "../lib/client";
import "react-native-url-polyfill/auto";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { Divider } from "react-native-paper";
import useIsReady from "../hooks/useIsReady";
import { TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import tbf from "../assets/tbf-logo.jpg";
import NetInfo from "@react-native-community/netinfo";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useSupabase } from "../context/useSupabase";
import DevoItem from "../components/DevoItem";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

const Devotional = ({ navigation }) => {
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
    <>
      {refresh ? <ActivityIndicator /> : null}
      <Container
        style={
          theme == "dark"
            ? {
                backgroundColor: "#121212",
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
            backgroundColor: theme == "dark" ? "#212121" : "#93d8f8",
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
              {convertDate(devotionals[0].date)}
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
            {devotionals[0].title}
          </Text>
          <Text
            style={{
              color: theme == "dark" ? "white" : "#2f2d51",
              fontFamily: "Inter-Regular",
              textAlign: "left",
              fontSize: 16,
              marginBottom: 10,
            }}
          >
            {devotionals[0].description}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("DevoList")}
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
          </TouchableOpacity>
        </View>
        {/* <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
        >
          {devotionals?.map((d, index) => (
            <View key={d._id}>
              <DevoItem
                theme={theme}
                tbf={tbf}
                supabase={supabase}
                currentUser={currentUser}
                channel={channel}
                setChannel={setChannel}
                fetchLikes={fetchLikes}
                refreshReflections={refreshReflections}
                fetchReflections={fetchReflections}
                isFocused={isFocused}
                refresh={refresh}
                loadDevotionals={loadDevotionals}
                convertDigitIn={convertDigitIn}
                devo={d}
              />
              <View
                style={
                  theme == "dark"
                    ? {
                        position: "absolute",
                        bottom: 10,
                        width: "75%",

                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        alignSelf: "center",
                        padding: 10,
                        borderRadius: 20,
                        backgroundColor: "#212121",
                      }
                    : {
                        position: "absolute",
                        bottom: 10,
                        width: "75%",
                        shadowColor: "#9f9f9f",
                        shadowOffset: {
                          width: 0,
                          height: 6,
                        },
                        shadowOpacity: 0.2,
                        shadowRadius: 5.62,
                        elevation: 8,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        alignSelf: "center",
                        padding: 10,
                        borderRadius: 20,
                        backgroundColor: "white",
                      }
                }
              >
                <TouchableOpacity onPress={() => insertLike(d.title)}>
                  <Animated.View
                    style={[
                      animatedStyle,
                      { flexDirection: "row", alignItems: "center", gap: 5 },
                    ]}
                  >
                    <AntDesign
                      name="hearto"
                      size={24}
                      color={
                        isLikedByMe
                          ? "red"
                          : theme == "dark"
                          ? "white"
                          : "#2f2d51"
                      }
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Inter-Medium",
                        color: isLikedByMe
                          ? "red"
                          : theme == "dark"
                          ? "white"
                          : "#2f2d51",
                      }}
                    >
                      {likesArray.length}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
                <View
                  style={{
                    height: "100%",
                    backgroundColor: theme == "dark" ? "white" : "black",
                    width: 1,
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Reflection", { devoTitle: d.title })
                  }
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <FontAwesome
                    style={{ marginBottom: 4 }}
                    name="comment-o"
                    size={24}
                    color={theme == "dark" ? "white" : "#2f2d51"}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      color: theme == "dark" ? "white" : "white",
                      fontFamily: "Inter-Medium",
                    }}
                  >
                    {reflectionsArray.length}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    height: "100%",
                    backgroundColor: theme == "dark" ? "white" : "black",
                    width: 1,
                  }}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate("Reflection")}
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <FontAwesome5
                    name="share"
                    size={24}
                    color={theme == "dark" ? "white" : "#2f2d51"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </KeyboardAvoidingView> */}
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

export default Devotional;
