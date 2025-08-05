import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

import { editFolderName } from "../redux/folderReducer";

import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import HeaderText from "./HeaderText";

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
          <View
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary p-3 w-4/5 items-center rounded-2xl justify-center dark:bg-dark-secondary"
          >
            <HeaderText className="text-xl mb-4" text="Change list name" />

            <TextInput
              style={
                actualTheme &&
                actualTheme.SecondaryTxt && {
                  borderColor: actualTheme.SecondaryTxt,
                  color: actualTheme.SecondaryTxt,
                }
              }
              className="items-center w-full p-3 rounded-lg self-center font-inter-regular text-light-primary dark:text-dark-primary border border-light-primary dark:border-dark-primary/40"
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
            <View className="flex-row w-full items-center justify-evenly mt-4 mb-2">
              <Pressable
                className="bg-white size-16 rounded-full items-center justify-center"
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
              </Pressable>
              <Pressable
                className="bg-light-primary dark:bg-dark-accent size-16 rounded-full items-center justify-center"
                onPress={() => HandleEditFolder(folderId)}
              >
                <AntDesign
                  name="check"
                  size={28}
                  color={
                    actualTheme && actualTheme.PrimaryTxt
                      ? actualTheme.PrimaryTxt
                      : colorScheme === "dark"
                      ? "#121212"
                      : "white"
                  }
                />
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default EditFolder;
