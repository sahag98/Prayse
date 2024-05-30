import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import { editFolderName } from "../redux/folderReducer";
import { useState } from "react";
import { useDispatch } from "react-redux";

const EditFolder = ({ folderName, openEdit, setOpenEdit, theme, folderId }) => {
  const [newFolderName, setNewFolderName] = useState(folderName);
  const dispatch = useDispatch();
  function editFolder(id) {
    dispatch(
      editFolderName({
        name: newFolderName,
        id: id,
      })
    );
    setOpenEdit(false);
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={openEdit}
      onRequestClose={() => setOpenEdit(false)}
      statusBarTranslucent={true}
      // onShow={() => inputRef.current?.focus()}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
      >
        <ModalContainer
          style={
            theme == "dark"
              ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
              : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
          }
        >
          <ModalView
            style={
              theme == "dark"
                ? { backgroundColor: "#212121" }
                : { backgroundColor: "#93D8F8" }
            }
          >
            <ModalIcon>
              <HeaderTitle
                style={
                  theme == "dark"
                    ? {
                        fontFamily: "Inter-Bold",
                        fontSize: 18,
                        color: "white",
                      }
                    : { fontSize: 18, fontFamily: "Inter-Bold" }
                }
              >
                Change folder name
              </HeaderTitle>
            </ModalIcon>
            <StyledInput
              style={theme == "dark" ? styles.inputDark : styles.input}
              placeholder="Enter new folder name"
              placeholderTextColor={"white"}
              selectionColor={"white"}
              autoFocus={true}
              onChangeText={(text) => setNewFolderName(text)}
              value={newFolderName}
              onSubmitEditing={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
            />
            <ModalActionGroup>
              <ModalAction color={"white"} onPress={() => setOpenEdit(false)}>
                <AntDesign
                  name="close"
                  size={28}
                  color={theme == "dark" ? "black" : "#2F2D51"}
                />
              </ModalAction>
              <ModalAction
                color={theme == "dark" ? "#121212" : "#2F2D51"}
                onPress={() => editFolder(folderId)}
              >
                <AntDesign name="check" size={28} color={"white"} />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </ModalContainer>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditFolder;

const styles = StyleSheet.create({
  inputDark: {
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontSize: 14,
    fontFamily: "Inter-Regular",
    backgroundColor: "#121212",
  },
  input: {
    alignItems: "center",
    alignSelf: "center",
    textAlignVertical: "center",
    fontFamily: "Inter-Regular",
    backgroundColor: "#2F2D51",
  },
});
