import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import {
  getPrimaryBackgroundColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import { cn } from "@lib/utils";

interface EncouragementModalProps {
  visible: boolean;
  onClose: () => void;
  actualTheme: any;
  colorScheme: string;
  message: string;
  verse: {
    text: string;
    reference: string;
  };
}

const EncouragementModal: React.FC<EncouragementModalProps> = ({
  visible,
  onClose,
  actualTheme,
  colorScheme,
  message,
  verse,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <View
          className="bg-light-secondary dark:bg-dark-secondary w-4/5 rounded-2xl p-6"
          style={getSecondaryBackgroundColorStyle(actualTheme)}
        >
          {/* Header with icon */}
          <View className="flex-row items-center justify-center gap-3 mb-4">
            <MaterialIcons
              name="celebration"
              size={32}
              color={colorScheme === "dark" ? "#ff6262" : "#ff6262"}
            />
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="text-2xl font-inter-bold text-light-primary dark:text-dark-primary"
            >
              Amazing! 🙏
            </Text>
          </View>

          {/* Encouraging message */}
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="font-inter-medium text-lg mb-4 text-center text-light-primary dark:text-dark-primary"
          >
            {message}
          </Text>

          {/* Bible verse */}
          <View
            className="bg-light-background dark:bg-dark-background p-4 rounded-lg mb-6"
            style={{
              borderLeftWidth: 4,
              borderLeftColor: colorScheme === "dark" ? "#ff6262" : "#ff6262",
            }}
          >
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-medium text-base italic text-center text-light-primary dark:text-dark-primary mb-2"
            >
              "{verse.text}"
            </Text>
            <Text
              style={getSecondaryTextColorStyle(actualTheme)}
              className="font-inter-semibold text-sm text-center text-light-primary dark:text-dark-primary opacity-80"
            >
              — {verse.reference}
            </Text>
          </View>

          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="w-full items-center justify-center bg-light-primary dark:bg-dark-accent p-4 rounded-lg"
          >
            <Text className="font-inter-bold text-lg text-light-background dark:text-dark-background">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EncouragementModal;
