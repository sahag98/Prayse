import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useSupabase } from "../context/useSupabase";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";
import { PROJECT_ID } from "@env";
import { useSelector } from "react-redux";
import { Image } from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons, Entypo, AntDesign } from "@expo/vector-icons";
import { TouchableOpacity, Platform } from "react-native";
import ProfileModal from "../components/ProfileModal";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedFAB } from "react-native-paper";
import CommunityPrayers from "../components/CommunityPrayers";
import CommunityModal from "../components/ComunityModal";
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

const PublicCommunity = ({ route }) => {
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
  const isIOS = Platform.OS === "ios";
  const { current: velocity } = useRef(new Animated.Value(0));
  const scrollTimeoutRef = useRef(null);

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
    getPermission();
    getPrayers();
  }, [isFocused]);

  //   useEffect(()=>{
  //  getPrayers()
  //   },[newPost])

  async function getPrayers() {
    //prayers for production
    //prayers_test for testing
    let { data: prayers, error } = await supabase
      .from("prayers")
      .select("*, profiles(*)")
      .order("id", { ascending: false });
    setPrayers(prayers);
  }

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
        await Notifications.getExpoPushTokenAsync({ projectId: PROJECT_ID })
      ).data;
    } else {
      console.log("Must use physical device for Push Notifications");
    }
    sendToken(token);
  }
  return (
    <Container
      style={
        theme == "dark"
          ? { backgroundColor: "#121212", position: "relative" }
          : { backgroundColor: "#F2F7FF", position: "relative" }
      }
    >
      <HeaderView style={{ marginTop: 0, marginBottom: 20 }}>
        <Animated.View
          entering={FadeIn.duration(500)}
          style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("Community")}>
            <AntDesign
              name="left"
              size={24}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </TouchableOpacity>
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
            <Text>Public</Text>
          </HeaderTitle>
          <Animated.View style={animatedStyle}>
            <Entypo
              name="globe"
              size={24}
              color={theme == "dark" ? "white" : "#2f2d51"}
            />
          </Animated.View>
        </Animated.View>
        {/* <View style={styles.iconContainer}>
          <Image
            style={styles.profileImg}
            source={{
              uri: currentUser?.avatar_url
                ? currentUser?.avatar_url
                : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
            }}
          />
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={
              theme == "dark" ? styles.featherIconDark : styles.featherIcon
            }
          >
            <Ionicons name="settings" size={16} color="black" />
          </TouchableOpacity>
        </View> */}
      </HeaderView>

      <View style={{ flex: 1, position: "relative" }}>
        {newPost && (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={
              theme == "dark"
                ? {
                    position: "absolute",
                    zIndex: 99,
                    width: "65%",
                    alignSelf: "center",
                    marginVertical: 10,
                    backgroundColor: "#121212",
                    borderRadius: 50, // Set your desired border radius
                    ...Platform.select({
                      ios: {
                        shadowColor: theme == "dark" ? "#A5C9FF" : "#2f2d51",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                      },
                      android: {
                        elevation: 4,
                      },
                    }),
                  }
                : {
                    position: "absolute",
                    zIndex: 99,
                    width: "70%",
                    alignSelf: "center",
                    marginVertical: 10,
                    backgroundColor: "white",
                    borderRadius: 50, // Set your desired border radius
                    ...Platform.select({
                      ios: {
                        shadowColor: "#2f2d51",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                      },
                      android: {
                        elevation: 4,
                      },
                    }),
                  }
            }
          >
            <Animated.Text
              style={
                theme == "dark"
                  ? {
                      fontFamily: "Inter-Bold",
                      paddingVertical: 15,
                      paddingHorizontal: 5,
                      color: "#A5C9FF",
                      textAlign: "center",
                      fontSize: 13,
                    }
                  : {
                      fontFamily: "Inter-Bold",
                      paddingVertical: 15,
                      paddingHorizontal: 5,
                      color: "#2f2d51",
                      textAlign: "center",
                      fontSize: 13,
                    }
              }
            >
              New Prayers! Pull down to refresh
            </Animated.Text>
          </Animated.View>
        )}
        <CommunityModal
          getUserPrayers={getUserPrayers}
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
          setNewPost={setNewPost}
          visible={visible}
          setVisible={setVisible}
          prayers={prayers}
          setPrayers={setPrayers}
          onScroll={onScroll}
          supabase={supabase}
          currentUser={currentUser}
        />
      </View>
      <View style={styles.actionButtons}>
        <AnimatedFAB
          icon={"plus"}
          label={"Post prayer"}
          extended={extended}
          onPress={() => setPrayerModal(true)}
          visible={true}
          animateFrom={"right"}
          iconMode={"dynamic"}
          color={theme == "dark" ? "#212121" : "white"}
          style={theme == "dark" ? styles.fabStyleDark : styles.fabStyle}
        />
      </View>
    </Container>
  );
};

export default PublicCommunity;

const styles = StyleSheet.create({
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
