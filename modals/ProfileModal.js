import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import uuid from "react-native-uuid";
import { useSelector } from "react-redux";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import ProfilePrayers from "../components/ProfilePrayers";
import { PUBLIC_COMMUNITY_SCREEN } from "../routes";
import { HeaderTitle, HeaderView, ModalContainer } from "../styles/appStyles";
import {
  getMainBackgroundColorStyle,
  getMainTextColorStyle,
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const ProfileModal = ({
  actualTheme,
  colorScheme,
  logout,
  setCurrentUser,
  getPrayers,
  setPrayerModal,
  userPrayers,
  getUserPrayers,
  profileVisible,
  setProfileVisible,
  supabase,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(user?.full_name);
  const [isUnique, setIsUnique] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);
  const [image, setImage] = useState(user?.avatar_url);
  const navigation = useNavigation();
  useEffect(() => {
    getUserPrayers();
  }, []);

  const handleCloseModal = () => {
    setProfileVisible(false);
    setIsUnique(true);
    setIsEmpty(false);
    setName(user?.full_name);
  };

  const addPrayer = () => {
    setProfileVisible(false);
    navigation.navigate(PUBLIC_COMMUNITY_SCREEN);
    setPrayerModal(true);
  };

  async function getProfile() {
    const { data: profiles } = await supabase
      .from("profiles")
      .select()
      .eq("id", user?.id);
    setCurrentUser(profiles[0]);
  }

  function onModalShow() {
    getUserPrayers();
    setIsUnique(true);
    setName(user?.full_name);
    setImage(user?.avatar_url);
  }

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
          "We need camera roll permissions to make this work!"
        );
      } else {
        pickImage();
      }
    }
  };

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
        result.assets[0].uri.lastIndexOf(".") + 1
      );

      const fileName = result.assets[0].uri.replace(/^.*[\\\/]/, "");

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

      const { data, error } = await supabase
        .from("profiles")
        .update({
          avatar_url: imageData.signedUrl,
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }
      getProfile();
      getPrayers();
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  async function handleAnonymous() {
    const id = uuid.v4();
    const newId = id.substring(0, 3);

    await supabase
      .from("profiles")
      .update({
        full_name: `Anonymous${newId}`,
        avatar_url:
          "https://cdn.glitch.global/9c6cd6b6-a7ae-4da4-be68-09611ad266da/user_3177440.png?v=1692410467559",
      })
      .eq("id", user.id)
      .select();
    showToast("success", "Anonymous mode is set. ✔️");
    getProfile();
    getPrayers();
    setProfileVisible(false);
  }

  const checkIfUnique = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("full_name")
      .neq("id", user.id);

    const isUnique = profiles.every((prof) => {
      const profileName = prof.full_name || ""; // Handle null or undefined

      return name.trim().toLowerCase() !== profileName.trim().toLowerCase();
    });

    return isUnique;
  };

  const updateProfile = async () => {
    if (name.length <= 1) {
      setIsEmpty(true);
      return;
    }

    // Wait for checkIfUnique to complete and get the result
    const isUniqueName = await checkIfUnique();

    if (!isUniqueName) {
      setIsUnique(false);
    }

    if (isUniqueName) {
      await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("id", user.id)
        .select();
      showToast("success", "Profile updated successfully. ✔️");
      setProfileVisible(false);
    }
    getProfile();
    getPrayers();
    setIsEmpty(false);
  };

  return (
    <Modal
      animationType="fade"
      onShow={onModalShow}
      transparent
      visible={profileVisible}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, height: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ModalContainer
          className="bg-light-background dark:bg-dark-background justify-start items-start"
          style={[
            getMainBackgroundColorStyle(actualTheme),
            colorScheme === "dark"
              ? {
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingTop: Platform.OS === "ios" ? insets.top : 0,
                  paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
                }
              : {
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingTop: Platform.OS === "ios" ? insets.top : 0,
                  paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
                },
          ]}
        >
          <HeaderView className="w-full flex-row justify-between">
            <TouchableOpacity onPress={handleCloseModal}>
              <AntDesign
                name="close"
                size={30}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "white"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>
            <HeaderTitle
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter font-bold text-light-primary dark:text-dark-primary"
            >
              Profile Settings
            </HeaderTitle>

            <TouchableOpacity onPress={updateProfile}>
              <AntDesign
                name="check"
                size={30}
                color={
                  actualTheme && actualTheme.MainTxt
                    ? actualTheme.MainTxt
                    : colorScheme === "dark"
                      ? "#A5C9FF"
                      : "#2f2d51"
                }
              />
            </TouchableOpacity>
          </HeaderView>
          <View className="relative self-center p-2">
            <Image
              className="w-32 aspect-square rounded-full"
              source={{
                uri: image
                  ? image
                  : "https://cdn.glitch.global/bcf084df-5ed4-42b3-b75f-d5c89868051f/profile-icon.png?v=1698180898451",
              }}
            />
            <TouchableOpacity
              onPress={photoPermission}
              style={getPrimaryBackgroundColorStyle(actualTheme)}
              className="absolute bottom-1 right-2 rounded-full items-center justify-center w-10 h-10 bg-light-primary dark:bg-dark-accent"
            >
              <AntDesign
                name="plus"
                size={20}
                color={
                  actualTheme && actualTheme.PrimaryTxt
                    ? actualTheme.PrimaryTxt
                    : colorScheme === "dark"
                      ? "white"
                      : "white"
                }
              />
            </TouchableOpacity>
          </View>

          <View className="my-3 w-full">
            <Text
              style={getMainTextColorStyle(actualTheme)}
              className="font-inter font-semibold text-lg text-light-primary dark:text-dark-primary"
            >
              Change username
            </Text>
            <TextInput
              className="font-inter w-full border-b border-b-light-primary dark:border-b-dark-primary p-2"
              style={getMainTextColorStyle(actualTheme)}
              selectionColor={
                actualTheme && actualTheme.MainTxt
                  ? actualTheme.MainTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
              value={name}
              onChangeText={(text) => setName(text)}
            />
            {!isUnique && (
              <Text className="font-inter text-sm mt-2 text-red-500">
                This name already exists.
              </Text>
            )}
            {isEmpty && (
              <Text className="font-inter mt-2 text-red-500 text-sm">
                Username field can't be empty.
              </Text>
            )}
          </View>
          <View className="flex-row w-full items-center justify-between">
            <TouchableOpacity onPress={handleAnonymous}>
              <Text
                style={getMainTextColorStyle(actualTheme)}
                className="font-inter font-medium underline text-light-primary dark:text-dark-primary"
              >
                Set Anonymous
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={dismissKeyboard}>
              <Text className="font-inter font-medium text-sm text-red-500">
                Dismiss Keyboard
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={getMainTextColorStyle(actualTheme)}
            className="p-3 text-xl text-center font-inter font-semibold w-full text-light-primary dark:text-dark-primary"
          >
            Prayers Shared
          </Text>
          {userPrayers?.length === 0 ? (
            <View
              style={getSecondaryBackgroundColorStyle(actualTheme)}
              className="w-full gap-1 min-h-32 max-h-56 bg-light-secondary dark:bg-dark-secondary items-center justify-center rounded-lg"
            >
              <Text
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter font-medium text-light-primary dark:text-dark-primary"
              >
                You haven't posted any prayers yet.
              </Text>
              <TouchableOpacity onPress={addPrayer}>
                <Text
                  style={getSecondaryTextColorStyle(actualTheme)}
                  className="font-inter text-lg font-bold underline text-light-primary dark:text-dark-primary"
                >
                  Post a prayer
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              className="w-full bg-light-secondary dark:bg-dark-secondary"
              data={userPrayers}
              keyExtractor={(i) => i.toString()}
              onEndReachedThreshold={0}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator
              renderItem={({ item }) => (
                <ProfilePrayers
                  item={item}
                  theme={colorScheme}
                  actualTheme={actualTheme}
                  user={user}
                  getUserPrayers={getUserPrayers}
                  supabase={supabase}
                  getPrayers={getPrayers}
                />
              )}
            />
          )}
          <TouchableOpacity
            onPress={logout}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="self-end my-3 w-full p-4 rounded-lg flex-row justify-center items-center gap-2 bg-light-primary dark:bg-dark-secondary"
          >
            <Text
              style={getPrimaryTextColorStyle(actualTheme)}
              className="font-inter font-bold text-light-background dark:text-dark-primary"
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </ModalContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ProfileModal;

const styles = StyleSheet.create({
  inputField: {
    marginVertical: 10,
    width: "100%",
  },
  inputDark: {
    color: "white",
    fontFamily: "Inter-Regular",
    width: "100%",
    borderBottomColor: "white",
    borderBottomWidth: 1,
    padding: 5,
  },
  dismiss: {
    padding: 2,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "100%",
    borderBottomColor: "#2f2d51",
    borderBottomWidth: 1,
    padding: 5,
  },
  logoutDark: {
    alignSelf: "flex-end",
    backgroundColor: "#212121",
    marginVertical: 10,
    width: "100%",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logout: {
    alignSelf: "flex-end",
    marginVertical: 15,
    backgroundColor: "#2f2d51",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImg: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  iconContainer: {
    position: "relative",
    alignSelf: "center",
    padding: 8,
  },
  featherIconDark: {
    position: "absolute",
    backgroundColor: "#3e3e3e",
    borderRadius: 50,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    bottom: 6,
    right: 12,
  },
  featherIcon: {
    position: "absolute",
    backgroundColor: "#b7d3ff",
    borderRadius: 50,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    bottom: 6,
    right: 12,
  },
});
