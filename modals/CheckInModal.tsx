//@ts-nocheck

import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ModalContainer, ModalView } from "@styles/appStyles";

const CheckInModal = ({
  checkInModal,
  setCheckInModal,
  prayerToCheckin,
  colorScheme,
  actualTheme,
}: any) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={checkInModal}
      onRequestClose={() => setCheckInModal(false)}
    >
      <ModalContainer
        style={
          colorScheme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.8)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.8)" }
        }
      >
        <ModalView
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="bg-light-secondary gap-2 w-5/6 dark:bg-dark-secondary"
        >
          <TouchableOpacity
            onPress={() => setCheckInModal(false)}
            className="absolute right-2  z-10 top-2 p-3"
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
            className="text-light-primary font-inter-bold text-2xl dark:text-dark-primary"
          >
            Check In
          </Text>

          <Text>{prayerToCheckin?.prayer}</Text>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};

export default CheckInModal;
