import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { PROJECT_ID } from "@env";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import {
  HeaderTitle,
  HeaderView,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Image } from "react-native";
import { TextInput } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Keyboard } from "react-native";
import { useSupabase } from "../context/useSupabase";

const WelcomeModal = ({
  user,
  getUserGroups,
  isShowingWelcome,
  supabase,
  setCurrentUser,
  setIsShowingWelcome,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const { logout } = useSupabase();
  const [name, setName] = useState("");

  const [isUnique, setIsUnique] = useState(true);
  const [image, setImage] = useState("");
  const isFocused = useIsFocused();

  const handleCloseModal = () => {
    setIsShowingWelcome(false);
    setName("");
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
          "We need camera roll permissions to make this work!"
        );
      } else {
        pickImage();
      }
    }
  };

  async function getProfile() {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", user?.id);
    setCurrentUser(profiles[0]);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
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

      let { error: uploadError } = await supabase.storage
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
      // getPrayers();
    }
  };

  const checkIfUnique = async () => {
    const { data: profiles, profileError } = await supabase
      .from("profiles")
      .select("full_name")
      .neq("id", user.id);

    const isUnique = profiles.every((prof) => {
      const profileName = prof.full_name || ""; // Handle null or undefined

      return name.trim().toLowerCase() !== profileName.trim().toLowerCase();
    });

    return isUnique;
  };

  const handleNext = async () => {
    if (name.length == 0) {
      showToast("error", "Username field is required.");
      return;
    }
    const isUniqueName = await checkIfUnique();
    if (!isUniqueName) {
      setIsUnique(false);
    }

    if (isUniqueName) {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: name,
        })
        .eq("id", user.id)
        .select();
      showToast("success", "Profile has been created.");
      setCurrentUser(data[0]);
      setIsShowingWelcome(false);
    }
  };

  async function handleAnonymous() {
    const id = uuid.v4();
    const newId = id.substring(0, 3);
    setName(`Anonymous${newId}`);
    setImage(
      "https://cdn.glitch.global/9c6cd6b6-a7ae-4da4-be68-09611ad266da/user_3177440.png?v=1692410467559"
    );
    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: `Anonymous${newId}`,
        avatar_url:
          "https://cdn.glitch.global/9c6cd6b6-a7ae-4da4-be68-09611ad266da/user_3177440.png?v=1692410467559",
      })
      .eq("id", user.id)
      .select();
  }

  async function sendToken(expoPushToken) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ expoToken: expoPushToken })
      .eq("id", user?.id)
      .select();
  }

  async function getPermission() {
    getUserGroups();
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

  const updateProfile = async () => {
    console.log(name);
    if (name.length <= 1) {
      showToast("error", "The name field can't be left empty.");
      handleCloseModal();
      return;
    }
    const isUniqueName = await checkIfUnique();
    if (isUniqueName) {
      const { data, error } = await supabase
        .from("profiles")
        .update({ full_name: name })
        .eq("id", user.id)
        .select();
      showToast("success", "Profile created successfully. ✔️");
    }
    getProfile();
    // getPrayers();
    setModalVisible(false);
  };

  return (
    <Modal
      onShow={getPermission}
      animationType="fade"
      transparent={true}
      visible={isShowingWelcome}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ModalContainer
          style={
            theme == "dark"
              ? {
                  backgroundColor: "#121212",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 20,
                }
              : {
                  backgroundColor: "#F2F7FF",
                  gap: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }
          }
        >
          <HeaderView
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <HeaderTitle
              style={
                theme == "dark"
                  ? {
                      fontFamily: "Inter-Bold",
                      textAlign: "center",
                      color: "#a5c9ff",
                      fontSize: 20,
                    }
                  : {
                      fontFamily: "Inter-Bold",
                      textAlign: "center",
                      color: "#2F2D51",
                      fontSize: 20,
                    }
              }
            >
              Welcome to Prayse Community
            </HeaderTitle>
          </HeaderView>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={photoPermission}
              style={
                theme == "dark" ? styles.featherIconDark : styles.featherIcon
              }
            >
              {image.length == 0 ? (
                <Text
                  style={
                    theme == "dark"
                      ? { fontFamily: "Inter-Medium", color: "white" }
                      : { fontFamily: "Inter-Medium", color: "#2f2d51" }
                  }
                >
                  Upload an Image + (Optional)
                </Text>
              ) : (
                <Image
                  style={styles.profileImg}
                  source={{
                    uri: image,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.inputField}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={
                  theme == "dark"
                    ? { color: "white", fontFamily: "Inter-Bold", fontSize: 15 }
                    : {
                        color: "#2f2d51",
                        fontFamily: "Inter-Bold",
                        fontSize: 15,
                      }
                }
              >
                Enter username: (Required)
              </Text>
              <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                <Text
                  style={
                    theme == "dark"
                      ? {
                          color: "#ff6262",
                          fontFamily: "Inter-Regular",
                          fontSize: 13,
                        }
                      : {
                          color: "#ff6262",
                          fontFamily: "Inter-Regular",
                          fontSize: 13,
                        }
                  }
                >
                  Dismiss Keyboard
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={theme == "dark" ? styles.inputDark : styles.input}
              selectionColor={theme == "dark" ? "white" : "#2f2d51"}
              value={name}
              onChangeText={(text) => setName(text)}
            />
            {!isUnique && (
              <Text style={{ color: "#ff6262" }}>
                This name already exists. Try again.
              </Text>
            )}
          </View>
          <View
            style={{
              position: "relative",

              height: 20,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={
                theme == "dark"
                  ? { height: 1, width: "100%", backgroundColor: "#a5c9ff" }
                  : { height: 1, width: "100%", backgroundColor: "#2f2d51" }
              }
            />

            <Text
              style={
                theme == "dark"
                  ? {
                      position: "absolute",
                      backgroundColor: "#121212",
                      color: "white",
                      letterSpacing: 2,
                      paddingHorizontal: 5,
                    }
                  : {
                      position: "absolute",
                      backgroundColor: "#F2F7FF",
                      color: "#2f2d51",
                      letterSpacing: 2,
                      paddingHorizontal: 5,
                    }
              }
            >
              Or
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <TouchableOpacity onPress={handleAnonymous}>
              <Text
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Medium",
                        textDecorationLine: "underline",
                        color: "#a5c9ff",
                      }
                    : {
                        fontFamily: "Inter-Medium",
                        textDecorationLine: "underline",
                        color: "#2f2d51",
                      }
                }
              >
                Set Anonymous
              </Text>
            </TouchableOpacity>
            <View
              style={{
                borderWidth: 1.5,
                borderColor: "#ffa500",
                borderRadius: 5,
                width: "100%",
                backgroundColor: "#ffd589",
                padding: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Feather name="alert-triangle" size={24} color="#eb9800" />
                <Text style={{ color: "#eb9800", fontFamily: "Inter-Bold" }}>
                  Alert
                </Text>
              </View>
              <Text>
                To ensure that setup is done correctly, make sure you are signed
                in on one device per account.
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleNext}
              style={
                theme == "dark"
                  ? {
                      backgroundColor: "#a5c9ff",
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      backgroundColor: "#2f2d51",
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? { color: "#121212", fontFamily: "Inter-Bold" }
                    : { color: "white", fontFamily: "Inter-Bold" }
                }
              >
                Get Right in!
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              style={
                theme == "dark"
                  ? {
                      backgroundColor: "#212121",
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      borderWidth: 1,
                      borderColor: "#2f2d51",
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? { color: "white", fontFamily: "Inter-Bold" }
                    : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                }
              >
                Back to Sign in
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={(handleNext)}
              style={
                theme == "dark"
                  ? {
                      backgroundColor: "#a5c9ff",
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }
                  : {
                      borderColor: "#2f2d51",
                      borderWidth: 1,
                      width: "100%",
                      padding: 15,
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? { color: "#121212", fontFamily: "Inter-Bold" }
                    : { color: "#2f2d51", fontFamily: "Inter-Bold" }
                }
              >
                Not Now
              </Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity style={styles.dismiss} onPress={dismissKeyboard}>
              <Text
                style={{
                  color: "#ff4e4e",
                  fontFamily: "Inter-Regular",
                  fontSize: 13,
                }}
              >
                Dismiss Keyboard
              </Text>
            </TouchableOpacity> */}
          </View>
        </ModalContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default WelcomeModal;

const styles = StyleSheet.create({
  inputField: {
    gap: 5,
    width: "100%",
  },
  inputDark: {
    color: "white",
    fontFamily: "Inter-Regular",
    width: "100%",
    backgroundColor: "#212121",
    padding: 12,
    borderRadius: 10,
  },
  dismiss: {
    padding: 2,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "100%",
    backgroundColor: "#caecfc",
    padding: 12,
    borderRadius: 10,
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
    width: "100%",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  featherIconDark: {
    backgroundColor: "#212121",

    position: "absolute",

    borderRadius: 100,
    padding: 10,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  featherIcon: {
    position: "absolute",
    backgroundColor: "#caecfc",
    borderRadius: 100,
    padding: 10,
    width: 130,
    alignItems: "center",
    justifyContent: "center",
    height: 130,
  },
});
