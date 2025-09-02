import React from "react";
import { Modal, Pressable, View } from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

import { deleteFolder, deleteQuickFolder } from "../redux/folderReducer";
import { deletePrayerByFolderId } from "../redux/prayerReducer";
import { FOLDER_SCREEN, PRAYER_SCREEN } from "../routes";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import HeaderText from "./HeaderText";

const DeleteFolder = ({
  actualTheme,
  colorScheme,
  openDelete,
  setOpenDelete,
  theme,
  folderId,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  function deleteFolderById() {
    if (folderId == 4044) {
      dispatch(deleteQuickFolder(folderId));
      navigation.navigate(PRAYER_SCREEN);
    } else {
      dispatch(deleteFolder(folderId));
      dispatch(deletePrayerByFolderId(folderId));
      navigation.goBack();
    }

    setOpenDelete(false);
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={openDelete}
      onRequestClose={() => setOpenDelete(false)}
      statusBarTranslucent
      // onShow={() => inputRef.current?.focus()}
    >
      <View
        className="p-2 justify-center items-center flex-1"
        style={
          colorScheme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="bg-light-secondary p-3 rounded-2xl items-center justify-center w-4/5 dark:bg-dark-secondary"
        >
          <HeaderText
            className="mb-4 text-xl text-center"
            text=" This will permenantly delete this prayer list."
          />

          <View className="flex-row w-full items-center justify-evenly">
            <Pressable
              className="bg-white size-16 rounded-full items-center justify-center"
              onPress={() => setOpenDelete(false)}
            >
              <AntDesign
                name="close"
                size={28}
                color={colorScheme === "dark" ? "black" : "#2F2D51"}
              />
            </Pressable>
            <Pressable
              className="bg-light-primary dark:bg-dark-accent size-16 rounded-full items-center justify-center"
              onPress={deleteFolderById}
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
    </Modal>
  );
};

export default DeleteFolder;
