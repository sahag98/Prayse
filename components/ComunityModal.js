import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Modal } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { HeaderTitle, HeaderView, ModalContainer } from "../styles/appStyles";
import { useSelector } from "react-redux";
import { useState } from "react";

import { TextInput } from "react-native";

const CommunityModal = ({
  modalVisible,
  getPrayers,
  supabase,
  setModalVisible,
  user,
}) => {
  const theme = useSelector((state) => state.user.theme);
  const [prayer, setPrayer] = useState("");

  const handleCloseModal = () => {
    setModalVisible(false);
    setPrayer("");
  };

  const addPrayer = async () => {
    console.log(prayer);
    const { data, error } = await supabase
      .from("prayers")
      .insert({ prayer: prayer, user_id: user.id });
    if (error) {
      alert("try again");
    }
    getPrayers();
    setModalVisible(false);
    setPrayer("");
  };

  return (
    <Modal
      animationType="slide"
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
              Add A Prayer
            </HeaderTitle>

            <TouchableOpacity onPress={addPrayer}>
              <AntDesign
                name="check"
                size={30}
                color={theme == "dark" ? "#A5C9FF" : "#2f2d51"}
              />
            </TouchableOpacity>
          </HeaderView>
          <View style={styles.inputField}>
            <Text
              style={
                theme == "dark"
                  ? { color: "white", fontFamily: "Inter-Bold" }
                  : { color: "#2f2d51", fontFamily: "Inter-Bold" }
              }
            >
              Prayer
            </Text>
            <TextInput
              style={theme == "dark" ? styles.inputDark : styles.input}
              autoFocus
              placeholder="Add a prayer"
              selectionColor={theme == "dark" ? "white" : "#2f2d51"}
              value={prayer}
              onChangeText={(text) => setPrayer(text)}
            />
          </View>
        </ModalContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CommunityModal;

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
