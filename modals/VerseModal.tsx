//@ts-nocheck

import React from "react";
import { ActivityIndicator, Modal, Text, TouchableOpacity } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ModalContainer, ModalView } from "@styles/appStyles";

const VerseModal = ({
  verseModal,
  setVerseModal,
  verse,
  colorScheme,
  isLoadingVerse,
  actualTheme,
}: any) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={verseModal}
      onRequestClose={() => setVerseModal(null)}
    >
      <ModalContainer
        style={
          colorScheme == "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
        }
      >
        <ModalView
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="bg-light-secondary gap-2 w-5/6 dark:bg-dark-secondary"
        >
          <TouchableOpacity
            onPress={() => setVerseModal(null)}
            className="absolute right-2 top-2 p-2"
          >
            <AntDesign
              name="close"
              size={24}
              color={
                actualTheme && actualTheme.SecondaryTxt
                  ? actualTheme.SecondaryTxt
                  : colorScheme === "dark"
                    ? "white"
                    : "#2f2d51"
              }
            />
          </TouchableOpacity>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="text-light-primary font-inter font-bold text-2xl dark:text-dark-primary"
          >
            Bible Verse
          </Text>

          {isLoadingVerse ? (
            <ActivityIndicator />
          ) : (
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="text-light-primary font-inter text-lg dark:text-dark-primary"
            >
              {verse}
            </Text>
          )}
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default VerseModal;
