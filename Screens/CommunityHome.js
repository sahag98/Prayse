import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useSupabase } from "../context/useSupabase";
import { Container, HeaderTitle } from "../styles/appStyles";
import { PROJECT_ID } from "@env";
import { useSelector } from "react-redux";
import { Image } from "react-native";
import { useState } from "react";
import { TouchableOpacity, Platform } from "react-native";
import {
  Entypo,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useRef } from "react";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import WelcomeModal from "../components/WelcomeModal";
import cm2 from "../assets/cm2.png";
import CreateGroupModal from "../components/CreateGroupModal";
import { FlatList } from "react-native";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const CommunityHome = () => {
  const navigation = useNavigation();
  const {
    currentUser,
    setCurrentUser,
    session,
    newPost,
    setNewPost,
    logout,
    supabase,
  } = useSupabase();
  const theme = useSelector((state) => state.user.theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [extended, setExtended] = useState(true);
  const [prayerModal, setPrayerModal] = useState(false);
  const [isShowingWelcome, setIsShowingWelcome] = useState(false);
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(true);
  const [prayers, setPrayers] = useState([]);
  const [userPrayers, setUserPrayers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const isIOS = Platform.OS === "ios";
  const { current: velocity } = useRef(new Animated.Value(0));
  const scrollTimeoutRef = useRef(null);
  // function generateRandomPin() {
  //   // Math.random() generates a random number between 0 (inclusive) and 1 (exclusive)
  //   // Multiply by 900000 to get a number between 0 and 899999
  //   // Add 100000 to ensure the number is at least 100000
  //   var pin = Math.floor(Math.random() * 900000) + 100000;

  //   return pin;
  // }
  // var randomPin = generateRandomPin();

  // console.log("6 digit pin: ", randomPin);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const onScroll = ({ nativeEvent }) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    if (!isIOS) {
      return velocity.setValue(currentScrollPosition);
    }

    setExtended(currentScrollPosition <= 0);
  };

  useEffect(() => {
    if (!isIOS) {
      setExtended(true);
    } else setExtended(extended);
  }, [velocity, extended, isIOS]);

  useEffect(() => {
    const wavingAnimation = withSpring(15, { damping: 2, stiffness: 80 });

    rotation.value = withSequence(wavingAnimation);
    getUserPrayers();
    getUserGroups();
    getPermission();
    getPrayers();
  }, [isFocused]);

  async function getPrayers() {
    //prayers for production
    //prayers_test for testing
    let { data: prayers, error } = await supabase
      .from("prayers")
      .select("*, profiles(*)")
      .order("id", { ascending: false });
    setPrayers(prayers);
  }

  console.log("groups of user :", userGroups);

  async function getUserPrayers() {
    //prayers for production
    //prayers_test for testing
    let { data: prayers, error } = await supabase
      .from("prayers")
      .select("*")
      .eq("user_id", currentUser?.id)
      .order("id", { ascending: false });
    setUserPrayers(prayers);
  }

  async function getUserGroups() {
    let { data: groups, error } = await supabase
      .from("members")
      .select("*,groups(*)")
      .eq("user_id", currentUser?.id)
      .order("id", { ascending: false });
    setUserGroups(groups);
  }

  async function sendToken(expoPushToken) {
    const { data, error } = await supabase
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
      console.log(existingStatus);

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log(status);
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        console.log("not granted");
        return;
      }
      console.log("permission granted");
      token = (
        await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })
      ).data;
    } else {
      console.log("Must use physical device for Push Notifications");
    }
    sendToken(token);
  }

  if (currentUser?.full_name == null) {
    return (
      <WelcomeModal
        supabase={supabase}
        setCurrentUser={setCurrentUser}
        isShowingWelcome={true}
        setIsShowingWelcome={setIsShowingWelcome}
        user={currentUser}
      />
    );
  }

  const data = [
    { key: "1", text: "Item 1" },
    { key: "2", text: "Item 2" },
    { key: "3", text: "Item 3" },
    { key: "4", text: "Item 4" },
    { key: "5", text: "Item 5" },
    // Add more items as needed
  ];
  const ITEM_WIDTH = Dimensions.get("window").width / 2;
  console.log(currentUser);

  return (
    <Container
      style={
        theme == "dark"
          ? {
              backgroundColor: "#121212",
              justifyContent: "center",
              gap: 10,
              position: "relative",
            }
          : {
              backgroundColor: "#F2F7FF",
              justifyContent: "center",
              gap: 10,
              position: "relative",
            }
      }
    >
      <Image
        style={
          theme == "dark" ? [styles.img, { tintColor: "white" }] : styles.img
        }
        source={cm2}
      />
      <Animated.View
        entering={FadeIn.duration(500)}
        style={{
          flexDirection: "row",
          alignItems: "center",

          gap: 10,
        }}
      >
        <HeaderTitle
          style={
            theme == "dark"
              ? {
                  fontFamily: "Inter-Bold",
                  fontSize: 20,
                  letterSpacing: 2,
                  color: "white",
                }
              : {
                  fontFamily: "Inter-Bold",
                  fontSize: 20,
                  color: "#2F2D51",
                }
          }
        >
          <Text>Welcome {currentUser.full_name}</Text>
        </HeaderTitle>
        <Animated.View style={animatedStyle}>
          <MaterialCommunityIcons name="hand-wave" size={30} color="#ffe03b" />
        </Animated.View>
      </Animated.View>
      <TouchableOpacity
        onPress={() => navigation.navigate("PublicCommunity")}
        style={
          theme == "dark"
            ? {
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                borderRadius: 10,
                justifyContent: "space-between",
                backgroundColor: "#a5c9ff",
              }
            : {
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                borderRadius: 10,
                justifyContent: "space-between",
                backgroundColor: "#93d8f8",
              }
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={
              theme == "dark"
                ? { fontFamily: "Inter-Medium", color: "#121212", fontSize: 15 }
                : { fontFamily: "Inter-Medium", color: "#2f2d51", fontSize: 15 }
            }
          >
            Public Prayers
          </Text>
          <Entypo
            name="globe"
            size={24}
            color={theme == "dark" ? "#121212" : "#2f2d51"}
          />
        </View>
        <AntDesign
          name="right"
          size={24}
          color={theme == "dark" ? "#121212" : "#2f2d51"}
        />
      </TouchableOpacity>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text
          style={
            theme == "dark"
              ? { fontFamily: "Inter-Bold", color: "white", fontSize: 16 }
              : { fontFamily: "Inter-Bold", color: "#2f2d51", fontSize: 16 }
          }
        >
          Prayer Groups
        </Text>
        <MaterialIcons
          name="groups"
          size={30}
          color={theme == "dark" ? "white" : "#2f2d51"}
        />
      </View>
      {userGroups.length > 0 && (
        <FlatList
          pagingEnabled
          snapToInterval={ITEM_WIDTH}
          horizontal
          data={userGroups}
          keyExtractor={(e, i) => i.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.item,
                { backgroundColor: item.groups.color, width: ITEM_WIDTH },
              ]}
            >
              <Text>{item.groups.name}</Text>
              <Text>{item.groups.description}</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={
          theme == "dark"
            ? {
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                borderRadius: 10,
                justifyContent: "space-between",
                backgroundColor: "#a5c9ff",
              }
            : {
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                borderRadius: 10,
                justifyContent: "space-between",
                backgroundColor: "#2f2d51",
              }
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={
              theme == "dark"
                ? { fontFamily: "Inter-Medium", color: "#121212", fontSize: 15 }
                : { fontFamily: "Inter-Medium", color: "white", fontSize: 15 }
            }
          >
            Create a Group
          </Text>
          <AntDesign
            name="addusergroup"
            size={24}
            color={theme == "dark" ? "#121212" : "white"}
          />
        </View>
        <AntDesign
          name="plus"
          size={24}
          color={theme == "dark" ? "#121212" : "white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("PublicCommunity")}
        style={
          theme == "dark"
            ? {
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                borderRadius: 10,
                justifyContent: "space-between",
                borderColor: "#a5c9ff",
                borderWidth: 1,
              }
            : {
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
                borderRadius: 10,
                justifyContent: "space-between",
                borderColor: "#93d8f8",
                borderWidth: 1,
              }
        }
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text
            style={
              theme == "dark"
                ? {
                    fontFamily: "Inter-Medium",
                    fontSize: 15,
                    color: "#a5c9ff",
                  }
                : {
                    fontFamily: "Inter-Medium",
                    fontSize: 15,
                    color: "#2f2d51",
                  }
            }
          >
            Join a Group
          </Text>
          <MaterialIcons
            name="group-add"
            size={24}
            color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
          />
        </View>
        <AntDesign
          name="plus"
          size={24}
          color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
        />
      </TouchableOpacity>
      <CreateGroupModal
        getUserGroups={getUserGroups}
        supabase={supabase}
        theme={theme}
        user={currentUser}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </Container>
  );
};

export default CommunityHome;

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f0f0f0",
    padding: 20,
    margin: 5,
    borderRadius: 10,
  },
  img: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginVertical: 15,

    // borderWidth: 1,
    // borderColor: "#2f2d51",
    // borderRadius: 99,
  },

  imgContainer: {
    marginBottom: 20,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  question: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#93d8f8",
    borderWidth: 0.8,
    // backgroundColor: "#93d8f8",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  questionDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#f1d592",
    borderWidth: 0.3,
    // backgroundColor: "#f1d592",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 5,
    marginBottom: 15,
  },
  actionButtons: {
    position: "absolute",
    right: 15,
    bottom: 15,
    display: "flex",
  },
  fabStyleDark: {
    position: "relative",
    alignSelf: "flex-end",
    justifyContent: "center",
    backgroundColor: "#A5C9FF",
  },
  fabStyle: {
    position: "relative",
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "#2f2d51",
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  iconContainer: {
    position: "relative",
    padding: 8,
  },
  featherIconDark: {
    position: "absolute",
    backgroundColor: "#A5C9FF",
    borderRadius: 50,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    bottom: 4,
    right: 2,
  },
  featherIcon: {
    position: "absolute",
    backgroundColor: "#93d8f8",
    borderRadius: 50,
    width: 25,
    alignItems: "center",
    justifyContent: "center",
    height: 25,
    bottom: 4,
    right: 2,
  },
});
