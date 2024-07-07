import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";

import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";

const AddFolderModal = ({
  folderName,
  colorScheme,
  setFolderName,
  addVisible,
  handleCloseModal,
  setAddVisible,
  addNewFolder,
  theme,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={addVisible}
      onRequestClose={handleCloseModal}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ModalContainer
          style={
            colorScheme == "dark"
              ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
              : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
          }
        >
          <ModalView
            style={
              colorScheme == "dark"
                ? { backgroundColor: "#212121" }
                : { backgroundColor: "#b7d3ff" }
            }
          >
            <ModalIcon>
              <HeaderTitle
                style={
                  colorScheme == "dark"
                    ? {
                        fontFamily: "Inter-Bold",
                        fontSize: 20,
                        color: "white",
                      }
                    : { fontFamily: "Inter-Bold", fontSize: 20 }
                }
              >
                Create Folder
              </HeaderTitle>
            </ModalIcon>
            <TextInput
              className=""
              style={colorScheme == "dark" ? styles.inputDark : styles.input}
              placeholder="Enter folder name"
              placeholderTextColor="white"
              selectionColor="white"
              textAlignVertical="center"
              autoFocus={true}
              onChangeText={(text) => setFolderName(text)}
              value={folderName}
              onSubmitEditing={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
              multiline
            />

            <ModalActionGroup>
              <ModalAction color="white" onPress={() => setAddVisible(false)}>
                <AntDesign
                  name="close"
                  size={28}
                  color={colorScheme === "dark" ? "#121212" : "#2F2D51"}
                />
              </ModalAction>
              <ModalAction
                color={colorScheme == "dark" ? "#121212" : "#2F2D51"}
                onPress={addNewFolder}
              >
                <AntDesign name="check" size={28} color="white" />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </ModalContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddFolderModal;

const styles = StyleSheet.create({
  inputDark: {
    width: 250,
    paddingHorizontal: 10,
    color: "white",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    fontSize: 14,
    fontFamily: "Inter-Regular",
    backgroundColor: "#121212",
  },
  input: {
    width: 250,
    fontSize: 14,
    color: "white",
    marginTop: 10,
    // height: 40,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontFamily: "Inter-Regular",
    backgroundColor: "#2F2D51",
  },
});
