import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

import { editFolderName } from "../redux/folderReducer";
import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalIcon,
  ModalView,
  StyledInput,
} from "../styles/appStyles";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const EditFolder = ({
  actualTheme,
  colorScheme,
  folderName,
  openEdit,
  setOpenEdit,
  theme,
  folderId,
}) => {
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
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        >
          <ModalView
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary dark:bg-dark-secondary"
          >
            <ModalIcon>
              <HeaderTitle
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-bold mb-2 text-light-primary dark:text-dark-primary"
              >
                Change list name
              </HeaderTitle>
            </ModalIcon>

            <StyledInput
              style={
                actualTheme &&
                actualTheme.SecondaryTxt && {
                  borderColor: actualTheme.SecondaryTxt,
                  color: actualTheme.SecondaryTxt,
                }
              }
              className="items-center self-center font-inter-regular text-light-primary dark:text-dark-primary border border-light-primary dark:border-dark-primary"
              placeholder="Enter new list name"
              placeholderTextColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "#e0e0e0"
                    : "#2f2d51"
              }
              selectionColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "#e0e0e0"
                    : "#2f2d51"
              }
              autoFocus
              onChangeText={(text) => setNewFolderName(text)}
              value={newFolderName}
              onSubmitEditing={(e) => {
                e.key === "Enter" && e.preventDefault();
              }}
            />
            {error && (
              <Text className="mt-1 text-sm font-inter-medium text-red-500">
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
                color={
                  actualTheme && actualTheme.Primary
                    ? actualTheme.Primary
                    : colorScheme === "dark"
                      ? "#121212"
                      : "#2F2D51"
                }
                onPress={() => HandleEditFolder(folderId)}
              >
                <AntDesign
                  name="check"
                  size={28}
                  color={
                    actualTheme && actualTheme.PrimaryTxt
                      ? actualTheme.PrimaryTxt
                      : "white"
                  }
                />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditFolder;
