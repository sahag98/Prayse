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
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import {
  HeaderTitle,
  HeaderView,
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
import * as ImagePicker from "expo-image-picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
const ProfileModal = ({
  logout,
  setCurrentUser,
  getPrayers,
  modalVisible,
  supabase,
  setModalVisible,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [name, setName] = useState(user?.full_name);
  const [image, setImage] = useState(user?.avatar_url);
  const isFocused = useIsFocused();

  const handleCloseModal = () => {
    setModalVisible(false);
    setName(user?.full_name);
  };

  async function getProfile() {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id);
    setCurrentUser(profiles[0]);
  }

  function onModalShow() {
    setName(user?.full_name);
    setImage(user?.avatar_url);
  }

  const showToast = (type, content) => {
    Toast.show({
      type,
      text1: content,
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
      getPrayers();
    }
  };

  async function handleAnonymous() {
    const id = uuid.v4();
    const newId = id.substring(0, 3);

    const { data, error } = await supabase
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
    setModalVisible(false);
  }

  const updateProfile = async () => {
    if (name.length <= 0) {
      showToast("error", "The name field can't be left empty.");
      handleCloseModal();
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id)
      .select();
    showToast("success", "Name changed successfully. ✔️");
    getProfile();
    getPrayers();
    setModalVisible(false);
  };

  return (
    <Modal
      animationType="fade"
      onShow={onModalShow}
      transparent={true}
      visible={modalVisible}
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
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }
              : {
                  backgroundColor: "#F2F7FF",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }
          }
        >
          <HeaderView
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={handleCloseModal}>
              <AntDesign
                name="close"
                size={30}
                color={theme == "dark" ? "white" : "#2f2d51"}
              />
            </TouchableOpacity>
            <HeaderTitle
              style={
                theme == "dark"
                  ? { fontFamily: "Inter-Bold", color: "white" }
                  : { fontFamily: "Inter-Bold", color: "#2F2D51" }
              }
            >
              Profile Settings
            </HeaderTitle>

            <TouchableOpacity onPress={updateProfile}>
              <AntDesign
                name="check"
                size={30}
                color={theme == "dark" ? "#A5C9FF" : "#2f2d51"}
              />
            </TouchableOpacity>
          </HeaderView>
          <View style={styles.iconContainer}>
            <Image style={styles.profileImg} source={{ uri: image }} />
            <TouchableOpacity
              onPress={photoPermission}
              style={
                theme == "dark" ? styles.featherIconDark : styles.featherIcon
              }
            >
              <AntDesign
                name="plus"
                size={20}
                color={theme == "dark" ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputField}>
            <Text
              style={
                theme == "dark"
                  ? { color: "white", fontFamily: "Inter-Bold" }
                  : { color: "#2f2d51", fontFamily: "Inter-Bold" }
              }
            >
              Change Name
            </Text>
            <TextInput
              style={theme == "dark" ? styles.inputDark : styles.input}
              autoFocus
              selectionColor={theme == "dark" ? "white" : "#2f2d51"}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <TouchableOpacity
            style={{ marginBottom: 15 }}
            onPress={handleAnonymous}
          >
            <Text
              style={
                theme == "dark"
                  ? {
                      fontFamily: "Inter-Medium",
                      textDecorationLine: "underline",
                      color: "white",
                    }
                  : {
                      fontFamily: "Inter-Medium",
                      textDecorationLine: "underline",
                    }
              }
            >
              Set Anonymous
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={logout}
            style={theme == "dark" ? styles.logoutDark : styles.logout}
          >
            <Ionicons name="md-exit-outline" size={25} color="white" />
            <Text style={{ color: "white", fontFamily: "Inter-Medium" }}>
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
    padding: 2,
  },
  input: {
    color: "#2f2d51",
    fontFamily: "Inter-Regular",
    width: "100%",
    borderBottomColor: "#2f2d51",
    borderBottomWidth: 1,
    padding: 2,
  },
  logoutDark: {
    alignSelf: "flex-end",
    backgroundColor: "#212121",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  logout: {
    alignSelf: "flex-end",
    backgroundColor: "#2f2d51",
    width: "100%",
    paddingVertical: 12,
    borderRadius: 5,
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
    backgroundColor: "#93d8f8",
    borderRadius: 50,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    bottom: 6,
    right: 12,
  },
});
