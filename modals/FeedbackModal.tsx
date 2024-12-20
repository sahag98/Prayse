import React, { useEffect, useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

import { CheckReview } from "@hooks/useShowReview";
import {
  getPrimaryBackgroundColorStyle,
  getSecondaryBackgroundColorStyle,
  getSecondaryTextColorStyle,
} from "@lib/customStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ModalContainer } from "@styles/appStyles";
// import * as StoreReview from "expo-store-review";
const FeedbackModal = ({ actualTheme, theme }: any) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkAppOpenCount();
  }, []);

  const checkAppOpenCount = async () => {
    // await AsyncStorage.removeItem("appOpenCount");
    try {
      const count = await AsyncStorage.getItem("appOpenCount");
      console.log("Checking app open count", count);
      const newCount = count ? parseInt(count) + 1 : 1;
      await AsyncStorage.setItem("appOpenCount", newCount.toString());
      if (newCount % 20 === 0) {
        CheckReview();
      }
    } catch (error) {
      console.error("Error checking app open count:", error);
    }
  };

  const handleSubmit = async () => {
    // TODO: Implement feedback submission logic
    console.log("Feedback submitted");
    setIsVisible(false);
  };

  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <ModalContainer
        style={
          theme === "dark"
            ? { backgroundColor: "rgba(0, 0, 0, 0.4)" }
            : { backgroundColor: "rgba(0, 0, 0, 0.4)" }
        }
      >
        <View
          style={getSecondaryBackgroundColorStyle(actualTheme)}
          className="bg-light-secondary shadow-md shadow-light-secondary dark:shadow-dark-accent dark:bg-dark-secondary p-4 rounded-lg w-4/5"
        >
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="text-xl font-inter text-center font-bold mb-3"
          >
            Feedback
          </Text>
          <Text
            style={getSecondaryTextColorStyle(actualTheme)}
            className="text-left font-inter mb-3"
          >
            If you have enjoyed using our app, please take a moment to share
            your thoughts with us :)
          </Text>

          <TouchableOpacity
            style={getPrimaryBackgroundColorStyle(actualTheme)}
            className="bg-light-primary dark:bg-dark-accent p-4 rounded-lg items-center"
            onPress={handleSubmit}
          >
            <Text className="text-white font-bold">Okay</Text>
          </TouchableOpacity>
        </View>
      </ModalContainer>
    </Modal>
  );
};

export default FeedbackModal;
