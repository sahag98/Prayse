import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalContainer } from "@styles/appStyles";

import probanner from "../assets/probanner.png";

import { ProBanner } from "@components/pro-banner";
import { useDispatch } from "react-redux";
import { showProModal } from "@redux/userReducer";
import { ProModalButton } from "@components/pro-modal-button";
// import * as StoreReview from "expo-store-review";
const ProModal = ({ visible, setVisible, actualTheme, theme }: any) => {
  const dispatch = useDispatch();
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <ModalContainer
        style={
          theme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="bg-light-secondary gap-3 dark:shadow-dark-accent dark:bg-dark-secondary p-4 rounded-lg w-11/12"
        >
          <Pressable
            className="absolute top-2 p-2 right-2 z-10"
            onPress={() => {
              setVisible(false);
              dispatch(showProModal());
            }}
          >
            <Ionicons
              name="close"
              size={28}
              color={theme === "dark" ? "white" : "#2f2d51"}
            />
          </Pressable>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="text-2xl font-inter-bold text-light-primary dark:text-dark-primary text-center font-bold mb-3"
          >
            PRO FEATURES
          </Text>
          <Image
            source={probanner}
            style={{
              width: "100%",
              height: 170,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="text-left text-light-primary dark:text-dark-primary font-inter-medium mb-3"
          >
            Custom themes, prayer wallpapers and more!
          </Text>

          <ProModalButton
            setVisible={setVisible}
            actualTheme={actualTheme}
            theme={theme}
          />
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default ProModal;
