import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  HeaderTitle,
  ModalAction,
  ModalActionGroup,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";
import { AntDesign } from "@expo/vector-icons";
import { deleteFolder, deleteQuickFolder } from "../redux/folderReducer";
import { deletePrayerByFolderId } from "../redux/prayerReducer";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

const DeleteFolder = ({ openDelete, setOpenDelete, theme, folderId }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  function deleteFolderById() {
    if (folderId == 4044) {
      dispatch(deleteQuickFolder(folderId));
      navigation.navigate("Prayer");
    } else {
      dispatch(deleteFolder(folderId));
      dispatch(deletePrayerByFolderId(folderId));
      navigation.navigate("Prayer");
    }

    setOpenDelete(false);
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={openDelete}
      onRequestClose={() => setOpenDelete(false)}
      statusBarTranslucent={true}
      // onShow={() => inputRef.current?.focus()}
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
                  ? { fontFamily: "Inter-Bold", fontSize: 18, color: "white" }
                  : { fontSize: 18, fontFamily: "Inter-Bold" }
              }
            >
              Are you sure you want to delete this folder and all its prayers?
            </HeaderTitle>
          </ModalIcon>
          <ModalActionGroup>
            <ModalAction color={"white"} onPress={() => setOpenDelete(false)}>
              <AntDesign
                name="close"
                size={28}
                color={theme == "dark" ? "black" : "#2F2D51"}
              />
            </ModalAction>
            <ModalAction
              color={theme == "dark" ? "#121212" : "#2F2D51"}
              onPress={deleteFolderById}
            >
              <AntDesign name="check" size={28} color={"white"} />
            </ModalAction>
          </ModalActionGroup>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default DeleteFolder;

const styles = StyleSheet.create({});
