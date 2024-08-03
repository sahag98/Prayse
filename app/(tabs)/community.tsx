// @ts-nocheck
import React, { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Network from "expo-network";
import * as Notifications from "expo-notifications";
import { useColorScheme } from "nativewind";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
} from "@lib/customStyles";
import { Link, useIsFocused, useNavigation } from "@react-navigation/native";
import { ActualTheme } from "@types/reduxTypes";

import globeBg from "../../assets/globe-bg.png";
import groupBg from "../../assets/group-bg.png";
import questionBg from "../../assets/question-bg.png";
import config from "../../config";
import { useSupabase } from "../../context/useSupabase";
import CreateGroupModal from "../../modals/CreateGroupModal";
import JoinModal from "../../modals/JoinModal";
import ProfileModal from "../../modals/ProfileModal";
import WelcomeModal from "../../modals/WelcomeModal";
import {
  PRAYER_GROUP_SCREEN,
  PUBLIC_COMMUNITY_SCREEN,
  PUBLIC_GROUPS_SCREEN,
  QUESTION_LIST_SCREEN,
} from "../../routes";
import { HeaderTitle } from "../../styles/appStyles";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
const duration = 2000;
const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

const CommunityHomeScreen = () => {
  const navigation = useNavigation();
  const {
    currentUser,
    setCurrentUser,
    session,
    refreshMembers,
    setRefreshMembers,
    logout,
    supabase,
  } = useSupabase();

  const theme = useSelector((state) => state.user.theme);
  const [modalVisible, setModalVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [joinVisible, setJoinVisible] = useState(false);
  const [extended, setExtended] = useState(true);
  const statusBarHeight = Constants.statusBarHeight;
  const [prayerModal, setPrayerModal] = useState(false);
  const [isShowingWelcome, setIsShowingWelcome] = useState(false);
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(true);
  const [prayers, setPrayers] = useState([]);
  const [userPrayers, setUserPrayers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [groups, setGroups] = useState([]);
  const isIOS = Platform.OS === "ios";
  // const { current: velocity } = useRef(new Animated.Value(0));
  const [searchName, setSearchName] = useState("");
  const [isViewingGroups, setIsViewingGroups] = useState(false);
  const [hasConnection, setHasConnection] = useState(true);
  const [isFetchingUserGroups, setIsFetchingUserGroups] = useState(false);
  const rotation = useSharedValue(0);
  const { colorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  // const routeParams = useLocalSearchParams();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: "Copied to Clipboard.",
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    if (!isIOS) {
      setExtended(true);
    } else setExtended(extended);
  }, [extended, isIOS]);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await Network.getNetworkStateAsync();
      console.log("connection: ", connected.isConnected);
      if (!connected.isConnected) {
        setHasConnection(false);
      }
    };
    checkConnection();
    const wavingAnimation = withSpring(15, { damping: 2, stiffness: 80 });

    rotation.value = withSequence(wavingAnimation);
    getUserPrayers();
    getGroupUsers();
    getUserGroups();
    getPermission();
    getPrayers();
  }, [isFocused]);

  // useEffect(() => {
  //   if (routeParams !== undefined) {
  //     navigation.navigate(PRAYER_GROUP_SCREEN, {
  //       group: routeParams.group,
  //       allGroups: routeParams.allGroups,
  //     });
  //   }
  // }, [route?.params]);

  useEffect(() => {
    getUserGroups();
    getGroupUsers();
  }, [refreshMembers]);

  async function getPrayers() {
    //prayers for production
    //prayers_test for testing
    const { data: prayers, error } = await supabase
      .from("prayers")
      .select("*, profiles(*)")
      .order("id", { ascending: false });
    setPrayers(prayers);
  }

  async function getUserPrayers() {
    //prayers for production
    //prayers_test for testing
    const { data: prayers, error } = await supabase
      .from("prayers")
      .select("*")
      .eq("user_id", currentUser?.id)
      .order("id", { ascending: false });
    setUserPrayers(prayers);
  }

  async function getUserGroups() {
    try {
      setIsFetchingUserGroups(true);
      const { data: groups, error } = await supabase
        .from("members")
        .select("*,groups(*), profiles(*)")
        .eq("user_id", currentUser?.id)
        .order("id", { ascending: false });
      setUserGroups(groups);
    } catch (error) {
      console.log(error);
    }
    setIsFetchingUserGroups(false);
  }

  async function getGroupUsers() {
    const { data: groups, error } = await supabase
      .from("members")
      .select("*,groups(*), profiles(*)")
      .order("id", { ascending: true });
    setGroups(groups);
    setRefreshMembers(false);
  }

  async function sendToken(expoPushToken) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ expoToken: expoPushToken })
      .eq("id", currentUser?.id)
      .select();
  }

  const copyToClipboard = async (code) => {
    await Clipboard.setStringAsync(code);
    showToast("success");
  };

  async function getPermission() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

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

  const ITEM_WIDTH = Dimensions.get("window").width / 2;

  const list = userGroups?.filter((item) =>
    searchName !== "" ? item.groups.name.includes(searchName) : true,
  );

  const width = Dimensions.get("window").width - 30;

  // if (routeParams !== undefined) {
  //   navigation.navigate(PRAYER_GROUP_SCREEN, {
  //     group: routeParams.group,
  //     allGroups: routeParams.allGroups,
  //   });
  // }

  if (currentUser && currentUser?.full_name == null) {
    return (
      <WelcomeModal
        supabase={supabase}
        getUserGroups={getUserGroups}
        setCurrentUser={setCurrentUser}
        isShowingWelcome
        setIsShowingWelcome={setIsShowingWelcome}
        user={currentUser}
      />
    );
  }

  if (!hasConnection) {
    return (
      <View className="flex-1 justify-center gap-2 items-center bg-light-background dark:bg-dark-background">
        <MaterialIcons
          name="network-check"
          size={50}
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
        <Text className="font-inter text-lg font-medium text-light-primary dark:text-dark-primary">
          No network connection. Try again...
        </Text>
      </View>
    );
  }

  return (
    <View
      className="bg-light-background dark:bg-dark-background p-4 flex-1 justify-center gap-3 pb-3 relative"
      style={[
        { paddingTop: statusBarHeight },
        getMainBackgroundColorStyle(actualTheme),
      ]}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <HeaderTitle
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-bold text-2xl text-light-primary dark:text-dark-primary"
          >
            Hey {currentUser?.full_name}
          </HeaderTitle>
          <Animated.View style={animatedStyle}>
            <MaterialCommunityIcons
              name="hand-wave"
              size={30}
              color="#ffe03b"
            />
          </Animated.View>
        </View>
        <ProfileModal
          getUserPrayers={getUserPrayers}
          userPrayers={userPrayers}
          setPrayerModal={setPrayerModal}
          getPrayers={getPrayers}
          logout={logout}
          session={session}
          setCurrentUser={setCurrentUser}
          supabase={supabase}
          profileVisible={profileVisible}
          user={currentUser}
          setProfileVisible={setProfileVisible}
        />

        <TouchableOpacity className="relative p-3 self-end ml-auto">
          <Image
            className="w-16 h-16 rounded-full"
            source={{
              uri: currentUser?.avatar_url
                ? currentUser?.avatar_url
                : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
            }}
          />
          <TouchableOpacity
            onPress={() => setProfileVisible(true)}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="absolute bg-light-primary p-2 dark:bg-dark-accent rounded-full items-center justify-center bottom-1 right-1"
          >
            <Ionicons
              name="settings"
              size={17}
              color={
                actualTheme && actualTheme.PrimaryTxt
                  ? actualTheme.PrimaryTxt
                  : colorScheme === "dark "
                    ? "#121212"
                    : "white"
              }
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View className="flex-row w-full gap-3 items-center">
        <Link style={{ width: "50%" }} to={`/${PUBLIC_COMMUNITY_SCREEN}`}>
          <View
            style={
              theme == "dark"
                ? {
                    flex: 1,
                    minHeight: 130,
                    maxHeight: 150,
                    justifyContent: "space-between",
                    padding: 10,
                    gap: 20,
                    borderRadius: 10,
                    backgroundColor: "#212121",
                    position: "relative",
                  }
                : {
                    flex: 1,
                    position: "relative",
                    minHeight: 130,
                    maxHeight: 150,
                    gap: 20,
                    justifyContent: "space-between",
                    shadowColor: "#bdbdbd",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.17,
                    shadowRadius: 3.05,
                    elevation: 4,
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: "#b7d3ff",
                  }
            }
          >
            <Image
              source={globeBg}
              style={{
                position: "absolute",
                tintColor: theme == "dark" ? "#5c5c5c" : "#9693c3",
                bottom: 0,
                right: 0,
                width: 100,
                height: 100,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Bold",
                        color: "#a5c9ff",
                        fontSize: 16,
                      }
                    : {
                        fontFamily: "Inter-Bold",
                        color: "#2f2d51",
                        fontSize: 16,
                      }
                }
              >
                Public Prayers
              </Text>
              <Entypo
                name="globe"
                size={24}
                color={theme == "dark" ? "#a5c9ff" : "#2f2d51"}
              />
            </View>
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  color: theme == "dark" ? "white" : "#2f2d51",
                  fontSize: 13,
                }}
              >
                Public prayers posted by our users.
              </Text>
              <Link to={`/${PUBLIC_COMMUNITY_SCREEN}`}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 5,
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    width: "100%",
                    backgroundColor: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                  }}
                >
                  <Text
                    style={{
                      color: theme == "dark" ? "#121212" : "white",
                      fontFamily: "Inter-Medium",
                    }}
                  >
                    View
                  </Text>
                  <AntDesign
                    name="right"
                    size={24}
                    color={theme == "dark" ? "#121212" : "white"}
                  />
                </View>
              </Link>
            </View>
          </View>
        </Link>

        <Link style={{ width: "50%" }} to={`/${QUESTION_LIST_SCREEN}`}>
          <View
            style={
              theme == "dark"
                ? {
                    flex: 1,
                    minHeight: 130,
                    maxHeight: 150,
                    justifyContent: "space-between",
                    padding: 10,
                    gap: 20,
                    borderRadius: 10,
                    backgroundColor: "#212121",
                    position: "relative",
                  }
                : {
                    position: "relative",
                    flex: 1,
                    minHeight: 130,
                    maxHeight: 150,
                    gap: 20,
                    padding: 10,
                    shadowColor: "#bdbdbd",
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowOpacity: 0.17,
                    shadowRadius: 3.05,
                    elevation: 4,
                    borderRadius: 10,
                    justifyContent: "space-between",
                    backgroundColor: "#ffcd8b",
                  }
            }
          >
            <Image
              source={questionBg}
              style={{
                position: "absolute",
                tintColor: theme == "dark" ? "#353535" : "#ffd59f",
                bottom: 0,
                right: 0,
                width: 100,
                height: 100,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Bold",
                        color: "#e8bb4e",
                        fontSize: 16,
                      }
                    : {
                        fontFamily: "Inter-Bold",
                        color: "#2f2d51",
                        fontSize: 16,
                      }
                }
              >
                Questions
              </Text>
              <MaterialCommunityIcons
                name="frequently-asked-questions"
                size={24}
                color={theme == "dark" ? "#e8bb4e" : "#2f2d51"}
              />
            </View>
            <View style={{ gap: 10 }}>
              <Text
                style={{
                  fontFamily: "Inter-Regular",
                  color: theme == "dark" ? "white" : "#2f2d51",
                  fontSize: 13,
                }}
              >
                Weekly questions to reflect on.
              </Text>
              <Link to={`/${QUESTION_LIST_SCREEN}`}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderRadius: 5,
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    width: "100%",
                    backgroundColor: theme == "dark" ? "#e8bb4e" : "white",
                  }}
                >
                  <Text
                    style={{
                      color: theme == "dark" ? "#121212" : "#2f2d51",
                      fontFamily: "Inter-Medium",
                    }}
                  >
                    View
                  </Text>
                  <AntDesign
                    name="right"
                    size={24}
                    color={theme == "dark" ? "#121212" : "#2f2d51"}
                  />
                </View>
              </Link>
            </View>
          </View>
        </Link>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text
            style={
              theme == "dark"
                ? {
                    fontFamily: "Inter-Bold",

                    color: "white",
                    fontSize: 18,
                  }
                : {
                    fontFamily: "Inter-Bold",
                    color: "#2f2d51",
                    fontSize: 18,
                  }
            }
          >
            Prayer Groups
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TouchableOpacity
            onPress={() => setJoinVisible(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              padding: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                color: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                fontSize: 16,
                textDecorationLine: "underline",
              }}
            >
              Join
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              flexDirection: "row",
              padding: 5,
              alignItems: "center",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter-Bold",
                textDecorationLine: "underline",
                color: theme == "dark" ? "#a5c9ff" : "#2f2d51",
                fontSize: 16,
              }}
            >
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Link style={{ width: "100%" }} to={`/${PUBLIC_GROUPS_SCREEN}`}>
        <View
          style={{
            width: "100%",
            backgroundColor: theme == "dark" ? "#212121" : "#b7d3ff",
            padding: 12,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              color: theme == "dark" ? "#d2d2d2" : "#2f2d51",
              fontFamily: "Inter-Medium",
            }}
          >
            Search for Public Groups
          </Text>
          <EvilIcons
            name="search"
            size={24}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
        </View>
      </Link>

      {/* {userGroups?.length != 0 && isFetchingUserGroups && (
            <View
              style={{
                flex: 1,
                gap: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name="group"
                size={30}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
              <Text
                style={{
                  fontFamily: "Inter-Medium",
                  color: theme == "dark" ? "white" : "#2f2d51",
                  fontSize: 13,
                }}
              >
                Loading...
              </Text>
            </View>
          )} */}

      {userGroups?.length == 0 && (
        <View
          style={{
            flex: 1,
            gap: 5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome
            name="group"
            size={30}
            color={theme == "dark" ? "white" : "#2f2d51"}
          />
          <Text
            style={{
              fontFamily: "Inter-Medium",
              color: theme == "dark" ? "white" : "#2f2d51",
              fontSize: 13,
            }}
          >
            No groups created or joined.
          </Text>
        </View>
      )}
      {userGroups?.length > 0 && (
        <FlatList
          pagingEnabled
          snapToInterval={ITEM_WIDTH}
          numColumns={1}
          windowSize={8}
          ListFooterComponent={() => (
            <View
              style={
                theme == "dark"
                  ? {
                      height: 30,
                    }
                  : {
                      height: 30,
                    }
              }
            />
          )}
          showsHorizontalScrollIndicator={false}
          data={userGroups}
          keyExtractor={(e, i) => i.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(PRAYER_GROUP_SCREEN, {
                    group: item,
                    allGroups: groups.filter(
                      (g) => g.group_id === item.group_id,
                    ),
                  })
                }
                style={
                  theme == "dark"
                    ? {
                        position: "relative",
                        backgroundColor: "#212121",
                        padding: 8,
                        width: "100%",
                        flexDirection: "row",
                        marginBottom: 10,
                        gap: 10,
                        borderRadius: 10,
                        justifyContent: "space-between",
                      }
                    : {
                        position: "relative",
                        backgroundColor: "#b7d3ff",
                        padding: 8,
                        width: "100%",
                        flexDirection: "row",
                        marginBottom: 10,
                        gap: 10,
                        borderRadius: 10,
                        justifyContent: "space-between",
                      }
                }
              >
                <Image
                  source={
                    item.groups.group_img
                      ? {
                          uri: item.groups.group_img,
                        }
                      : groupBg
                  }
                  style={
                    item.groups.group_img
                      ? {
                          width: 70,
                          height: 70,
                          borderRadius: 10,
                        }
                      : {
                          tintColor: theme == "dark" ? "white" : "#d1e3ff",
                          backgroundColor:
                            theme == "dark" ? "#121212" : "white",
                          borderRadius: 10,
                          width: 70,
                          height: 70,
                        }
                  }
                />
                <View style={{ flex: 1, justifyContent: "space-between" }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",

                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    <Text
                      style={
                        theme == "dark"
                          ? {
                              flex: 1,
                              fontFamily: "Inter-Bold",
                              fontSize: 17,
                              color: "white",
                            }
                          : {
                              flex: 1,
                              fontFamily: "Inter-Bold",
                              fontSize: 17,
                              color: "#2f2d51",
                            }
                      }
                    >
                      {item.groups.name}
                    </Text>
                    {item.groups.is_public === true ? (
                      <View
                        style={
                          theme == "dark"
                            ? {
                                padding: 7,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "#121212",
                                borderRadius: 10,
                                gap: 8,
                              }
                            : {
                                padding: 7,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "#f2f7ff",
                                borderRadius: 10,
                                gap: 8,
                              }
                        }
                      >
                        <Text
                          style={
                            theme == "dark"
                              ? {
                                  color: "white",
                                  fontSize: 13,
                                  fontFamily: "Inter-Medium",
                                }
                              : {
                                  color: "#2f2d51",
                                  fontSize: 13,
                                  fontFamily: "Inter-Medium",
                                }
                          }
                        >
                          PUBLIC
                        </Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          copyToClipboard(item.groups.code.toString())
                        }
                        style={
                          theme == "dark"
                            ? {
                                padding: 7,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "#121212",
                                borderRadius: 10,
                                gap: 8,
                              }
                            : {
                                padding: 7,
                                flexDirection: "row",
                                alignItems: "center",
                                backgroundColor: "#f2f7ff",
                                borderRadius: 10,
                                gap: 8,
                              }
                        }
                      >
                        <Feather
                          name="copy"
                          size={12}
                          color={theme == "dark" ? "white" : "#2f2d51"}
                        />
                        <Text
                          style={
                            theme == "dark"
                              ? {
                                  color: "white",
                                  fontSize: 13,
                                  fontFamily: "Inter-Medium",
                                }
                              : {
                                  color: "#2f2d51",
                                  fontSize: 13,
                                  fontFamily: "Inter-Medium",
                                }
                          }
                        >
                          {item.groups.code}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingHorizontal: 10,
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    {groups
                      .filter((g) => g.group_id === item.group_id)
                      .slice(0, 3)
                      .map((g, index) => (
                        <View
                          key={index}
                          style={{
                            position: "relative",
                            marginLeft: index > 0 ? -10 : 0,
                          }}
                        >
                          <Image
                            style={styles.joinedUserImg}
                            source={{
                              uri: g.profiles?.avatar_url
                                ? g.profiles?.avatar_url
                                : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
                            }}
                          />
                        </View>
                      ))}
                    <View>
                      {groups?.length > 3 &&
                        groups.filter((g) => g.group_id === item.group_id)
                          ?.length > 3 && (
                          <Text
                            style={
                              theme == "dark"
                                ? {
                                    marginLeft: 5,
                                    fontFamily: "Inter-Regular",
                                    color: "grey",
                                  }
                                : {
                                    marginLeft: 5,
                                    fontFamily: "Inter-Regular",
                                    color: "#2f2d51",
                                  }
                            }
                          >
                            +
                            {groups.filter((g) => g.group_id === item.group_id)
                              ?.length - 3}
                          </Text>
                        )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <CreateGroupModal
        getUserGroups={getUserGroups}
        getGroupUsers={getGroupUsers}
        supabase={supabase}
        theme={theme}
        user={currentUser}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <JoinModal
        getUserGroups={getUserGroups}
        getGroupUsers={getGroupUsers}
        supabase={supabase}
        theme={theme}
        user={currentUser}
        modalVisible={joinVisible}
        setModalVisible={setJoinVisible}
      />
    </View>
  );
};

export default CommunityHomeScreen;

const styles = StyleSheet.create({
  joinedUserImg: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },
  textInputStyle: {
    padding: 10,
    width: "100%",
    fontSize: 13,
  },
  textInputStyleDark: {
    padding: 10,
    width: "100%",
    fontSize: 13,
  },

  img: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginVertical: 15,
  },
  box: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#b58df1",
    borderRadius: 20,
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

  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  iconContainer: {
    position: "relative",
    padding: 10,
    alignSelf: "flex-end",
    marginLeft: "auto",
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
  // profileImg: {
  //   width: 60,
  //   height: 60,
  //   borderRadius: 50,
  // },
  // iconContainer: {
  //   position: "relative",
  //   padding: 8,
  // },
  featherIconDark: {
    position: "absolute",
    backgroundColor: "#A5C9FF",
    borderRadius: 50,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    bottom: 4,
    right: 2,
  },
  featherIcon: {
    position: "absolute",
    backgroundColor: "white",
    padding: 5,
    borderWidth: 1,
    borderColor: "#2f2d51",
    borderRadius: 50,

    alignItems: "center",
    justifyContent: "center",

    bottom: 4,
    right: 2,
  },
});
