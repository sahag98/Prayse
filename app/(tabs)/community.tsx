// @ts-nocheck
import React, { useCallback, useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Network from "expo-network";
import * as Notifications from "expo-notifications";
import {
  Link,
  Redirect,
  useFocusEffect,
  useNavigation,
  useRouter,
} from "expo-router";
import { useColorScheme } from "nativewind";
import {
  FlatList,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import {
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
import { posthog } from "@lib/posthog";
import { useIsFocused } from "@react-navigation/native";
import { ActualTheme } from "@types/reduxTypes";

import config from "../../config";
import { useSupabase } from "../../context/useSupabase";
import CreateGroupModal from "../../modals/CreateGroupModal";
import JoinModal from "../../modals/JoinModal";
import ProfileModal from "../../modals/ProfileModal";
import { PRAYER_GROUP_SCREEN, QUESTION_LIST_SCREEN } from "../../routes";
import { HeaderTitle } from "../../styles/appStyles";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

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

  const [modalVisible, setModalVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [joinVisible, setJoinVisible] = useState(false);
  const [extended, setExtended] = useState(true);
  const statusBarHeight = Constants.statusBarHeight;

  const [userPrayers, setUserPrayers] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [groups, setGroups] = useState([]);
  const isIOS = Platform.OS === "ios";

  const [hasConnection, setHasConnection] = useState(true);
  const rotation = useSharedValue(0);
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  useEffect(() => {
    const checkAndRedirect = async () => {
      if (!currentUser) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          if (profile) {
            setCurrentUser(profile);
          } else {
            router.replace("/profile-setup");
          }
        } else {
          router.replace("/login");
        }
      }
    };

    checkAndRedirect();
  }, [currentUser]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const showToast = (type) => {
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

  useFocusEffect(
    // Callback should be wrapped in `React.useCallback` to avoid running the effect too often.
    useCallback(() => {
      // Invoked whenever the route is focused.
      const checkConnection = async () => {
        const connected = await Network.getNetworkStateAsync();
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
      // Return function is invoked whenever the route gets out of focus.
      return () => {
        console.log("This route is now unfocused.");
      };
    }, []),
  );

  useEffect(() => {
    getUserGroups();
    getGroupUsers();
  }, [refreshMembers]);

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

  async function getUserGroups() {
    try {
      const { data: groups } = await supabase
        .from("members")
        .select("*,groups(*), profiles(*)")
        .eq("user_id", currentUser?.id)
        .order("id", { ascending: false });
      setUserGroups(groups);
    } catch (error) {
      console.log(error);
    }
  }

  async function getGroupUsers() {
    const { data: groups } = await supabase
      .from("members")
      .select("*,groups(*), profiles(*)")
      .order("id", { ascending: true });
    setGroups(groups);
    setRefreshMembers(false);
  }

  async function sendToken(expoPushToken) {
    await supabase
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
      return;
    }
    sendToken(token);
  }

  if (!currentUser) {
    console.log("no user still");
    return null;
  }

  if (currentUser && currentUser?.full_name === null) {
    console.log("should redirect to setup");
    return <Redirect href="profile-setup" />;
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
          className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
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
            className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary"
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
                  : colorScheme === "dark"
                    ? "#121212"
                    : "white"
              }
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <View className="flex-row w-full gap-3 items-center">
        <Link asChild className="w-full" href={`/${QUESTION_LIST_SCREEN}`}>
          <TouchableOpacity
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="flex-1 justify-between relative p-3 gap-5 rounded-lg bg-light-secondary dark:bg-dark-secondary"
          >
            <View className="flex-row justify-between items-center">
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-xl text-light-primary dark:text-dark-primary"
              >
                Questions
              </Text>
              <MaterialCommunityIcons
                name="frequently-asked-questions"
                size={24}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </View>
            <View className="gap-3">
              <Text
                className="font-inter-medium leading-6 text-light-primary dark:text-dark-primary"
                style={getSecondaryTextColorStyle(actualTheme)}
              >
                Weekly biblical questions to answer and reflect on.
              </Text>
              <Link
                asChild
                className="w-full"
                href={`/${QUESTION_LIST_SCREEN}`}
              >
                <TouchableOpacity
                  style={getPrimaryBackgroundColorStyle(actualTheme)}
                  className="flex-row items-center rounded-md justify-center w-full p-3 bg-light-primary dark:bg-dark-accent"
                >
                  <Text
                    style={getPrimaryTextColorStyle(actualTheme)}
                    className="font-inter-bold text-lg text-light-background dark:text-dark-background"
                  >
                    View
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </TouchableOpacity>
        </Link>
      </View>
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
      <View className="flex-1 mt-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-bold text-2xl text-light-primary dark:text-dark-primary"
            >
              Prayer Groups
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              onPress={() => {
                setModalVisible(true);
                posthog.capture("Create group");
              }}
              className="flex-row bg-light-primary dark:bg-dark-accent items-center rounded-lg gap-2 p-2"
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-lg text-light-background dark:text-dark-background"
              >
                Create
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              onPress={() => {
                setJoinVisible(true);
                posthog.capture("Join group");
              }}
              className="flex-row items-center rounded-lg gap-2 p-2"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-lg text-light-primary dark:text-dark-accent"
              >
                Join
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={userGroups}
          className="flex-1 mt-4"
          contentContainerStyle={{ flexGrow: 1, gap: 10 }} // Increased bottom padding and added flexGrow
          keyExtractor={(item) => item.id.toString()}
          onEndReachedThreshold={0}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View className="flex-1 gap-3 justify-center items-center">
              <FontAwesome
                name="group"
                size={40}
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
                className="font-inter-semibold text-light-primary dark:text-dark-primary"
              >
                No groups created or joined.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(PRAYER_GROUP_SCREEN, {
                  group_id: item.group_id,
                })
              }
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-full p-3 h-auto bg-light-secondary dark:bg-dark-secondary rounded-lg"
            >
              <View className="justify-between gap-5">
                <View className="gap-3">
                  <View className="flex-row justify-between">
                    <Text
                      numberOfLines={1}
                      style={getMainTextColorStyle(actualTheme)}
                      className="flex-1 font-inter-semibold text-xl text-light-primary dark:text-dark-primary"
                    >
                      {item.groups.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => copyToClipboard(item.groups.code)}
                      style={getPrimaryBackgroundColorStyle(actualTheme)}
                      className="bg-light-primary flex-row gap-1 p-1.5 rounded-lg dark:bg-dark-background items-center justify-between"
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
                        className="text-light-background text-sm font-inter-semibold dark:text-dark-primary"
                      >
                        {item.groups.code}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {item.groups.description && (
                    <Text
                      numberOfLines={1}
                      style={getMainTextColorStyle(actualTheme)}
                      className="font-inter-regular  text-light-primary dark:text-dark-accent"
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
                          className="ml-1 font-inter-medium text-light-primary dark:text-dark-primary"
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
          )}
        />
      </View>
    </View>
  );
};

export default CommunityHomeScreen;
