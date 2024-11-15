// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useColorScheme } from "nativewind";
import {
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "@types/reduxTypes";

import { useSupabase } from "../context/useSupabase";
import {
  Container,
  ModalActionGroup,
  ModalContainer,
  ModalView,
} from "../styles/appStyles";

const LoginScreen = () => {
  const [forgotModal, setForgotModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, login, getGoogleOAuthUrl, setOAuthSession } = useSupabase();
  const [passVisible, setPassVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const router = useRouter();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );
  const { colorScheme } = useColorScheme();
  useEffect(() => {
    WebBrowser.warmUpAsync();

    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 5000,
    });
  };

  const SignUp = () => {
    if (email.length === 0 || password.length === 0) {
      showToast("error", "Email and password fields can't be empty.");
    } else {
      register(email, password);
      setIsLoggingIn(true);
      // setCheckInbox(true);
    }
  };

  const resetAccount = () => {
    setForgotModal(false);
    Linking.openURL("mailto:arzsahag@gmail.com");
  };

  const onSignInWithGoogle = async () => {
    try {
      const url = await getGoogleOAuthUrl();
      if (!url) {
        showToast("error", "Failed to get Google sign-in URL");
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(
        url,
        "prayseapp://google-auth",
        {
          showInRecents: true,
        },
      );

      if (result.type === "success") {
        const data = extractParamsFromUrl(result.url);

        if (!data.access_token || !data.refresh_token) {
          showToast("error", "Failed to get authentication tokens");
          return;
        }

        await setOAuthSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
      } else if (result.type === "cancel") {
        showToast("info", "Google sign-in was cancelled");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      showToast("error", "An error occurred during Google sign-in");
    }
  };

  const extractParamsFromUrl = (url) => {
    const params = new URLSearchParams(url.split("#")[1]);
    const data = {
      access_token: params.get("access_token"),
      //@ts-nocheck
      expires_in: parseInt(params.get("expires_in") || "0", 10),
      refresh_token: params.get("refresh_token"),
      token_type: params.get("token_type"),
      provider_token: params.get("provider_token"),
    };

    return data;
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <Container
        style={getMainBackgroundColorStyle(actualTheme)}
        className="bg-light-background relative dark:bg-dark-background justify-center items-center"
      >
        <AntDesign
          onPress={() => router.replace("/(tabs)/welcome")}
          className="self-start"
          name="left"
          size={24}
          color={
            actualTheme && actualTheme.MainTxt
              ? actualTheme.MainTxt
              : colorScheme === "dark"
                ? "white"
                : "#2f2d51"
          }
        />
        <View className="items-center gap-2 mb-4">
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-bold text-light-primary dark:text-dark-primary text-3xl"
          >
            {isLoggingIn ? "Sign In" : "Sign Up"}
          </Text>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="font-inter-medium text-lg text-light-primary dark:text-dark-primary"
          >
            Connect and pray for one another.
          </Text>
        </View>
        {isLoggingIn && (
          <>
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-full bg-light-secondary dark:bg-dark-secondary flex-row p-5 mb-3 rounded-lg relative justify-between items-center"
            >
              <TextInput
                style={getSecondaryTextColorStyle(actualTheme)}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                selectionColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                }
                placeholderTextColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                }
                value={email}
                blurOnSubmit
                className="w-3/4 text-light-primary dark:text-dark-primary font-inter-regular"
                placeholder="Enter email"
              />
            </View>
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-full bg-light-secondary dark:bg-dark-secondary flex-row p-5 mb-3 rounded-lg relative justify-between items-center"
            >
              <TextInput
                style={getSecondaryTextColorStyle(actualTheme)}
                cursorColor={colorScheme === "dark" ? "white" : "#2f2d51"}
                onChangeText={(text) => setPassword(text)}
                value={password}
                autoCapitalize="none"
                blurOnSubmit
                secureTextEntry={!passVisible}
                selectionColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                }
                placeholderTextColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                }
                className="w-3/4 text-light-primary dark:text-dark-primary font-inter-regular"
                placeholder="Enter password"
              />
              <TouchableOpacity
                onPress={() => setPassVisible(!passVisible)}
                className="justify-center items-center"
              >
                {passVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={17}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "#d6d6d6"
                          : "#2f2d51"
                    }
                  />
                ) : (
                  <Ionicons
                    name="eye-outline"
                    size={17}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "#d6d6d6"
                          : "#2f2d51"
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => setForgotModal(true)}
              className="self-end mb-3"
            >
              <Text className="font-inter-medium text-red-500 text-sm">
                Forgot password?
              </Text>
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent
              visible={forgotModal}
              onRequestClose={() => setForgotModal(false)}
              statusBarTranslucent
              // onShow={() => inputRef.current?.focus()}
            >
              <ModalContainer
                style={
                  colorScheme === "dark"
                    ? { backgroundColor: "rgba(0, 0, 0, 0.5)" }
                    : { backgroundColor: "rgba(0, 0, 0, 0.5)" }
                }
              >
                <ModalView
                  style={getSecondaryBackgroundColorStyle(actualTheme)}
                  className="bg-light-secondary dark:bg-dark-secondary w-5/6"
                >
                  <Text
                    className="font-inter-bold text-center text-2xl text-light-primary dark:text-dark-primary"
                    style={getSecondaryTextColorStyle(actualTheme)}
                  >
                    Forgot Password
                  </Text>

                  <ModalActionGroup>
                    <TouchableOpacity
                      onPress={resetAccount}
                      style={getPrimaryBackgroundColorStyle(actualTheme)}
                      className="bg-light-primary dark:bg-dark-accent w-full flex-row items-center justify-center p-4 rounded-lg"
                    >
                      <MaterialCommunityIcons
                        name="email-edit-outline"
                        className="mr-3"
                        size={24}
                        color={
                          actualTheme && actualTheme.PrimaryTxt
                            ? actualTheme.PrimaryTxt
                            : colorScheme === "dark"
                              ? "#121212"
                              : "white"
                        }
                      />
                      <Text
                        style={getPrimaryTextColorStyle(actualTheme)}
                        className="font-inter-semibold  text-light-background dark:text-dark-background"
                      >
                        Contact Developer
                      </Text>
                    </TouchableOpacity>
                  </ModalActionGroup>
                </ModalView>
              </ModalContainer>
            </Modal>

            <TouchableOpacity
              onPress={async () => {
                if (email.length === 0 && password.length === 0) {
                  showToast(
                    "error",
                    "Email and password field can't be empty.",
                  );
                  return;
                }
                await login(email, password);
                // console.log("user in login: ", currentUser);

                setEmail("");
                setPassword("");
                Keyboard.dismiss();

                // router.replace("/(tabs)/community");
              }}
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="bg-light-primary dark:bg-dark-accent p-4 rounded-lg w-full justify-center items-center"
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-light-background text-lg dark:text-dark-background"
              >
                Login
              </Text>
            </TouchableOpacity>
            <View className="w-full justify-center items-center">
              <View
                style={getSecondaryBackgroundColorStyle(actualTheme)}
                className="w-full h-[2px] absolute self-center bg-light-secondary dark:bg-dark-secondary"
              />
              <Text
                style={[
                  getMainBackgroundColorStyle(actualTheme),
                  getMainTextColorStyle(actualTheme),
                ]}
                className="my-2 p-3 font-inter-medium text-light-primary dark:text-dark-primary bg-light-background dark:bg-dark-background"
              >
                Or
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                onSignInWithGoogle();
                Keyboard.dismiss();
              }}
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="bg-light-secondary dark:bg-dark-secondary p-4 rounded-lg justify-center items-center w-full flex-row gap-3"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-light-primary text-lg dark:text-dark-primary"
              >
                Sign in with Google
              </Text>
              <AntDesign
                name="google"
                size={24}
                color={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLoggingIn(false)}
              className="mt-5"
            >
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="underline underline-offset-4 font-inter-medium text-light-primary dark:text-dark-accent"
              >
                Don't have an account yet? Sign up.
              </Text>
            </TouchableOpacity>
          </>
        )}
        {!isLoggingIn && (
          <>
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-full bg-light-secondary dark:bg-dark-secondary flex-row p-5 mb-3 rounded-lg relative justify-between items-center"
            >
              <TextInput
                style={getSecondaryTextColorStyle(actualTheme)}
                onChangeText={(text) => setEmail(text)}
                autoCapitalize="none"
                selectionColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                }
                placeholderTextColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                }
                value={email}
                blurOnSubmit
                className="w-3/4 text-light-primary dark:text-dark-primary font-inter-regular"
                placeholder="Enter email"
              />
            </View>
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-full bg-light-secondary dark:bg-dark-secondary flex-row p-5 mb-3 rounded-lg relative justify-between items-center"
            >
              <TextInput
                style={getSecondaryTextColorStyle(actualTheme)}
                cursorColor={colorScheme === "dark" ? "white" : "#2f2d51"}
                onChangeText={(text) => setPassword(text)}
                value={password}
                autoCapitalize="none"
                blurOnSubmit
                secureTextEntry={!passVisible}
                selectionColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                }
                placeholderTextColor={
                  actualTheme && actualTheme.SecondaryTxt
                    ? actualTheme.SecondaryTxt
                    : colorScheme === "dark"
                      ? "#d6d6d6"
                      : "#423f72"
                }
                className="w-3/4 text-light-primary dark:text-dark-primary font-inter-regular"
                placeholder="Enter password"
              />
              <TouchableOpacity
                onPress={() => setPassVisible(!passVisible)}
                className="justify-center items-center"
              >
                {passVisible ? (
                  <Ionicons
                    name="eye-off-outline"
                    size={17}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "#d6d6d6"
                          : "#2f2d51"
                    }
                  />
                ) : (
                  <Ionicons
                    name="eye-outline"
                    size={17}
                    color={
                      actualTheme && actualTheme.SecondaryTxt
                        ? actualTheme.SecondaryTxt
                        : colorScheme === "dark"
                          ? "#d6d6d6"
                          : "#2f2d51"
                    }
                  />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={SignUp}
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="bg-light-primary dark:bg-dark-accent p-4 rounded-lg justify-center items-center w-full flex-row gap-3"
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-light-background text-lg dark:text-dark-background"
              >
                Sign Up
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLoggingIn(true)}
              className="mt-5"
            >
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="underline underline-offset-2 text-sm font-inter-medium text-light-primary dark:text-dark-accent"
              >
                Already have an account yet? Sign in.
              </Text>
            </TouchableOpacity>
          </>
        )}
        <View className="mt-10">
          <Text className="dark:text-dark-primary text-light-primary font-inter-regular  mt-5 text-sm">
            Confess your faults one to another, and pray one for another, that
            ye may be healed. The effectual fervent prayer of a righteous man
            availeth much. - James 5:16
          </Text>
        </View>
      </Container>
      {/* <CheckInboxModal checkInbox={checkInbox} setCheckInbox={setCheckInbox} /> */}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
