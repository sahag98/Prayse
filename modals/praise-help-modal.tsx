import React from "react";
import { useColorScheme } from "nativewind";
import {
  Alert,
  Modal,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { ActualTheme } from "../types/reduxTypes";

import { ModalContainer } from "../styles/appStyles";

interface PraiseHelpModalProps {
  isShowingHelpModal: boolean;
  setIsShowingHelpModal: React.Dispatch<React.SetStateAction<boolean>>;
  actualTheme: ActualTheme;
}
const PraiseHelpModal = ({
  isShowingHelpModal,
  setIsShowingHelpModal,
  actualTheme,
}: PraiseHelpModalProps) => {
  const { colorScheme } = useColorScheme();

  return (
    <Modal
      animationType="fade"
      transparent
      visible={isShowingHelpModal}
      onRequestClose={() => setIsShowingHelpModal(false)}
      statusBarTranslucent
    >
      <ModalContainer
        style={
          colorScheme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.6)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.6)" }
        }
      >
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="w-10/12 rounded-3xl p-5 gap-3 bg-light-secondary dark:bg-dark-secondary"
        >
          <AntDesign
            className="self-end"
            onPress={() => setIsShowingHelpModal(false)}
            name="close"
            size={28}
            color={
              actualTheme && actualTheme.SecondaryTxt
                ? actualTheme.SecondaryTxt
                : colorScheme === "dark"
                  ? "white"
                  : "#2f2d51"
            }
          />
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="text-center font-inter-bold text-3xl text-[#2f2d51] dark:text-white"
          >
            Welcome to Daily Praises
          </Text>

          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className=" dark:text-white text-light-primary font-inter-medium text-lg mt-[5px]"
          >
            A space to share God's daily blessings in our lives.
          </Text>

          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className=" dark:text-white text-light-primary font-inter-regular text-sm text-center mt-[5px]"
          >
            The list will renew each day.
          </Text>
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default PraiseHelpModal;
