//@ts-nocheck

import React, { useState } from "react";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import uuid from "react-native-uuid";
import { useSelector } from "react-redux";

import { Feather } from "@expo/vector-icons";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

import config from "../config";
import { useSupabase } from "../context/useSupabase";
import { Container, HeaderTitle, HeaderView } from "../styles/appStyles";

const ProfileSetup = () => {
  const { colorScheme } = useColorScheme();

  const { currentUser, setCurrentUser, logout, supabase } = useSupabase();
  const actualTheme = useSelector(
    (state: { theme: ActualTheme }) => state.theme.actualTheme,
  );

  const [name, setName] = useState("");
  const router = useRouter();
  const [isUnique, setIsUnique] = useState(true);
  const [image, setImage] = useState("");

  const handleBacktoSignIn = async () => {
    logout();
    router.replace("login");
  };

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
      visibilityTime: 3000,
    });
  };

  const photoPermission = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showToast(
          "error",
          "We need camera roll permissions to make this work!",
        );
      } else {
        pickImage();
      }
    }
  };

  async function getProfile() {
    const { data: profiles } = await supabase
      .from("profiles")
      .select()
      .eq("id", currentUser?.id);
    setCurrentUser(profiles[0]);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const ext = result.assets[0].uri.substring(
        result.assets[0].uri.lastIndexOf(".") + 1,
      );

      const fileName = result.assets[0].uri.replace(/^.*[\\/]/, "");

      const filePath = `${fileName}`;
      const formData = new FormData();
      formData.append("files", {
        uri: result.assets[0].uri,
        name: fileName,
        type: result.assets[0].type ? `image/${ext}` : `video/${ext}`,
      });

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, formData);

      if (uploadError) {
        throw uploadError;
      }

      const { data: imageData, error: getUrlError } = await supabase.storage
        .from("avatars")
        .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry

      if (getUrlError) {
        throw getUrlError;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          avatar_url: imageData.signedUrl,
        })
        .eq("id", currentUser.id);

      if (error) {
        throw error;
      }
      getProfile();
    }
  };

  const checkIfUnique = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("full_name")
      .neq("id", currentUser.id);

    const isUnique = profiles.every((prof) => {
      const profileName = prof.full_name || ""; // Handle null or undefined

      return name.trim().toLowerCase() !== profileName.trim().toLowerCase();
    });

    return isUnique;
  };

  const handleNext = async () => {
    if (name.length === 0) {
      showToast("error", "Username field is required.");
      return;
    }

    const isUniqueName = await checkIfUnique();

    if (!isUniqueName) {
      setIsUnique(false);
    }

    if (isUniqueName) {
      const { data } = await supabase
        .from("profiles")
        .update({
          full_name: name,
        })
        .eq("id", currentUser.id)
        .select();
      showToast("success", "Profile has been created.");
      setCurrentUser(data[0]);
      router.replace("/(tabs)/community");
    }
  };

  async function handleAnonymous() {
    const id = uuid.v4();
    const newId = id.substring(0, 3);
    setName(`Anonymous${newId}`);
    setImage(
      "https://cdn.glitch.global/9c6cd6b6-a7ae-4da4-be68-09611ad266da/user_3177440.png?v=1692410467559",
    );
    await supabase
      .from("profiles")
      .update({
        full_name: `Anonymous${newId}`,
        avatar_url:
          "https://cdn.glitch.global/9c6cd6b6-a7ae-4da4-be68-09611ad266da/user_3177440.png?v=1692410467559",
      })
      .eq("id", currentUser.id)
      .select();
  }

  return (
    <Container
      style={getMainBackgroundColorStyle(actualTheme)}
      className="flex-1 justify-center w-full gap-2 items-center bg-light-background dark:bg-dark-background"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        className="w-full"
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View
          style={getMainBackgroundColorStyle(actualTheme)}
          className="bg-light-background flex-1 w-full dark:bg-dark-background justify-center items-center gap-5"
        >
          <HeaderView className="items-center justify-center">
            <HeaderTitle
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter-bold text-wrap text-center text-light-primary dark:text-dark-accent"
            >
              Welcome to Community
            </HeaderTitle>
          </HeaderView>
          <View className="relative self-center w-full h-32 justify-center items-center">
            <TouchableOpacity
              onPress={photoPermission}
              className="absolute bg-light-secondary dark:bg-dark-secondary rounded-full p-3 w-32 h-32 items-center justify-center"
              style={getSecondaryBackgroundColorStyle(actualTheme)}
            >
              {image.length === 0 ? (
                <Text className="font-inter-medium text-xs text-center text-light-primary dark:text-dark-primary">
                  Upload Profile Image (Optional)
                </Text>
              ) : (
                <Image
                  className="w-32 h-32 rounded-full"
                  source={{
                    uri: image,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>

          <View className="w-full gap-2">
            <View className="flex-row items-center justify-between">
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter-semibold text-lg text-light-primary dark:text-dark-primary"
              >
                Username (Required)
              </Text>
              <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                <Text className="font-inter-medium text-sm text-red-500">
                  Dismiss Keyboard
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                getSecondaryTextColorStyle(actualTheme),
                getSecondaryBackgroundColorStyle(actualTheme),
              ]}
              className="font-inter-regular w-full bg-light-secondary dark:bg-dark-secondary p-4 rounded-md"
              selectionColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
              placeholder="Enter a username"
              placeholderTextColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
              value={name}
              onChangeText={(text) => setName(text)}
            />
            {!isUnique && (
              <Text className="font-inter-medium text-red-500">
                This name already exists. Try again.
              </Text>
            )}
          </View>
          <View className="relative h-5 w-full justify-center items-center">
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-full bg-light-primary dark:bg-dark-accent h-[1px]"
            />
            <Text
              style={getMainBackgroundColorStyle(actualTheme)}
              className="absolute tracking-wide font-inter-semibold bg-light-background dark:bg-dark-background px-2"
            >
              Or
            </Text>
          </View>
          <View className="w-full items-center justify-center gap-3">
            <TouchableOpacity onPress={handleAnonymous}>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter-medium underline text-light-primary dark:text-dark-accent"
              >
                Be Anonymous
              </Text>
            </TouchableOpacity>
            <View className="bg-[#fbe2b2] border border-[#ffa500] w-full rounded-md p-3 gap-2">
              <View className="flex-row items-center gap-2">
                <Feather name="alert-triangle" size={26} color="#eb9800" />
                <Text className="font-inter-bold text-[#c08314] text-lg">
                  Alert
                </Text>
              </View>
              <Text className="font-inter-medium text-[#c4840e]">
                To ensure that setup is done correctly, make sure you are signed
                in on one device per account.
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleNext}
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="w-full p-5 my-3 items-center rounded-md bg-light-primary dark:bg-dark-accent"
            >
              <Text
                style={getPrimaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-light-background dark:text-dark-primary"
              >
                Get Right in!
              </Text>
            </TouchableOpacity>

            <Text
              style={getMainTextColorStyle(actualTheme)}
              onPress={handleBacktoSignIn}
              className="font-inter-semibold underline text-sm text-light-primary dark:text-dark-primary"
            >
              Back to Sign in
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ProfileSetup;
