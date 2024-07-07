import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { editFolderName } from "../redux/folderReducer";
import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";

const EditFolder = ({
  colorScheme,
  folderName,
  openEdit,
  setOpenEdit,
  theme,
  folderId,
}) => {
  console.log("folder name: ", folderName);
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();

  function HandleEditFolder(id) {
    if (newFolderName.length === 0) {
      setError("Folder name field can't be empty.");
      return;
    }
    console.log("just edited.");
    dispatch(
      editFolderName({
        name: newFolderName,
        id,
      })
    );
    navigation.setParams({
      title: newFolderName,
    });
    setOpenEdit(false);
    setError("");
    setNewFolderName("");
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={openEdit}
      onRequestClose={() => setOpenEdit(false)}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
      >
        <View
          className="p-2 justify-center items-center flex-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <ModalView
            style={
              colorScheme === "dark"
                ? { backgroundColor: "#212121" }
                : { backgroundColor: "#93D8F8" }
            }
          >
            <ModalIcon>
              <HeaderTitle
                style={
                  colorScheme === "dark"
                    ? {
                        fontFamily: "Inter-Bold",
                        fontSize: 18,
                        color: "white",
                        marginBottom: 5,
                      }
                    : {
                        fontSize: 18,
                        marginBottom: 5,
                        fontFamily: "Inter-Bold",
                      }
                }
              >
                Change folder name
              </HeaderTitle>
            </ModalIcon>
            <StyledInput
              style={colorScheme === "dark" ? styles.inputDark : styles.input}
              placeholder="Enter new folder name"
              placeholderTextColor="white"
              selectionColor="white"
              autoFocus
              onChangeText={(text) => setNewFolderName(text)}
              value={newFolderName}
              onSubmitEditing={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
            />
            {error && (
              <Text className="mt-1 text-sm font-inter text-red-500">
                {error}
              </Text>
            )}

            <ModalActionGroup>
              <ModalAction
                color="white"
                onPress={() => {
                  setError("");
                  setOpenEdit(false);
                }}
              >
                <AntDesign
                  name="close"
                  size={28}
                  color={colorScheme === "dark" ? "black" : "#2F2D51"}
                />
              </ModalAction>
              <ModalAction
                color={colorScheme === "dark" ? "#121212" : "#2F2D51"}
                onPress={() => HandleEditFolder(folderId)}
              >
                <AntDesign name="check" size={28} color="white" />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </View>
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
    fontSize: 14,
    fontFamily: "Inter-Regular",
    backgroundColor: "#2F2D51",
  },
});
