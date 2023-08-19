import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import {
  HeaderTitle,
  HeaderView,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Image } from "react-native";
import { TextInput } from "react-native";

const ProfileModal = ({
  logout,
  modalVisible,
  supabase,
  setModalVisible,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [name, setName] = useState(user?.full_name);

  const handleCloseModal = () => {
    setModalVisible(false);
    setName(user?.full_name);
  };

  const updateProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user.id)
      .select();

    setModalVisible(false);
  };

  return (
    <Modal
      animationType="fade"
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
                color={theme == "dark" ? "white" : "black"}
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
            <Image
              style={styles.profileImg}
              source={{ uri: user?.avatar_url }}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
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
            <Text style={{ color: "white", fontFamily: "Inter-Bold" }}>
              Change Name
            </Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <TouchableOpacity onPress={logout} style={styles.logout}>
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
    marginVertical: 20,
    width: "100%",
    gap: 10,
  },
  input: {
    color: "white",
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#212121",
    padding: 10,
  },
  logout: {
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
  profileImg: {
    marginTop: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
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
    bottom: 3,
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
    bottom: 3,
    right: 12,
  },
});
