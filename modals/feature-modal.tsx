// @ts-nocheck
import React from "react";
import { nativeApplicationVersion } from "expo-application";
import {
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSupabase } from "@context/useSupabase";
import {
  getPrimaryBackgroundColorStyle,
  getPrimaryTextColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "../types/reduxTypes";

import {
  HeaderTitle,
  ModalContainer,
  ModalIcon,
  ModalView,
} from "../styles/appStyles";
import { Image } from "expo-image";

import guidedprayer from "../assets/feature/guided-prayers.png";
import { Link } from "expo-router";
import { PRAYER_ROOM_SCREEN } from "@routes";

interface FeatureModalProps {
  theme: string;
  actualTheme: ActualTheme;
}
export const FeatureModal: React.FC<FeatureModalProps> = ({
  featureVisible,
  setFeatureVisible,
  theme,
  actualTheme,
}) => {
  function handleTry() {
    setFeatureVisible(false);
  }
  return (
    <Modal
      animationType="fade"
      transparent
      visible={featureVisible}
      statusBarTranslucent
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
          className="bg-light-secondary gap-4 dark:bg-dark-secondary w-11/12"
        >
          <ModalIcon className="gap-2">
            <HeaderTitle
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-bold text-xl text-light-primary dark:text-dark-primary"
            >
              Guided Prayer
            </HeaderTitle>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-regular text-light-primary dark:text-dark-primary"
            >
              Take a moment and connect with God with guided questions.
            </Text>
          </ModalIcon>

          <Image
            source={guidedprayer}
            style={{
              width: "100%",
              aspectRatio: 16 / 9,
              borderRadius: 10,
            }}
          />
          <Link href={PRAYER_ROOM_SCREEN} asChild>
            <Pressable
              onPress={handleTry}
              className="bg-light-primary dark:bg-dark-accent p-4 rounded-lg items-center justify-center"
            >
              <Text className="text-light-background dark:text-dark-background text-lg font-inter-bold">
                Try it out
              </Text>
            </Pressable>
          </Link>
        </ModalView>
      </ModalContainer>
    </Modal>
  );
};
