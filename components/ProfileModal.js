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
import * as ImagePicker from "expo-image-picker";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import ProfilePrayers from "./ProfilePrayers";
import { FlatList } from "react-native";
import { Keyboard } from "react-native";
const ProfileModal = ({
  logout,
  setCurrentUser,
  getPrayers,
  setPrayerModal,
  userPrayers,
  getUserPrayers,
  modalVisible,
  supabase,
  setModalVisible,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [name, setName] = useState(user?.full_name);
  const [image, setImage] = useState(user?.avatar_url);
  const isFocused = useIsFocused();

  useEffect(() => {
    getUserPrayers();
  }, []);

  const handleCloseModal = () => {
    setModalVisible(false);
    setName(user?.full_name);
  };

  const addPrayer = () => {
    setModalVisible(false);
    setPrayerModal(true);
  };

  async function getProfile() {
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id);
    setCurrentUser(profiles[0]);
  }

  function onModalShow() {
    getUserPrayers();
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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
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
    showToast("success", "Profile updated successfully. ✔️");
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
                  ? { color: "white", fontFamily: "Inter-Bold", fontSize: 15 }
                  : { color: "#2f2d51", fontFamily: "Inter-Bold", fontSize: 15 }
              }
            >
              Change Name
            </Text>
            <TextInput
              style={theme == "dark" ? styles.inputDark : styles.input}
              selectionColor={theme == "dark" ? "white" : "#2f2d51"}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity onPress={handleAnonymous}>
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
            <TouchableOpacity style={styles.dismiss} onPress={dismissKeyboard}>
              <Text
                style={{
                  color: "#ff4e4e",
                  fontFamily: "Inter-Regular",
                  fontSize: 13,
                }}
              >
                Dismiss Keyboard
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            style={
              theme == "dark"
                ? {
                    padding: 10,
                    fontSize: 17,
                    color: "#A5C9FF",
                    fontFamily: "Inter-Medium",
                    width: "100%",
                    textAlign: "center",
                  }
                : {
                    padding: 10,
                    fontSize: 17,
                    color: "#2f2d51",
                    fontFamily: "Inter-Medium",
                    width: "100%",
                    textAlign: "center",
                  }
            }
          >
            Prayers Shared
          </Text>
          {userPrayers.length == 0 ? (
            <View
              style={
                theme == "dark"
                  ? {
                      width: "100%",
                      backgroundColor: "#212121",
                      borderWidth: 1,
                      borderColor: "#797979",
                      borderRadius: 10,
                      height: 120,
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 5,
                    }
                  : {
                      width: "100%",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "#2f2d51",
                      borderRadius: 10,
                      height: 120,
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 5,
                    }
              }
            >
              <Text
                style={
                  theme == "dark"
                    ? { fontFamily: "Inter-Regular", color: "#bebebe" }
                    : { fontFamily: "Inter-Regular", color: "#2f2d51" }
                }
              >
                You haven't posted any prayers yet.
              </Text>
              <TouchableOpacity onPress={addPrayer}>
                <Text
                  style={
                    theme == "dark"
                      ? {
                          fontFamily: "Inter-Bold",
                          textDecorationLine: "underline",
                          color: "white",
                        }
                      : {
                          fontFamily: "Inter-Bold",
                          textDecorationLine: "underline",
                          color: "#2f2d51",
                        }
                  }
                >
                  Post a prayer
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              style={
                theme == "dark"
                  ? {
                      width: "100%",
                      backgroundColor: "#212121",
                      borderWidth: 1,
                      borderColor: "#A5C9FF",
                      borderRadius: 10,
                    }
                  : {
                      width: "100%",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "#2f2d51",
                      borderRadius: 10,
                    }
              }
              data={userPrayers}
              keyExtractor={(e, i) => i.toString()}
              onEndReachedThreshold={0}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={true}
              renderItem={({ item }) => (
                <ProfilePrayers
                  item={item}
                  theme={theme}
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
            style={theme == "dark" ? styles.logoutDark : styles.logout}
          >
            <Ionicons
              name="md-exit-outline"
              size={25}
              color={theme == "dark" ? "white" : "white"}
            />
            <Text
              style={
                theme == "dark"
                  ? { color: "white", fontFamily: "Inter-Bold" }
                  : { color: "white", fontFamily: "Inter-Bold" }
              }
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
    padding: 1,
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
    padding: 1,
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
