import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
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
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";

const AddFolderModal = ({
  actualTheme,
  folderName,
  colorScheme,
  setFolderName,
  addVisible,
  handleCloseModal,
  setAddVisible,
  addNewFolder,
}) => {
  return (
    <Modal
      animationType="fade"
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
            colorScheme === "dark"
              ? { backgroundColor: "rgba(0, 0, 0, 0.5)" }
              : { backgroundColor: "rgba(0, 0, 0, 0.5)" }
          }
        >
          <ModalView
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary w-11/12 dark:bg-dark-secondary"
          >
            <ModalIcon>
              <HeaderTitle
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter-bold text-lg text-light-primary dark:text-dark-primary"
              >
                Create Folder
              </HeaderTitle>
            </ModalIcon>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="mb-3 text-center font-inter-medium text-light-primary dark:text-dark-primary"
            >
              Create a prayer folder to add your prayers to it.
            </Text>
            <TextInput
              style={[
                getSecondaryTextColorStyle(actualTheme),
                getSecondaryBackgroundColorStyle(actualTheme),
                actualTheme &&
                  actualTheme.SecondaryTxt && {
                    borderWidth: 1,
                    borderColor: actualTheme.SecondaryTxt,
                  },
              ]}
              className="w-full border text-light-primary font-inter-regular dark:text-dark-primary border-light-primary dark:border-[#c1c0c0] p-5 rounded-lg"
              placeholder="Enter folder name"
              placeholderTextColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
              selectionColor={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
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
                color={
                  actualTheme && actualTheme.Primary
                    ? actualTheme.Primary
                    : colorScheme == "dark"
                      ? "#121212"
                      : "#2F2D51"
                }
                onPress={addNewFolder}
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
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddFolderModal;
