import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

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

const ProfilePrayers = ({
  item,
  actualTheme,
  theme,
  getPrayers,
  getUserPrayers,
  supabase,
}) => {
  const [deleteModal, setDeleteModal] = useState(false);

  async function handleDelete(id) {
    setDeleteModal(false);
    await supabase.from("prayers").delete().eq("id", id);
    getUserPrayers();
    getPrayers();
  }

  return (
    <View
      style={
        actualTheme &&
        actualTheme.SecondaryTxt && {
          borderBottomColor: actualTheme.SecondaryTxt,
        }
      }
      className="w-full p-3 border-b border-b-light-primary dark:border-b-dark-primary flex-row items-center justify-between"
    >
      <Text
        style={getSecondaryTextColorStyle(actualTheme)}
        className="font-inter w-4/5 leading-5 text-light-primary dark:text-dark-primary"
      >
        {item.prayer}
      </Text>
      <TouchableOpacity onPress={() => setDeleteModal(true)}>
        <AntDesign
          style={{ alignSelf: "center", verticalAlign: "middle" }}
          name="close"
          size={25}
          color={
            actualTheme && actualTheme.SecondaryTxt
              ? actualTheme.SecondaryTxt
              : theme === "dark"
                ? "#ff4e4e"
                : "#cb3f68"
          }
        />
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent
        visible={deleteModal}
        onRequestClose={() => setDeleteModal(false)}
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
            style={getSecondaryBackgroundColorStyle(actualTheme)}
            className="bg-light-secondary dark:bg-dark-secondary"
          >
            <ModalIcon>
              <HeaderTitle
                style={getSecondaryTextColorStyle(actualTheme)}
                className="font-inter font-bold text-light-primary dark:text-dark-primary text-lg"
              >
                Are you sure you want to delete this prayer?
              </HeaderTitle>
            </ModalIcon>
            <ModalActionGroup>
              <ModalAction color="white" onPress={() => setDeleteModal(false)}>
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
                    : theme === "dark"
                      ? "#121212"
                      : "#2F2D51"
                }
                onPress={() => handleDelete(item.id)}
              >
                <AntDesign
                  name="check"
                  size={28}
                  color={
                    actualTheme && actualTheme.Primary
                      ? actualTheme.Primary
                      : "white"
                  }
                />
              </ModalAction>
            </ModalActionGroup>
          </ModalView>
        </ModalContainer>
      </Modal>
    </View>
  );
};

export default ProfilePrayers;
