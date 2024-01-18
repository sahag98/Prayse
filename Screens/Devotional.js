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
  const [thought, setThought] = useState("");
  const { isLoggedIn, currentUser, supabase } = useSupabase();
  const [likesArray, setLikesArray] = useState([]);
  const [reflectionsArray, setReflectionsArray] = useState([]);
  const [channel, setChannel] = useState([]);
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

  async function insertLike(title) {
    if (!isLoggedIn) {
      alert("You are not signed in!");
      return;
    }

    if (isLikedByMe) {
      console.log("liked it");
      scale.value = withSequence(
        withSpring(1.2, { damping: 2, stiffness: 80 }),
        withSpring(1, { damping: 2, stiffness: 80 })
      );

      console.log(title);
      const { data, error } = await supabase
        .from("devo_likes")
        .delete()
        // .eq("devo_title", title)
        .eq("user_id", currentUser.id);

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
      withSpring(1, { damping: 2, stiffness: 80 })
    );
    const { data, error } = await supabase.from("devo_likes").insert({
      user_id: currentUser?.id,
      devo_title: title,
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

  function convertDigitIn(str) {
    let newStr = str.replace(/-/g, "/");
    return newStr.split("/").reverse().join("/");
  }

  const isLikedByMe = !!likesArray?.find(
    (like) => like.user_id == currentUser.id
  );

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
            ? { backgroundColor: "#121212" }
            : { backgroundColor: "#F2F7FF" }
        }
      >
        <HeaderView
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <AntDesign
              name="left"
              size={30}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
          <Text
            style={
              theme == "dark"
                ? {
                    color: "white",
                    fontSize: 20,
                    marginLeft: 10,
                    fontFamily: "Inter-Bold",
                  }
                : {
                    color: "#2f2d51",
                    fontSize: 20,
                    marginLeft: 10,
                    fontFamily: "Inter-Bold",
                  }
            }
          >
            Devotional
          </Text>
        </HeaderView>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
        >
          {devotionals?.map((d) => (
            <>
              <DevoItem
                tbf={tbf}
                supabase={supabase}
                currentUser={currentUser}
                channel={channel}
                setChannel={setChannel}
                fetchLikes={fetchLikes}
                isFocused={isFocused}
                refresh={refresh}
                loadDevotionals={loadDevotionals}
                key={d._id}
                convertDigitIn={convertDigitIn}
                devo={d}
              />
              <View
                style={{
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
                }}
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
                      color={isLikedByMe ? "red" : "#2f2d51"}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: "Inter-Medium",
                        color: isLikedByMe ? "red" : "#2f2d51",
                      }}
                    >
                      {likesArray.length}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
                <View
                  style={{ height: "100%", backgroundColor: "black", width: 1 }}
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
                    color="#2f2d51"
                  />
                  <Text style={{ fontSize: 16, fontFamily: "Inter-Medium" }}>
                    {reflectionsArray.length}
                  </Text>
                </TouchableOpacity>
                <View
                  style={{ height: "100%", backgroundColor: "black", width: 1 }}
                />
                <TouchableOpacity
                  onPress={() => navigation.navigate("Reflection")}
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <FontAwesome5 name="share" size={24} color="#2f2d51" />
                </TouchableOpacity>
              </View>
            </>
          ))}
        </KeyboardAvoidingView>
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

export default Devotional;
