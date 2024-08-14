// @ts-nocheck
import React, { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Network from "expo-network";
import * as Notifications from "expo-notifications";
import { Link } from "expo-router";
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
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ActualTheme } from "@types/reduxTypes";

import globeBg from "../../assets/globe-bg.png";
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

  if (currentUser && currentUser?.full_name === null) {
    return (
      <WelcomeModal
        actualTheme={actualTheme}
        colorScheme={colorScheme}
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
      <View
        style={getMainBackgroundColorStyle(actualTheme)}
        className="flex-1 justify-center gap-2 items-center bg-light-background dark:bg-dark-background"
      >
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
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter text-lg font-medium text-light-primary dark:text-dark-primary"
        >
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
          actualTheme={actualTheme}
          colorScheme={colorScheme}
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
        <Link className="w-1/2" href={`/${PUBLIC_COMMUNITY_SCREEN}`}>
          <View
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="flex-1 min-h-32 max-h-40 justify-between relative p-3 gap-5 rounded-lg bg-light-secondary dark:bg-dark-secondary"
          >
            <Image
              source={globeBg}
              className="absolute bottom-0 right-0 w-24 h-24"
              style={{
                tintColor: "#ababac",
              }}
            />
            <View className="flex-row gap-3 items-center justify-between">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter font-bold text-lg text-light-primary dark:text-dark-primary"
              >
                Public Prayers
              </Text>
              <Entypo
                name="globe"
                size={24}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#a5c9ff"
                      : "#2f2d51"
                }
              />
            </View>
            <View className="gap-3">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter text-sm text-light-primary dark:text-dark-primary"
              >
                Public prayers posted by our users.
              </Text>
              <Link href={`/${PUBLIC_COMMUNITY_SCREEN}`}>
                <View
                  style={getPrimaryBackgroundColorStyle(actualTheme)}
                  className="flex-row items-center rounded-md justify-between w-full px-3 py-2 bg-light-primary dark:bg-dark-accent"
                >
                  <Text
                    style={getPrimaryTextColorStyle(actualTheme)}
                    className="font-inter font-semibold text-light-background dark:text-dark-background"
                  >
                    View
                  </Text>
                  <AntDesign
                    name="right"
                    size={24}
                    color={
                      actualTheme && actualTheme.PrimaryTxt
                        ? actualTheme.PrimaryTxt
                        : colorScheme === "dark"
                          ? "#121212"
                          : "white"
                    }
                  />
                </View>
              </Link>
            </View>
          </View>
        </Link>

        <Link className="w-1/2" href={`/${QUESTION_LIST_SCREEN}`}>
          <View
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="flex-1 min-h-32 max-h-40 justify-between relative p-3 gap-5 rounded-lg bg-light-secondary dark:bg-dark-secondary"
          >
            <Image
              source={questionBg}
              className="absolute bottom-0 right-0 w-24 h-24"
              style={{
                tintColor: "#ababac",
              }}
            />
            <View className="flex-row justify-between items-center">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter font-bold text-lg text-light-primary dark:text-dark-primary"
              >
                Questions
              </Text>
              <MaterialCommunityIcons
                name="frequently-asked-questions"
                size={24}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme == "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </View>
            <View className="gap-3">
              <Text
                className="font-inter text-sm text-light-primary dark:text-dark-primary"
                style={getSecondaryTextColorStyle(actualTheme)}
              >
                Weekly questions to reflect on.
              </Text>
              <Link href={`/${QUESTION_LIST_SCREEN}`}>
                <View
                  style={getPrimaryBackgroundColorStyle(actualTheme)}
                  className="flex-row items-center rounded-md justify-between w-full px-3 py-2 bg-light-primary dark:bg-dark-accent"
                >
                  <Text
                    style={getPrimaryTextColorStyle(actualTheme)}
                    className="font-inter font-bold text-light-background dark:text-dark-background"
                  >
                    View
                  </Text>
                  <AntDesign
                    name="right"
                    size={24}
                    color={
                      actualTheme && actualTheme.PrimaryTxt
                        ? actualTheme.PrimaryTxt
                        : colorScheme === "dark"
                          ? "#121212"
                          : "#2f2d51"
                    }
                  />
                </View>
              </Link>
            </View>
          </View>
        </Link>
      </View>
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-bold text-2xl text-light-primary dark:text-dark-primary"
          >
            Prayer Groups
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            onPress={() => setModalVisible(true)}
            className="flex-row items-center rounded-lg gap-2 p-2"
          >
            <Text
              style={getPrimaryTextColorStyle(actualTheme)}
              className="font-inter font-bold text-lg text-light-primary dark:text-dark-accent"
            >
              Create
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            onPress={() => setJoinVisible(true)}
            className="flex-row items-center rounded-lg gap-2 p-2"
          >
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter font-bold text-lg text-light-primary dark:text-dark-accent"
            >
              Join
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {userGroups?.length == 0 && (
        <View className="flex-1 pt-10 gap-3 justify-center items-center">
          <FontAwesome
            name="group"
            size={40}
            color={
              actualTheme && actualTheme.MainTxt
                ? actualTheme.MainTxt
                : colorScheme == "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter font-semibold text-light-primary dark:text-dark-primary"
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
          showsVerticalScrollIndicator={false}
          windowSize={8}
          ListFooterComponent={() => <View className="h-7" />}
          contentContainerStyle={{ gap: 15 }}
          showsHorizontalScrollIndicator={false}
          data={userGroups}
          keyExtractor={(e, i) => i.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(PRAYER_GROUP_SCREEN, {
                    group_id: item.group_id,
                    // group: item,
                    // allGroups: groups.filter(
                    //   (g) => g.group_id === item.group_id
                    // ),
                  })
                }
                style={
                  actualTheme &&
                  actualTheme.MainTxt && {
                    borderColor: actualTheme.MainTxt,
                  }
                }
                className=" p-3 w-full border border-light-primary rounded-lg"
              >
                <View className="flex-1 justify-between gap-5">
                  <View className="gap-1 ">
                    <View className="flex-row justify-between">
                      <Text
                        style={getMainTextColorStyle(actualTheme)}
                        className="flex-1 font-inter font-semibold text-xl text-light-primary dark:text-dark-primary"
                      >
                        {item.groups.name}
                      </Text>
                      <TouchableOpacity
                        style={getPrimaryBackgroundColorStyle(actualTheme)}
                        className="bg-light-primary flex-row gap-1 p-1.5 rounded-lg dark:bg-dark-secondary items-center justify-between"
                      >
                        <Feather
                          name="copy"
                          size={16}
                          color={
                            actualTheme && actualTheme.PrimaryTxt
                              ? actualTheme.PrimaryTxt
                              : colorScheme === "dark"
                                ? "white"
                                : "white"
                          }
                        />
                        <Text
                          style={getPrimaryTextColorStyle(actualTheme)}
                          className="text-light-background text-sm font-inter font-semibold dark:text-dark-primary"
                        >
                          {item.groups.code}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {item.groups.description && (
                      <Text
                        style={getMainTextColorStyle(actualTheme)}
                        className="font-inter  text-light-primary dark:text-dark-primary"
                      >
                        {item.groups?.description}
                      </Text>
                    )}
                  </View>

                  <View className="flex-row px-3 w-full items-center">
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
                            className="w-9 h-9 rounded-full"
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
                            style={getMainTextColorStyle(actualTheme)}
                            className="ml-1 font-inter text-light-primary dark:text-dark-primary"
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
        actualTheme={actualTheme}
        theme={colorScheme}
        user={currentUser}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <JoinModal
        getUserGroups={getUserGroups}
        getGroupUsers={getGroupUsers}
        supabase={supabase}
        actualTheme={actualTheme}
        theme={colorScheme}
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
