import React from "react";
import { Modal } from "react-native";
import { useDispatch } from "react-redux";

import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { deleteFolder, deleteQuickFolder } from "../redux/folderReducer";
import { deletePrayerByFolderId } from "../redux/prayerReducer";
import { PRAYER_SCREEN } from "../routes";
import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";

const DeleteFolder = ({ openDelete, setOpenDelete, theme, folderId }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  function deleteFolderById() {
    if (folderId == 4044) {
      dispatch(deleteQuickFolder(folderId));
      navigation.navigate(PRAYER_SCREEN);
    } else {
      dispatch(deleteFolder(folderId));
      dispatch(deletePrayerByFolderId(folderId));
      navigation.navigate(PRAYER_SCREEN);
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
          theme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
        }
      >
        <ModalView
          style={
            theme === "dark"
              ? { backgroundColor: "#212121" }
              : { backgroundColor: "#93D8F8" }
          }
        >
          <ModalIcon>
            <HeaderTitle
              style={
                theme === "dark"
                  ? { fontFamily: "Inter-Bold", fontSize: 18, color: "white" }
                  : { fontSize: 18, fontFamily: "Inter-Bold" }
              }
            >
              Are you sure you want to delete this folder and all its prayers?
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
              color={theme === "dark" ? "#121212" : "#2F2D51"}
              onPress={deleteFolderById}
            >
              <AntDesign name="check" size={28} color="white" />
            </ModalAction>
          </ModalActionGroup>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default DeleteFolder;
