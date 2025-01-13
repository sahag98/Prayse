import React from "react";
import { Modal } from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

import { deleteFolder, deleteQuickFolder } from "../redux/folderReducer";
import { deletePrayerByFolderId } from "../redux/prayerReducer";
import { FOLDER_SCREEN, PRAYER_SCREEN } from "../routes";
import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

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
      <ModalContainer
        style={
          colorScheme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <ModalView
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="bg-light-secondary dark:bg-dark-secondary"
        >
          <ModalIcon>
            <HeaderTitle
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-bold text-light-primary dark:text-dark-primary"
            >
              Are you sure you want to delete this folder?
            </HeaderTitle>
          </ModalIcon>
          <ModalActionGroup>
            <ModalAction color="white" onPress={() => setOpenDelete(false)}>
              <AntDesign
                name="close"
                size={28}
                color={theme === "dark" ? "black" : "#2F2D51"}
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
              onPress={deleteFolderById}
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
      </ModalContainer>
    </Modal>
  );
};

export default DeleteFolder;
