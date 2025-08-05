// @ts-nocheck
import React, { useEffect, useState } from "react";
import * as Application from "expo-application";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Link } from "expo-router";
import { useColorScheme } from "nativewind";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { Ionicons } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
} from "@lib/customStyles";

import config from "../config";
import { large, regular, small } from "../redux/userReducer";
import { MORE_SCREEN } from "../routes";
import { Container } from "@components/Container";
import HeaderText from "@components/HeaderText";

const SettingsScreen = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const size = useSelector((state) => state.user.fontSize);
  const dispatch = useDispatch();

  const { colorScheme, setColorScheme } = useColorScheme();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  useEffect(() => {
    // getlastUpdate();
    getPermission();
  }, []);

  async function sendToken(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
    };
    await fetch(config.notificationApi, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  async function getPermission() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        setIsEnabled(false);
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
        await Notifications.getExpoPushTokenAsync({
          projectId: config.projectId,
        })
      ).data;
      setIsEnabled(true);
      console.log(token);
    } else {
      console.log("Must use physical device for Push Notifications");
    }
    sendToken(token);
  }

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
    if (isEnabled === false) {
      getPermission();
    }
  };

  const changeFont = (font) => {
    if (font === "large") {
      dispatch(large());
    }
    if (font === "regular") {
      dispatch(regular());
    }
    if (font === "small") {
      dispatch(small());
    }
  };

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="bg-light-background dark:bg-dark-background justify-between"
    >
      <View className="gap-2">
        <View>
          <View
            style={{
              marginVertical: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Link className="mr-2" href={`/${MORE_SCREEN}`}>
              <Ionicons
                name="chevron-back"
                size={30}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "light"
                      ? "#2f2d51"
                      : "white"
                }
              />
            </Link>
            <HeaderText text="Settings" />
          </View>
        </View>
        <View>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
          >
            APPEARANCE
          </Text>
          {actualTheme && actualTheme.MainTxt ? (
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-regular text-light-primary dark:text-dark-primary"
            >
              You are using a custom theme.
            </Text>
          ) : (
            <View className="mt-1 flex-row justify-between gap-3">
              <View className="w-[30%]">
                <TouchableOpacity
                  onPress={() => setColorScheme("light")}
                  style={
                    colorScheme === "light"
                      ? styles.activeLight
                      : styles.inactiveLight
                  }
                >
                  <View className="absolute bottom-0 right-0 rounded-tl-lg bg-white aspect-square w-full">
                    <Text className="font-inter-medium pl-2">Aa</Text>
                  </View>
                </TouchableOpacity>
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-medium mt-2 text-light-primary dark:text-dark-primary"
                >
                  Light theme
                </Text>
              </View>
              <View className="w-[30%]">
                <TouchableOpacity
                  onPress={() => setColorScheme("dark")}
                  style={
                    colorScheme === "dark"
                      ? styles.activeDark
                      : styles.inactiveDark
                  }
                >
                  <View className="absolute bottom-0 right-0 rounded-tl-lg bg-dark-background aspect-square w-full">
                    <Text className="font-inter-medium text-white  pl-2">
                      Aa
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-medium mt-2 text-light-primary dark:text-dark-primary"
                >
                  Dark theme
                </Text>
              </View>
              <View className="w-[30%]">
                <TouchableOpacity
                  onPress={() => setColorScheme("system")}
                  className="relative overflow-hidden bg-dark-background aspect-square w-full rounded-lg"
                >
                  <View className="absolute right-0 bg-dark-secondary h-full w-1/2">
                    <Text className="font-inter-medium pl-2 text-white">
                      Aa
                    </Text>
                  </View>
                  <View className="absolute left-0 bg-white h-full w-1/2">
                    <Text className="font-inter-medium pl-2 text-dark-background">
                      Aa
                    </Text>
                  </View>
                </TouchableOpacity>
                <Text
                  style={getMainTextColorStyle(actualTheme)}
                  className="font-inter-medium mt-2 text-light-primary dark:text-dark-primary"
                >
                  System theme
                </Text>
              </View>
            </View>
          )}
        </View>
        <View className="mt-2">
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-semibold mb-1 text-lg text-light-primary dark:text-dark-primary"
          >
            FONT SIZE (PRAYERS ONLY)
          </Text>

          <View>
            <View className="mb-2 flex-row items-center">
              <TouchableOpacity
                onPress={() => changeFont("large")}
                style={size === 20 ? styles.FontActive : styles.FontInActive}
              >
                <Text className="font-inter-medium text-xl text-black">
                  Large
                </Text>
              </TouchableOpacity>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter-regular pl-3 text-xl text-light-primary dark:text-dark-primary"
              >
                Text example
              </Text>
            </View>
            <View className="mb-2 flex-row items-center">
              <TouchableOpacity
                onPress={() => changeFont("regular")}
                style={size === 16 ? styles.FontActive : styles.FontInActive}
              >
                <Text className="text-base text-black">Regular Font</Text>
              </TouchableOpacity>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter-regular pl-3 text-base text-light-primary dark:text-dark-primary"
              >
                Text example
              </Text>
            </View>
            <View className="mb-2 flex-row items-center">
              <TouchableOpacity
                onPress={() => changeFont("small")}
                style={size === 12 ? styles.FontActive : styles.FontInActive}
              >
                <Text className="text-sm font-inter-regular text-black">
                  Small Font
                </Text>
              </TouchableOpacity>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter-regular pl-3 text-sm text-light-primary dark:text-dark-primary"
              >
                Text example
              </Text>
            </View>
          </View>
          <View className="w-full flex-row items-center mt-1 justify-between">
            <Text
              className="font-inter-medium text-light-primary dark:text-dark-primary"
              style={getMainTextColorStyle(actualTheme)}
            >
              Notifications
            </Text>
            <Switch
              trackColor={{ false: "grey", true: "grey" }}
              thumbColor={isEnabled ? "green" : "white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
      </View>
      <View className="mb-4 gap-2 items-center justify-center">
        <Text
          style={getMainTextColorStyle(actualTheme)}
          className="font-inter-medium text-light-primary dark:text-dark-primary"
        >
          {Application.applicationName} v {Application.nativeApplicationVersion}
        </Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  reviewButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 15,
    backgroundColor: "white",
  },
  clearAllDark: {
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#212121",
    borderRadius: 5,
  },
  clearAll: {
    width: "100%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#b7d3ff",
    borderRadius: 5,
  },
  reviewButtonDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 15,
    backgroundColor: "#212121",
  },
  donateButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    width: "45%",
    backgroundColor: "white",
  },
  donateButtonDark: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    width: "45%",
    backgroundColor: "white",
  },
  wrapper: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  feedback: {
    backgroundColor: "#2f2d51",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    padding: 15,
    width: "100%",
  },
  feedbackDark: {
    backgroundColor: "#2e2e2e",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    padding: 15,
    width: "100%",
  },
  settingsTitleDark: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontFamily: "Inter-Medium",
  },
  activeLight: {
    borderWidth: 2,
    borderColor: "#A5C9FF",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#d3d3d3",
    aspectRatio: 1 / 1,
    width: "100%",
    borderRadius: 5,
    padding: 35,
  },
  inactiveLight: {
    borderWidth: 2,
    borderColor: "#d3d3d3",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#d3d3d3",
    aspectRatio: 1 / 1,
    width: "100%",
    borderRadius: 5,
    padding: 35,
  },
  lightButton: {
    position: "absolute",
    bottom: 0,
    right: -1,
    borderTopLeftRadius: 5,
    backgroundColor: "white",
    aspectRatio: 1 / 1,
    width: "100%",
  },
  darkButton: {
    position: "absolute",
    bottom: 0,
    right: -1,
    borderTopLeftRadius: 5,
    backgroundColor: "#212121",
    aspectRatio: 1 / 1,
    width: "100%",
  },
  system: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "black",
    aspectRatio: 1 / 1,
    width: "100%",
    borderRadius: 5,
  },
  systemDark: {
    position: "absolute",
    right: -1,
    backgroundColor: "#212121",
    height: "100%",
    width: "50%",
  },
  systemLight: {
    position: "absolute",
    left: -1,
    backgroundColor: "white",
    height: "100%",
    width: "50%",
  },
  activeDark: {
    borderWidth: 2,
    borderColor: "#A5C9FF",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#373737",
    aspectRatio: 1 / 1,
    width: "100%",
    borderRadius: 5,
    padding: 35,
  },
  inactiveDark: {
    borderWidth: 2,
    borderColor: "#212121",
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#373737",
    aspectRatio: 1 / 1,
    width: "100%",
    borderRadius: 5,
    padding: 35,
  },
  FontActive: {
    borderWidth: 3,
    borderColor: "#A5C9FF",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    height: 80,
    width: 100,
    borderRadius: 5,
  },
  FontInActive: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d3d3d3",
    height: 80,
    width: 100,
    borderRadius: 5,
  },
  settingsTitle: {
    color: "#2f2d51",
    textAlign: "center",
    fontSize: 17,
    fontFamily: "Inter-Medium",
  },
  appearance: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    paddingBottom: 5,
    color: "#2f2d51",
  },
  appearanceDark: {
    fontSize: 15,
    fontFamily: "Inter-Medium",
    paddingBottom: 5,
    color: "white",
  },
  fontSizeWrapper: {
    display: "flex",
    justifyContent: "space-between",
  },
});

export default SettingsScreen;
